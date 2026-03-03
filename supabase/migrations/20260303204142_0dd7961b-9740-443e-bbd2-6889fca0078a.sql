
-- User profiles table for onboarding (keyed by Dynamic user ID)
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dynamic_user_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  pseudo TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access (for leaderboard, social features)
CREATE POLICY "Anyone can view profiles"
ON public.user_profiles
FOR SELECT
USING (true);

-- Service role manages profiles (edge functions handle writes)
CREATE POLICY "Service role can manage profiles"
ON public.user_profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- Link table: user -> wallets
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_name TEXT NOT NULL DEFAULT 'Main Wallet',
  wallet_type TEXT NOT NULL DEFAULT 'mpc', -- 'mpc' or 'imported'
  chain TEXT NOT NULL DEFAULT 'ethereum',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Unique constraint: one wallet address per profile
ALTER TABLE public.user_wallets ADD CONSTRAINT unique_wallet_per_profile UNIQUE (profile_id, wallet_address);

CREATE POLICY "Anyone can view wallets"
ON public.user_wallets
FOR SELECT
USING (true);

CREATE POLICY "Service role can manage wallets"
ON public.user_wallets
FOR ALL
USING (true)
WITH CHECK (true);
