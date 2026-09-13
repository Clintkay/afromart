import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/CartPage";

export const Route = createFileRoute("/cart")({
  component: CartRoute,
  head: () => ({
    meta: [
      { title: "Your Cart | Afromart" },
      { name: "description", content: "Review your cart at Afromart." },
      { property: "og:title", content: "Your Cart | Afromart" },
      { property: "og:description", content: "Review your cart at Afromart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function CartRoute() {
  return <CartPage />;
}
