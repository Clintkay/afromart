import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  beforeLoad: () => { throw redirect({ to: "/download", replace: true }); },
  head: () => ({
    meta: [
      { title: "Get the Afromart App" },
      { name: "description", content: "The complete marketplace experience is available in the Afromart mobile app." },
      { property: "og:title", content: "Get the Afromart App" },
      { property: "og:description", content: "The complete marketplace experience is available in the Afromart mobile app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
