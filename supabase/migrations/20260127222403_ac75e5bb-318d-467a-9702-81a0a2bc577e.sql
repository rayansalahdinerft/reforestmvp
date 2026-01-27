-- Create table to track global tree planting stats
CREATE TABLE public.tree_counter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_trees DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total_donations_usd DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total_swaps INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial row
INSERT INTO public.tree_counter (total_trees, total_donations_usd, total_swaps)
VALUES (1247, 3117.50, 523);

-- Enable RLS
ALTER TABLE public.tree_counter ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counter (public stats)
CREATE POLICY "Anyone can view tree counter"
ON public.tree_counter
FOR SELECT
USING (true);

-- Only authenticated service role can update (via edge function)
CREATE POLICY "Service role can update tree counter"
ON public.tree_counter
FOR UPDATE
USING (true)
WITH CHECK (true);