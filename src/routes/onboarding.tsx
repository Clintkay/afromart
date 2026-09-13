import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/components/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingRoute,
  head: () => ({
    meta: [
      { title: "Get Started | Afromart" },
      { name: "description", content: "See how Afromart helps you shop African products, hire professionals and track orders." },
      { property: "og:title", content: "Get Started | Afromart" },
      { property: "og:description", content: "See how Afromart helps you shop African products, hire professionals and track orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function OnboardingRoute() {
  return <OnboardingPage />;
}
