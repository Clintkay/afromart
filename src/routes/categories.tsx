import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/components/CategoriesPage";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({ meta: [
    { title: "Categories | Afromart Web App" },
    { name: "description", content: "Explore Afromart categories: fashion, beauty, groceries, home, electronics and agriculture." },
    { property: "og:title", content: "Categories | Afromart Web App" },
    { property: "og:description", content: "Explore Afromart categories across African markets." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
