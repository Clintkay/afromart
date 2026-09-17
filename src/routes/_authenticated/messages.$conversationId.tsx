import { createFileRoute } from "@tanstack/react-router";
import { ConversationPage } from "@/components/ConversationPage";
import { conversationOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/messages/$conversationId")({
  component: ConversationRoute,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(conversationOptions(params.conversationId));
  },
  head: () => ({
    meta: [
      { title: "Seller chat | Afromart" },
      { name: "description", content: "Your conversation with an Afromart seller." },
      { property: "og:title", content: "Seller chat | Afromart" },
      { property: "og:description", content: "Your conversation with an Afromart seller." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ConversationRoute() {
  return <ConversationPage />;
}
