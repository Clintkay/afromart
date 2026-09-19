import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeCheck, MessageCircle, RefreshCw } from "lucide-react";
import { conversationsOptions } from "@/lib/queries";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function MessagesPage() {
  const { data: conversations } = useSuspenseQuery(conversationsOptions);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: conversationsOptions.queryKey });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="flex items-start justify-between gap-3">
        <div>
        <p className="text-xs font-bold uppercase text-primary">Messages</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Your seller chats</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ask about stock, delivery times or custom orders before you buy.</p>
        </div>
        <Button variant="outline" size="sm" className="mt-1 shrink-0 gap-2" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Refresh
        </Button>
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
            const iAmSeller = !!user?.id && conversation.seller_id === user.id && conversation.buyer_id !== user.id;
            const title = iAmSeller
              ? conversation.subject || "Buyer enquiry"
              : store?.business_name || store?.name || "Afromart seller";
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
