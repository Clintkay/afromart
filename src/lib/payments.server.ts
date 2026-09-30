/**
 * Shared server-only helper that marks an order paid exactly once and notifies
 * the buyer plus every seller involved. Used by Paystack verification, the
 * Paystack webhook and the Stripe fallback path.
 */
export async function markOrderPaid(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .single();
  if (!order) return false;

  const { data: updated } = await supabaseAdmin
    .from("orders")
    .update({ payment_status: "paid", status: "processing", updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("payment_status", "pending")
    .select("id");

  if (!updated?.length) return true;

  await supabaseAdmin.from("notifications").insert({
    user_id: order.user_id,
    kind: "order",
    title: "Payment confirmed",
    body: "Afromart received your payment. Your order is now being prepared for delivery.",
  });

  const { data: storeItems } = await supabaseAdmin.from("order_items").select("store_id").eq("order_id", order.id);
  const storeIds = [...new Set((storeItems ?? []).map((i) => i.store_id).filter(Boolean))] as string[];
  if (storeIds.length > 0) {
    const { data: stores } = await supabaseAdmin.from("stores").select("name, owner_id").in("id", storeIds);
    const rows = (stores ?? [])
      .filter((s) => s.owner_id)
      .map((s) => ({
        user_id: s.owner_id as string,
        kind: "order",
        title: "Order paid",
        body: `${s.name}: a buyer has paid for their order. You can start fulfilment.`,
      }));
    if (rows.length > 0) await supabaseAdmin.from("notifications").insert(rows);
  }

  return true;
}

export type PaystackVerification = {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  metadata?: { order_id?: string; user_id?: string } | null;
};

/** Calls Paystack's verify endpoint for a transaction reference. */
export async function verifyPaystackTransaction(reference: string, secretKey: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const payload = (await response.json()) as { status?: boolean; data?: PaystackVerification };
  if (!response.ok || !payload.status || !payload.data) return null;
  return payload.data;
}
