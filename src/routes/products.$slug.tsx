import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "@/components/ProductDetail";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetail,
  head: () => ({
    meta: [
      { title: "Product Details | Afromart" },
      { name: "description", content: "See product details, seller information and delivery options on Afromart." },
      { property: "og:title", content: "Product Details | Afromart" },
      { property: "og:description", content: "See product details, seller information and delivery options on Afromart." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
