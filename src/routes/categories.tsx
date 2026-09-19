import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  beforeLoad: () => { throw redirect({ to: "/download", replace: true }); },
  head: () => ({ meta: [
    { title: "Categories | Afromart" },
    { name: "description", content: "Explore Afromart categories in the mobile app." },
    { property: "og:title", content: "Categories | Afromart" },
    { property: "og:description", content: "Explore Afromart categories in the mobile app." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});