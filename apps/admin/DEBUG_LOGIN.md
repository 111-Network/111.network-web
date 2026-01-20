# Debugging Login Issues

If you're experiencing login problems, follow these steps:

## 1. Check Environment Variables

Make sure your `.env.local` file in `apps/admin/` contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
```

**Important**: 
- Restart your dev server after changing `.env.local`
- Check the browser console for any "Missing environment variable" errors

## 2. Verify User in Supabase

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user by email
3. Check:
   - ✅ User is **confirmed** (not pending)
   - ✅ Email matches exactly (case-sensitive)
   - ✅ User was created successfully

## 3. Verify Core Team Entry

1. Go to Supabase Dashboard → Table Editor → `core_team`
2. Check:
   - ✅ Row exists with your `user_id` (the UUID from auth.users)
   - ✅ `user_id` matches exactly (copy-paste, don't type manually)

## 4. Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- ✅ "Supabase client initialized" message
- ✅ "Login successful" message
- ❌ Any red error messages

## 5. Common Issues

### "Invalid email or password"
- **Cause**: Wrong email/password OR user not confirmed
- **Fix**: 
  - Double-check email/password in Supabase
  - Ensure user is confirmed in Authentication → Users
  - Try resetting password in Supabase dashboard

### "Login failed: [error message]"
- **Cause**: The actual error from Supabase
- **Fix**: Check the error message in the browser console for details

### User can log in but sees "Access Denied"
- **Cause**: User not in `core_team` table
- **Fix**: Add user to `core_team` table with correct `user_id`

### Session not persisting
- **Cause**: Cookie issues or environment variable problems
- **Fix**: 
  - Clear browser cookies
  - Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` are set correctly
  - Restart dev server

## 6. Test Login Flow

1. Open browser console (F12)
2. Try to log in
3. Watch for:
   - "Login error:" messages
   - "Login successful" messages
   - Any Supabase errors

## 7. Verify Password

If you created the user via Supabase dashboard:
- The password you set might not be what you think
- Try resetting the password:
  1. Go to Authentication → Users
  2. Click on your user
  3. Click "Reset Password" or "Send Password Reset Email"

## 8. Check Supabase Logs

1. Go to Supabase Dashboard → Logs → API
2. Look for failed login attempts
3. Check the error messages in the logs

## Still Not Working?

1. Check that your dev server is running: `pnpm dev` in `apps/admin/`
2. Verify you're accessing the correct URL (usually `http://localhost:3000`)
3. Try in an incognito/private window to rule out cookie issues
4. Check network tab in DevTools for failed API requests
