
-- Watchlist: users can save favorite tokens
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  token_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, token_id)
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view watchlist" ON public.watchlist
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage watchlist" ON public.watchlist
  FOR ALL USING (true) WITH CHECK (true);

-- Swap streaks tracking
ALTER TABLE public.wallet_stats
  ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_swap_date DATE;

-- Badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, badge_type)
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage badges" ON public.badges
  FOR ALL USING (true) WITH CHECK (true);
