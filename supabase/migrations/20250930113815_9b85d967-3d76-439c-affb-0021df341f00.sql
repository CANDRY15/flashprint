-- CRITICAL SECURITY FIX: Prevent privilege escalation
-- Drop the existing overly permissive update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create separate policies for different profile fields
-- Users can update their own email only
CREATE POLICY "Users can update own email"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent updating is_admin column
  is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);

-- Only allow admins to update admin status
CREATE POLICY "Only admins can update admin status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Add audit logging for admin changes
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.profiles(id) NOT NULL,
  action text NOT NULL,
  target_user_id uuid REFERENCES public.profiles(id),
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  _action text,
  _target_user_id uuid DEFAULT NULL,
  _details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), _action, _target_user_id, _details);
END;
$$;