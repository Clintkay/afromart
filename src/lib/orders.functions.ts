import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";
import { countryOptions, deliveryQuote } from "@/lib/delivery";

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
      paymentMethod?: "card" | "bank_transfer";
    }) => z.object({
      shippingAddress: z.object({ full_name: z.string().trim().min(2), address_line1: z.string().trim().min(3), address_line2: z.string().nullable().optional(), city: z.string().trim().min(2), state: z.string().nullable().optional(), country: z.string().min(2), phone: z.string().nullable().optional() }),
      items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(999) })).min(1).max(100),
      paymentMethod: z.enum(["card", "bank_transfer"]).default("card"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const quantities = new Map<string, number>();
    for (const item of data.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    const { data: products, error: productsError } = await context.supabase.from("products")
      .select("id, name, price, store_id, inventory_count, status").in("id", [...quantities.keys()]);
    if (productsError) throw productsError;
    if (!products || products.length !== quantities.size) throw new Error("Some products are no longer available.");
    const lines = products.map(product => {
      const quantity = quantities.get(product.id) ?? 0;
      if (product.status !== "active" || quantity > (product.inventory_count ?? 0)) throw new Error(`${product.name} is unavailable in that quantity.`);
      return { product_id: product.id, store_id: product.store_id, name: product.name, price: product.price, quantity, total: product.price * quantity };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const country = countryOptions.find(c => c.name === data.shippingAddress.country);
    if (!country) throw new Error("Choose a valid delivery country.");
    const shipping = deliveryQuote(country.code, subtotal).cost;
    const { data: order, error } = await context.supabase.from("orders").insert({
      user_id: context.userId, subtotal, shipping_cost: shipping, total: subtotal + shipping,
      shipping_address: data.shippingAddress, status: "pending", payment_status: "pending",
    }).select().single();
    if (error) throw error;
    const orderItems = lines.map(line => ({ ...line, order_id: order.id }));
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
