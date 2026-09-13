import { useState } from "react";
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

export function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">(search.mode === "signup" ? "signup" : "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const redirect = typeof search.redirect === "string" ? search.redirect : "/home";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, phone } },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirect });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset instructions have been sent to your email.");
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
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
  };

  return (
    <main className="grid min-h-dvh bg-card lg:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-primary lg:block">
        <img src={communityArtwork.url} alt="African makers and merchants" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="absolute left-12 top-10"><Logo className="h-12 brightness-0 invert" /></div>
        <div className="absolute inset-x-12 bottom-14 max-w-xl text-primary-foreground">
          <p className="text-sm font-semibold uppercase">Connecting African commerce</p>
          <p className="mt-4 font-heading text-5xl font-bold leading-tight">Your marketplace. Your community.</p>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col px-6 pb-8 pt-6 sm:px-10 lg:px-14 lg:py-10">
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

        <div className="mx-auto mt-9 w-full max-w-md lg:my-auto">
          <Link to="/" className="mb-9 hidden justify-center lg:flex"><Logo variant="horizontal" className="h-12" /></Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Log in to continue purchasing authentic goods." : "Join AfroMart to shop authentic Pan-African items."}
          </p>

          <form onSubmit={handleEmailSubmit} className="mt-8 space-y-4">
            {mode === "signup" ? (
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="e.g. Amina Yusuf" className="mt-1.5 h-12" autoComplete="name" />
              </div>
            ) : null}
            <div>
              <Label htmlFor="email">{mode === "signin" ? "Email or Phone Number" : "Email Address"}</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder={mode === "signin" ? "amina@domain.com" : "e.g. amina@domain.com"} className="mt-1.5 h-12" autoComplete="email" />
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
            {mode === "signin" ? (
              <div className="flex justify-end">
                <Button type="button" variant="link" onClick={handleForgotPassword} className="h-auto px-0 text-sm text-primary">Forgot Password?</Button>
              </div>
            ) : null}
            <Button type="submit" size="lg" className="mt-3 h-13 w-full text-base font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Log In" : "Sign up with Email"}
            </Button>
          </form>

          <Button variant="outline" size="lg" className="mt-3 h-13 w-full font-bold" onClick={handleGoogleSignIn} type="button">
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

        <div className="mt-auto pt-10 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button type="button" variant="link" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")} className="h-auto px-0 font-bold text-primary">
            {mode === "signin" ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </section>
    </main>
  );
}
