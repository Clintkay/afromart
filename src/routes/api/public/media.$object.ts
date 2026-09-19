import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media/$object")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const object = decodeURIComponent(params.object);
        if (!/^[0-9a-f-]{36}\/(product|profile)-[0-9a-f-]{36}\.(jpg|png|webp)$/.test(object)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("marketplace-media").download(object);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});