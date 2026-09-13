import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/ServicesPage";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({ meta: [
    { title: "Services | Afromart" },
    { name: "description", content: "Find trusted African professionals and services on Afromart." },
    { property: "og:title", content: "Services | Afromart" },
    { property: "og:description", content: "Find trusted African professionals and services on Afromart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});