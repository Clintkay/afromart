import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/SettingsPage";
import { profileOptions } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(profileOptions);
  },
  head: () => ({
    meta: [
      { title: "Settings | Afromart" },
      { name: "description", content: "Change your Afromart appearance, language, name and verified phone number." },
      { property: "og:title", content: "Settings | Afromart" },
      { property: "og:description", content: "Change your Afromart appearance, language, name and verified phone number." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SettingsRoute() {
  return <SettingsPage />;
}
