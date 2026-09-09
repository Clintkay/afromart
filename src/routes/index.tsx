import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Globe2,
  Heart,
  MessagesSquare,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/StoreBadges";
import appMockup from "@/assets/app-mockup.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Afro Mart | Connecting African Commerce" },
      {
        name: "description",
        content:
          "Afro Mart is the app connecting African makers, growers and service providers with people across the world. Explore as a guest or join as a seller.",
      },
      { property: "og:title", content: "Afro Mart | Connecting African Commerce" },
      {
        property: "og:description",
        content:
          "Afro Mart is the app connecting African makers, growers and service providers with people across the world. Explore as a guest or join as a seller.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  {
    icon: Compass,
    title: "Discover with intent",
    body: "Browse curated collections by region, craft and category, with filters that surface exactly what you had in mind.",
  },
  {
    icon: Store,
    title: "Verified storefronts",
    body: "Every maker, grower and provider gets their own branded space with ratings, story and highlights.",
  },
  {
    icon: MessagesSquare,
    title: "Talk in your language",
    body: "Chat directly with a store, with automatic translation across ten launch languages.",
  },
  {
    icon: Heart,
    title: "Save what inspires you",
    body: "Keep a wishlist of the pieces you are still thinking about and pick up where you left off.",
  },
  {
    icon: Truck,
    title: "Follow every step",
    body: "Live status from confirmation to doorstep, with delivery partners across the continent and beyond.",
  },
  {
    icon: ShieldCheck,
    title: "Protected all through",
    body: "Identity-checked stores, secure local payment methods and a support team for anything that goes sideways.",
  },
];

function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
              Connecting African commerce
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              One home for Africa&apos;s makers, growers and doers
            </h1>
            <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              Afro Mart brings together food, fabric, craft, beauty and everyday services from across the continent — and
              the people who create them. Come and look around first; no account needed.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="gap-2">
                  <UserRound className="h-4 w-4" />
                  Continue as guest
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Become a seller
                </Button>
              </Link>
            </div>

            <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              Get the app
            </p>
            <StoreBadges className="mt-3" />
          </div>

          <div className="relative">
            <img
              src={appMockup}
              alt="The Afro Mart app shown on two phones"
              width={1200}
              height={1200}
              className="mx-auto w-full max-w-md rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Guest strip */}
      <section className="border-b bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Look around as a guest
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Wander through stores, read the stories behind each maker and see what the app can do — all without signing
              up. Create an account whenever you are ready for wishlists, chat and order tracking.
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <Compass className="h-4 w-4" />
                Start exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Inside the app</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Built for the way Africa trades
          </h2>
          <p className="mt-4 text-muted-foreground">
            Products and services, single makers and large markets, local currencies and languages — all in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                <Globe2 className="h-4 w-4" />
                Ten launch languages
              </span>
              <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">Speak your own language</h2>
            </div>
            <ul className="flex flex-wrap gap-2 text-sm">
              {["English", "Français", "العربية", "Kiswahili", "Hausa", "Yorùbá", "isiZulu", "አማርኛ", "Igbo", "Português"].map(
                (language) => (
                  <li key={language} className="rounded-full border border-background/25 px-3 py-1">
                    {language}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-secondary/50 px-6 py-14 text-center sm:px-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">For sellers</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Turn your craft into a business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Open your own storefront, list products or services, set fixed or negotiable pricing and get paid through the
            methods your customers already use.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/sell">
              <Button size="lg" className="gap-2">
                <Store className="h-4 w-4" />
                Become a seller
              </Button>
            </Link>
            <Link to="/coming-soon">
              <Button size="lg" variant="outline">
                Get the app
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
