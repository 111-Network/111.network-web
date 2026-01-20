-- Create admin role tables for core team and community contributors
-- Core team members have full access, community contributors have limited moderation roles

-- Core Team Table
-- IMPORTANT: This table is manually managed via Supabase dashboard
-- No signups allowed - core team members are added manually by existing core members
CREATE TABLE IF NOT EXISTS core_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Community Contributors Table
-- IMPORTANT: ALL profiles created are "pending" until core team approval
-- Level 1-5 determines moderation capabilities
CREATE TABLE IF NOT EXISTS community_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_core_team_user_id ON core_team(user_id);
CREATE INDEX IF NOT EXISTS idx_community_contributors_user_id ON community_contributors(user_id);
CREATE INDEX IF NOT EXISTS idx_community_contributors_status ON community_contributors(status);
CREATE INDEX IF NOT EXISTS idx_community_contributors_level ON community_contributors(level);

-- Enable Row Level Security on both tables
ALTER TABLE core_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for core_team
-- No public access - service role only
CREATE POLICY "No public access to core_team"
  ON core_team
  FOR ALL
  USING (false);

-- RLS Policies for community_contributors
-- No public access - service role only
CREATE POLICY "No public access to community_contributors"
  ON community_contributors
  FOR ALL
  USING (false);

-- Role Detection Function
-- Efficiently checks both tables and returns role information
-- Uses SECURITY DEFINER to allow role checks while maintaining security
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TABLE(
  role_type TEXT,
  level INTEGER,
  is_core BOOLEAN,
  status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check core_team first (highest priority)
  IF EXISTS (SELECT 1 FROM core_team WHERE user_id = p_user_id) THEN
    RETURN QUERY SELECT 'core'::TEXT, NULL::INTEGER, true::BOOLEAN, 'approved'::TEXT;
  -- Then check community_contributors (only if approved)
  ELSIF EXISTS (
    SELECT 1 FROM community_contributors 
    WHERE user_id = p_user_id AND status = 'approved'
  ) THEN
    RETURN QUERY 
    SELECT 
      'moderator'::TEXT, 
      level, 
      false::BOOLEAN,
      status::TEXT
    FROM community_contributors 
    WHERE user_id = p_user_id AND status = 'approved';
  ELSE
    -- User exists but has no role or is pending/rejected
    RETURN QUERY SELECT NULL::TEXT, NULL::INTEGER, false::BOOLEAN, NULL::TEXT;
  END IF;
END;
$$;

-- Add comments for documentation
COMMENT ON TABLE core_team IS 'Core team members with full admin access. Manually managed via Supabase dashboard.';
COMMENT ON TABLE community_contributors IS 'Community contributors with limited moderation roles (levels 1-5). Requires core team approval.';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Returns the role, level, and status for a given user_id. Checks core_team first, then approved community_contributors.';
