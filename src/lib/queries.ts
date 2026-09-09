import { queryOptions } from "@tanstack/react-query";
import { getCategories, getProductBySlug, getProducts } from "./products.functions";
import { getStoreBySlug, getStoreProducts } from "./store.functions";
import { getOrders } from "./orders.functions";
import { getWishlistProducts } from "./wishlist.functions";
import { getAddresses } from "./addresses.functions";
import type { Category, ProductWithRelations, Store } from "./products.types";
import type { OrderWithItems } from "./orders.functions";
import type { Tables } from "@/integrations/supabase/types";

export const categoriesOptions = queryOptions<Category[]>({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
});

export const productsOptions = (filters: { categorySlug?: string | undefined; search?: string | undefined }) =>
  queryOptions<ProductWithRelations[]>({
    queryKey: ["products", filters],
    queryFn: () => getProducts({ data: filters }),
  });

export const productOptions = (slug: string) =>
  queryOptions<ProductWithRelations>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const storeOptions = (slug: string) =>
  queryOptions<Store>({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug({ data: { slug } }),
  });

export const storeProductsOptions = (slug: string) =>
  queryOptions<ProductWithRelations[]>({
    queryKey: ["store-products", slug],
    queryFn: () => getStoreProducts({ data: { storeSlug: slug } }),
  });

export const ordersOptions = queryOptions<OrderWithItems[]>({
  queryKey: ["orders"],
  queryFn: () => getOrders(),
});

export const wishlistOptions = queryOptions<ProductWithRelations[]>({
  queryKey: ["wishlist"],
  queryFn: () => getWishlistProducts(),
});

export const addressesOptions = queryOptions<Tables<"addresses">[]>({
  queryKey: ["addresses"],
  queryFn: () => getAddresses(),
});
