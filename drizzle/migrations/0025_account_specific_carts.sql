CREATE TABLE public.account_carts (
 user_id uuid PRIMARY KEY,
 items jsonb NOT NULL DEFAULT '[]'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.account_carts TO authenticated;
GRANT ALL ON public.account_carts TO service_role;
ALTER TABLE public.account_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own cart" ON public.account_carts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
