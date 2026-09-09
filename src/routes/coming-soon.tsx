import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/coming-soon")({
  component: ComingSoonPage,
  head: () => ({
    meta: [
      { title: "The Afro Mart App Is Coming Soon" },
      {
        name: "description",
        content: "The Afro Mart mobile app lands soon on iOS and Android. Join the waiting list to be first in line.",
      },
      { property: "og:title", content: "The Afro Mart App Is Coming Soon" },
      {
        property: "og:description",
        content: "The Afro Mart mobile app lands soon on iOS and Android. Join the waiting list to be first in line.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div className="relative isolate overflow-hidden brand-soft">
      <div className="absolute inset-0 brand-pattern-light opacity-25" aria-hidden="true" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
          Launching soon
        </span>

        <h1 className="font-heading text-4xl font-bold leading-tight text-brand-green sm:text-6xl">
          The Afro Mart app is almost here
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          We are putting the finishing touches on the mobile experience for iOS and Android. Join the waiting list and
          we will let you know the moment it goes live.
        </p>

        {joined ? (
          <p className="mt-10 flex items-center gap-2 rounded-xl border border-brand-green/20 bg-brand-green/5 px-6 py-4 text-sm font-medium text-brand-green">
            <BellRing className="h-4 w-4" />
            You are on the list. We will be in touch at {email}.
          </p>
        ) : (
          <form
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (email.trim()) setJoined(true);
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-12 bg-card"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0">
              Notify me
            </Button>
          </form>
        )}


        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link to="/" className="underline underline-offset-4 hover:opacity-80">
            Back to home
          </Link>
          <Link to="/products" className="underline underline-offset-4 hover:opacity-80">
            Keep exploring as a guest
          </Link>
        </div>
      </div>
    </div>
  );
}
