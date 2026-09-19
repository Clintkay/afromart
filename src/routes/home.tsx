import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceHome } from "@/components/MarketplaceHome";

export const Route = createFileRoute("/home")({
  component: MarketplaceHome,
  head: () => ({ meta: [
    { title: "Afromart Web App | Browse the Marketplace" },
    { name: "description", content: "Browse African products, services and sellers in the Afromart web app while the mobile app launches." },
    { property: "og:title", content: "Afromart Web App | Browse the Marketplace" },
    { property: "og:description", content: "Browse African products, services and sellers in the Afromart web app." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
