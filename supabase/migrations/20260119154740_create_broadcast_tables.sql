-- Create anonymous_devices table for rate limiting
CREATE TABLE IF NOT EXISTS anonymous_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id_hash TEXT NOT NULL UNIQUE,
  device_public_key TEXT,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_post_at TIMESTAMPTZ,
  post_count_24h INTEGER NOT NULL DEFAULT 0,
  post_count_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Create profiles table (minimal for now, will be extended later)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create broadcast_messages table
CREATE TABLE IF NOT EXISTS broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL CHECK (char_length(content) <= 240),
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  geo_precision TEXT NOT NULL DEFAULT 'approx' CHECK (geo_precision IN ('exact', 'approx', 'region')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending')),
  device_id UUID NOT NULL REFERENCES anonymous_devices(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_created_at ON broadcast_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_status ON broadcast_messages(status);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_location ON broadcast_messages(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_device_id ON broadcast_messages(device_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_devices_device_id_hash ON anonymous_devices(device_id_hash);
CREATE INDEX IF NOT EXISTS idx_anonymous_devices_ip_hash ON anonymous_devices(ip_hash);
CREATE INDEX IF NOT EXISTS idx_anonymous_devices_reset_at ON anonymous_devices(post_count_reset_at);

-- Enable Row Level Security on all tables
ALTER TABLE anonymous_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for broadcast_messages
-- Public SELECT only for published messages
CREATE POLICY "Public can view published messages"
  ON broadcast_messages
  FOR SELECT
  USING (status = 'published');

-- No direct INSERT/UPDATE/DELETE from anon client (only via service role)
CREATE POLICY "No anon inserts"
  ON broadcast_messages
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No anon updates"
  ON broadcast_messages
  FOR UPDATE
  USING (false);

CREATE POLICY "No anon deletes"
  ON broadcast_messages
  FOR DELETE
  USING (false);

-- RLS Policies for anonymous_devices
-- No public access (service role only)
CREATE POLICY "No public access to anonymous_devices"
  ON anonymous_devices
  FOR ALL
  USING (false);

-- RLS Policies for profiles
-- Owner can read/write own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to reset rate limit counters (runs automatically via trigger or can be called manually)
CREATE OR REPLACE FUNCTION reset_rate_limit_counters()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE anonymous_devices
  SET 
    post_count_24h = 0,
    post_count_reset_at = NOW() + INTERVAL '24 hours'
  WHERE post_count_reset_at < NOW();
END;
$$;

-- Create a function to check and update rate limits atomically
CREATE OR REPLACE FUNCTION check_and_increment_rate_limit(
  p_device_id_hash TEXT,
  p_ip_hash TEXT,
  p_rate_limit INTEGER
)
RETURNS TABLE(
  device_id UUID,
  allowed BOOLEAN,
  remaining INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_device_id UUID;
  v_post_count INTEGER;
  v_reset_at TIMESTAMPTZ;
  v_allowed BOOLEAN;
  v_remaining INTEGER;
BEGIN
  -- First, reset any expired counters
  PERFORM reset_rate_limit_counters();
  
  -- Try to find or create device record
  INSERT INTO anonymous_devices (device_id_hash, ip_hash, post_count_24h, post_count_reset_at)
  VALUES (p_device_id_hash, p_ip_hash, 0, NOW() + INTERVAL '24 hours')
  ON CONFLICT (device_id_hash) DO UPDATE
  SET 
    ip_hash = EXCLUDED.ip_hash,
    last_post_at = NOW()
  RETURNING id INTO v_device_id;
  
  -- If device already existed, get its current state
  IF v_device_id IS NULL THEN
    SELECT id, post_count_24h, post_count_reset_at
    INTO v_device_id, v_post_count, v_reset_at
    FROM anonymous_devices
    WHERE device_id_hash = p_device_id_hash;
  ELSE
    SELECT post_count_24h, post_count_reset_at
    INTO v_post_count, v_reset_at
    FROM anonymous_devices
    WHERE id = v_device_id;
  END IF;
  
  -- Check if rate limit is exceeded
  IF v_post_count >= p_rate_limit AND v_reset_at > NOW() THEN
    v_allowed := false;
    v_remaining := 0;
  ELSE
    -- Increment counter atomically
    UPDATE anonymous_devices
    SET 
      post_count_24h = post_count_24h + 1,
      last_post_at = NOW()
    WHERE id = v_device_id
    RETURNING post_count_24h INTO v_post_count;
    
    v_allowed := true;
    v_remaining := GREATEST(0, p_rate_limit - v_post_count);
  END IF;
  
  RETURN QUERY SELECT v_device_id, v_allowed, v_remaining;
END;
$$;
