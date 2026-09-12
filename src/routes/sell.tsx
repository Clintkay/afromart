import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/sell")({ component: SellLayout });

function SellLayout() {
  return <Outlet />;
}
