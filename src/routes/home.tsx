import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
  head: () => ({ meta: [
    { title: "Home | Afromart" },
    { name: "description", content: "Discover the Afromart ecosystem and download the mobile marketplace app." },
    { property: "og:title", content: "Home | Afromart" },
    { property: "og:description", content: "Discover the Afromart ecosystem and download the mobile marketplace app." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});