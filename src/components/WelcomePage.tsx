import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import communityArtwork from "@/assets/onboarding/afromart-community.png.asset.json";

export function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <main className="grid min-h-dvh place-items-center bg-card" aria-label="Afro Mart is loading">
        <Logo variant="horizontal" className="h-auto w-24 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-card px-6 py-8 sm:px-10 lg:grid lg:grid-cols-[minmax(24rem,31rem)_minmax(0,1fr)] lg:p-0">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col lg:min-h-dvh lg:px-12 lg:py-10">
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <Logo variant="horizontal" className="h-auto w-36 sm:w-44" />
          <div className="mt-20 w-full overflow-hidden rounded-lg sm:mt-24 lg:hidden">
            <img
              src={communityArtwork.url}
              alt="African makers holding handcrafted products"
              className="aspect-[1.61/1] w-full object-cover"
            />
          </div>
        </div>

        <div className="pb-3">
          <Button asChild size="lg" className="h-13 w-full text-base font-bold">
            <Link to="/auth" search={{ redirect: "/home", mode: "signup" }}>Get Started</Link>
          </Button>
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </section>

      <section className="relative hidden min-h-dvh overflow-hidden bg-secondary lg:block">
        <img
          src={communityArtwork.url}
          alt="African makers and merchants holding handcrafted products"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/25" />
        <div className="absolute inset-x-12 bottom-12 max-w-2xl text-primary-foreground">
          <p className="text-sm font-bold uppercase">Connecting African commerce</p>
          <h1 className="mt-3 font-heading text-5xl font-bold leading-tight">
            Authentic products. Trusted people. One marketplace.
          </h1>
        </div>
      </section>
    </main>
  );
}