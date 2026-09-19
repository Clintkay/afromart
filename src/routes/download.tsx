import { createFileRoute } from "@tanstack/react-router";
import { DownloadPage } from "@/components/PublicPages";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
  head: () => ({ meta: [
    { title: "Download the Afromart App" },
    { name: "description", content: "Get the complete Afromart marketplace experience on your mobile device." },
    { property: "og:title", content: "Download the Afromart App" },
    { property: "og:description", content: "Discover African products, services and businesses in the Afromart mobile app." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});