import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/NotificationsPage";
import { notificationsOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsRoute,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(notificationsOptions);
  },
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

function NotificationsRoute() {
  return <NotificationsPage />;
}
