import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/CartPage";

export const Route = createFileRoute("/cart")({
  component: CartRoute,
  head: () => ({
    meta: [
      { title: "Your Cart | Afro Mart" },
      { name: "description", content: "Review your cart at Afro Mart." },
      { property: "og:title", content: "Your Cart | Afro Mart" },
      { property: "og:description", content: "Review your cart at Afro Mart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function CartRoute() {
  return <CartPage />;
}
