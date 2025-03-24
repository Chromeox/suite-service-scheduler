-- SQL script to create the stored procedure for safely fetching user profiles
-- Run this in your Supabase SQL Editor (https://app.supabase.com)

-- Create the function with SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION get_user_profile_safe(user_id_param UUID)
RETURNS SETOF user_profiles
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_profile_safe(UUID) TO authenticated;

-- Test if the function works
-- Replace 'your-user-id-here' with an actual user ID from your database
-- SELECT * FROM get_user_profile_safe('your-user-id-here');

-- Verify the function exists
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
  n.nspname = 'public' AND 
  p.proname = 'get_user_profile_safe';
