import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/components/MessagesPage";
import { conversationsOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/messages/")({
  component: MessagesRoute,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(conversationsOptions);
  },
  head: () => ({
    meta: [
      { title: "Messages | Afromart" },
      { name: "description", content: "Chat with Afromart sellers about products, stock and delivery." },
      { property: "og:title", content: "Messages | Afromart" },
      { property: "og:description", content: "Chat with Afromart sellers about products, stock and delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function MessagesRoute() {
  return <MessagesPage />;
}
