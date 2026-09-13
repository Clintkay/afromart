import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceHome } from "@/components/MarketplaceHome";
import { categoriesOptions, productsOptions } from "@/lib/queries";

export const Route = createFileRoute("/home")({
  component: MarketplaceHome,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsOptions({})),
      context.queryClient.ensureQueryData(categoriesOptions),
    ]);
  },
  head: () => ({ meta: [
    { title: "Home | Afromart" },
    { name: "description", content: "Explore authentic African goods, services, and independent sellers on Afromart." },
    { property: "og:title", content: "Home | Afromart" },
    { property: "og:description", content: "Explore authentic African goods, services, and independent sellers on Afromart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});