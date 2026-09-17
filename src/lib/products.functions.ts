import { createServerFn } from "@tanstack/react-start";
import { PRODUCT_SELECT, type Category, type ProductWithRelations } from "./products.types";

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabaseClient } = await import("./supabase.server");
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
});

export const getProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { categorySlug?: string | undefined; search?: string | undefined }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();

    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (data.categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", data.categorySlug)
        .maybeSingle();
      if (!category) return [] as ProductWithRelations[];
      query = query.eq("category_id", category.id);
    }

    if (data.search) {
      const term = `%${data.search}%`;
      query = query.or(`name.ilike.${term},description.ilike.${term}`);
    }

    const { data: products, error } = await query;
    if (error) throw error;
    return (products ?? []) as unknown as ProductWithRelations[];
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .eq("status", "active")
      .single();
    if (error) throw error;
    return product as unknown as ProductWithRelations;
  });
