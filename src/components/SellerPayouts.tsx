import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getAllPayouts, getMyPayouts, requestPayout, updatePayout } from "@/lib/payouts.functions";

const statusLabel: Record<string, string> = { requested: "Requested", processing: "Processing", paid: "Paid", rejected: "Declined" };

export function SellerPayouts({ hasStore }: { hasStore: boolean }) {
  const qc = useQueryClient();
  const fetchMine = useServerFn(getMyPayouts); const request = useServerFn(requestPayout);
  const fetchAll = useServerFn(getAllPayouts); const update = useServerFn(updatePayout);
  const { data } = useQuery({ queryKey: ["my-payouts"], queryFn: () => fetchMine(), enabled: hasStore, refetchInterval: 30000 });
  const { data: queue } = useQuery({ queryKey: ["admin-payouts"], queryFn: () => fetchAll() });
  const [amount, setAmount] = useState(""); const [busy, setBusy] = useState(false);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["my-payouts"] }), qc.invalidateQueries({ queryKey: ["admin-payouts"] })]);

  async function submit() {
    setBusy(true);
    try { await request({ data: { amount: Math.round(Number(amount)) } }); toast.success("Payout requested."); setAmount(""); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Payout request failed."); }
    finally { setBusy(false); }
  }
  async function setStatus(payoutId: string, status: "processing" | "paid" | "rejected") {
    try { await update({ data: { payoutId, status } }); toast.success("Payout updated."); await refresh(); }
    catch { toast.error("Could not update payout."); }
  }

  const b = data?.balance;
  return (
    <>
      {hasStore && (
        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-heading text-lg font-bold">Payouts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Money from paid orders becomes available once the order is marked delivered.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Available", b?.available], ["Pending", b?.pending], ["Paid out", b?.paid], ["Delivered earnings", b?.earned]].map(([label, v]) => (
              <div key={label as string} className="rounded-md border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-heading text-lg font-bold">{formatPrice((v as number) ?? 0)}</p></div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <input type="number" min={1000} inputMode="numeric" className="w-48 rounded-md border bg-background px-3 py-2 text-sm" placeholder="Amount (₦)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button variant="outline" onClick={() => setAmount(String(b?.available ?? 0))}>Max</Button>
            <Button disabled={busy || !amount || Number(amount) < 1000 || Number(amount) > (b?.available ?? 0)} onClick={submit}>{busy ? "Requesting…" : "Request payout"}</Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Minimum ₦1,000. Paid to the bank account saved above.</p>
          <ul className="mt-4 divide-y">
            {(data?.payouts ?? []).map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span><span className="font-semibold">{formatPrice(p.amount)}</span><span className="text-muted-foreground"> · {p.bank_name} ····{p.account_number.slice(-4)} · {new Date(p.created_at).toLocaleDateString()}</span>{p.note && <span className="block text-xs text-muted-foreground">{p.note}</span>}</span>
                <Badge variant={p.status === "paid" ? "secondary" : p.status === "rejected" ? "destructive" : "default"}>{statusLabel[p.status]}</Badge>
              </li>
            ))}
            {data && data.payouts.length === 0 && <li className="py-3 text-sm text-muted-foreground">No payout requests yet.</li>}
          </ul>
        </section>
      )}
      {queue && (
        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-heading text-lg font-bold">Admin: payout requests</h2>
          {queue.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Nothing waiting.</p> : (
            <ul className="mt-3 divide-y">{queue.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span><span className="font-semibold">{p.stores?.name} · {formatPrice(p.amount)}</span><span className="block text-muted-foreground">{p.bank_name} · {p.account_name} · {p.account_number}</span></span>
                <span className="flex gap-2">{p.status === "requested" && <Button size="sm" variant="outline" onClick={() => setStatus(p.id, "processing")}>Processing</Button>}<Button size="sm" onClick={() => setStatus(p.id, "paid")}>Mark paid</Button><Button size="sm" variant="ghost" onClick={() => setStatus(p.id, "rejected")}>Decline</Button></span>
              </li>
            ))}</ul>
          )}
        </section>
      )}
    </>
  );
}
