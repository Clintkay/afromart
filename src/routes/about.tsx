import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/PublicPages";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About Afromart | Connecting African Commerce" },
    { name: "description", content: "Learn how Afromart connects buyers, businesses and service providers across Africa through one mobile marketplace." },
    { property: "og:title", content: "About Afromart | Connecting African Commerce" },
    { property: "og:description", content: "A Pan-African marketplace for products, services, businesses and opportunity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});