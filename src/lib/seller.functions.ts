import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

export type SellerOrderItem = Tables<"order_items"> & {
  products: { name: string; slug: string } | null;
};

export type SellerOrder = Tables<"orders"> & {
  order_items: SellerOrderItem[];
};

const SELLER_ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

async function getOwnedStore(supabase: { from: (table: string) => any }, userId: string) {
  const { data: store, error } = await supabase
    .from("stores")
    .select("id, name, slug")
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!store) throw new Error("You do not have a seller store.");
  return store as { id: string; name: string; slug: string };
}

export const getSellerOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const store = await getOwnedStore(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("order_id")
      .eq("store_id", store.id);
    if (itemsError) throw itemsError;

    const orderIds = [...new Set((items ?? []).map((item) => item.order_id))];
    if (orderIds.length === 0) return { store, orders: [] as SellerOrder[] };

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*, products(name, slug))")
      .in("id", orderIds)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const sellerOrders = ((orders ?? []) as SellerOrder[]).map((order) => ({
      ...order,
      order_items: order.order_items.filter((item) => item.store_id === store.id),
    }));
    return { store, orders: sellerOrders };
  });

export const updateSellerOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string; status: string }) =>
    z
      .object({ orderId: z.string().uuid(), status: z.enum(SELLER_ORDER_STATUSES) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const store = await getOwnedStore(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: match, error: matchError } = await supabaseAdmin
      .from("order_items")
      .select("id")
      .eq("order_id", data.orderId)
      .eq("store_id", store.id)
      .limit(1);
    if (matchError) throw matchError;
    if (!match || match.length === 0) throw new Error("This order does not belong to your store.");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.orderId)
      .select()
      .single();
    if (error) throw error;

    await supabaseAdmin.from("notifications").insert({
      user_id: order.user_id,
      kind: "order",
      title: `Order ${data.status}`,
      body: `Your order from ${store.name} is now ${data.status}. Open your orders to follow it.`,
    });

    return order as Tables<"orders">;
  });
