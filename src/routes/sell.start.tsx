import { createFileRoute } from "@tanstack/react-router";
import { SellerStartPage } from "@/components/SellerStartPage";

export const Route = createFileRoute("/sell/start")({
  component: SellerStartPage,
  head: () => ({ meta: [
    { title: "Create Your Business Profile | Afromart" },
    { name: "description", content: "Create your Afromart seller or service-provider profile and manage your business presence." },
    { property: "og:title", content: "Create Your Business Profile | Afromart" },
    { property: "og:description", content: "Create your Afromart seller or service-provider profile and manage your business presence." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});