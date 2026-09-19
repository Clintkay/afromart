import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ServiceListing = Tables<"service_listings"> & {
  stores: {
    id: string;
    name: string;
    slug: string;
    business_name: string | null;
    city: string | null;
    country: string | null;
    response_time: string | null;
    is_verified: boolean | null;
    rating: number | null;
  } | null;
};

const SELECT =
  "*, stores(id, name, slug, business_name, city, country, response_time, is_verified, rating)";

export async function fetchServiceListings() {
  const { data, error } = await supabase
    .from("service_listings")
    .select(SELECT)
    .eq("is_active", true)
    .order("orders_count", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ServiceListing[];
}

export const serviceListingsOptions = queryOptions<ServiceListing[]>({
  queryKey: ["service-listings"],
  queryFn: fetchServiceListings,
});
