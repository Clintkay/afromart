import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buyerUpdateDispute, getOrderDisputes, getStoreDisputes, openDispute, respondDispute } from "@/lib/disputes.functions";

export const reasonLabels: Record<string, string> = { damaged: "Item arrived damaged", not_delivered: "Delivery delayed / not received", wrong_item: "Wrong item", payment_issue: "Payment problem", other: "Something else" };
const statusLabels: Record<string, string> = { open: "Waiting for seller", seller_responded: "Seller replied", resolved: "Resolved", escalated: "With Afromart support" };
const field = "w-full rounded-md border bg-background px-3 py-2 text-sm";

export function DisputePanel({ orderId, stores }: { orderId: string; stores: { id: string; name: string }[] }) {
  const qc = useQueryClient();
  const fetchD = useServerFn(getOrderDisputes); const open = useServerFn(openDispute); const update = useServerFn(buyerUpdateDispute);
  const { data: disputes = [] } = useQuery({ queryKey: ["disputes", orderId], queryFn: () => fetchD({ data: { orderId } }), refetchInterval: 20000 });
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ storeId: stores[0]?.id ?? "", reason: "damaged", requested: "refund", details: "" });
  const refresh = () => qc.invalidateQueries({ queryKey: ["disputes", orderId] });

  async function submit() {
    setBusy(true);
    try { await open({ data: { orderId, ...form } }); toast.success("Issue sent to the seller."); setShow(false); setForm({ ...form, details: "" }); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not send. Add a little more detail and try again."); }
    finally { setBusy(false); }
  }
  async function act(disputeId: string, action: "resolve" | "escalate") {
    try { await update({ data: { disputeId, action } }); toast.success(action === "resolve" ? "Marked as resolved." : "Sent to Afromart support."); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong."); }
  }

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-3"><h2 className="font-heading font-bold">Problem with this order?</h2>{!show && stores.length > 0 && <Button size="sm" variant="outline" onClick={() => setShow(true)}>Report an issue</Button>}</div>
      {show && (
        <div className="mt-4 space-y-3">
          {stores.length > 1 && <select className={field} value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })}>{stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>}
          <select className={field} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>{Object.entries(reasonLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select className={field} value={form.requested} onChange={(e) => setForm({ ...form, requested: e.target.value })}><option value="refund">I want a refund</option><option value="replacement">I want a replacement</option><option value="other">Something else</option></select>
          <textarea className={field} rows={4} placeholder="Tell the seller what happened (at least 10 characters)" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
          <div className="flex gap-2"><Button disabled={busy || form.details.trim().length < 10} onClick={submit}>{busy ? "Sending…" : "Send to seller"}</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></div>
        </div>
      )}
      <ul className="mt-4 space-y-3">
        {disputes.map((d) => (
          <li key={d.id} className="rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{reasonLabels[d.reason]}{d.stores?.name ? ` · ${d.stores.name}` : ""}</span><Badge variant={d.status === "resolved" ? "secondary" : "default"}>{statusLabels[d.status]}</Badge></div>
            <p className="mt-2 text-muted-foreground">{d.details}</p>
            {d.seller_response && <p className="mt-2 rounded bg-muted p-2"><span className="font-semibold">Seller: </span>{d.seller_response}</p>}
            {d.status !== "resolved" && <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => act(d.id, "resolve")}>It's sorted</Button>{d.status !== "escalated" && <Button size="sm" variant="ghost" onClick={() => act(d.id, "escalate")}>Ask Afromart to step in</Button>}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SellerDisputes({ hasStore }: { hasStore: boolean }) {
  const qc = useQueryClient();
  const fetchD = useServerFn(getStoreDisputes); const respond = useServerFn(respondDispute);
  const { data: disputes = [] } = useQuery({ queryKey: ["store-disputes"], queryFn: () => fetchD(), enabled: hasStore, refetchInterval: 20000 });
  const [replies, setReplies] = useState<Record<string, string>>({});
  if (!hasStore) return null;
  async function send(id: string, resolve: boolean) {
    try { await respond({ data: { disputeId: id, response: replies[id] ?? "", resolve } }); toast.success(resolve ? "Issue resolved." : "Reply sent."); setReplies({ ...replies, [id]: "" }); await qc.invalidateQueries({ queryKey: ["store-disputes"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Write a reply first."); }
  }
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-heading text-lg font-bold">Order issues</h2>
      {disputes.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No buyer issues. Great job!</p> : (
        <ul className="mt-4 space-y-3">{disputes.map((d) => (
          <li key={d.id} className="rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">Order #{d.order_id.slice(0, 8).toUpperCase()} · {reasonLabels[d.reason]} · wants {d.requested}</span><Badge variant={d.status === "resolved" ? "secondary" : "default"}>{statusLabels[d.status]}</Badge></div>
            <p className="mt-2 text-muted-foreground">{d.details}</p>
            {d.seller_response && <p className="mt-2 rounded bg-muted p-2"><span className="font-semibold">You: </span>{d.seller_response}</p>}
            {d.status !== "resolved" && <div className="mt-3 space-y-2"><textarea className={field} rows={2} placeholder="Reply to the buyer (e.g. refund sent, replacement on the way)" value={replies[d.id] ?? ""} onChange={(e) => setReplies({ ...replies, [d.id]: e.target.value })} /><div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => send(d.id, false)}>Reply</Button><Button size="sm" variant="outline" onClick={() => send(d.id, true)}>Reply & mark resolved</Button></div></div>}
          </li>
        ))}</ul>
      )}
    </section>
  );
}
