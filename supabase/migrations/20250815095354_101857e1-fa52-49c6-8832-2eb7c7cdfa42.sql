-- Create children table
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_present BOOLEAN NOT NULL DEFAULT true,
  marked_absent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, date)
);

-- Create escalations table
CREATE TABLE public.escalations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  escalation_type TEXT NOT NULL, -- 'monthly' or 'annual'
  absence_count INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  escalated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

-- Create policies (for now allowing all access, can be restricted later with authentication)
CREATE POLICY "Allow all access to children" ON public.children FOR ALL USING (true);
CREATE POLICY "Allow all access to attendance_records" ON public.attendance_records FOR ALL USING (true);
CREATE POLICY "Allow all access to escalations" ON public.escalations FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_attendance_records_child_date ON public.attendance_records(child_id, date);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(date);
CREATE INDEX idx_escalations_child ON public.escalations(child_id);

-- Function to calculate absence counts and create escalations
CREATE OR REPLACE FUNCTION public.check_and_create_escalations()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  child_record RECORD;
  monthly_absences INTEGER;
  annual_absences INTEGER;
  current_month_start DATE;
  current_month_end DATE;
  current_year_start DATE;
  current_year_end DATE;
BEGIN
  -- Set date ranges
  current_month_start := date_trunc('month', CURRENT_DATE)::DATE;
  current_month_end := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::DATE;
  current_year_start := date_trunc('year', CURRENT_DATE)::DATE;
  current_year_end := (date_trunc('year', CURRENT_DATE) + interval '1 year - 1 day')::DATE;

  -- Loop through all children
  FOR child_record IN SELECT id FROM public.children LOOP
    -- Count monthly absences
    SELECT COUNT(*) INTO monthly_absences
    FROM public.attendance_records
    WHERE child_id = child_record.id
      AND date >= current_month_start
      AND date <= current_month_end
      AND is_present = false;

    -- Count annual absences
    SELECT COUNT(*) INTO annual_absences
    FROM public.attendance_records
    WHERE child_id = child_record.id
      AND date >= current_year_start
      AND date <= current_year_end
      AND is_present = false;

    -- Check for monthly escalation (more than 4 days in a month)
    IF monthly_absences > 4 THEN
      -- Check if escalation already exists for this month
      IF NOT EXISTS (
        SELECT 1 FROM public.escalations
        WHERE child_id = child_record.id
          AND escalation_type = 'monthly'
          AND period_start = current_month_start
          AND period_end = current_month_end
      ) THEN
        INSERT INTO public.escalations (child_id, escalation_type, absence_count, period_start, period_end)
        VALUES (child_record.id, 'monthly', monthly_absences, current_month_start, current_month_end);
      END IF;
    END IF;

    -- Check for annual escalation (more than 20 days in a year)
    IF annual_absences > 20 THEN
      -- Check if escalation already exists for this year
      IF NOT EXISTS (
        SELECT 1 FROM public.escalations
        WHERE child_id = child_record.id
          AND escalation_type = 'annual'
          AND period_start = current_year_start
          AND period_end = current_year_end
      ) THEN
        INSERT INTO public.escalations (child_id, escalation_type, absence_count, period_start, period_end)
        VALUES (child_record.id, 'annual', annual_absences, current_year_start, current_year_end);
      END IF;
    END IF;
  END LOOP;
END;
$$;

-- Trigger to automatically check escalations when attendance is updated
CREATE OR REPLACE FUNCTION public.trigger_escalation_check()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.check_and_create_escalations();
  RETURN NEW;
END;
$$;

CREATE TRIGGER attendance_escalation_trigger
  AFTER INSERT OR UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_escalation_check();

-- Insert sample children (35 children)
INSERT INTO public.children (name, grade) VALUES
  ('Aiden Smith', 'Grade 1'),
  ('Emma Johnson', 'Grade 1'),
  ('Liam Williams', 'Grade 1'),
  ('Olivia Brown', 'Grade 1'),
  ('Noah Jones', 'Grade 1'),
  ('Sophia Garcia', 'Grade 2'),
  ('Ethan Miller', 'Grade 2'),
  ('Isabella Davis', 'Grade 2'),
  ('Mason Rodriguez', 'Grade 2'),
  ('Ava Wilson', 'Grade 2'),
  ('Lucas Martinez', 'Grade 3'),
  ('Mia Anderson', 'Grade 3'),
  ('Henry Taylor', 'Grade 3'),
  ('Charlotte Thomas', 'Grade 3'),
  ('Alexander Hernandez', 'Grade 3'),
  ('Amelia Moore', 'Grade 4'),
  ('Benjamin Martin', 'Grade 4'),
  ('Harper Jackson', 'Grade 4'),
  ('Elijah Thompson', 'Grade 4'),
  ('Evelyn White', 'Grade 4'),
  ('James Lopez', 'Grade 5'),
  ('Abigail Lee', 'Grade 5'),
  ('William Gonzalez', 'Grade 5'),
  ('Emily Harris', 'Grade 5'),
  ('Michael Clark', 'Grade 5'),
  ('Elizabeth Lewis', 'Grade 6'),
  ('Daniel Robinson', 'Grade 6'),
  ('Sofia Walker', 'Grade 6'),
  ('Matthew Perez', 'Grade 6'),
  ('Avery Hall', 'Grade 6'),
  ('Joseph Young', 'Grade 7'),
  ('Scarlett Allen', 'Grade 7'),
  ('David Sanchez', 'Grade 7'),
  ('Grace Wright', 'Grade 7'),
  ('Samuel King', 'Grade 7');