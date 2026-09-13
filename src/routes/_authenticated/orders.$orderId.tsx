import { createFileRoute, notFound } from "@tanstack/react-router";
import { OrderTrackingPage } from "@/components/OrderTrackingPage";
import { orderOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/orders/$orderId")({
  loader: async ({ context, params }) => {
    const order = await context.queryClient.ensureQueryData(orderOptions(params.orderId));
    if (!order) throw notFound();
    return order;
  },
  component: OrderRoute,
  head: () => ({ meta: [
    { title: "Track Order | Afromart" },
    { name: "description", content: "View your Afromart order and delivery progress." },
    { property: "og:title", content: "Track Order | Afromart" },
    { property: "og:description", content: "View your Afromart order and delivery progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});

function OrderRoute() {
  const order = Route.useLoaderData();
  return <OrderTrackingPage order={order} />;
}