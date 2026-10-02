import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/ServicesPage";

export const Route = createFileRoute("/hire")({
  component: ServicesPage,
  head: () => ({ meta: [
    { title: "Hire Services | Afromart Marketplace" },
    { name: "description", content: "Browse and hire tailors, dispatch riders, repair experts and caterers, then chat with them on Afromart." },
    { property: "og:title", content: "Hire Services | Afromart Marketplace" },
    { property: "og:description", content: "Find trusted African service providers and message them directly on Afromart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
