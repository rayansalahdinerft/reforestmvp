
CREATE TABLE public.swap_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  sell_token text NOT NULL,
  buy_token text NOT NULL,
  sell_amount text NOT NULL,
  buy_amount text NOT NULL,
  tx_hash text NOT NULL,
  chain_id integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'success',
  donation_usd numeric NOT NULL DEFAULT 0,
  trees_planted numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast wallet lookups
CREATE INDEX idx_swap_history_wallet ON public.swap_history (wallet_address, created_at DESC);

-- Enable RLS
ALTER TABLE public.swap_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public leaderboard context)
CREATE POLICY "Anyone can view swap history" ON public.swap_history FOR SELECT USING (true);

-- Service role can insert
CREATE POLICY "Service role can manage swap history" ON public.swap_history FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.swap_history;
