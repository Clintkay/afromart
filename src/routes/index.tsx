import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "@/components/WelcomePage";

export const Route = createFileRoute("/")({
  component: WelcomePage,
  head: () => ({ meta: [
    { title: "Welcome to Afromart" },
    { name: "description", content: "Join Afromart, the marketplace connecting African products, services, sellers, and communities." },
    { property: "og:title", content: "Welcome to Afromart" },
    { property: "og:description", content: "Join Afromart, the marketplace connecting African products, services, sellers, and communities." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
