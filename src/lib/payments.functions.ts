import { createServerFn } from "@tanstack/react-start";
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
    const secretKey = process.env["STRIPE_LIVE_API_KEY"];
    if (!secretKey) throw new Error("Stripe is not configured yet.");

    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, total, payment_status, user_id")
      .eq("id", data.orderId)
      .single();
    if (error || !order) throw new Error("Order not found.");
    if (order.user_id !== context.userId) throw new Error("Forbidden");
    if (order.payment_status === "paid") return { url: `${data.origin}/orders/${order.id}` };

    const { data: items, error: itemsError } = await context.supabase
      .from("order_items")
      .select("name, price, quantity")
      .eq("order_id", order.id);
    if (itemsError) throw itemsError;

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      metadata: { order_id: order.id, user_id: context.userId },
      line_items: (items ?? []).map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "ngn",
          unit_amount: item.price,
          product_data: { name: item.name },
        },
      })),
      success_url: `${data.origin}/orders/${order.id}?payment=success`,
      cancel_url: `${data.origin}/checkout?payment=cancelled`,
    });

    if (!session.url) throw new Error("Stripe did not return a payment link.");
    return { url: session.url };
  });
