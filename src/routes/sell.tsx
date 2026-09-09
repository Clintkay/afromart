import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BarChart3,
  Camera,
  CreditCard,
  IdCard,
  MessagesSquare,
  Package,
  Store,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/StoreBadges";
import sellerHero from "@/assets/seller-hero.jpg";

export const Route = createFileRoute("/sell")({
  component: SellPage,
  head: () => ({
    meta: [
      { title: "Become a Seller on Afro Mart" },
      {
        name: "description",
        content:
          "Open a verified storefront on Afro Mart, list products or services, chat with customers and get paid through local methods.",
      },
      { property: "og:title", content: "Become a Seller on Afro Mart" },
      {
        property: "og:description",
        content:
          "Open a verified storefront on Afro Mart, list products or services, chat with customers and get paid through local methods.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  {
    icon: Store,
    step: "Step 1",
    title: "Create your store",
    body: "Pick a store name, add your logo and banner and write the story behind what you make.",
  },
  {
    icon: IdCard,
    step: "Step 2",
    title: "Verify who you are",
    body: "Upload an ID and business details once. A verified badge tells buyers you are the real thing.",
  },
  {
    icon: Camera,
    step: "Step 3",
    title: "List products or services",
    body: "Add photos, pricing — fixed or negotiable — stock levels, delivery options and service areas.",
  },
  {
    icon: Wallet,
    step: "Step 4",
    title: "Get paid",
    body: "Choose how payouts reach you and watch your earnings and orders in one dashboard.",
  },
];

const tools = [
  { icon: Package, title: "Orders & inventory", body: "Accept, pack and fulfil orders with stock updated as you sell." },
  { icon: MessagesSquare, title: "Customer chat", body: "Answer questions and negotiate, with translation built in." },
  { icon: BarChart3, title: "Insights", body: "See views, conversion and best sellers week by week." },
  { icon: CreditCard, title: "Promotions", body: "Run discounts, coupons and featured placements when you need a push." },
];

function SellPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <BadgeCheck className="h-3.5 w-3.5" />
              Sell on Afro Mart
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Your store, your prices, your customers
            </h1>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Whether you grow, cook, sew, style, repair or deliver — set up a storefront on Afro Mart and reach people
              looking for exactly what you offer. It is free to open a store.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/coming-soon">
                <Button size="lg">Start selling</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline">
                  See the marketplace
                </Button>
              </Link>
            </div>
          </div>

          <img
            src={sellerHero}
            alt="A seller preparing fabric orders in her shop"
            width={1200}
            height={900}
            className="w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">How it works</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">Four steps to your first order</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <article key={item.title} className="relative rounded-2xl border bg-card p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
                <item.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{item.step}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="bg-brand-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Everything you need in one dashboard</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <article key={tool.title} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <tool.icon className="h-5 w-5 text-brand-gold" />
                <h3 className="mt-4 font-heading text-lg font-semibold">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{tool.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl brand-gradient px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join the seller waiting list and we will walk you through setting up your
            store on day one.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/coming-soon">
              <Button size="lg" className="bg-brand-gold text-brand-ink hover:bg-brand-gold/90">
                Join the seller waiting list
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex justify-center">
            <StoreBadges />
          </div>
        </div>
      </section>
    </div>
  );
}
