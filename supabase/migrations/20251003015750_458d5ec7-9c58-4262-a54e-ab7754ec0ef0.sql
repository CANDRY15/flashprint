-- Add INSERT policy for profiles table to allow new users to create their profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also add a policy to allow the trigger to insert profiles
CREATE POLICY "Allow profile creation on signup"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);