-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create faculties table
CREATE TABLE public.faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faculties"
  ON public.faculties FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage faculties"
  ON public.faculties FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Insert default faculties
INSERT INTO public.faculties (name, slug, icon, color) VALUES
  ('Ingénieurs', 'ingenieurs', 'Calculator', 'bg-blue-100 text-blue-800'),
  ('Médecine', 'medecine', 'Beaker', 'bg-green-100 text-green-800'),
  ('Droit', 'droit', 'Scale', 'bg-purple-100 text-purple-800'),
  ('Sciences', 'sciences', 'GraduationCap', 'bg-orange-100 text-orange-800');

-- Create syllabus table
CREATE TABLE public.syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  professor TEXT NOT NULL,
  year TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE,
  file_url TEXT,
  file_size TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.syllabus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view syllabus"
  ON public.syllabus FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage syllabus"
  ON public.syllabus FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Create storage bucket for syllabus PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('syllabus', 'syllabus', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view syllabus files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'syllabus');

CREATE POLICY "Admins can upload syllabus files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update syllabus files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete syllabus files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'syllabus' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_syllabus_updated_at
  BEFORE UPDATE ON public.syllabus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();