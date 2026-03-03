
-- Add last_name, date_of_birth, and pin_hash to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS pin_hash text;
