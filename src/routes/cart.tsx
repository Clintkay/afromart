import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/CartPage";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Cart | Afromart" },
      { name: "description", content: "Review the items you selected from African sellers before checkout." },
      { property: "og:title", content: "Your Cart | Afromart" },
      { property: "og:description", content: "Review the items you selected from African sellers before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
