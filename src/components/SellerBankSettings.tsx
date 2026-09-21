import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Banknote, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { confirmTransfer, getMyBankAccount, getStoreTransfers, saveBankAccount } from "@/lib/bank-transfer.functions";

/**
 * Seller bank details plus the transfers buyers say they have sent, so the
 * seller can confirm receipt and release the order for fulfilment.
 */
export function SellerBankSettings({ hasStore }: { hasStore: boolean }) {
  const queryClient = useQueryClient();
  const fetchAccount = useServerFn(getMyBankAccount);
  const fetchTransfers = useServerFn(getStoreTransfers);
  const save = useServerFn(saveBankAccount);
  const confirm = useServerFn(confirmTransfer);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ bankName: "", accountName: "", accountNumber: "" });

  const { data: account } = useQuery({ queryKey: ["my-bank-account"], queryFn: () => fetchAccount(), enabled: hasStore });
  const { data: transfers } = useQuery({ queryKey: ["store-transfers"], queryFn: () => fetchTransfers(), enabled: hasStore, refetchInterval: 20000 });

  useEffect(() => {
    if (!account) return;
    setForm({ bankName: account.bank_name, accountName: account.account_name, accountNumber: account.account_number });
  }, [account]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await save({ data: form });
      toast.success("Bank details saved. Buyers can now pay you by transfer.");
      await queryClient.invalidateQueries({ queryKey: ["my-bank-account"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your bank details.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmReceipt(transferId: string) {
    setBusy(true);
    try {
      await confirm({ data: { transferId } });
      toast.success("Payment confirmed. The buyer's order moves to preparing.");
      await queryClient.invalidateQueries({ queryKey: ["store-transfers"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not confirm that payment.");
    } finally {
      setBusy(false);
    }
  }

  const pending = (transfers ?? []).filter((transfer) => transfer.status !== "confirmed");

  return (
    <section>
      <h2 className="flex items-center gap-2 font-heading text-2xl font-bold"><Banknote className="h-5 w-5 text-primary" />Bank transfers</h2>
      <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border bg-card p-5">
        <div>
          <label htmlFor="bank-name" className="text-sm font-semibold">Bank</label>
          <Input id="bank-name" required disabled={!hasStore} value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} className="mt-1.5" placeholder="Guaranty Trust Bank" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="bank-account-name" className="text-sm font-semibold">Account name</label>
            <Input id="bank-account-name" required disabled={!hasStore} value={form.accountName} onChange={(event) => setForm({ ...form, accountName: event.target.value })} className="mt-1.5" placeholder="Balogun Fabrics Ltd" />
          </div>
          <div>
            <label htmlFor="bank-account-number" className="text-sm font-semibold">Account number</label>
            <Input id="bank-account-number" required disabled={!hasStore} inputMode="numeric" value={form.accountNumber} onChange={(event) => setForm({ ...form, accountNumber: event.target.value })} className="mt-1.5" placeholder="0123456789" />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={busy || !hasStore}>{account ? "Update bank details" : "Save bank details"}</Button>
        {!hasStore ? <p className="text-xs text-muted-foreground">Create your store first to accept bank transfers.</p> : null}
      </form>

      {pending.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {pending.map((transfer) => (
            <li key={transfer.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading font-bold">{formatPrice(transfer.amount)}</p>
                  <p className="text-xs text-muted-foreground">Reference {transfer.reference}{transfer.sender_reference ? ` · buyer receipt ${transfer.sender_reference}` : ""}</p>
                </div>
                {transfer.status === "submitted" ? (
                  <Button size="sm" disabled={busy} onClick={() => confirmReceipt(transfer.id)}><Check className="h-4 w-4" />Money received</Button>
                ) : (
                  <span className="text-xs font-bold uppercase text-muted-foreground">Awaiting buyer transfer</span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Always check your bank statement before confirming.</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
