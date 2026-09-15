import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ChatConversation = {
  id: string;
  buyer_id: string;
  seller_id: string | null;
  store_id: string;
  product_id: string | null;
  subject: string | null;
  last_message_at: string;
  created_at: string;
  stores: { name: string; slug: string; business_name: string | null; city: string | null; country: string | null; logo_url: string | null; is_verified: boolean | null } | null;
  products: { name: string; slug: string; price: number } | null;
  product_messages: ChatMessage[];
};

const CONVERSATION_SELECT =
  "*, stores(name, slug, business_name, city, country, logo_url, is_verified), products(name, slug, price), product_messages(*)";

export const getConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("product_conversations")
      .select(CONVERSATION_SELECT)
      .order("last_message_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ChatConversation[];
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { conversationId: string }) => z.object({ conversationId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: conversation, error } = await context.supabase
      .from("product_conversations")
      .select(CONVERSATION_SELECT)
      .eq("id", data.conversationId)
      .maybeSingle();
    if (error) throw error;
    if (!conversation) return null;
    const typed = conversation as unknown as ChatConversation;
    typed.product_messages = [...(typed.product_messages ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at));
    return typed;
  });

/** Opens (or reuses) the buyer's conversation with a store and posts the first message. */
export const startConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { storeId: string; productId?: string | undefined; subject?: string | undefined; message: string }) =>
    z
      .object({
        storeId: z.string().uuid(),
        productId: z.string().uuid().optional(),
        subject: z.string().trim().max(160).optional(),
        message: z.string().trim().min(1).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let conversationId: string | null = null;

    let existingQuery = context.supabase
      .from("product_conversations")
      .select("id")
      .eq("buyer_id", context.userId)
      .eq("store_id", data.storeId);
    existingQuery = data.productId
      ? existingQuery.eq("product_id", data.productId)
      : existingQuery.is("product_id", null);

    const { data: existing, error: existingError } = await existingQuery.maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      conversationId = existing.id;
    } else {
      const { data: created, error: createError } = await context.supabase
        .from("product_conversations")
        .insert({
          buyer_id: context.userId,
          store_id: data.storeId,
          product_id: data.productId ?? null,
          subject: data.subject ?? null,
        })
        .select("id")
        .single();
      if (createError) throw createError;
      conversationId = created.id;
    }

    const { error: messageError } = await context.supabase
      .from("product_messages")
      .insert({ conversation_id: conversationId, sender_id: context.userId, body: data.message });
    if (messageError) throw messageError;

    await context.supabase
      .from("product_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    return { conversationId };
  });

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { conversationId: string; message: string }) =>
    z.object({ conversationId: z.string().uuid(), message: z.string().trim().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("product_messages")
      .insert({ conversation_id: data.conversationId, sender_id: context.userId, body: data.message });
    if (error) throw error;

    await context.supabase
      .from("product_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", data.conversationId);

    return { ok: true };
  });
