import { createFileRoute } from "@tanstack/react-router";
import { categoriesOptions, productsOptions } from "@/lib/queries";
import { Hero } from "@/components/Hero";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesOptions);
    await context.queryClient.ensureQueryData(productsOptions({}));
  },
  head: () => ({
    meta: [
      { title: "Afro Mart | Authentic African Foods & Goods" },
      { name: "description", content: "Shop authentic African groceries, skincare, fashion, and crafts delivered to your door." },
      { property: "og:title", content: "Afro Mart | Authentic African Foods & Goods" },
      { property: "og:description", content: "Shop authentic African groceries, skincare, fashion, and crafts delivered to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </main>
  );
}
