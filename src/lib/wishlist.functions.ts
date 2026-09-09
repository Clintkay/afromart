import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ProductWithRelations } from "./products.types";

export const getWishlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", context.userId);
    if (error) throw error;
    return (data ?? []).map((row) => row.product_id);
  });

export const getWishlistProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("wishlists")
      .select("product_id, products(*, categories(*), stores(*), product_images(*), product_variants(*))")
      .eq("user_id", context.userId);
    if (error) throw error;
    return (data ?? []).map((row) => (row.products as unknown as ProductWithRelations)).filter(Boolean);
  });

export const addToWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { productId: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("wishlists").insert({
      user_id: context.userId,
      product_id: data.productId,
    });
    if (error) throw error;
    return { ok: true };
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { productId: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("wishlists")
      .delete()
      .eq("user_id", context.userId)
      .eq("product_id", data.productId);
    if (error) throw error;
    return { ok: true };
  });
