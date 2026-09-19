import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: { categorySlug?: string; search?: string }) => search,
  beforeLoad: () => { throw redirect({ to: "/download", replace: true }); },
  head: () => ({
    meta: [
      { title: "Afromart Mobile Marketplace" },
      { name: "description", content: "Browse products in the Afromart mobile app." },
      { property: "og:title", content: "Afromart Mobile Marketplace" },
      { property: "og:description", content: "Browse products in the Afromart mobile app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
