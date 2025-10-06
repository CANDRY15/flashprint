-- Allow public read access to syllabus table
DROP POLICY IF EXISTS "Anyone can view syllabus" ON public.syllabus;
CREATE POLICY "Anyone can view syllabus" 
ON public.syllabus 
FOR SELECT 
USING (true);

-- Allow public read access to faculties table
DROP POLICY IF EXISTS "Anyone can view faculties" ON public.faculties;
CREATE POLICY "Anyone can view faculties" 
ON public.faculties 
FOR SELECT 
USING (true);

-- Allow public write access to syllabus
DROP POLICY IF EXISTS "Only admins can manage syllabus" ON public.syllabus;
CREATE POLICY "Public can manage syllabus" 
ON public.syllabus 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Allow public write access to faculties
DROP POLICY IF EXISTS "Only admins can manage faculties" ON public.faculties;
CREATE POLICY "Public can manage faculties" 
ON public.faculties 
FOR ALL 
USING (true)
WITH CHECK (true);