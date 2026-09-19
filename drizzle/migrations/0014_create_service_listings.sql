CREATE TABLE public.service_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  price_from integer NOT NULL DEFAULT 0,
  delivery_days integer NOT NULL DEFAULT 3,
  image_url text,
  city text,
  country text NOT NULL DEFAULT 'Nigeria',
  rating numeric NOT NULL DEFAULT 0,
  orders_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_listings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.service_listings TO authenticated;
GRANT ALL ON public.service_listings TO service_role;

ALTER TABLE public.service_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are viewable by everyone"
  ON public.service_listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Store owners can add their services"
  ON public.service_listings FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));

CREATE POLICY "Store owners can update their services"
  ON public.service_listings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));

CREATE INDEX service_listings_category_idx ON public.service_listings (category);
CREATE INDEX service_listings_store_idx ON public.service_listings (store_id);