import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, Globe2, LockKeyhole, MessageCircle, Search, ShieldCheck, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { StoreBadges } from "@/components/StoreBadges";
import foodImage from "@/assets/cat-food.jpg";
import fabricImage from "@/assets/cat-fabric.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({ meta: [
    { title: "Afro Mart | Africa's Marketplace App" },
    { name: "description", content: "Experience the Afro Mart app as a guest or start selling products and services across Africa and the diaspora." },
    { property: "og:title", content: "Afro Mart | Africa's Marketplace App" },
    { property: "og:description", content: "Experience the Afro Mart app as a guest or start selling products and services across Africa and the diaspora." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const capabilities = [
  { icon: Search, title: "Discover", body: "Search listings, services and verified stores across borders." },
  { icon: MessageCircle, title: "Connect", body: "Speak directly with sellers, with translation built in." },
  { icon: ShieldCheck, title: "Trade safely", body: "Verified identities, protected payments and tracked delivery." },
];

function AppPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[3rem] border-[9px] border-foreground bg-card shadow-2xl">
      <div className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground" />
      <div className="overflow-hidden rounded-[2.4rem]">
        <div className="px-5 pb-5 pt-12">
          <div className="flex items-center justify-between"><Logo className="h-7" /><span className="text-xs text-muted-foreground">Guest</span></div>
          <div className="relative mt-5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><div className="rounded-xl bg-secondary py-3 pl-10 text-xs text-muted-foreground">Search stores and services</div></div>
        </div>
        <div className="bg-secondary/60 p-5">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="text-xs font-semibold uppercase text-primary-foreground/70">Across Africa</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Find what feels like home.</h2>
            <p className="mt-2 text-xs text-primary-foreground/80">People, products and skills in one app.</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[{ image: foodImage, name: "Abeni Foods" }, { image: fabricImage, name: "Kente House" }].map((item) => (
              <div key={item.name} className="overflow-hidden rounded-xl bg-card shadow-sm">
                <img src={item.image} alt="" className="aspect-square w-full object-cover" />
                <p className="p-3 text-xs font-bold">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t bg-card py-4 text-center text-[10px] font-semibold text-muted-foreground">
          <span className="text-brand-green">Discover</span><span>Stores</span><span>Services</span>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div>
      <section className="overflow-hidden bg-brand-cream">
        <div className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green"><span className="h-2 w-2 rounded-full bg-brand-terracotta" /> Connecting African commerce</span>
            <h1 className="mt-7 max-w-3xl font-heading text-5xl font-extrabold leading-[.96] text-foreground sm:text-6xl lg:text-7xl">
              Africa&apos;s marketplace, <span className="text-brand-green">in your pocket.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Discover trusted makers, stores and service providers across Africa and the diaspora. Look around freely,
              or open your own place to sell.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/guest"><Button size="lg"><UserRound className="h-4 w-4" /> Browse as guest</Button></Link>
              <Link to="/sell/start"><Button size="lg" variant="outline"><Store className="h-4 w-4" /> Start selling</Button></Link>
            </div>
            <div className="mt-9 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4 text-brand-gold" /> Guest browsing needs no account. Ordering remains locked.</div>
          </div>
          <div id="app-preview" className="relative py-4"><AppPhone /></div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {capabilities.map((item) => <article key={item.title} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gold/20 text-brand-green"><item.icon className="h-5 w-5" /></span><div><h2 className="font-heading text-lg font-bold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p></div></article>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-2xl border bg-secondary/50 p-8">
          <UserRound className="h-7 w-7 text-brand-green" /><p className="mt-5 text-sm font-semibold text-brand-terracotta">FOR VISITORS</p>
          <h2 className="mt-2 font-heading text-3xl font-bold">Try the app without signing up.</h2>
          <p className="mt-3 text-muted-foreground">Explore discovery, stores, services and details. Create an account only when you want to save, chat or order.</p>
          <Link to="/guest" className="mt-7 inline-block"><Button>Enter guest mode <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
          <BriefcaseBusiness className="h-7 w-7 text-brand-gold" /><p className="mt-5 text-sm font-semibold text-primary-foreground/70">FOR SELLERS</p>
          <h2 className="mt-2 font-heading text-3xl font-bold">Start with who you are and what you offer.</h2>
          <p className="mt-3 text-primary-foreground/75">Choose products or services, create your account and continue into verification and store setup.</p>
          <Link to="/sell/start" className="mt-7 inline-block"><Button variant="secondary">Start seller setup <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      <section className="border-t bg-brand-cream"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><span className="flex items-center gap-2 text-sm font-semibold text-brand-green"><Globe2 className="h-4 w-4" /> Made for Africa and the diaspora</span><h2 className="mt-2 font-heading text-2xl font-bold">Take Afro Mart with you.</h2></div><StoreBadges /></div></section>
    </div>
  );
}