import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/components/ProductsPage";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: { categorySlug?: string; search?: string }) => search,
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Shop African Products | Afromart Web App" },
      { name: "description", content: "Browse verified African sellers and their products in the Afromart web app." },
      { property: "og:title", content: "Shop African Products | Afromart Web App" },
      { property: "og:description", content: "Browse verified African sellers and their products on Afromart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
