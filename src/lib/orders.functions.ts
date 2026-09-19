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

    // Always resolve the selling store from the product itself, so seller
    // dashboards and payouts work even if the client did not send a store id.
    const productIds = [...new Set(data.items.map((item) => item.productId).filter(Boolean))];
    const storeByProduct = new Map<string, string | null>();
    if (productIds.length > 0) {
      const { data: rows, error: productsError } = await context.supabase
        .from("products")
        .select("id, store_id")
        .in("id", productIds);
      if (productsError) throw productsError;
      for (const row of rows ?? []) storeByProduct.set(row.id, row.store_id ?? null);
    }

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      store_id: storeByProduct.get(item.productId) ?? item.storeId ?? null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await context.supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    // Notify each seller that a new order arrived.
    const storeIds = [...new Set(orderItems.map((item) => item.store_id).filter(Boolean))] as string[];
    if (storeIds.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: stores } = await supabaseAdmin.from("stores").select("id, name, owner_id").in("id", storeIds);
      const notifications = (stores ?? [])
        .filter((store) => store.owner_id)
        .map((store) => ({
          user_id: store.owner_id as string,
          kind: "order",
          title: "New order received",
          body: `${store.name} has a new Afromart order. Open your seller dashboard to confirm payment and delivery.`,
        }));
      if (notifications.length > 0) await supabaseAdmin.from("notifications").insert(notifications);
    }

    return order as Tables<"orders">;
  });
