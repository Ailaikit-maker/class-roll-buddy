-- Fix security warnings by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.check_and_create_escalations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Fix the trigger function as well
CREATE OR REPLACE FUNCTION public.trigger_escalation_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.check_and_create_escalations();
  RETURN NEW;
END;
$$;