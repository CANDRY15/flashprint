-- Fix function search path issue
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_syllabus_updated_at
  BEFORE UPDATE ON public.syllabus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();