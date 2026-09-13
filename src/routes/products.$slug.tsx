import { createFileRoute } from "@tanstack/react-router";
import { productOptions } from "@/lib/queries";
import { ProductDetail } from "@/components/ProductDetail";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailRoute,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(productOptions(params.slug));
  },
  head: () => ({
    meta: [
      { title: "Product | Afromart" },
      { name: "description", content: "Product details at Afromart." },
      { property: "og:title", content: "Product | Afromart" },
      { property: "og:description", content: "Product details at Afromart." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProductDetailRoute() {
  return <ProductDetail />;
}
