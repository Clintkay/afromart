ALTER TABLE public.products
  ADD COLUMN rating numeric(3,2),
  ADD COLUMN review_count integer NOT NULL DEFAULT 0;

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE INDEX reviews_product_id_idx ON public.reviews (product_id);
CREATE INDEX reviews_user_id_idx ON public.reviews (user_id);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON public.reviews FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can create own reviews"
  ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION private.refresh_product_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
DECLARE
  target_product uuid := COALESCE(NEW.product_id, OLD.product_id);
  target_store uuid;
BEGIN
  UPDATE public.products p
  SET rating = sub.avg_rating,
      review_count = sub.cnt,
      updated_at = now()
  FROM (
    SELECT round(avg(rating)::numeric, 2) AS avg_rating, count(*)::integer AS cnt
    FROM public.reviews WHERE product_id = target_product
  ) sub
  WHERE p.id = target_product;

  SELECT store_id INTO target_store FROM public.products WHERE id = target_product;
  IF target_store IS NOT NULL THEN
    UPDATE public.stores s
    SET rating = sub.avg_rating,
        updated_at = now()
    FROM (
      SELECT round(avg(r.rating)::numeric, 2) AS avg_rating
      FROM public.reviews r
      JOIN public.products p ON p.id = r.product_id
      WHERE p.store_id = target_store
    ) sub
    WHERE s.id = target_store;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION private.refresh_product_rating() FROM anon, authenticated;

CREATE TRIGGER reviews_refresh_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION private.refresh_product_rating();