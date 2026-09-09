import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Globe2,
  Heart,
  LifeBuoy,
  MessagesSquare,
  Quote,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/StoreBadges";
import appMockup from "@/assets/app-mockup.png";
import catFood from "@/assets/cat-food.jpg";
import catFabric from "@/assets/cat-fabric.jpg";
import catBeauty from "@/assets/cat-beauty.jpg";
import catCrafts from "@/assets/cat-crafts.jpg";
import catServices from "@/assets/cat-services.jpg";

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
    tone: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: Store,
    title: "Verified storefronts",
    body: "Every maker, grower and provider gets their own branded space with ratings, story and highlights.",
    tone: "bg-brand-gold/20 text-brand-gold",
  },
  {
    icon: MessagesSquare,
    title: "Talk in your language",
    body: "Chat directly with a store, with automatic translation across ten launch languages.",
    tone: "bg-brand-indigo/15 text-brand-indigo",
  },
  {
    icon: Heart,
    title: "Save what inspires you",
    body: "Keep a wishlist of the pieces you are still thinking about and pick up where you left off.",
    tone: "bg-brand-coral/15 text-brand-coral",
  },
  {
    icon: Truck,
    title: "Follow every step",
    body: "Live status from confirmation to doorstep, with delivery partners across the continent and beyond.",
    tone: "bg-brand-terracotta/15 text-brand-terracotta",
  },
  {
    icon: ShieldCheck,
    title: "Protected all through",
    body: "Identity-checked stores, secure local payment methods and a support team for anything that goes sideways.",
    tone: "bg-brand-leaf/15 text-brand-leaf",
  },
];

const collections = [
  { image: catFood, title: "Kitchen & pantry", body: "Grains, spices, oils and smoked staples", slug: "groceries" },
  { image: catFabric, title: "Fabric & fashion", body: "Ankara, aso oke, kente and ready-to-wear", slug: "fashion" },
  { image: catBeauty, title: "Skin & hair", body: "Shea, black soap and botanical oils", slug: "beauty" },
  { image: catCrafts, title: "Home & craft", body: "Woven baskets, carved wood, beadwork", slug: "home" },
];

const stats = [
  { value: "54", label: "African countries in scope" },
  { value: "10", label: "Languages at launch" },
  { value: "1", label: "App for buying and selling" },
  { value: "24/7", label: "Support in the app" },
];

function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden brand-soft">
        <div className="absolute inset-0 brand-pattern-light opacity-60" aria-hidden="true" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-brand-green/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              Connecting African commerce
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] text-brand-green sm:text-5xl lg:text-6xl">
              One home for Africa&apos;s <span className="text-gold-gradient">makers, growers and doers</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Afro Mart brings together food, fabric, craft, beauty and everyday services from across the continent — and
              the people who create them. Come and look around first; no account needed.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  <UserRound className="h-4 w-4" />
                  Continue as guest
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-brand-green/30 text-brand-green">
                  Become a seller
                </Button>
              </Link>
            </div>

            <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Get the app</p>
            <StoreBadges className="mt-3" />
          </div>

          <div className="relative">
            <img
              src={appMockup}
              alt="The Afro Mart app shown on two phones"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-md drop-shadow-xl"
            />
          </div>
        </div>

        {/* Stats ribbon */}
        <div className="relative border-y bg-card/80">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-heading text-3xl font-extrabold text-brand-green">{stat.value}</span>
                  <span className="mt-1 block text-xs uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Guest strip */}
      <section className="border-b bg-brand-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Look around as a guest</h2>
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


      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
            What people are finding
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Colour, craft and flavour from every corner
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              to="/products"
              search={{ categorySlug: collection.slug }}
              className="group relative overflow-hidden rounded-3xl border shadow-sm"
            >
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
                width={1024}
                height={768}
                className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="font-heading text-lg font-bold">{collection.title}</span>
                <span className="mt-1 block text-sm text-white/80">{collection.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Services band */}
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <img
            src={catServices}
            alt="Small business owners at work in their shop"
            loading="lazy"
            width={1024}
            height={768}
            className="w-full rounded-3xl border-4 border-brand-gold/30 object-cover shadow-xl"
          />
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-indigo">Not just products</span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Services and skills, close to home
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tailors, stylists, caterers, repairers, movers and creatives list what they do, where they work and how
              much it costs — fixed or open to negotiation. Send a request, agree the details in chat, book the date.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" variant="outline">
                  Browse the marketplace
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" className="gap-2">
                  <Store className="h-4 w-4" />
                  Offer your service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Inside the app</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Built for the way Africa trades
          </h2>
          <p className="mt-4 text-muted-foreground">
            Products and services, single makers and large markets, local currencies and languages — all in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.tone}`}>
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Voices */}
      <section className="border-y bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Voices from the marketplace</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                quote: "My baskets used to travel only as far as the market gate. Now they leave the country.",
                name: "Adjoa",
                role: "Weaver • Bolgatanga",
              },
              {
                quote: "I can ask questions in Hausa and the seller answers in French. It just works.",
                name: "Ibrahim",
                role: "Buyer • Kano",
              },
              {
                quote: "Bookings, deposits and messages in one place instead of five apps.",
                name: "Zanele",
                role: "Event caterer • Durban",
              },
            ].map((item) => (
              <figure key={item.name} className="rounded-3xl border bg-card p-6 shadow-sm">
                <Quote className="h-6 w-6 text-brand-gold" />
                <blockquote className="mt-4 font-heading text-lg leading-relaxed text-foreground">{item.quote}</blockquote>
                <figcaption className="mt-5 text-sm text-muted-foreground">
                  <span className="font-semibold text-brand-green">{item.name}</span> — {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                <Globe2 className="h-4 w-4" />
                Ten launch languages
              </span>
              <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Speak your own language
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2 text-sm text-brand-green">
              {["English", "Français", "العربية", "Kiswahili", "Hausa", "Yorùbá", "isiZulu", "አማርኛ", "Igbo", "Português"].map(
                (language) => (
                  <li key={language} className="rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1">
                    {language}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Seller + support CTA */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="rounded-3xl border bg-brand-cream px-6 py-12 text-center lg:col-span-2 lg:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">For sellers</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Turn your craft into a business
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground lg:mx-0">
            Open your own storefront, list products or services, set fixed or negotiable pricing and get paid through the
            methods your customers already use.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link to="/sell">
              <Button size="lg" className="gap-2">
                <Store className="h-4 w-4" />
                Become a seller
              </Button>
            </Link>
            <Link to="/coming-soon">
              <Button size="lg" variant="outline" className="border-brand-green/30 text-brand-green">
                Get the app
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-brand-green/20 bg-brand-green/5 px-6 py-12">
          <LifeBuoy className="h-8 w-8 text-brand-green" />
          <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">Need a hand?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Orders, payments, selling or safety — our team answers in your language, every day of the week.
          </p>
          <Link to="/support" className="mt-6">
            <Button size="lg" className="w-full">
              Visit support
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
