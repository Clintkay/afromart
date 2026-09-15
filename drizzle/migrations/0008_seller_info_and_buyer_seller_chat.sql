-- 1. Seller/business info on stores
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'Nigeria',
  ADD COLUMN IF NOT EXISTS response_time text,
  ADD COLUMN IF NOT EXISTS total_sales integer DEFAULT 0;

GRANT SELECT (business_name, city, country, response_time, total_sales) ON public.stores TO anon;
GRANT SELECT (business_name, city, country, response_time, total_sales) ON public.stores TO authenticated;

-- 2. Buyer <-> seller conversations
CREATE TABLE IF NOT EXISTS public.product_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  subject text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.product_conversations TO authenticated;
GRANT ALL ON public.product_conversations TO service_role;
ALTER TABLE public.product_conversations ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION private.set_conversation_seller()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SELECT owner_id INTO NEW.seller_id FROM public.stores WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_conversation_seller ON public.product_conversations;
CREATE TRIGGER set_conversation_seller
BEFORE INSERT ON public.product_conversations
FOR EACH ROW EXECUTE FUNCTION private.set_conversation_seller();

CREATE POLICY "Participants read conversations" ON public.product_conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers start conversations" ON public.product_conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants touch conversations" ON public.product_conversations
  FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE INDEX IF NOT EXISTS product_conversations_buyer_idx ON public.product_conversations (buyer_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS product_conversations_seller_idx ON public.product_conversations (seller_id, last_message_at DESC);

-- 3. Messages inside a conversation
CREATE TABLE IF NOT EXISTS public.product_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.product_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.product_messages TO authenticated;
GRANT ALL ON public.product_messages TO service_role;
ALTER TABLE public.product_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read messages" ON public.product_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.product_conversations c
    WHERE c.id = product_messages.conversation_id
      AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
  ));

CREATE POLICY "Participants send messages" ON public.product_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.product_conversations c
      WHERE c.id = product_messages.conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

CREATE INDEX IF NOT EXISTS product_messages_conversation_idx ON public.product_messages (conversation_id, created_at);

-- 4. Security fix: block self-service role escalation on profiles
CREATE OR REPLACE FUNCTION private.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Changing the role column is not permitted';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION private.prevent_profile_role_change();
