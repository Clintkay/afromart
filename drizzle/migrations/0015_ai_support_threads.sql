CREATE TABLE public.ai_support_threads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), title text NOT NULL DEFAULT 'New support chat', messages jsonb NOT NULL DEFAULT '[]', ticket_id uuid REFERENCES public.support_tickets(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_support_threads TO authenticated;
GRANT ALL ON public.ai_support_threads TO service_role;
ALTER TABLE public.ai_support_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own support chats" ON public.ai_support_threads FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX ai_support_threads_user_idx ON public.ai_support_threads(user_id, updated_at DESC);
CREATE TABLE public.ai_support_access (id text PRIMARY KEY, reason text NOT NULL, status integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_support_access TO service_role;
ALTER TABLE public.ai_support_access ENABLE ROW LEVEL SECURITY;