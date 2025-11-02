-- Create table for managing site content
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view content
CREATE POLICY "Anyone can view site content"
  ON public.site_content
  FOR SELECT
  USING (true);

-- Policy: Only admins can manage content
CREATE POLICY "Admins can manage site content"
  ON public.site_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Insert default content for Hero Section
INSERT INTO public.site_content (section, key, value, content_type) VALUES
('hero', 'badge_text', 'FLASHPRINT LUBUMBASHI', 'text'),
('hero', 'title_line1', 'Imprimez malin,', 'text'),
('hero', 'title_line2', 'accédez partout', 'text'),
('hero', 'description', 'La solution d''impression moderne pour les étudiants de Lubumbashi. Impression rapide, reliure professionnelle et accès numérique à vos syllabus via QR Code.', 'text'),
('hero', 'cta_primary_text', 'Commander maintenant', 'text'),
('hero', 'cta_secondary_text', 'Découvrir la bibliothèque', 'text'),
('hero', 'feature1_title', 'Accès numérique', 'text'),
('hero', 'feature1_desc', 'QR codes pour vos syllabus', 'text'),
('hero', 'feature2_title', 'Impression rapide', 'text'),
('hero', 'feature2_desc', 'Service express disponible', 'text'),
('hero', 'feature3_title', 'Reliure pro', 'text'),
('hero', 'feature3_desc', 'Finition professionnelle', 'text');

-- Insert default content for About Section
INSERT INTO public.site_content (section, key, value, content_type) VALUES
('about', 'badge_text', 'À Propos', 'text'),
('about', 'title', 'L''histoire de FlashPrint', 'text'),
('about', 'subtitle', 'Né de la passion d''un étudiant pour l''innovation, FlashPrint transforme l''expérience éducative en rendant l''information accessible partout et à tout moment.', 'text'),
('about', 'story_title', 'Notre Histoire', 'text'),
('about', 'story_paragraph1', 'Tout a commencé en 2023, quand Chadrack Saidi Candry, étudiant en médecine à la Faculté de Médecine de l''Université de Lubumbashi (Licence en Sciences Biomédicales), a réalisé les défis quotidiens auxquels font face ses camarades : accès limité aux syllabus, files d''attente interminables pour l''impression, et perte de documents importants.', 'text'),
('about', 'story_paragraph2', 'Passionné par la recherche clinique et l''innovation, avec plusieurs travaux publiés notamment sur la pré-éclampsie et les infections sexuellement transmissibles, Chadrack a appliqué sa rigueur scientifique à un problème concret : rendre l''éducation plus accessible.', 'text'),
('about', 'story_paragraph3', 'L''idée révolutionnaire ? Intégrer la technologie QR Code aux services d''impression traditionnels. Ainsi est né FlashPrint : un service qui non seulement imprime vos documents avec une qualité exceptionnelle, mais vous donne aussi un accès numérique permanent à vos contenus.', 'text'),
('about', 'story_paragraph4', 'Aujourd''hui, FlashPrint est devenu le partenaire de confiance de centaines d''étudiants à Lubumbashi, transformant leur façon d''accéder et de gérer leurs documents académiques. Un projet créé par un étudiant, pour les étudiants.', 'text'),
('about', 'location', 'Basé à Lubumbashi, RD Congo', 'text');

-- Insert default content for Services Section
INSERT INTO public.site_content (section, key, value, content_type) VALUES
('services', 'badge_text', 'Nos Services', 'text'),
('services', 'title', 'Solutions d''impression modernes', 'text'),
('services', 'subtitle', 'Des services complets adaptés aux besoins des étudiants, avec la technologie au service de votre réussite.', 'text'),
('services', 'why_title', 'Pourquoi choisir FlashPrint ?', 'text');

-- Create trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();