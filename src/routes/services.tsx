import { createFileRoute } from "@tanstack/react-router";
import { ServicesInfoPage } from "@/components/PublicPages";

export const Route = createFileRoute("/services")({
  component: ServicesInfoPage,
  head: () => ({ meta: [
    { title: "Services | Afromart" },
    { name: "description", content: "Discover tailoring, logistics, repairs and freelance services available through the Afromart mobile app." },
    { property: "og:title", content: "Services | Afromart" },
    { property: "og:description", content: "Discover African service providers and continue in the Afromart mobile app." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});