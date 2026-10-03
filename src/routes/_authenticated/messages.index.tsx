import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/components/MessagesPage";
import { conversationsOptions, notificationsOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/messages/")({
  component: MessagesRoute,
  validateSearch: (search: Record<string, unknown>): { tab?: "chats" | "system" } => ({ tab: search["tab"] === "system" ? "system" : "chats" }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(conversationsOptions),
      context.queryClient.ensureQueryData(notificationsOptions),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Messages | Afromart" },
      { name: "description", content: "Your seller chats, order updates, support replies and account alerts in one Afromart inbox." },
      { property: "og:title", content: "Messages | Afromart" },
      { property: "og:description", content: "Your seller chats, order updates, support replies and account alerts in one Afromart inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function MessagesRoute() {
  return <MessagesPage />;
}
