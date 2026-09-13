import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronDown, ChevronLeft, Eye, EyeOff, Globe2, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import communityArtwork from "@/assets/onboarding/afromart-community.png.asset.json";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8).max(128);

export function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">(search.mode === "signup" ? "signup" : "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [humanChecked, setHumanChecked] = useState(false);
  const [website, setWebsite] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const navigate = useNavigate();
  const redirect = typeof search.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : "/home";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email_confirmed_at) {
        const storedRedirect = window.sessionStorage.getItem("afromart_auth_redirect");
        window.sessionStorage.removeItem("afromart_auth_redirect");
        navigate({ to: storedRedirect?.startsWith("/") ? storedRedirect : redirect });
      }
    });
  }, [navigate, redirect]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (website || !humanChecked) throw new Error("Complete the security check to continue.");
      const safeEmail = emailSchema.parse(email);
      const safePassword = passwordSchema.parse(password);
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: safeEmail,
          password: safePassword,
          options: {
            data: { full_name: fullName.trim().slice(0, 100), phone: phone.trim().slice(0, 30) },
            emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(redirect)}`,
          },
        });
        if (error) throw error;
        if (data.session?.user.email_confirmed_at) {
          navigate({ to: redirect });
          return;
        }
        setAwaitingVerification(true);
        setResendSeconds(60);
        toast.success("We sent a confirmation email to you.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: safeEmail, password: safePassword });
        if (error) throw error;
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setAwaitingVerification(true);
          setResendSeconds(0);
          toast.error("Confirm your email before signing in.");
          return;
        }
        navigate({ to: redirect });
      }
    } catch (err) {
      toast.error(err instanceof z.ZodError ? "Enter a valid email and a password of at least 8 characters." : err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode.trim(),
      type: "signup",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: redirect });
  };

  const handleResendConfirmation = async () => {
    if (resendSeconds > 0) return;
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(redirect)}` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setResendSeconds(60);
    toast.success("A new confirmation email has been sent.");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset instructions have been sent to your email.");
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    window.sessionStorage.setItem("afromart_auth_redirect", redirect.startsWith("/") ? redirect : "/home");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });

    if (result.error) {
      setGoogleLoading(false);
      toast.error(result.error.message);
      return;
    }

    if (result.redirected) {
      return;
    }

    navigate({ to: redirect });
  };

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setPassword("");
    setAwaitingVerification(false);
    setVerificationCode("");
    setHumanChecked(false);
  };

  if (awaitingVerification) {
    return (
      <main className="grid min-h-dvh bg-card lg:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)]">
        <section className="relative hidden min-h-dvh overflow-hidden bg-primary lg:block">
          <img src={communityArtwork.url} alt="African makers and merchants" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/35" />
        </section>
        <section className="flex min-h-dvh flex-col px-5 py-5 sm:px-10 lg:justify-center lg:px-14">
          <Button variant="ghost" size="icon" className="-ml-3 text-primary" onClick={() => setAwaitingVerification(false)} aria-label="Back to sign up">
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <form onSubmit={handleVerifyCode} className="mx-auto my-auto w-full max-w-md pb-12">
            <Logo variant="horizontal" className="mb-8 h-8" />
            <h1 className="font-heading text-3xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter the confirmation code sent to <span className="font-semibold text-foreground">{email}</span>, or use the confirmation link in the email.</p>
            <Label htmlFor="verification-code" className="mt-8 block">Verification code</Label>
            <Input id="verification-code" inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="mt-2 h-14 text-center text-2xl tracking-[0.35em]" minLength={6} maxLength={6} required />
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={loading || verificationCode.length !== 6}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Verify email</Button>
            <Button type="button" variant="link" className="mt-3 w-full" onClick={handleResendConfirmation} disabled={loading || resendSeconds > 0}>{resendSeconds > 0 ? `Send again in ${resendSeconds}s` : "Send another email"}</Button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-dvh bg-card lg:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-primary lg:block">
        <img src={communityArtwork.url} alt="African makers and merchants" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="absolute left-12 top-10"><Logo variant="horizontal" className="h-8 brightness-0 invert" /></div>
        <div className="absolute inset-x-12 bottom-14 max-w-xl text-primary-foreground">
          <p className="text-sm font-semibold uppercase">Connecting African commerce</p>
          <p className="mt-4 font-heading text-5xl font-bold leading-tight">Your marketplace. Your community.</p>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col px-5 pb-5 pt-4 sm:px-10 sm:pb-8 sm:pt-6 lg:px-14 lg:py-10">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="icon" className="-ml-3 text-primary" aria-label="Back to welcome">
            <Link to="/"><ChevronLeft className="h-7 w-7" /></Link>
          </Button>
          {mode === "signup" ? (
            <Button variant="outline" size="sm" className="rounded-full" type="button">
              <Globe2 className="h-4 w-4 text-primary" /> English <ChevronDown className="h-4 w-4 text-primary" />
            </Button>
          ) : <span />}
        </div>

        <div className="mx-auto mt-5 w-full max-w-md sm:mt-9 lg:my-auto">
          <Link to="/" className="mb-8 hidden justify-center lg:flex"><Logo variant="horizontal" className="h-8" /></Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
             {mode === "signin" ? "Log in securely to continue." : "Join Afromart to shop, hire professionals and sell across Africa."}
          </p>

          <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
            {mode === "signup" ? (
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="e.g. Amina Yusuf" className="mt-1.5 h-12" autoComplete="name" />
              </div>
            ) : null}
             <div>
               <Label htmlFor="email">Email Address</Label>
               <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="e.g. amina@domain.com" className="mt-1.5 h-12" autoComplete="email" maxLength={255} />
             </div>
            {mode === "signup" ? (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder="e.g. +234 803 123 4567" className="mt-1.5 h-12" autoComplete="tel" />
              </div>
            ) : null}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required placeholder={mode === "signin" ? "Enter your password" : "Minimum 8 characters"} className="h-12 pr-12" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-1 top-1 h-10 w-10 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <input aria-hidden="true" tabIndex={-1} autoComplete="off" className="hidden" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} />
            <label className="flex min-h-13 cursor-pointer items-center gap-3 rounded-lg border bg-secondary/40 px-4 py-3 text-sm font-medium">
              <input type="checkbox" checked={humanChecked} onChange={(event) => setHumanChecked(event.target.checked)} className="h-4 w-4 accent-primary" required />
              <span>I’m human</span>
              <span className="ml-auto text-xs font-semibold text-muted-foreground">Security check</span>
            </label>
            {mode === "signin" ? (
              <div className="flex justify-end">
                <Button type="button" variant="link" onClick={handleForgotPassword} className="h-auto px-0 text-sm text-primary">Forgot Password?</Button>
              </div>
            ) : null}
             <Button type="submit" size="lg" className="mt-3 h-13 w-full text-base font-bold" disabled={loading || !humanChecked}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Log In" : "Sign up with Email"}
            </Button>
          </form>

          <Button variant="outline" size="lg" className="mt-3 h-13 w-full font-bold" onClick={handleGoogleSignIn} type="button" disabled={googleLoading}>
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {mode === "signin" ? "Log in with Google" : "Sign up with Google"}
          </Button>

          <div className="my-7 hidden items-center lg:flex"><Separator className="flex-1" /><span className="mx-3 text-xs text-muted-foreground">OR</span><Separator className="flex-1" /></div>
        </div>

        <div className="mt-auto pt-5 text-center text-sm text-muted-foreground sm:pt-10">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button type="button" variant="link" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")} className="h-auto px-0 font-bold text-primary">
            {mode === "signin" ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </section>
    </main>
  );
}
