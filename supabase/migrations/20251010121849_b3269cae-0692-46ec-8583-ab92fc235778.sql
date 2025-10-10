-- Allow public access to storage bucket for syllabus files
DROP POLICY IF EXISTS "Public can upload syllabus files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view syllabus files" ON storage.objects;
DROP POLICY IF EXISTS "Public can update syllabus files" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete syllabus files" ON storage.objects;

CREATE POLICY "Public can upload syllabus files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'syllabus');

CREATE POLICY "Public can view syllabus files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'syllabus');

CREATE POLICY "Public can update syllabus files"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'syllabus')
WITH CHECK (bucket_id = 'syllabus');

CREATE POLICY "Public can delete syllabus files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'syllabus');