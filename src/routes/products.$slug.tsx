import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$slug")({
  beforeLoad: () => { throw redirect({ to: "/download", replace: true }); },
  head: () => ({
    meta: [
      { title: "View on the Afromart App" },
      { name: "description", content: "Product discovery and purchasing are available in the Afromart mobile app." },
      { property: "og:title", content: "View on the Afromart App" },
      { property: "og:description", content: "Product discovery and purchasing are available in the Afromart mobile app." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
