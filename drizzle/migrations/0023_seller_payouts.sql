CREATE TABLE public.seller_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','processing','paid','rejected')),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX seller_payouts_store_idx ON public.seller_payouts(store_id);
GRANT SELECT ON public.seller_payouts TO authenticated;
GRANT ALL ON public.seller_payouts TO service_role;
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store owner views payouts" ON public.seller_payouts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.store_payout_balance(p_store uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH e AS (
    SELECT COALESCE(sum(i.total),0)::integer AS earned FROM public.order_items i JOIN public.orders o ON o.id=i.order_id
    WHERE i.store_id=p_store AND o.status='delivered' AND o.payment_status='paid'
  ), p AS (
    SELECT COALESCE(sum(amount) FILTER (WHERE status IN ('requested','processing')),0)::integer AS pending,
           COALESCE(sum(amount) FILTER (WHERE status='paid'),0)::integer AS paid FROM public.seller_payouts WHERE store_id=p_store
  )
  SELECT jsonb_build_object('earned',e.earned,'pending',p.pending,'paid',p.paid,'available',e.earned-p.pending-p.paid) FROM e,p
$$;
REVOKE EXECUTE ON FUNCTION public.store_payout_balance(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.store_payout_balance(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.request_payout(p_store uuid, p_user uuid, p_amount integer)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.seller_bank_accounts; avail integer; new_id uuid;
BEGIN
  PERFORM 1 FROM public.stores WHERE id=p_store AND owner_id=p_user FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT * INTO b FROM public.seller_bank_accounts WHERE store_id=p_store;
  IF NOT FOUND THEN RAISE EXCEPTION 'Add your bank details before requesting a payout.'; END IF;
  avail := (public.store_payout_balance(p_store)->>'available')::integer;
  IF p_amount <= 0 OR p_amount > avail THEN RAISE EXCEPTION 'Amount is more than your available balance.'; END IF;
  INSERT INTO public.seller_payouts(store_id,amount,bank_name,account_name,account_number)
  VALUES(p_store,p_amount,b.bank_name,b.account_name,b.account_number) RETURNING id INTO new_id;
  RETURN new_id;
END $$;
REVOKE EXECUTE ON FUNCTION public.request_payout(uuid,uuid,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_payout(uuid,uuid,integer) TO service_role;