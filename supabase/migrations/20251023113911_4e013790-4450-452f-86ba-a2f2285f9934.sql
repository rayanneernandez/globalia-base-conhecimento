-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT,
  category TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read videos (public knowledge base)
CREATE POLICY "Anyone can view videos"
ON public.videos FOR SELECT
USING (true);

-- Allow anyone to insert videos
CREATE POLICY "Anyone can create videos"
ON public.videos FOR INSERT
WITH CHECK (true);

-- Allow anyone to update videos
CREATE POLICY "Anyone can update videos"
ON public.videos FOR UPDATE
USING (true);

-- Allow anyone to delete videos
CREATE POLICY "Anyone can delete videos"
ON public.videos FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_created_at ON public.videos(created_at DESC);