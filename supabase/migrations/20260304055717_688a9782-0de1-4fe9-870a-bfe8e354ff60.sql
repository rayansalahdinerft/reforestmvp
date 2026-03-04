-- Enforce one profile per dynamic user and case-insensitive unique pseudo
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_dynamic_user_id_unique_idx
ON public.user_profiles (dynamic_user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_pseudo_lower_unique_idx
ON public.user_profiles (lower(pseudo));