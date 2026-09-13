import { queryOptions } from "@tanstack/react-query";
import { getCategories, getProductBySlug, getProducts } from "./products.functions";
import { getStoreBySlug, getStoreProducts } from "./store.functions";
import { getOrderById, getOrders } from "./orders.functions";
import { getWishlistProducts } from "./wishlist.functions";
import { getAddresses } from "./addresses.functions";
import { getNotifications, type AppNotification } from "./notifications.functions";
import { getSupportTickets, type SupportTicketWithMessages } from "./support.functions";
import { getProfile, type Profile } from "./profile.functions";
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

export const orderOptions = (orderId: string) => queryOptions<OrderWithItems | null>({
  queryKey: ["orders", orderId],
  queryFn: () => getOrderById({ data: { orderId } }),
});

export const wishlistOptions = queryOptions<ProductWithRelations[]>({
  queryKey: ["wishlist"],
  queryFn: () => getWishlistProducts(),
});

export const addressesOptions = queryOptions<Tables<"addresses">[]>({
  queryKey: ["addresses"],
  queryFn: () => getAddresses(),
});

export const notificationsOptions = queryOptions<AppNotification[]>({
  queryKey: ["notifications"],
  queryFn: () => getNotifications(),
});

export const supportTicketsOptions = queryOptions<SupportTicketWithMessages[]>({
  queryKey: ["support-tickets"],
  queryFn: () => getSupportTickets(),
});

export const profileOptions = queryOptions<Profile | null>({
  queryKey: ["profile"],
  queryFn: () => getProfile(),
});
