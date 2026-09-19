import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/PublicPages";

export const Route = createFileRoute("/business")({
  component: BusinessPage,
  head: () => ({ meta: [
    { title: "For Businesses | Afromart" },
    { name: "description", content: "Create and manage your Afromart business profile, verification and marketplace listings." },
    { property: "og:title", content: "For Businesses | Afromart" },
    { property: "og:description", content: "Build a trusted business presence and reach customers across Africa with Afromart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});