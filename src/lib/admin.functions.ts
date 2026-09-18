import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function requireAdmin(supabase: { from: (table: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required.");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [profiles, products, stores, orders, tickets] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("stores").select("id, name, slug, is_verified, created_at", { count: "exact" }).order("created_at", { ascending: false }),
      supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);

    return {
      userCount: profiles.count ?? 0,
      productCount: products.count ?? 0,
      orderCount: orders.count ?? 0,
      openTicketCount: tickets.count ?? 0,
      stores: stores.data ?? [],
    };
  });

export const adminSetStoreVerified = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { storeId: string; verified: boolean }) =>
    z.object({ storeId: z.string().uuid(), verified: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("stores")
      .update({ is_verified: data.verified, updated_at: new Date().toISOString() })
      .eq("id", data.storeId);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetProductStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { productId: string; status: string }) =>
    z
      .object({ productId: z.string().uuid(), status: z.enum(["active", "draft", "archived"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("products")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.productId);
    if (error) throw error;
    return { ok: true };
  });
