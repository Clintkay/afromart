-- Sellers manage their own store
CREATE POLICY "Owners insert own store" ON public.stores
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own store" ON public.stores
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners read own store" ON public.stores
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);
GRANT INSERT, UPDATE ON public.stores TO authenticated;
GRANT SELECT (owner_id) ON public.stores TO authenticated;

-- Sellers manage their own products
CREATE POLICY "Owners insert own products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()));
CREATE POLICY "Owners update own products" ON public.products
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()));
CREATE POLICY "Owners read own products" ON public.products
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()));
GRANT INSERT, UPDATE ON public.products TO authenticated;

-- Sellers manage images for their own products
CREATE POLICY "Owners insert own product images" ON public.product_images
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id
    WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()));
CREATE POLICY "Owners delete own product images" ON public.product_images
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.products p JOIN public.stores s ON s.id = p.store_id
    WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()));
GRANT INSERT, DELETE ON public.product_images TO authenticated;

-- Service requests (Fiverr-style ordering of a service)
CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_title text NOT NULL,
  category text,
  budget integer,
  country text,
  details text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own service requests" ON public.service_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own service requests" ON public.service_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own service requests" ON public.service_requests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX service_requests_user_idx ON public.service_requests (user_id, created_at DESC);