import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const recoveryHash = window.location.hash.includes("type=recovery");
    if (recoveryHash) setRecoveryReady(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && recoveryHash) setRecoveryReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8 || password.length > 128) return toast.error("Use 8 to 128 characters.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Your password has been updated.");
    navigate({ to: "/home", replace: true });
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
        <Logo variant="horizontal" className="h-8" />
        <span className="mt-8 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></span>
        <h1 className="mt-5 font-heading text-3xl font-bold">Set a new password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a strong password you have not used before.</p>
        {!recoveryReady ? <div className="mt-6 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">Open the password reset link from your email to continue.</div> : <form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><Label htmlFor="new-password">New password</Label><div className="relative mt-1.5"><Input id="new-password" type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={128} required className="h-12 pr-12" autoComplete="new-password" /><Button type="button" variant="ghost" size="icon" onClick={() => setVisible((value) => !value)} className="absolute right-1 top-1 h-10 w-10" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</Button></div></div><div><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type={visible ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} maxLength={128} required className="mt-1.5 h-12" autoComplete="new-password" /></div><Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Update password</Button></form>}
        <Button asChild variant="link" className="mt-4 w-full"><Link to="/auth">Back to sign in</Link></Button>
      </section>
    </main>
  );
}