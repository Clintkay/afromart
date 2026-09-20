CREATE TABLE public.seller_bank_accounts (store_id uuid PRIMARY KEY REFERENCES public.stores(id), bank_name text NOT NULL, account_name text NOT NULL, account_number text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.seller_bank_accounts TO authenticated;
GRANT ALL ON public.seller_bank_accounts TO service_role;
ALTER TABLE public.seller_bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY bank_owner ON public.seller_bank_accounts TO authenticated USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id=store_id AND s.owner_id=auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id=store_id AND s.owner_id=auth.uid()));
CREATE TABLE public.order_bank_transfers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.orders(id), store_id uuid NOT NULL REFERENCES public.stores(id), bank_name text NOT NULL, account_name text NOT NULL, account_number text NOT NULL, amount integer NOT NULL CHECK (amount>0), reference text NOT NULL UNIQUE DEFAULT ('AFR-' || replace(gen_random_uuid()::text,'-','')), status text NOT NULL DEFAULT 'awaiting_transfer' CHECK (status IN ('awaiting_transfer','submitted','confirmed')), sender_reference text, submitted_at timestamptz, confirmed_at timestamptz, confirmed_by uuid, UNIQUE(order_id,store_id));
GRANT SELECT ON public.order_bank_transfers TO authenticated;
GRANT ALL ON public.order_bank_transfers TO service_role;
ALTER TABLE public.order_bank_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY transfer_participants ON public.order_bank_transfers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id=order_id AND o.user_id=auth.uid()) OR EXISTS (SELECT 1 FROM public.stores s WHERE s.id=store_id AND s.owner_id=auth.uid()));
CREATE FUNCTION public.prepare_bank_transfers(p_order uuid, p_user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.orders; missing integer;
BEGIN
SELECT * INTO o FROM public.orders WHERE id=p_order AND user_id=p_user FOR UPDATE;
IF NOT FOUND OR o.payment_status <> 'pending' OR o.status <> 'pending' THEN RAISE EXCEPTION 'Order cannot use bank transfer'; END IF;
IF EXISTS(SELECT 1 FROM public.order_bank_transfers WHERE order_id=p_order) THEN RETURN; END IF;
SELECT count(*) INTO missing FROM public.order_items i LEFT JOIN public.seller_bank_accounts b ON b.store_id=i.store_id WHERE i.order_id=p_order AND b.store_id IS NULL;
IF missing>0 OR NOT EXISTS(SELECT 1 FROM public.order_items WHERE order_id=p_order) THEN RAISE EXCEPTION 'A seller has not added bank details. Choose card or contact the seller.'; END IF;
INSERT INTO public.order_bank_transfers(order_id,store_id,bank_name,account_name,account_number,amount)
SELECT p_order,x.store_id,b.bank_name,b.account_name,b.account_number,x.amount + CASE WHEN row_number() OVER (ORDER BY x.store_id)=1 THEN o.shipping_cost ELSE 0 END
FROM (SELECT store_id,sum(total)::integer amount FROM public.order_items WHERE order_id=p_order GROUP BY store_id) x JOIN public.seller_bank_accounts b ON b.store_id=x.store_id;
END $$;
REVOKE ALL ON FUNCTION public.prepare_bank_transfers(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_bank_transfers(uuid,uuid) TO service_role;
CREATE FUNCTION public.confirm_bank_transfer(p_transfer uuid,p_user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE t public.order_bank_transfers; o public.orders;
BEGIN
SELECT * INTO t FROM public.order_bank_transfers WHERE id=p_transfer;
IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.stores WHERE id=t.store_id AND owner_id=p_user) THEN RAISE EXCEPTION 'Forbidden'; END IF;
SELECT * INTO o FROM public.orders WHERE id=t.order_id FOR UPDATE;
IF o.status='cancelled' OR o.payment_status='refunded' THEN RAISE EXCEPTION 'Order cannot be confirmed'; END IF;
UPDATE public.order_bank_transfers SET status='confirmed',confirmed_at=now(),confirmed_by=p_user WHERE id=t.id AND status='submitted';
IF NOT FOUND THEN RETURN; END IF;
IF NOT EXISTS(SELECT 1 FROM public.order_bank_transfers WHERE order_id=t.order_id AND status<>'confirmed') THEN
UPDATE public.orders SET payment_status='paid',status='processing',updated_at=now() WHERE id=t.order_id AND payment_status='pending';
INSERT INTO public.notifications(user_id,kind,title,body) VALUES(o.user_id,'order','Payment confirmed','All sellers confirmed your bank transfers. Your order is being prepared.');
END IF;
END $$;
REVOKE ALL ON FUNCTION public.confirm_bank_transfer(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_bank_transfer(uuid,uuid) TO service_role;