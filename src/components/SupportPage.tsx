import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, LifeBuoy, Loader2, MessagesSquare, Package, Send, ShieldAlert, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supportTicketsOptions } from "@/lib/queries";
import { createSupportTicket, replyToSupportTicket } from "@/lib/support.functions";
import { useAuth } from "@/lib/auth-context";
import supportHero from "@/assets/support-hero.jpg";

const topics = [
  { icon: Package, value: "orders", title: "Orders & delivery", body: "Track a parcel, change an address or report a late order." },
  { icon: CreditCard, value: "payments", title: "Payments & refunds", body: "Card, bank transfer and mobile money questions, plus refunds." },
  { icon: Store, value: "selling", title: "Selling on Afromart", body: "Store set-up, verification, listings, payouts and promotions." },
  { icon: ShieldAlert, value: "safety", title: "Safety & disputes", body: "Report a listing, raise a dispute or flag a suspicious message." },
];

const faqs = [
  { q: "How do I track my order?", a: "Open Orders in your account and choose the order. You will see each step from confirmation to delivery." },
  { q: "How do I reach a seller?", a: "Open the product and tap “Chat with seller”. Your conversations live under Messages." },
  { q: "Which payment methods are supported?", a: "Cards, bank transfer and mobile money as they go live in each country." },
  { q: "How do I become a seller?", a: "Open Start selling and follow registration, business details, verification and approval." },
  { q: "Can I change the app language or appearance?", a: "Yes. Settings lets you switch language and choose light or dark." },
];

export function SupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const create = useServerFn(createSupportTicket);
  const reply = useServerFn(replyToSupportTicket);

  const { data: tickets } = useQuery({ ...supportTicketsOptions, enabled: Boolean(user) });

  const [topic, setTopic] = useState("orders");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [openTicket, setOpenTicket] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: supportTicketsOptions.queryKey });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await create({ data: { subject: subject.trim(), topic, message: message.trim() } });
      setSubject("");
      setMessage("");
      await refresh();
      toast.success("Request sent. Our team replies within one working day.");
    } catch {
      toast.error("Could not send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async (ticketId: string) => {
    const body = replyBody.trim();
    if (!body) return;
    setBusy(true);
    try {
      await reply({ data: { ticketId, message: body } });
      setReplyBody("");
      await refresh();
    } catch {
      toast.error("Reply not sent.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <section className="grid items-center gap-6 rounded-2xl border bg-card p-5 sm:p-7 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase text-primary">
            <LifeBuoy className="h-3.5 w-3.5" />Afromart support
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">Help, inside the app</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Send a request and follow the whole conversation here. Replies also land in your inbox.
          </p>
        </div>
        <img src={supportHero} alt="An Afromart support agent wearing a headset" className="w-full rounded-xl border object-cover" />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTopic(item.value)}
            className={`rounded-xl border bg-card p-5 text-left transition hover:border-primary/35 ${topic === item.value ? "border-primary bg-primary/5" : ""}`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary"><item.icon className="h-5 w-5" /></span>
            <span className="mt-4 block font-heading font-bold">{item.title}</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.body}</span>
          </button>
        ))}
      </section>

      <div className="mt-9 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-bold">Your support requests</h2>
          {!user ? (
            <div className="mt-4 rounded-xl border bg-card p-6">
              <p className="text-sm text-muted-foreground">Sign in to open a request and see replies from our team.</p>
              <Button asChild className="mt-4"><Link to="/auth" search={{ redirect: "/support" }}>Sign in</Link></Button>
            </div>
          ) : (
            <>
              <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border bg-card p-5">
                <div>
                  <label htmlFor="support-subject" className="text-sm font-semibold">Subject</label>
                  <Input id="support-subject" required minLength={3} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Late delivery for order 4F2C…" className="mt-1.5" />
                </div>
                <div>
                  <label htmlFor="support-message" className="text-sm font-semibold">What happened?</label>
                  <Textarea id="support-message" required minLength={5} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us the details" className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send request
                </Button>
              </form>

              <ul className="mt-5 space-y-3">
                {(tickets ?? []).map((ticket) => {
                  const messages = [...(ticket.support_messages ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at));
                  const open = openTicket === ticket.id;
                  return (
                    <li key={ticket.id} className="rounded-xl border bg-card p-4">
                      <button type="button" className="w-full text-left" onClick={() => setOpenTicket(open ? null : ticket.id)}>
                        <span className="flex items-center justify-between gap-3">
                          <span className="min-w-0 truncate font-heading font-bold">{ticket.subject}</span>
                          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase text-primary">{ticket.status}</span>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</span>
                      </button>
                      {open ? (
                        <div className="mt-3 space-y-2 border-t pt-3">
                          {messages.map((entry) => (
                            <div key={entry.id} className={`rounded-lg px-3 py-2 text-sm ${entry.sender === "user" ? "bg-primary/10" : "bg-secondary"}`}>
                              <p className="whitespace-pre-wrap">{entry.body}</p>
                              <p className="mt-1 text-[10px] text-muted-foreground">{entry.sender === "user" ? "You" : "Afromart support"} · {new Date(entry.created_at).toLocaleString()}</p>
                            </div>
                          ))}
                          <Textarea rows={2} value={replyBody} onChange={(event) => setReplyBody(event.target.value)} placeholder="Add more details…" aria-label="Reply" />
                          <Button size="sm" onClick={() => sendReply(ticket.id)} disabled={busy || !replyBody.trim()}>Reply</Button>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold">Common questions</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border bg-card p-4">
                <summary className="cursor-pointer list-none font-heading font-semibold marker:hidden">{faq.q}</summary>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
            <MessagesSquare className="h-4 w-4 text-primary" />
            Seller questions? Use Messages to chat with the store directly.
          </div>
        </div>
      </div>
    </div>
  );
}
