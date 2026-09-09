import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/auth")({
  component: AuthRoute,
  validateSearch: (search: { redirect?: string }) => search,
  head: () => ({
    meta: [
      { title: "Sign In | Afro Mart" },
      { name: "description", content: "Sign in or create an account at Afro Mart." },
      { property: "og:title", content: "Sign In | Afro Mart" },
      { property: "og:description", content: "Sign in or create an account at Afro Mart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthRoute() {
  return <AuthPage />;
}
