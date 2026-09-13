import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type OrderWithItems = Tables<"orders"> & {
  order_items: Tables<"order_items">[];
};

export const getOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as OrderWithItems[];
  });

export const getOrderById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return order as OrderWithItems | null;
  });

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      subtotal: number;
      shippingCost: number;
      total: number;
      shippingAddress: Tables<"orders">["shipping_address"];
      items: { productId: string; name: string; price: number; quantity: number; storeId?: string | null }[];
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .insert({
        user_id: context.userId,
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        total: data.total,
        shipping_address: data.shippingAddress,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();
    if (error) throw error;

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      store_id: item.storeId ?? null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await context.supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    return order as Tables<"orders">;
  });
