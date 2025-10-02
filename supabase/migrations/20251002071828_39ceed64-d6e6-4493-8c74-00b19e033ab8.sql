-- Create disciplinary_records table
CREATE TABLE public.disciplinary_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  incident_type TEXT NOT NULL,
  description TEXT,
  action_taken TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create school_fees table
CREATE TABLE public.school_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  last_payment_date DATE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'partial', 'pending', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, academic_year)
);

-- Create extracurricular_activities table
CREATE TABLE public.extracurricular_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  instructor TEXT,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learner_activities table (junction table)
CREATE TABLE public.learner_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.extracurricular_activities(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, activity_id)
);

-- Create awards table
CREATE TABLE public.awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  award_name TEXT NOT NULL,
  award_type TEXT NOT NULL,
  description TEXT,
  date_received DATE NOT NULL,
  awarded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.disciplinary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurricular_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for disciplinary_records
CREATE POLICY "Authenticated users can view disciplinary records"
  ON public.disciplinary_records FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage disciplinary records"
  ON public.disciplinary_records FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for school_fees
CREATE POLICY "Authenticated users can view school fees"
  ON public.school_fees FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage school fees"
  ON public.school_fees FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for extracurricular_activities
CREATE POLICY "Authenticated users can view activities"
  ON public.extracurricular_activities FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage activities"
  ON public.extracurricular_activities FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for learner_activities
CREATE POLICY "Authenticated users can view learner activities"
  ON public.learner_activities FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage learner activities"
  ON public.learner_activities FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for awards
CREATE POLICY "Authenticated users can view awards"
  ON public.awards FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage awards"
  ON public.awards FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at columns
CREATE TRIGGER update_disciplinary_records_updated_at
  BEFORE UPDATE ON public.disciplinary_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_fees_updated_at
  BEFORE UPDATE ON public.school_fees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();