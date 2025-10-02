-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 100,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  submission_text TEXT NOT NULL,
  submission_file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  grade NUMERIC,
  feedback TEXT,
  ai_usage_detected BOOLEAN DEFAULT false,
  ai_detection_details JSONB,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by TEXT,
  UNIQUE(assignment_id, child_id)
);

-- Create grading rubrics table
CREATE TABLE public.grading_rubrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  criteria TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_rubrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Authenticated users can view assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete assignments"
  ON public.assignments FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for submissions
CREATE POLICY "Authenticated users can view submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for grading rubrics
CREATE POLICY "Authenticated users can view rubrics"
  ON public.grading_rubrics FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage rubrics"
  ON public.grading_rubrics FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();