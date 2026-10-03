import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notifications")({
  beforeLoad: () => { throw redirect({ to: "/messages", search: { tab: "system" }, replace: true }); },
  head: () => ({
    meta: [
      { title: "Notifications | Afromart" },
      { name: "description", content: "Order updates, support replies and account alerts from Afromart." },
      { property: "og:title", content: "Notifications | Afromart" },
      { property: "og:description", content: "Order updates, support replies and account alerts from Afromart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

