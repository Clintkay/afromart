ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paystack_reference text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_paystack_reference_idx ON public.orders (paystack_reference);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('card','bank_transfer','paystack'));