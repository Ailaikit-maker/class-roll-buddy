-- Add status column to attendance_records table
ALTER TABLE public.attendance_records 
ADD COLUMN status TEXT DEFAULT 'present';

-- Migrate existing data: convert is_present boolean to status
UPDATE public.attendance_records 
SET status = CASE 
  WHEN is_present = true THEN 'present'
  ELSE 'absent'
END;

-- Make status column NOT NULL
ALTER TABLE public.attendance_records 
ALTER COLUMN status SET NOT NULL;

-- Add check constraint for valid status values
ALTER TABLE public.attendance_records 
ADD CONSTRAINT valid_status CHECK (status IN ('present', 'late', 'absent', 'excused'));