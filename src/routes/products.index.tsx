import { createFileRoute } from "@tanstack/react-router";
import { productsOptions, categoriesOptions } from "@/lib/queries";
import { ProductsPage } from "@/components/ProductsPage";

export const Route = createFileRoute("/products/")({
  component: ProductsRoute,
  validateSearch: (search: { categorySlug?: string; search?: string }) => search,
  loaderDeps: ({ search: { categorySlug, search } }) => ({ categorySlug, search }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(categoriesOptions);
    await context.queryClient.ensureQueryData(productsOptions(deps));
  },
  head: () => ({
    meta: [
      { title: "Shop | Afromart" },
      { name: "description", content: "Browse authentic African foods, skincare, fashion, and crafts from verified sellers." },
      { property: "og:title", content: "Shop | Afromart" },
      { property: "og:description", content: "Browse authentic African foods, skincare, fashion, and crafts from verified sellers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProductsRoute() {
  return <ProductsPage />;
}
