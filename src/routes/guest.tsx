import { createFileRoute } from "@tanstack/react-router";
import { GuestExperience } from "@/components/GuestExperience";

export const Route = createFileRoute("/guest")({
  component: GuestExperience,
  head: () => ({ meta: [
    { title: "Browse as a Guest | Afromart" },
    { name: "description", content: "Explore the Afromart marketplace as a guest before creating an account." },
    { property: "og:title", content: "Browse as a Guest | Afromart" },
    { property: "og:description", content: "Explore the Afromart marketplace as a guest before creating an account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
