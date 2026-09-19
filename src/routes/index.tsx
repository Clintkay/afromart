import { createFileRoute } from "@tanstack/react-router";
import { PublicHome } from "@/components/PublicHome";

export const Route = createFileRoute("/")({
  component: PublicHome,
  head: () => ({ meta: [
    { title: "Afromart | Everything Africa. One Marketplace." },
    { name: "description", content: "Discover African products, services, businesses and opportunities through the Afromart mobile marketplace." },
    { property: "og:title", content: "Afromart | Everything Africa. One Marketplace." },
    { property: "og:description", content: "A Pan-African mobile marketplace connecting people, businesses and service providers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
