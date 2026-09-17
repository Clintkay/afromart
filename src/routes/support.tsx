import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/components/SupportPage";

export const Route = createFileRoute("/support")({
  component: SupportRoute,
  head: () => ({
    meta: [
      { title: "Afromart Support | Help & Requests" },
      {
        name: "description",
        content: "Get help with orders, deliveries, payments, sellers and your Afromart account, and follow every reply in the app.",
      },
      { property: "og:title", content: "Afromart Support | Help & Requests" },
      {
        property: "og:description",
        content: "Get help with orders, deliveries, payments, sellers and your Afromart account, and follow every reply in the app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SupportRoute() {
  return <SupportPage />;
}
