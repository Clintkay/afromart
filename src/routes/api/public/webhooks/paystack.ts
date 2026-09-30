import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/webhooks/paystack")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env["PAYSTACK_SECRET_KEY"];
        if (!secretKey) return new Response("Not configured", { status: 500 });

        const signature = request.headers.get("x-paystack-signature");
        const body = await request.text();
        const expected = createHmac("sha512", secretKey).update(body).digest("hex");
        const received = Buffer.from(signature ?? "", "utf8");
        const digest = Buffer.from(expected, "utf8");
        if (received.length !== digest.length || !timingSafeEqual(received, digest)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as {
          event?: string;
          data?: { reference?: string; status?: string; amount?: number; currency?: string };
        };
        if (event.event !== "charge.success" || !event.data?.reference) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, total, payment_status")
          .eq("paystack_reference", event.data.reference)
          .maybeSingle();
        if (!order || order.payment_status === "paid") return new Response("ok");

        const { verifyPaystackTransaction, markOrderPaid } = await import("@/lib/payments.server");
        const transaction = await verifyPaystackTransaction(event.data.reference, secretKey);
        if (!transaction || transaction.status !== "success") return new Response("ok");
        if (transaction.currency !== "NGN" || transaction.amount !== order.total) return new Response("ok");

        await markOrderPaid(order.id);
        return new Response("ok");
      },
    },
  },
});
