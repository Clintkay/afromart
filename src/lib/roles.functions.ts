import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Enums } from "@/integrations/supabase/types";

export type AppRole = Enums<"app_role">;

const SELF_ROLES = ["buyer", "seller", "service_provider", "delivery_partner"] as const;

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw error;
    const roles = (data ?? []).map((row) => row.role as AppRole);
    return roles.length > 0 ? roles : (["buyer"] as AppRole[]);
  });

export const addMyRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { role: string }) => z.object({ role: z.enum(SELF_ROLES) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_roles")
      .upsert({ user_id: context.userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw error;

    if (data.role === "seller") {
      await context.supabase.from("notifications").insert({
        user_id: context.userId,
        kind: "system",
        title: "Seller account ready",
        body: "Your Afromart seller workspace is open. Add your store details and first products to start selling.",
      });
    }
    return { ok: true };
  });
