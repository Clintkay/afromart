import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Globe, Loader2, Moon, ShieldCheck, Store, UserRound } from "lucide-react";
import { toast } from "sonner";
import { myRolesOptions, profileOptions } from "@/lib/queries";
import { addMyRole } from "@/lib/roles.functions";
import { Switch } from "@/components/ui/switch";
import { updateProfileSettings } from "@/lib/profile.functions";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InternationalPhoneInput } from "@/components/InternationalPhoneInput";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "sw", label: "Kiswahili" },
];

export function SettingsPage() {
  const { data: profile } = useSuspenseQuery(profileOptions);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const save = useServerFn(updateProfileSettings);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [country, setCountry] = useState<CountryCode>("NG");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [phoneStep, setPhoneStep] = useState<"edit" | "verify">("edit");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { data: roles } = useQuery(myRolesOptions);
  const isSeller = (roles ?? []).includes("seller");
  const becomeSeller = useServerFn(addMyRole);

  const refresh = () => queryClient.invalidateQueries({ queryKey: profileOptions.queryKey });

  const saveName = async () => {
    if (!fullName.trim()) return;
    setSavingName(true);
    try {
      await save({ data: { fullName: fullName.trim() } });
      await refresh();
      toast.success("Name updated.");
    } catch {
      toast.error("Could not save your name.");
    } finally {
      setSavingName(false);
    }
  };

  const applyTheme = async (next: "light" | "dark") => {
    setTheme(next);
    try {
      await save({ data: { theme: next } });
    } catch {
      /* appearance is stored locally too */
    }
  };

  const applyLanguage = async (next: string) => {
    setLanguage(next);
    try {
      await save({ data: { preferredLanguage: next } });
      await refresh();
    } catch {
      /* language is stored locally too */
    }
  };

  const requestPhoneCode = async () => {
    const parsed = parsePhoneNumberFromString(phone, country);
    if (!parsed?.isValid()) {
      toast.error("Enter a valid phone number for the selected country.");
      return;
    }
    if (!user?.email) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: user.email, options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) {
      toast.error("Could not send the verification code. Try again shortly.");
      return;
    }
    setPhoneStep("verify");
    toast.success(`We emailed a 6-digit code to ${user.email}.`);
  };

  const confirmPhone = async () => {
    if (!user?.email || code.length < 6) return;
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: user.email, token: code, type: "email" });
    if (error) {
      setBusy(false);
      toast.error("That code is not valid. Request a new one.");
      return;
    }
    try {
      const parsed = parsePhoneNumberFromString(phone, country);
      await save({ data: { phone: parsed?.number ?? phone } });
      await refresh();
      setPhoneStep("edit");
      setCode("");
      toast.success("Phone number verified and saved.");
    } catch {
      toast.error("Verified, but the number could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
      <header>
        <p className="text-xs font-bold uppercase text-primary">Settings</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Your Afromart preferences</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
      </header>

      <section className="mt-7 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Moon className="h-5 w-5 text-primary" />Dark mode</h2>
            <p className="mt-1 text-sm text-muted-foreground">Turn on a darker interface for low light.</p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(next) => applyTheme(next ? "dark" : "light")}
            aria-label="Dark mode"
          />
        </div>
      </section>

      <section className="mt-5 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Store className="h-5 w-5 text-primary" />Buyer or seller</h2>
        <p className="mt-1 text-sm text-muted-foreground">Switch between shopping and selling without a second account.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="h-12 justify-start" onClick={() => navigate({ to: "/home" })}>Shop as buyer</Button>
          <Button
            className="h-12 justify-start"
            disabled={switching}
            onClick={async () => {
              setSwitching(true);
              try {
                if (!isSeller) await becomeSeller({ data: { role: "seller" } });
                await queryClient.invalidateQueries({ queryKey: myRolesOptions.queryKey });
                navigate({ to: "/seller" });
              } catch {
                toast.error("Could not open your seller workspace.");
              } finally {
                setSwitching(false);
              }
            }}
          >
            {switching ? <Loader2 className="h-4 w-4 animate-spin" /> : isSeller ? "Open seller dashboard" : "Start selling"}
          </Button>
        </div>
      </section>

      <section className="mt-5 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Globe className="h-5 w-5 text-primary" />Language</h2>
        <p className="mt-1 text-sm text-muted-foreground">The app switches over immediately.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {languages.map((item) => (
            <Button
              key={item.value}
              variant={language === item.value ? "default" : "outline"}
              className="h-12 justify-start"
              onClick={() => applyLanguage(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><UserRound className="h-5 w-5 text-primary" />Your details</h2>
        <div className="mt-4"><ImageUpload kind="profile" value={profile?.avatar_url ?? ""} onChange={async avatarUrl => {
          await save({ data: { avatarUrl } });
          await refresh();
        }} /></div>
        <label htmlFor="settings-name" className="mt-4 block text-sm font-semibold">Full name</label>
        <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Input id="settings-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" />
          <Button onClick={saveName} disabled={savingName}>{savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold">Phone number</p>
          <p className="mt-1 text-xs text-muted-foreground">Changing your number needs a verification code sent to your email.</p>
          {phoneStep === "edit" ? (
            <div className="mt-3 space-y-3">
              <InternationalPhoneInput country={country} onCountryChange={setCountry} value={phone} onChange={setPhone} />
              <Button onClick={requestPhoneCode} disabled={busy} className="w-full sm:w-auto">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send verification code"}
              </Button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                aria-label="Verification code"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={confirmPhone} disabled={busy || code.length < 6}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify and save"}
                </Button>
                <Button variant="ghost" onClick={() => { setPhoneStep("edit"); setCode(""); }}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Bell className="h-5 w-5 text-primary" />Messages from the app</h2>
        <p className="mt-1 text-sm text-muted-foreground">Order updates, support replies and account alerts arrive in your inbox.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/notifications" })}>Open inbox</Button>
      </section>

      <section className="mt-5 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><ShieldCheck className="h-5 w-5 text-primary" />Account</h2>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={async () => {
            await signOut();
            navigate({ to: "/auth" });
          }}
        >
          Sign out
        </Button>
      </section>
    </div>
  );
}
