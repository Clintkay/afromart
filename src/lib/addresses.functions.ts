import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

export type AddressInput = {
  label?: string | null;
  full_name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  country?: string;
  phone?: string | null;
  is_default?: boolean;
};

export const getAddresses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("addresses")
      .select("*")
      .eq("user_id", context.userId)
      .order("is_default", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Tables<"addresses">[];
  });

export const createAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: AddressInput) => input)
  .handler(async ({ data, context }) => {
    if (data.is_default) {
      await context.supabase.from("addresses").update({ is_default: false }).eq("user_id", context.userId);
    }
    const { data: address, error } = await context.supabase
      .from("addresses")
      .insert({ user_id: context.userId, ...data })
      .select()
      .single();
    if (error) throw error;
    return address as Tables<"addresses">;
  });

export const updateAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string } & Partial<AddressInput>) => input)
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    if (rest.is_default) {
      await context.supabase.from("addresses").update({ is_default: false }).eq("user_id", context.userId);
    }
    const { data: address, error } = await context.supabase
      .from("addresses")
      .update(rest)
      .eq("id", id)
      .eq("user_id", context.userId)
      .select()
      .single();
    if (error) throw error;
    return address as Tables<"addresses">;
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("addresses")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
