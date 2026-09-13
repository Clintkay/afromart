import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type AppNotification = Tables<"notifications">;

export const getNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []) as AppNotification[];
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", context.userId)
      .eq("is_read", false);
    if (error) throw error;
    return { ok: true };
  });

export const addNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title: string; body: string; kind?: string }) =>
    z
      .object({ title: z.string().min(1).max(120), body: z.string().min(1).max(600), kind: z.string().max(40).optional() })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("notifications").insert({
      user_id: context.userId,
      title: data.title,
      body: data.body,
      kind: data.kind ?? "system",
    });
    if (error) throw error;
    return { ok: true };
  });

export const ensureWelcomeNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error } = await context.supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId);
    if (error) throw error;
    if ((count ?? 0) > 0) return { created: false };

    const { error: insertError } = await context.supabase.from("notifications").insert([
      {
        user_id: context.userId,
        title: "Welcome to Afromart",
        body: "Thanks for joining Afromart. Browse trusted African sellers, hire professionals and track every order right here.",
        kind: "welcome",
      },
      {
        user_id: context.userId,
        title: "Finish setting up your account",
        body: "Add your delivery details and choose your language and appearance in Settings.",
        kind: "system",
      },
    ]);
    if (insertError) throw insertError;
    return { created: true };
  });
