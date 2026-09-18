import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Tables } from "@/integrations/supabase/types";

export type ReviewWithAuthor = Tables<"reviews"> & {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
};

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getProductReviews = createServerFn({ method: "GET" })
  .inputValidator((input: { productId: string }) => z.object({ productId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: reviews, error } = await publicClient()
      .from("reviews")
      .select("*, profiles(full_name, avatar_url)")
      .eq("product_id", data.productId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (reviews ?? []) as unknown as ReviewWithAuthor[];
  });

export const upsertReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { productId: string; rating: number; title?: string; body?: string; orderId?: string }) =>
    z
      .object({
        productId: z.string().uuid(),
        rating: z.number().int().min(1).max(5),
        title: z.string().trim().max(120).optional(),
        body: z.string().trim().max(2000).optional(),
        orderId: z.string().uuid().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: review, error } = await context.supabase
      .from("reviews")
      .upsert(
        {
          product_id: data.productId,
          user_id: context.userId,
          rating: data.rating,
          title: data.title ?? null,
          body: data.body ?? null,
          order_id: data.orderId ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_id,user_id" },
      )
      .select()
      .single();
    if (error) throw error;
    return review as Tables<"reviews">;
  });

export const deleteMyReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { reviewId: string }) => z.object({ reviewId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("reviews")
      .delete()
      .eq("id", data.reviewId)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
