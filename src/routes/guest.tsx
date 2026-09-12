import { createFileRoute } from "@tanstack/react-router";
import { GuestExperience } from "@/components/GuestExperience";

export const Route = createFileRoute("/guest")({
  component: GuestExperience,
  head: () => ({ meta: [
    { title: "Browse as a Guest | Afro Mart" },
    { name: "description", content: "Experience Afro Mart without signing up. Explore stores, services and listings in guest mode." },
    { property: "og:title", content: "Browse as a Guest | Afro Mart" },
    { property: "og:description", content: "Experience Afro Mart without signing up. Explore stores, services and listings in guest mode." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});