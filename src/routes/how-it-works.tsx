import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "@/components/PublicPages";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
  head: () => ({ meta: [
    { title: "How Afromart Works" },
    { name: "description", content: "Discover how people and businesses connect through the Afromart mobile marketplace." },
    { property: "og:title", content: "How Afromart Works" },
    { property: "og:description", content: "Discover, connect, continue in the app and grow with Afromart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});