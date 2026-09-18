import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

export type ServiceRequest = Tables<"service_requests">;

export const getServiceRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("service_requests")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ServiceRequest[];
  });

export const createServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { serviceTitle: string; category?: string | undefined; budget?: number | undefined; country?: string | undefined; details: string }) =>
    z
      .object({
        serviceTitle: z.string().trim().min(3).max(140),
        category: z.string().trim().max(60).optional(),
        budget: z.number().int().nonnegative().optional(),
        country: z.string().trim().max(60).optional(),
        details: z.string().trim().min(5).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request, error } = await context.supabase
      .from("service_requests")
      .insert({
        user_id: context.userId,
        service_title: data.serviceTitle,
        category: data.category ?? null,
        budget: data.budget ?? null,
        country: data.country ?? null,
        details: data.details,
      })
      .select()
      .single();
    if (error) throw error;

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      kind: "service",
      title: "Service request sent",
      body: `We shared "${data.serviceTitle}" with matching Afromart professionals. Replies arrive in Messages.`,
    });

    return request as ServiceRequest;
  });
