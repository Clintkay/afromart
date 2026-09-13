import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { z } from "zod";

export type SupportTicket = Tables<"support_tickets">;
export type SupportMessage = Tables<"support_messages">;
export type SupportTicketWithMessages = SupportTicket & { support_messages: SupportMessage[] };

export const getSupportTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("support_tickets")
      .select("*, support_messages(*)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as SupportTicketWithMessages[];
  });

export const createSupportTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { subject: string; topic: string; message: string }) =>
    z
      .object({
        subject: z.string().trim().min(3).max(120),
        topic: z.string().trim().min(2).max(60),
        message: z.string().trim().min(5).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: ticket, error } = await context.supabase
      .from("support_tickets")
      .insert({ user_id: context.userId, subject: data.subject, topic: data.topic })
      .select()
      .single();
    if (error) throw error;

    const { error: messageError } = await context.supabase
      .from("support_messages")
      .insert({ ticket_id: ticket.id, sender: "user", body: data.message });
    if (messageError) throw messageError;

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      title: "Support request received",
      body: `We received "${data.subject}". Our team replies within one working day.`,
      kind: "support",
    });

    return ticket as SupportTicket;
  });

export const replyToSupportTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ticketId: string; message: string }) =>
    z.object({ ticketId: z.string().uuid(), message: z.string().trim().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: ticket, error: ticketError } = await context.supabase
      .from("support_tickets")
      .select("id")
      .eq("id", data.ticketId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (ticketError) throw ticketError;
    if (!ticket) throw new Error("Support request not found");

    const { error } = await context.supabase
      .from("support_messages")
      .insert({ ticket_id: data.ticketId, sender: "user", body: data.message });
    if (error) throw error;

    await context.supabase
      .from("support_tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", data.ticketId);

    return { ok: true };
  });
