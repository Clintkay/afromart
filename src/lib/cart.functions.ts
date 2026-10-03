import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const cartItem = z.object({
  productId: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  quantity: z.number().int().min(1).max(9999),
});

export const getAccountCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("account_carts")
      .select("items").eq("user_id", context.userId).maybeSingle();
    if (error) throw error;
    return z.array(cartItem).parse(data?.items ?? []);
  });

export const saveAccountCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ expectedUserId: z.string().uuid(), items: z.array(cartItem).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    // Reject delayed writes from a previous login; ownership never comes from input.
    if (data.expectedUserId !== context.userId) throw new Error("Account changed. Cart was not saved.");
    const { error } = await context.supabase.from("account_carts").upsert({
      user_id: context.userId,
      items: data.items,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) throw error;
    return { saved: true };
  });