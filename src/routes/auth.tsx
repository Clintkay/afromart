import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/auth")({
  component: AuthRoute,
  validateSearch: (search: { redirect?: string; mode?: "signin" | "signup" }) => search,
  head: () => ({
    meta: [
      { title: "Sign In | Afromart" },
      { name: "description", content: "Sign in or create a secure Afromart account." },
      { property: "og:title", content: "Sign In | Afromart" },
      { property: "og:description", content: "Sign in or create a secure Afromart account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthRoute() {
  return <AuthPage />;
}
