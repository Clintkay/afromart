import { createFileRoute } from "@tanstack/react-router";
import { SellerDashboard } from "@/components/SellerDashboard";

export const Route = createFileRoute("/_authenticated/seller")({
  component: SellerRoute,
  head: () => ({
    meta: [
      { title: "Seller Dashboard | Afromart" },
      { name: "description", content: "Manage your Afromart store details, products, inventory, orders and payouts." },
      { property: "og:title", content: "Seller Dashboard | Afromart" },
      { property: "og:description", content: "Manage your Afromart store details, products, inventory, orders and payouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SellerRoute() {
  return <SellerDashboard />;
}
