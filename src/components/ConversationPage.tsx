import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, ChevronLeft, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { conversationOptions, conversationsOptions } from "@/lib/queries";
import { sendChatMessage } from "@/lib/chat.functions";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ConversationPage() {
  const { conversationId } = useParams({ from: "/_authenticated/messages/$conversationId" });
  const { data: conversation } = useSuspenseQuery({ ...conversationOptions(conversationId), refetchInterval: 5000 });
  const { user } = useAuth();
  const send = useServerFn(sendChatMessage);
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation?.product_messages?.length]);

  if (!conversation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted-foreground">This conversation is no longer available.</p>
        <Button asChild className="mt-5"><Link to="/messages">Back to messages</Link></Button>
      </div>
    );
  }

  const store = conversation.stores;
  const iAmSeller = !!user?.id && conversation.seller_id === user.id && conversation.buyer_id !== user.id;
  const heading = iAmSeller
    ? conversation.subject || "Buyer enquiry"
    : store?.business_name || store?.name || "Afromart seller";
  const location = [store?.city, store?.country].filter(Boolean).join(", ");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = body.trim();
    if (!message) return;
    setSending(true);
    try {
      await send({ data: { conversationId, message } });
      setBody("");
      await queryClient.invalidateQueries({ queryKey: conversationOptions(conversationId).queryKey });
      await queryClient.invalidateQueries({ queryKey: conversationsOptions.queryKey });
    } catch {
      toast.error("Message not sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 py-5 sm:px-6">
      <header className="flex items-center gap-2 border-b pb-4">
        <Button asChild variant="ghost" size="icon" aria-label="Back to messages">
          <Link to="/messages"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="min-w-0">
          <p className="flex min-w-0 items-center gap-1.5 font-heading text-lg font-bold">
            <span className="truncate">{heading}</span>
            {!iAmSeller && store?.is_verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-primary" /> : null}
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            {iAmSeller ? <span>Buyer message for {store?.name ?? "your store"}</span> : null}
            {!iAmSeller && location ? <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span> : null}
            {!iAmSeller && store?.response_time ? <span>Replies {store.response_time}</span> : null}
          </p>
        </div>
      </header>

      {conversation.products ? (
        <Link
          to="/products/$slug"
          params={{ slug: conversation.products.slug }}
          className="mt-4 rounded-lg border bg-secondary/40 px-4 py-3 text-sm font-semibold hover:border-primary/35"
        >
          About: {conversation.products.name}
        </Link>
      ) : null}

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
        {(conversation.product_messages ?? []).length === 0 ? (
          <p className="rounded-lg border bg-secondary/40 p-4 text-sm text-muted-foreground">
            No messages yet. Say hello and ask your question below.
          </p>
        ) : null}
        {(conversation.product_messages ?? []).map((message) => {
          const mine = message.sender_id === user?.id;
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="sticky bottom-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 border-t bg-background pt-3 md:bottom-0">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={2}
          placeholder="Write a message…"
          aria-label="Message"
          className="resize-none"
        />
        <Button type="submit" size="icon" className="h-11 w-11" disabled={sending || !body.trim()} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
