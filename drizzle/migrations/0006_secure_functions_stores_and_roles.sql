CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.handle_new_user() SET SCHEMA private;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.handle_new_user() TO service_role;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE SELECT ON public.stores FROM anon, authenticated;
GRANT SELECT (id, name, slug, description, logo_url, banner_url, is_verified, rating, created_at, updated_at) ON public.stores TO anon, authenticated;
GRANT ALL ON public.stores TO service_role;

CREATE POLICY "Role rows cannot be updated"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);