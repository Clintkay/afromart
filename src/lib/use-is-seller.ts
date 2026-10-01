import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { myRolesOptions } from "@/lib/queries";

/** True when the signed-in user already has a seller or service-provider role. */
export function useIsSeller() {
  const { user } = useAuth();
  const { data: roles } = useQuery({ ...myRolesOptions, enabled: Boolean(user) });
  return Boolean(user) && (roles ?? []).some((role) => role === "seller" || role === "service_provider");
}
