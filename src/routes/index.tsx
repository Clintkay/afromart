import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceHome } from "@/components/MarketplaceHome";
import { categoriesOptions, productsOptions } from "@/lib/queries";

export const Route = createFileRoute("/")({
  component: MarketplaceHome,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsOptions({})),
      context.queryClient.ensureQueryData(categoriesOptions),
    ]);
  },
  head: () => ({ meta: [
    { title: "Afro Mart | African Marketplace" },
    { name: "description", content: "Discover authentic African products, services, stores and independent sellers in one marketplace." },
    { property: "og:title", content: "Afro Mart | African Marketplace" },
    { property: "og:description", content: "Discover authentic African products, services, stores and independent sellers in one marketplace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
