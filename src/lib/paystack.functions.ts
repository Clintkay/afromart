import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const orderInput = z.object({ orderId: z.string().uuid() });

/**
 * Starts a Paystack transaction for an existing order and returns the hosted
 * payment page URL. Buyers can pay with a Nigerian card, bank transfer, USSD
 * or bank account there. The order is only marked paid after verification.
 */
export const startPaystackPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => orderInput.parse(input))
  .handler(async ({ data, context }) => {
    const secretKey = process.env["PAYSTACK_SECRET_KEY"];
    if (!secretKey) throw new Error("Paystack is not configured yet.");
    const origin = new URL(getRequest().url).origin;

    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, total, shipping_cost, payment_status, user_id, status")
      .eq("id", data.orderId)
      .single();
    if (error || !order) throw new Error("Order not found.");
    if (order.user_id !== context.userId) throw new Error("Forbidden");
    if (order.payment_status === "paid") return { url: `${origin}/orders/${order.id}` };
    if (order.status === "cancelled" || order.payment_status === "refunded") throw new Error("This order cannot be paid.");

    const { data: items, error: itemsError } = await context.supabase
      .from("order_items")
      .select("price, quantity")
      .eq("order_id", order.id);
    if (itemsError) throw itemsError;
    const computed = (items ?? []).reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shipping_cost;
    if (!items?.length || computed !== order.total) throw new Error("Order total could not be verified.");

    const email = (context.claims as { email?: string }).email ?? `buyer+${order.user_id}@afromart.app`;
    const reference = `AFR-${order.id.replaceAll("-", "").slice(0, 16)}-${Date.now().toString(36).toUpperCase()}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: order.total,
        currency: "NGN",
        reference,
        callback_url: `${origin}/orders/${order.id}?payment=success`,
        channels: ["card", "bank", "ussd", "bank_transfer", "mobile_money", "qr"],
        metadata: { order_id: order.id, user_id: order.user_id },
      }),
    });

    const payload = (await response.json()) as { status?: boolean; message?: string; data?: { authorization_url?: string } };
    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      console.error("[paystack] initialize failed", payload.message);
      throw new Error("Payment could not be started. Please try again.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("orders").update({ paystack_reference: reference, payment_method: "paystack" }).eq("id", order.id);

    return { url: payload.data.authorization_url };
  });

/**
 * Confirms a Paystack payment when the buyer returns from the payment page.
 * Amount, currency, reference and ownership are all checked before the order
 * is marked paid; the webhook covers buyers who close the tab early.
 */
export const verifyPaystackPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => orderInput.parse(input))
  .handler(async ({ data, context }) => {
    const secretKey = process.env["PAYSTACK_SECRET_KEY"];
    if (!secretKey) throw new Error("Paystack is not configured yet.");

    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, total, user_id, payment_status, paystack_reference")
      .eq("id", data.orderId)
      .single();
    if (error || !order) throw new Error("Order not found.");
    if (order.user_id !== context.userId) throw new Error("Forbidden");
    if (order.payment_status === "paid") return { paid: true };
    if (!order.paystack_reference) return { paid: false };

    const { verifyPaystackTransaction, markOrderPaid } = await import("./payments.server");
    const transaction = await verifyPaystackTransaction(order.paystack_reference, secretKey);
    if (!transaction) return { paid: false };
    if (transaction.status !== "success") return { paid: false };
    if (transaction.currency !== "NGN" || transaction.amount !== order.total) return { paid: false };
    if (transaction.metadata?.order_id !== order.id || transaction.metadata?.user_id !== order.user_id) return { paid: false };

    await markOrderPaid(order.id);
    return { paid: true };
  });
