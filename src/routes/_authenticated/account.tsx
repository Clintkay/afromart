import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/AccountPage";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountRoute,
  head: () => ({
    meta: [
      { title: "My Account | Afro Mart" },
      { name: "description", content: "Manage your Afro Mart account." },
      { property: "og:title", content: "My Account | Afro Mart" },
      { property: "og:description", content: "Manage your Afro Mart account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AccountRoute() {
  return <AccountPage />;
}
