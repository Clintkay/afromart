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
      { title: "Product | Afro Mart" },
      { name: "description", content: "Product details at Afro Mart." },
      { property: "og:title", content: "Product | Afro Mart" },
      { property: "og:description", content: "Product details at Afro Mart." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProductDetailRoute() {
  return <ProductDetail />;
}
