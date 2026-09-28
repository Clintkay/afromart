import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type Payout = Tables<"seller_payouts">;
export type PayoutBalance = { earned: number; pending: number; paid: number; available: number };

async function ownedStore(supabase: any, userId: string) {
  const { data } = await supabase.from("stores").select("id, name").eq("owner_id", userId).limit(1).maybeSingle();
  return data as { id: string; name: string } | null;
}

export const getMyPayouts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const store = await ownedStore(context.supabase, context.userId);
    if (!store) return { balance: { earned: 0, pending: 0, paid: 0, available: 0 } as PayoutBalance, payouts: [] as Payout[] };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: balance, error } = await supabaseAdmin.rpc("store_payout_balance", { p_store: store.id });
    if (error) throw error;
    const { data: payouts } = await context.supabase.from("seller_payouts").select("*").eq("store_id", store.id).order("created_at", { ascending: false });
    return { balance: balance as unknown as PayoutBalance, payouts: (payouts ?? []) as Payout[] };
  });

export const requestPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { amount: number }) => z.object({ amount: z.number().int().min(1000, "Minimum payout is ₦1,000") }).parse(i))
  .handler(async ({ data, context }) => {
    const store = await ownedStore(context.supabase, context.userId);
    if (!store) throw new Error("Create your store first.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("request_payout", { p_store: store.id, p_user: context.userId, p_amount: data.amount });
    if (error) throw new Error(error.message.includes("bank") || error.message.includes("balance") ? error.message : "Payout request failed. Try again.");
    await supabaseAdmin.from("notifications").insert({ user_id: context.userId, kind: "system", title: "Payout requested", body: `Your withdrawal request for ${store.name} was received. We'll update you as it is processed.` });
    return { ok: true };
  });

async function requireAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const getAllPayouts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("seller_payouts").select("*, stores(name)").in("status", ["requested", "processing"]).order("created_at");
    return (data ?? []) as (Payout & { stores: { name: string } | null })[];
  });

export const updatePayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { payoutId: string; status: "processing" | "paid" | "rejected"; note?: string }) =>
    z.object({ payoutId: z.string().uuid(), status: z.enum(["processing", "paid", "rejected"]), note: z.string().max(300).optional() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p, error } = await supabaseAdmin.from("seller_payouts").update({ status: data.status, note: data.note ?? null, updated_at: new Date().toISOString() })
      .eq("id", data.payoutId).in("status", ["requested", "processing"]).select("amount, stores(owner_id)").maybeSingle();
    if (error) throw error;
    const owner = (p?.stores as { owner_id: string | null } | null)?.owner_id;
    if (owner) {
      const titles = { processing: "Payout is being processed", paid: "Payout sent", rejected: "Payout request declined" } as const;
      await supabaseAdmin.from("notifications").insert({ user_id: owner, kind: "system", title: titles[data.status], body: data.note || `Your payout of ₦${(p!.amount).toLocaleString()} is now ${data.status}.` });
    }
    return { ok: true };
  });
