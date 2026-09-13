import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/components/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [
    { title: "Reset Password | Afromart" },
    { name: "description", content: "Choose a new password for your Afromart account." },
    { property: "og:title", content: "Reset Password | Afromart" },
    { property: "og:description", content: "Choose a new password for your Afromart account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});