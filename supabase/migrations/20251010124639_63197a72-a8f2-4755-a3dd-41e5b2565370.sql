-- Clear existing faculties and add Medicine faculty
DELETE FROM public.faculties;

INSERT INTO public.faculties (name, slug, color, icon)
VALUES ('Médecine', 'medecine', '#FF6B6B', 'stethoscope');

-- Note: Existing syllabus records with L1, L2, L3 values will remain in the database
-- New records will use Bac1-Bac3 and Master1-Master4 values
-- The year column is TEXT type, so it can store any promotion value