import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getVerifications,
  submitVerification,
  reviewVerification,
} from "@/lib/verification.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function StoreVerification({
  storeId,
  verified,
}: {
  storeId?: string;
  verified?: boolean | null;
}) {
  const get = useServerFn(getVerifications),
    submit = useServerFn(submitVerification),
    review = useServerFn(reviewVerification);
  const query = useQuery({ queryKey: ["store-verifications"], queryFn: () => get() });
  const [file, setFile] = useState<File | null>(null),
    [kind, setKind] = useState("Business registration"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload() {
    if (!file || !storeId) return;
    setBusy(true);
    setError("");
    try {
      if (file.size > 5 * 1024 * 1024) throw Error("Maximum file size is 5 MB.");
      const content = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      await submit({ data: { storeId, documentType: kind, content } });
      setFile(null);
      await query.refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  async function decide(id: string, action: "view" | "approved" | "rejected") {
    setBusy(true);
    try {
      const result = await review({
        data: {
          id,
          action,
          note:
            action === "rejected"
              ? "Documents could not be verified. Please submit clearer, valid business credentials."
              : "",
        },
      });
      if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
      await query.refetch();
    } catch {
      setError("Could not complete the review.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="my-6 border-y py-6">
      <h2 className="font-heading text-xl font-bold">Store verification</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {verified ? "Verified store" : "Not verified"} · Documents are private and reviewed by
        Afromart administrators.
      </p>
      {storeId && !verified && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Document type
            <select
              className="mt-1 block h-10 w-full rounded-md border bg-background px-3"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              {["Business registration", "Government ID", "Proof of business address"].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            PDF, JPG or PNG · up to 5 MB
            <Input
              className="mt-1"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button disabled={!file || busy} onClick={upload}>
            {busy ? "Uploading…" : "Submit for review"}
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {query.isError && <p role="alert">Could not load verification requests.</p>}
      <ul className="mt-4 divide-y">
        {query.data?.rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium">
                {row.stores?.name} · {row.document_type}
              </p>
              <p className="text-sm capitalize">{row.status}</p>
              {row.review_note && (
                <p className="text-sm text-muted-foreground">{row.review_note}</p>
              )}
            </div>
            {query.data.admin && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" disabled={busy} onClick={() => decide(row.id, "view")}>
                  View document
                </Button>
                {row.status === "pending" && (
                  <>
                    <Button disabled={busy} onClick={() => decide(row.id, "approved")}>
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => decide(row.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
