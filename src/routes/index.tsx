import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "@/components/WelcomePage";

export const Route = createFileRoute("/")({
  component: WelcomePage,
  head: () => ({ meta: [
    { title: "Welcome to Afro Mart" },
    { name: "description", content: "Join Afro Mart, the marketplace connecting African products, services, sellers, and communities." },
    { property: "og:title", content: "Welcome to Afro Mart" },
    { property: "og:description", content: "Join Afro Mart, the marketplace connecting African products, services, sellers, and communities." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
