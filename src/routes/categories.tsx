import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/components/CategoriesPage";
import { categoriesOptions, productsOptions } from "@/lib/queries";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  loader: async ({ context }) => Promise.all([context.queryClient.ensureQueryData(categoriesOptions), context.queryClient.ensureQueryData(productsOptions({}))]),
  head: () => ({ meta: [
    { title: "Categories | Afromart" },
    { name: "description", content: "Browse Afromart products by category." },
    { property: "og:title", content: "Categories | Afromart" },
    { property: "og:description", content: "Browse Afromart products by category." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});