import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const uploadSchema = z.object({
  content: z.string().max(7_000_000),
  kind: z.enum(["product", "profile"]),
});

export const uploadMarketplaceImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { content: string; kind: "product" | "profile" }) => uploadSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (data.kind === "product") {
      const { data: store, error } = await context.supabase
        .from("stores")
        .select("id")
        .eq("owner_id", context.userId)
        .maybeSingle();
      if (error || !store) throw new Error("Create your store before uploading product photos.");
    }

    const bytes = Buffer.from(data.content, "base64");
    let mime = "";
    let ext = "";
    if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      mime = "image/jpeg";
      ext = "jpg";
    } else if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      mime = "image/png";
      ext = "png";
    } else if (bytes.subarray(0, 4).toString("hex") === "52494646" && bytes.subarray(8, 12).toString() === "WEBP") {
      mime = "image/webp";
      ext = "webp";
    }
    if (!mime || bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
      throw new Error("Upload a JPG, PNG or WebP image under 5 MB.");
    }

    const path = `${context.userId}/${data.kind}-${crypto.randomUUID()}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("marketplace-media")
      .upload(path, bytes, { contentType: mime, cacheControl: "31536000" });
    if (error) throw error;

    return { url: `/api/public/media/${encodeURIComponent(path)}` };
  });