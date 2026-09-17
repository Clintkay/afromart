import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { conversationsOptions } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export function MessagesPage() {
  const { data: conversations } = useSuspenseQuery(conversationsOptions);

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
      <header>
        <p className="text-xs font-bold uppercase text-primary">Messages</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Your seller chats</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ask about stock, delivery times or custom orders before you buy.</p>
      </header>

      {conversations.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg font-semibold">No conversations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Open any product and tap “Chat with seller” to start one.</p>
          <Button asChild className="mt-5"><Link to="/products">Browse products</Link></Button>
        </div>
      ) : (
        <ul className="mt-7 space-y-3">
          {conversations.map((conversation) => {
            const messages = [...(conversation.product_messages ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at));
            const last = messages[messages.length - 1];
            const store = conversation.stores;
            return (
              <li key={conversation.id}>
                <Link
                  to="/messages/$conversationId"
                  params={{ conversationId: conversation.id }}
                  className="block rounded-xl border bg-card p-4 transition hover:border-primary/35 hover:bg-secondary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex min-w-0 items-center gap-1.5 font-heading font-bold">
                      <span className="truncate">{store?.business_name || store?.name || "Afromart seller"}</span>
                      {store?.is_verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-primary" /> : null}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(conversation.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                  {conversation.products ? (
                    <p className="mt-1 truncate text-xs font-semibold text-primary">{conversation.products.name}</p>
                  ) : null}
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{last?.body ?? "No messages yet."}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
