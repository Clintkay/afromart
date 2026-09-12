ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'buyer',
  ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Nigeria',
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('buyer', 'seller', 'service_provider', 'delivery_partner')) NOT VALID;

ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_role_check;