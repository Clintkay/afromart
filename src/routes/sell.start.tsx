import { createFileRoute } from "@tanstack/react-router";
import { SellerStartPage } from "@/components/SellerStartPage";

export const Route = createFileRoute("/sell/start")({
  component: SellerStartPage,
  head: () => ({ meta: [
    { title: "Start Selling | Afro Mart" },
    { name: "description", content: "Choose your seller role and create your Afro Mart seller account." },
    { property: "og:title", content: "Start Selling | Afro Mart" },
    { property: "og:description", content: "Choose your seller role and create your Afro Mart seller account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});