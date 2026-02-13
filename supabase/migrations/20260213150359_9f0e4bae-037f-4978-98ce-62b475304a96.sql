-- Add display_name column for optional pseudonyms on leaderboard
ALTER TABLE public.wallet_stats 
ADD COLUMN display_name text DEFAULT NULL;

-- Allow anyone to read wallet_stats for leaderboard (already has SELECT true policy)
-- Add policy so wallets can update their own display_name via edge function
-- The service role policy already covers updates from edge functions

-- Create an index for leaderboard queries (order by total_trees desc)
CREATE INDEX idx_wallet_stats_trees_desc ON public.wallet_stats (total_trees DESC);