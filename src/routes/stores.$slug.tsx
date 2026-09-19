import { createFileRoute } from "@tanstack/react-router";
import { PublicStorefront } from "@/components/PublicStorefront";
import { storeOptions, storeProductsOptions } from "@/lib/queries";

export const Route = createFileRoute("/stores/$slug")({
  component: PublicStorefront,
  loader: async ({ context, params }) => Promise.all([
    context.queryClient.ensureQueryData(storeOptions(params.slug)),
    context.queryClient.ensureQueryData(storeProductsOptions(params.slug)),
  ]),
  head: ({ loaderData }) => {
    const store = loaderData?.[0];
    const name = store?.business_name || store?.name || "Afromart Business";
    const description = store?.description || `View ${name}'s public business profile on Afromart.`;
    return { meta: [
      { title: `${name} | Afromart Business` },
      { name: "description", content: description },
      { property: "og:title", content: `${name} | Afromart Business` },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
});