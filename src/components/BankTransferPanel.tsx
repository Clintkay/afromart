import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Banknote, Check, Clock3, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { getOrderTransfers, prepareTransfers, reportTransfer } from "@/lib/bank-transfer.functions";

/**
 * Buyer-facing bank transfer instructions: one payment box per seller in the
 * order, with the reference to quote and a way to tell the seller it was sent.
 */
export function BankTransferPanel({ orderId, paymentStatus }: { orderId: string; paymentStatus: string }) {
  const queryClient = useQueryClient();
  const fetchTransfers = useServerFn(getOrderTransfers);
  const prepare = useServerFn(prepareTransfers);
  const report = useServerFn(reportTransfer);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [references, setReferences] = useState<Record<string, string>>({});

  const { data: transfers, isLoading } = useQuery({
    queryKey: ["order-transfers", orderId],
    queryFn: async () => {
      const rows = await fetchTransfers({ data: { orderId } });
      if (rows.length === 0 && paymentStatus === "pending") {
        try {
          await prepare({ data: { orderId } });
          return await fetchTransfers({ data: { orderId } });
        } catch {
          return rows;
        }
      }
      return rows;
    },
    refetchInterval: 15000,
  });

  async function markSent(transferId: string) {
    const reference = (references[transferId] ?? "").trim();
    if (reference.length < 3) {
      toast.error("Enter the reference or narration shown on your bank receipt.");
      return;
    }
    setBusyId(transferId);
    try {
      await report({ data: { transferId, reference } });
      toast.success("Thanks. The seller will confirm once the money lands.");
      await queryClient.invalidateQueries({ queryKey: ["order-transfers", orderId] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send that yet. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading transfer details…</p>;
  if (!transfers || transfers.length === 0) {
    return <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">Bank details are not ready for this order yet. Message the seller, or pay by card instead.</p>;
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <section key={transfer.id} className="rounded-lg border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-heading font-bold"><Banknote className="h-5 w-5 text-primary" />Transfer {formatPrice(transfer.amount)}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase ${transfer.status === "confirmed" ? "text-primary" : "text-muted-foreground"}`}>
              {transfer.status === "confirmed" ? <Check className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
              {transfer.status === "awaiting_transfer" ? "Awaiting your transfer" : transfer.status === "submitted" ? "Waiting for seller to confirm" : "Confirmed"}
            </span>
          </div>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Bank</dt><dd className="font-semibold">{transfer.bank_name}</dd></div>
            <div><dt className="text-muted-foreground">Account name</dt><dd className="font-semibold">{transfer.account_name}</dd></div>
            <div><dt className="text-muted-foreground">Account number</dt><dd className="font-semibold">{transfer.account_number}</dd></div>
            <div>
              <dt className="text-muted-foreground">Use this reference</dt>
              <dd className="flex items-center gap-2 font-semibold">
                {transfer.reference}
                <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => { void navigator.clipboard?.writeText(transfer.reference); toast.success("Reference copied."); }}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </dd>
            </div>
          </dl>
          {transfer.status === "awaiting_transfer" ? (
            <div className="mt-4 border-t pt-4">
              <label htmlFor={`ref-${transfer.id}`} className="text-sm font-semibold">Already sent it? Add your bank receipt reference</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input id={`ref-${transfer.id}`} value={references[transfer.id] ?? ""} placeholder="e.g. GTB/1234567" onChange={(event) => setReferences((current) => ({ ...current, [transfer.id]: event.target.value }))} />
                <Button type="button" disabled={busyId === transfer.id} onClick={() => markSent(transfer.id)}>{busyId === transfer.id ? "Sending…" : "I have sent it"}</Button>
              </div>
            </div>
          ) : null}
          {transfer.status === "submitted" ? <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">Reference sent: {transfer.sender_reference}. The seller confirms once the money shows in their account.</p> : null}
        </section>
      ))}
    </div>
  );
}
