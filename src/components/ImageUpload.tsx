import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadMarketplaceImage } from "@/lib/media.functions";

export function ImageUpload({ kind, value, onChange, disabled = false, onBusyChange }: {
  kind: "product" | "profile";
  value: string;
  onChange: (url: string) => void | Promise<void>;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = useServerFn(uploadMarketplaceImage);
  const label = kind === "profile" ? "profile picture" : "product photo";
  async function select(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024 || !file.size) {
      toast.error("Choose a JPG, PNG or WebP image under 5 MB.");
      return;
    }
    setBusy(true);
    onBusyChange?.(true);
    try {
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(file);
      });
      const result = await upload({ data: { content, kind } });
      await onChange(result.url);
      toast.success(kind === "profile" ? "Profile picture saved." : "Product photo uploaded.");
    } catch {
      toast.error("Could not save your photo. Please try again.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }
  return <div className="space-y-3">
    {value && <img src={value} alt={label} className="h-24 w-24 rounded-lg border object-cover" />}
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label={`Upload ${label}`} className="sr-only" disabled={disabled || busy} onChange={event => void select(event.target.files?.[0])} />
    <Button type="button" variant="outline" disabled={disabled || busy} onClick={() => input.current?.click()}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      {busy ? "Saving photo…" : `Upload ${label}`}
    </Button>
    <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Maximum 5 MB</p>
  </div>;
}