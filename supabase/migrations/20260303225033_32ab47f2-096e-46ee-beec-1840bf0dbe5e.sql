
-- 1) Extend user_profiles with email and face_id
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS face_id_enabled boolean NOT NULL DEFAULT false;

-- 2) Extend user_wallets with import fields
ALTER TABLE public.user_wallets
  ADD COLUMN IF NOT EXISTS encrypted_private_key text,
  ADD COLUMN IF NOT EXISTS import_method text;

-- 3) Create wallet_balances for cached token balances per wallet
CREATE TABLE IF NOT EXISTS public.wallet_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.user_wallets(id) ON DELETE CASCADE,
  token_symbol text NOT NULL,
  token_address text,
  balance numeric NOT NULL DEFAULT 0,
  balance_usd numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_id, token_symbol)
);

ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wallet balances"
  ON public.wallet_balances FOR SELECT USING (true);

CREATE POLICY "Service role can manage wallet balances"
  ON public.wallet_balances FOR ALL
  USING (true) WITH CHECK (true);

-- 4) Create security_events for audit logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  ip_address text,
  device text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view their security events"
  ON public.security_events FOR SELECT USING (true);

CREATE POLICY "Service role can manage security events"
  ON public.security_events FOR ALL
  USING (true) WITH CHECK (true);

-- 5) Add type column to swap_history to support send/receive/swap
ALTER TABLE public.swap_history
  ADD COLUMN IF NOT EXISTS tx_type text NOT NULL DEFAULT 'swap';
