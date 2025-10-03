-- Remove the overly permissive INSERT policy
DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.profiles;