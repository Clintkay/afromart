CREATE TABLE public.order_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('damaged','not_delivered','wrong_item','payment_issue','other')),
  requested text NOT NULL DEFAULT 'refund' CHECK (requested IN ('refund','replacement','other')),
  details text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','seller_responded','resolved','escalated')),
  seller_response text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_disputes_order_idx ON public.order_disputes(order_id);
CREATE INDEX order_disputes_store_idx ON public.order_disputes(store_id);
GRANT SELECT ON public.order_disputes TO authenticated;
GRANT ALL ON public.order_disputes TO service_role;
ALTER TABLE public.order_disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyer or seller can view disputes" ON public.order_disputes FOR SELECT TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));