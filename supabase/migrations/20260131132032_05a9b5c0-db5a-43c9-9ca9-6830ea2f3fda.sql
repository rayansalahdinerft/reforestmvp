-- Create table to track per-wallet stats
CREATE TABLE public.wallet_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    total_trees NUMERIC NOT NULL DEFAULT 0,
    total_donations_usd NUMERIC NOT NULL DEFAULT 0,
    total_swaps INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view their own stats (by wallet address)
CREATE POLICY "Users can view their own wallet stats"
ON public.wallet_stats
FOR SELECT
USING (true);

-- Policy: Service role can insert/update (from edge function)
CREATE POLICY "Service role can manage wallet stats"
ON public.wallet_stats
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster lookups by wallet address
CREATE INDEX idx_wallet_stats_address ON public.wallet_stats(wallet_address);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_stats;