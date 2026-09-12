import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, Headphones, LockKeyhole, MessageCircle, ShieldCheck, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppScreen } from "@/components/AppScreen";
import { StoreBadges } from "@/components/StoreBadges";
import homeScreen from "@/assets/app-screens/home.png.asset.json";
import serviceScreen from "@/assets/app-screens/services-home.png.asset.json";
import messageScreen from "@/assets/app-screens/messages-list.png.asset.json";
import sellerScreen from "@/assets/app-screens/seller-dashboard.png.asset.json";

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
  { icon: ShieldCheck, title: "Built for trust", body: "Verified sellers, protected payments and clear delivery updates." },
  { icon: MessageCircle, title: "Made to connect", body: "Talk with sellers and service providers from inside the app." },
  { icon: BriefcaseBusiness, title: "Open to sellers", body: "Create a storefront, offer services and manage your business." },
];

function LandingPage() {
  return (
    <div>
      <section className="overflow-hidden brand-soft">
        <div className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-10 lg:px-8 lg:py-16">
          <div className="order-2 lg:order-1">
            <span className="text-sm font-bold uppercase text-brand-green">The Afro Mart app</span>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-bold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              African commerce. <span className="text-brand-green">One app.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Discover trusted stores, book local services, speak directly with sellers, and follow every order from one place.
            </p>
            <StoreBadges className="mt-8" />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/guest"><Button variant="outline" size="lg"><UserRound className="h-4 w-4" /> Preview as guest</Button></Link>
              <Link to="/sell/start"><Button variant="ghost" size="lg"><Store className="h-4 w-4" /> Become a seller <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4 text-brand-gold" /> Explore without an account. Account actions stay locked.</div>
          </div>
          <div id="app-preview" className="relative order-1 flex min-h-[320px] items-center justify-center py-2 sm:min-h-[560px] lg:order-2 lg:min-h-[650px] lg:py-4">
            <AppScreen src={homeScreen.url} alt="Afro Mart mobile app home screen" priority className="relative z-20 w-[150px] sm:w-[250px] lg:w-[292px]" />
            <AppScreen src={serviceScreen.url} alt="Afro Mart services screen" className="absolute left-0 top-24 hidden w-[220px] -rotate-6 opacity-90 sm:block lg:left-4" />
            <AppScreen src={messageScreen.url} alt="Afro Mart messages screen" className="absolute bottom-10 right-0 hidden w-[210px] rotate-6 opacity-90 sm:block lg:right-3" />
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {capabilities.map((item) => <article key={item.title} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gold/20 text-brand-green"><item.icon className="h-5 w-5" /></span><div><h2 className="font-heading text-lg font-bold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p></div></article>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="border-l-4 border-brand-gold bg-secondary/50 p-8">
          <UserRound className="h-7 w-7 text-brand-green" /><p className="mt-5 text-sm font-semibold text-brand-terracotta">FOR VISITORS</p>
          <h2 className="mt-2 font-heading text-3xl font-bold">Try the app without signing up.</h2>
          <p className="mt-3 text-muted-foreground">Explore discovery, stores, services and details. Create an account only when you want to save, chat or order.</p>
          <Link to="/guest" className="mt-7 inline-block"><Button>Enter guest mode <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="bg-primary p-8 text-primary-foreground">
          <BriefcaseBusiness className="h-7 w-7 text-brand-gold" /><p className="mt-5 text-sm font-semibold text-primary-foreground/70">FOR SELLERS</p>
          <h2 className="mt-2 font-heading text-3xl font-bold">Start with who you are and what you offer.</h2>
          <p className="mt-3 text-primary-foreground/75">Choose products or services, create your account and continue into verification and store setup.</p>
          <Link to="/sell/start" className="mt-7 inline-block"><Button variant="secondary">Start seller setup <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      <section className="overflow-hidden border-t bg-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div><span className="flex items-center gap-2 text-sm font-semibold text-brand-green"><Headphones className="h-4 w-4" /> Help when you need it</span><h2 className="mt-3 font-heading text-3xl font-bold">Support is part of the experience.</h2><p className="mt-3 text-muted-foreground">Find answers, start a live chat, or report an issue through the support centre.</p><Link to="/support" className="mt-6 inline-block"><Button>Contact support <ArrowRight className="h-4 w-4" /></Button></Link></div>
          <div className="flex justify-center"><AppScreen src={sellerScreen.url} alt="Afro Mart seller dashboard" className="w-full max-w-xl" /></div>
        </div>
      </section>
    </div>
  );
}