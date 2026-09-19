import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/guest")({
  beforeLoad: () => { throw redirect({ to: "/download", replace: true }); },
  head: () => ({ meta: [
    { title: "Get the Afromart App" },
    { name: "description", content: "Explore Afromart through the complete mobile marketplace experience." },
    { property: "og:title", content: "Get the Afromart App" },
    { property: "og:description", content: "Explore Afromart through the complete mobile marketplace experience." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});