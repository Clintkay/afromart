import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

export type SellerStore = Tables<"stores">;
export type SellerProduct = Tables<"products">;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

export const getMyStore = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("stores")
      .select("*")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as SellerStore | null;
  });

export const saveMyStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      name: string;
      businessName?: string | undefined;
      description?: string | undefined;
      city?: string | undefined;
      country?: string | undefined;
      responseTime?: string | undefined;
      logoUrl?: string | undefined;
      bannerUrl?: string | undefined;
    }) =>
      z
        .object({
          name: z.string().trim().min(2).max(80),
          businessName: z.string().trim().max(120).optional(),
          description: z.string().trim().max(1000).optional(),
          city: z.string().trim().max(80).optional(),
          country: z.string().trim().max(80).optional(),
          responseTime: z.string().trim().max(60).optional(),
          logoUrl: z.string().trim().url().max(500).optional(),
          bannerUrl: z.string().trim().url().max(500).optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const fields = {
      name: data.name,
      business_name: data.businessName ?? null,
      description: data.description ?? null,
      city: data.city ?? null,
      country: data.country ?? "Nigeria",
      response_time: data.responseTime ?? null,
      logo_url: data.logoUrl ?? null,
      banner_url: data.bannerUrl ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing, error: existingError } = await context.supabase
      .from("stores")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { data: updated, error } = await context.supabase
        .from("stores")
        .update(fields)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return updated as SellerStore;
    }

    const { data: created, error } = await context.supabase
      .from("stores")
      .insert({ ...fields, owner_id: context.userId, slug: `${slugify(data.name)}-${Date.now().toString(36)}` })
      .select()
      .single();
    if (error) throw error;

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      kind: "system",
      title: "Store created",
      body: `${data.name} is live on Afromart. Add products and your first order can arrive today.`,
    });

    return created as SellerStore;
  });

export const getMyProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: store, error: storeError } = await context.supabase
      .from("stores")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (storeError) throw storeError;
    if (!store) return [] as SellerProduct[];

    const { data, error } = await context.supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as SellerProduct[];
  });

export const saveMyProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      productId?: string | undefined;
      name: string;
      description?: string | undefined;
      price: number;
      inventoryCount: number;
      categoryId?: string | undefined;
      status?: string | undefined;
      imageUrl?: string | undefined;
    }) =>
      z
        .object({
          productId: z.string().uuid().optional(),
          name: z.string().trim().min(2).max(140),
          description: z.string().trim().max(2000).optional(),
          price: z.number().int().positive(),
          inventoryCount: z.number().int().nonnegative(),
          categoryId: z.string().uuid().optional(),
          status: z.enum(["active", "draft"]).optional(),
          imageUrl: z.string().trim().url().max(500).optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: store, error: storeError } = await context.supabase
      .from("stores")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (storeError) throw storeError;
    if (!store) throw new Error("Create your store first.");

    const fields = {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      inventory_count: data.inventoryCount,
      category_id: data.categoryId ?? null,
      status: data.status ?? "active",
      updated_at: new Date().toISOString(),
    };

    if (data.productId) {
      const { data: updated, error } = await context.supabase
        .from("products")
        .update(fields)
        .eq("id", data.productId)
        .eq("store_id", store.id)
        .select()
        .single();
      if (error) throw error;
      return updated as SellerProduct;
    }

    const { data: created, error } = await context.supabase
      .from("products")
      .insert({ ...fields, store_id: store.id, slug: `${slugify(data.name)}-${Date.now().toString(36)}` })
      .select()
      .single();
    if (error) throw error;

    if (data.imageUrl) {
      await context.supabase.from("product_images").insert({ product_id: created.id, url: data.imageUrl, position: 0 });
    }

    return created as SellerProduct;
  });

export const getSellerEarnings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: store, error: storeError } = await context.supabase
      .from("stores")
      .select("id, total_sales")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (storeError) throw storeError;
    if (!store) return { gross: 0, orders: 0, units: 0, available: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: items, error } = await supabaseAdmin
      .from("order_items")
      .select("order_id, total, quantity")
      .eq("store_id", store.id);
    if (error) throw error;

    const rows = items ?? [];
    const gross = rows.reduce((sum, row) => sum + (row.total ?? 0), 0);
    return {
      gross,
      orders: new Set(rows.map((row) => row.order_id)).size,
      units: rows.reduce((sum, row) => sum + (row.quantity ?? 0), 0),
      available: Math.round(gross * 0.9),
    };
  });
