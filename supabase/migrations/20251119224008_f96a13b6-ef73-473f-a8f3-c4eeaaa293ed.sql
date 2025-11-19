-- Create table for syllabus analytics
CREATE TABLE public.syllabus_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  syllabus_id UUID NOT NULL REFERENCES public.syllabus(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'qr_scan')),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.syllabus_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can track analytics"
ON public.syllabus_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view analytics"
ON public.syllabus_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_syllabus_analytics_syllabus_id ON public.syllabus_analytics(syllabus_id);
CREATE INDEX idx_syllabus_analytics_event_type ON public.syllabus_analytics(event_type);
CREATE INDEX idx_syllabus_analytics_created_at ON public.syllabus_analytics(created_at DESC);