ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS state text;
COMMENT ON COLUMN public.stores.state IS 'Seller business state, province, or region supplied during store onboarding.';