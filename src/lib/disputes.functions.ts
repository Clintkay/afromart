import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type OrderDispute = Tables<"order_disputes"> & { stores?: { name: string } | null };

export const getOrderDisputes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { orderId: string }) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from("order_disputes").select("*, stores(name)").eq("order_id", data.orderId).order("created_at", { ascending: false });
    if (error) throw error;
    return (rows ?? []) as OrderDispute[];
  });

export const getStoreDisputes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: stores } = await context.supabase.from("stores").select("id").eq("owner_id", context.userId);
    const ids = (stores ?? []).map((s) => s.id);
    if (!ids.length) return [] as OrderDispute[];
    const { data: rows, error } = await context.supabase.from("order_disputes").select("*").in("store_id", ids).order("created_at", { ascending: false });
    if (error) throw error;
    return (rows ?? []) as OrderDispute[];
  });

export const openDispute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { orderId: string; storeId: string; reason: string; requested: string; details: string }) =>
    z.object({
      orderId: z.string().uuid(), storeId: z.string().uuid(),
      reason: z.enum(["damaged", "not_delivered", "wrong_item", "payment_issue", "other"]),
      requested: z.enum(["refund", "replacement", "other"]),
      details: z.string().trim().min(10).max(2000),
    }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("orders").select("id, order_items(store_id)").eq("id", data.orderId).eq("user_id", context.userId).maybeSingle();
    if (!order || !(order.order_items ?? []).some((i) => i.store_id === data.storeId)) throw new Error("This seller is not part of your order.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.from("order_disputes").select("id").eq("order_id", data.orderId).eq("store_id", data.storeId).neq("status", "resolved").maybeSingle();
    if (existing) throw new Error("You already have an open issue with this seller for this order.");
    const { error } = await supabaseAdmin.from("order_disputes").insert({ order_id: data.orderId, store_id: data.storeId, user_id: context.userId, reason: data.reason, requested: data.requested, details: data.details });
    if (error) throw error;
    const { data: store } = await supabaseAdmin.from("stores").select("owner_id").eq("id", data.storeId).maybeSingle();
    if (store?.owner_id) await supabaseAdmin.from("notifications").insert({ user_id: store.owner_id, kind: "order", title: "A buyer reported an order issue", body: "Open your seller dashboard to review and respond to the issue." });
    return { ok: true };
  });

export const respondDispute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { disputeId: string; response: string; resolve: boolean }) =>
    z.object({ disputeId: z.string().uuid(), response: z.string().trim().min(2).max(2000), resolve: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: d } = await supabaseAdmin.from("order_disputes").select("id, user_id, store_id, status").eq("id", data.disputeId).maybeSingle();
    if (!d) throw new Error("Issue not found.");
    const { data: store } = await supabaseAdmin.from("stores").select("owner_id").eq("id", d.store_id).maybeSingle();
    if (store?.owner_id !== context.userId) throw new Error("Forbidden");
    if (d.status === "resolved") throw new Error("This issue is already resolved.");
    await supabaseAdmin.from("order_disputes").update({ seller_response: data.response, status: data.resolve ? "resolved" : "seller_responded", updated_at: new Date().toISOString() }).eq("id", d.id);
    await supabaseAdmin.from("notifications").insert({ user_id: d.user_id, kind: "order", title: data.resolve ? "Your order issue was resolved" : "The seller replied to your issue", body: data.response.slice(0, 500) });
    return { ok: true };
  });

export const buyerUpdateDispute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { disputeId: string; action: "resolve" | "escalate" }) =>
    z.object({ disputeId: z.string().uuid(), action: z.enum(["resolve", "escalate"]) }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: d } = await supabaseAdmin.from("order_disputes").select("id, user_id, order_id, status").eq("id", data.disputeId).maybeSingle();
    if (!d || d.user_id !== context.userId) throw new Error("Forbidden");
    if (d.status === "resolved") throw new Error("This issue is already resolved.");
    await supabaseAdmin.from("order_disputes").update({ status: data.action === "resolve" ? "resolved" : "escalated", updated_at: new Date().toISOString() }).eq("id", d.id);
    if (data.action === "escalate") {
      await supabaseAdmin.from("support_tickets").insert({ user_id: context.userId, subject: `Order issue #${d.order_id.slice(0, 8).toUpperCase()}`, topic: "orders" });
    }
    return { ok: true };
  });
