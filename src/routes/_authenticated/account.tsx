import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/AccountPage";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountRoute,
  head: () => ({
    meta: [
      { title: "My Account | Afromart" },
      { name: "description", content: "Manage your Afromart account and track orders." },
      { property: "og:title", content: "My Account | Afromart" },
      { property: "og:description", content: "Manage your Afromart account and track orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AccountRoute() {
  return <AccountPage />;
}
