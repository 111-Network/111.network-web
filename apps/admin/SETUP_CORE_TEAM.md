# Setting Up Core Team Member Access

This guide explains how to add a core team member so they can log in to the admin app.

## Prerequisites

- Access to your Supabase project dashboard
- The user's email address and a password they will use to log in

## Steps

### 1. Create User Account in Supabase Auth

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite user"**
4. Enter the user's email address
5. Set a temporary password (user can change it later)
6. **Important**: Make sure **"Auto Confirm User"** is enabled, or manually confirm the user after creation
7. Click **"Create user"** or **"Send invitation"**

### 2. Get the User ID

After creating the user:
1. Find the user in the **Authentication** → **Users** list
2. Click on the user to view details
3. Copy the **User UID** (this is a UUID like `123e4567-e89b-12d3-a456-426614174000`)

### 3. Add User to Core Team Table

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `core_team` table
3. Click **"Insert row"** or **"New row"**
4. Fill in the fields:
   - **user_id**: Paste the User UID from step 2
   - **created_by**: (Optional) Your own user ID if you want to track who added them
   - **notes**: (Optional) Any notes about this team member
5. Click **"Save"**

### 4. Verify Setup

The user should now be able to:
1. Go to the admin app login page
2. Enter their email and password
3. Successfully log in and access the dashboard

## Security Notes

- **Never share service role keys** - These are only for server-side use
- **Core team table is protected** - Only service role can read/write (via API routes)
- **RLS is enabled** - Public users cannot access the `core_team` table directly
- **Manual management only** - Core team members must be added manually via Supabase dashboard

## Troubleshooting

### User can't log in
- Verify the user account exists in **Authentication** → **Users**
- Check that the user is confirmed (not pending)
- Verify the email and password are correct

### User can log in but sees "Access Denied"
- Verify the `user_id` in `core_team` table matches the User UID exactly
- Check that the row was saved successfully in the `core_team` table
- Wait a few seconds and try refreshing (role check may need a moment)

### User sees "Pending Approval" message
- This means the user is in `community_contributors` table with `status = 'pending'`
- Remove them from `community_contributors` if they should be core team
- Or approve them in `community_contributors` if they should be a moderator instead

## Alternative: Using SQL

If you prefer using SQL directly:

```sql
-- First, create the user (if not already created via dashboard)
-- Note: User creation via SQL requires Supabase admin access
-- It's easier to use the dashboard for this step

-- Then add to core_team (replace USER_ID_HERE with actual UUID)
INSERT INTO core_team (user_id, created_by, notes)
VALUES (
  'USER_ID_HERE'::uuid,
  'YOUR_USER_ID_HERE'::uuid,  -- Optional: your user ID
  'Initial core team member'  -- Optional: notes
);
```

## Next Steps

After setting up core team access:
- Test login with the new user
- Set up additional core team members as needed
- Consider setting up community contributors (moderators) if needed
