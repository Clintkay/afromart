import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  orderId: z.string().uuid(),
  origin: z.string().url(),
});

/**
 * Creates a Stripe Checkout Session for an existing Afromart order and returns
 * the hosted payment URL. The order is only marked paid by the Stripe webhook.
 */
export const createOrderCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string; origin: string }) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const origin = new URL(getRequest().url).origin;
    const secretKey = process.env["STRIPE_LIVE_API_KEY"];
    if (!secretKey) throw new Error("Stripe is not configured yet.");

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
      .select("name, price, quantity")
      .eq("order_id", order.id);
    if (itemsError) throw itemsError;
    if (!items?.length || items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shipping_cost !== order.total) throw new Error("Order total could not be verified.");

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      metadata: { order_id: order.id, user_id: context.userId },
      line_items: [...items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "ngn",
          unit_amount: item.price,
          product_data: { name: item.name },
        },
      })), ...(order.shipping_cost > 0 ? [{ quantity: 1, price_data: { currency: "ngn", unit_amount: order.shipping_cost, product_data: { name: "Delivery" } } }] : [])],
      success_url: `${origin}/orders/${order.id}?payment=success`,
      cancel_url: `${origin}/orders/${order.id}?payment=cancelled`,
    });

    if (!session.url) throw new Error("Stripe did not return a payment link.");
    return { url: session.url };
  });
