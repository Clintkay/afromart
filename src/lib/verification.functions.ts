import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
export const getVerifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (role) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("store_verifications")
        .select("*,stores(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return { admin: true, rows: data };
    }
    const { data, error } = await context.supabase
      .from("store_verifications")
      .select("*,stores(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { admin: false, rows: data };
  });
export const submitVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { storeId: string; documentType: string; content: string }) =>
    z
      .object({
        storeId: z.string().uuid(),
        documentType: z.enum([
          "Business registration",
          "Government ID",
          "Proof of business address",
        ]),
        content: z.string().max(7000000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: store, error } = await context.supabase
      .from("stores")
      .select("id")
      .eq("id", data.storeId)
      .eq("owner_id", context.userId)
      .single();
    if (error || !store) throw new Error("Store ownership could not be verified.");
    const bytes = Buffer.from(data.content, "base64");
    let mime = "",
      ext = "";
    if (bytes.subarray(0, 5).toString() === "%PDF-") {
      mime = "application/pdf";
      ext = "pdf";
    } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      mime = "image/jpeg";
      ext = "jpg";
    } else if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      mime = "image/png";
      ext = "png";
    }
    if (!mime || bytes.length > 5 * 1024 * 1024)
      throw new Error("Upload a PDF, JPG or PNG under 5 MB.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${context.userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("seller-credentials")
      .upload(path, bytes, { contentType: mime });
    if (uploadError) throw uploadError;
    const { error: insertError } = await context.supabase
      .from("store_verifications")
      .insert({
        store_id: store.id,
        user_id: context.userId,
        document_type: data.documentType,
        document_path: path,
      });
    if (insertError) {
      await supabaseAdmin.storage.from("seller-credentials").remove([path]);
      throw insertError;
    }
    return { ok: true };
  });
export const reviewVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; action: "view" | "approved" | "rejected"; note: string }) =>
    z
      .object({
        id: z.string().uuid(),
        action: z.enum(["view", "approved", "rejected"]),
        note: z.string().max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: role, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !role) throw new Error("Administrator access required.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error: e } = await supabaseAdmin
      .from("store_verifications")
      .select("*")
      .eq("id", data.id)
      .single();
    if (e) throw e;
    if (data.action === "view") {
      const { data: link, error: le } = await supabaseAdmin.storage
        .from("seller-credentials")
        .createSignedUrl(row.document_path, 120);
      if (le) throw le;
      return { url: link.signedUrl };
    }
    if (data.action === "approved") {
      const { error: se } = await supabaseAdmin
        .from("stores")
        .update({ is_verified: true })
        .eq("id", row.store_id);
      if (se) throw se;
    }
    const { error: re } = await supabaseAdmin
      .from("store_verifications")
      .update({ status: data.action, review_note: data.note })
      .eq("id", row.id);
    if (re) throw re;
    return { url: null };
  });
