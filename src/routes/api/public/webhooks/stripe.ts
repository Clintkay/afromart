import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe webhook. Marks Afromart orders paid once Stripe confirms the payment.
 * The signature is always verified before anything is written.
 */
export const Route = createFileRoute("/api/public/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env["STRIPE_LIVE_API_KEY"];
        const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secretKey || !webhookSecret) return new Response("Not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });
        const body = await request.text();

        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(secretKey, { httpClient: Stripe.createFetchHttpClient() });

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret,
            undefined,
            Stripe.createSubtleCryptoProvider(),
          );
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        if (event.type !== "checkout.session.completed") return new Response("ok");

        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        const orderId = session.metadata?.["order_id"] ?? session.client_reference_id;
        if (!orderId) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, user_id, total")
          .eq("id", orderId)
          .maybeSingle();
        if (!order) return new Response("ok");

        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid", status: "processing", updated_at: new Date().toISOString() })
          .eq("id", order.id);

        await supabaseAdmin.from("notifications").insert({
          user_id: order.user_id,
          kind: "order",
          title: "Payment confirmed",
          body: "Afromart received your payment. Your order is now being prepared for delivery.",
        });

        const { data: storeItems } = await supabaseAdmin
          .from("order_items")
          .select("store_id")
          .eq("order_id", order.id);
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

        return new Response("ok");
      },
    },
  },
});
