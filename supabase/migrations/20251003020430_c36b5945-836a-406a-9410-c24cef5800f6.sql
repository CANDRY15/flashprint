-- Drop the problematic INSERT policy that's causing conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Ensure the SELECT policy works correctly
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Update the function to not try to create profiles manually
-- The trigger will handle it automatically