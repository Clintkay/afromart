import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type Profile = Tables<"profiles">;

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as Profile | null;
  });

export const updateProfileSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { fullName?: string; phone?: string; preferredLanguage?: string; theme?: string }) =>
    z
      .object({
        fullName: z.string().trim().min(1).max(100).optional(),
        phone: z.string().trim().min(6).max(24).optional(),
        preferredLanguage: z.string().trim().min(2).max(10).optional(),
        theme: z.enum(["light", "dark"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const update: Partial<Profile> = { updated_at: new Date().toISOString() };
    if (data.fullName) update.full_name = data.fullName;
    if (data.phone) update.phone = data.phone;
    if (data.preferredLanguage) update.preferred_language = data.preferredLanguage;
    if (data.theme) update.preferences = { theme: data.theme };

    const { error } = await context.supabase.from("profiles").update(update).eq("id", context.userId);
    if (error) throw error;

    if (data.phone) {
      await context.supabase.from("notifications").insert({
        user_id: context.userId,
        title: "Phone number updated",
        body: `Your Afromart phone number is now ${data.phone}.`,
        kind: "security",
      });
    }

    return { ok: true };
  });
