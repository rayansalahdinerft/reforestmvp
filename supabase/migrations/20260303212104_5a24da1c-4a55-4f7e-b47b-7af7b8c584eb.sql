-- Add unique constraint on wallet_address for upsert support
ALTER TABLE public.user_wallets ADD CONSTRAINT user_wallets_wallet_address_key UNIQUE (wallet_address);