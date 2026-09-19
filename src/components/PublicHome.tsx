import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Handshake,
  Headphones,
  Languages,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreBadges } from "@/components/StoreBadges";
import communityImage from "@/assets/onboarding/afromart-community.png.asset.json";
import storeImage from "@/assets/marketplace/store-banner.jpg.asset.json";
import tailoringImage from "@/assets/marketplace/svc-tailoring.jpg.asset.json";
import logisticsImage from "@/assets/marketplace/svc-dispatch.jpg.asset.json";
import repairsImage from "@/assets/marketplace/svc-repair.jpg.asset.json";
import cateringImage from "@/assets/marketplace/svc-catering.jpg.asset.json";
import homeScreen from "@/assets/app-screens/home.png.asset.json";
import servicesScreen from "@/assets/app-screens/services-home.png.asset.json";
import messagesScreen from "@/assets/app-screens/messages-list.png.asset.json";
import fashionImage from "@/assets/marketplace/cat-fashion.jpg.asset.json";
import craftsImage from "@/assets/marketplace/handwoven-basket.jpg.asset.json";
import sellerSetupScreen from "@/assets/app-screens/storefront-setup.png.asset.json";

const possibilities = [
  { icon: Search, title: "Discover products", body: "Explore goods from independent sellers and established African businesses in the mobile app." },
  { icon: Wrench, title: "Find services", body: "Find tailors, logistics teams, repair specialists, freelancers and other local professionals." },
  { icon: MessageCircle, title: "Connect directly", body: "Speak with sellers and service providers, ask questions and agree the details in one place." },
  { icon: Building2, title: "Discover businesses", body: "Meet trusted stores and service providers across African cities and communities." },
];

const services = [
  { title: "Tailoring", body: "Bespoke clothing and alterations", image: tailoringImage.url },
  { title: "Logistics", body: "Local and interstate delivery", image: logisticsImage.url },
  { title: "Repairs", body: "Device and household repairs", image: repairsImage.url },
  { title: "Catering", body: "Event and everyday food service", image: cateringImage.url },
];

const trust = [
  { icon: BadgeCheck, title: "Verified sellers", body: "Business verification helps people identify approved sellers and providers." },
  { icon: ShieldCheck, title: "Secure marketplace", body: "Payments and transaction safeguards are handled inside the Afromart platform." },
  { icon: Star, title: "Ratings and reviews", body: "Community feedback supports informed decisions and accountable service." },
  { icon: Headphones, title: "Buyer support", body: "Integrated help, issue reporting and human escalation when it is needed." },
  { icon: Handshake, title: "Dispute handling", body: "Documented processes support fair resolution between marketplace participants." },
  { icon: Globe2, title: "Cross-border reach", body: "A localized foundation designed for commerce across African markets." },
];

const steps = [
  { number: "01", title: "Discover", body: "Explore businesses, products and services across Africa." },
  { number: "02", title: "Connect", body: "Talk directly with sellers and service providers." },
  { number: "03", title: "Continue in the app", body: "Use the mobile app for the complete marketplace experience." },
  { number: "04", title: "Grow", body: "Build a trusted business presence and reach new customers." },
];

const languages = ["English", "Français", "العربية", "Português", "Kiswahili", "Hausa", "Yorùbá", "isiZulu", "አማርኛ", "Igbo"];

export function PublicHome() {
  return (
    <div className="bg-background text-foreground">
      <section className="brand-soft border-b">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,.9fr)_minmax(30rem,1.1fr)] lg:px-8 lg:py-20">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-brand-gold">Products · services · opportunities</p>
            <h1 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-[1.05] text-primary sm:text-6xl">Everything Africa.<br />One Marketplace.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Afromart connects people with African products, services, businesses and opportunities through one trusted mobile marketplace.</p>
            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Button asChild size="lg"><Link to="/download"><Smartphone className="h-4 w-4" />Download the App</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/business"><Store className="h-4 w-4" />Become a Seller</Link></Button>
            </div>
            <p className="mt-5 text-xs font-semibold text-muted-foreground">Discover locally · connect across borders · grow with confidence</p>
          </div>
          <div className="relative min-w-0">
            <img src={storeImage.url} alt="An African business owner serving customers in her store" className="aspect-[1.35/1] w-full rounded-lg object-cover" />
            <div className="absolute bottom-4 left-4 max-w-56 rounded-md bg-card p-4 shadow-lg sm:bottom-6 sm:left-6">
              <p className="text-[10px] font-bold uppercase text-brand-gold">Made across Africa</p>
              <p className="mt-1 font-heading text-sm font-bold">Business, culture and opportunity in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase text-brand-gold">About Afromart</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">African commerce, connected.</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Afromart is a Pan-African digital marketplace built for buyers, sellers and service providers. It brings local discovery, direct communication, secure transactions and cross-border opportunity into one mobile experience.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {possibilities.map((item) => <article key={item.title} className="border-t-2 border-primary bg-card p-5 shadow-sm"><item.icon className="h-6 w-6 text-primary" /><h3 className="mt-4 font-heading text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p></article>)}
        </div>
      </section>

      <section id="join" className="border-y bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase text-brand-gold">Join Afromart</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Create your account here, in minutes.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Set up your Afromart account and your seller storefront right here on the web — no app required. Everything you create stays in sync with the Afromart marketplace.</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article className="rounded-lg border bg-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><UserPlus className="h-5 w-5" /></span>
              <h3 className="mt-4 font-heading text-lg font-bold">1. Create your free account</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign up with your email or Google, confirm your code and you are in.</p>
              <Button asChild className="mt-5 w-full"><Link to="/auth" search={{ redirect: "/seller" }}>Create account</Link></Button>
            </article>
            <article className="rounded-lg border bg-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><Store className="h-5 w-5" /></span>
              <h3 className="mt-4 font-heading text-lg font-bold">2. Set up your store profile</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Add your business name, location, reply time and your story, then request verification.</p>
              <Button asChild variant="outline" className="mt-5 w-full"><Link to="/sell/start">Set up my store</Link></Button>
            </article>
            <article className="rounded-lg border bg-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><BriefcaseBusiness className="h-5 w-5" /></span>
              <h3 className="mt-4 font-heading text-lg font-bold">3. List products and services</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Add products with photos, prices and stock, then manage orders and earnings from your dashboard.</p>
              <Button asChild variant="outline" className="mt-5 w-full"><Link to="/seller">Open seller dashboard</Link></Button>
            </article>
          </div>
          <div className="mt-8 grid items-center gap-8 rounded-lg border bg-card p-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h3 className="font-heading text-xl font-bold">Prefer to look around first?</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Browse the Afromart marketplace in your browser while the mobile apps are being released.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild><Link to="/home">Browse the marketplace</Link></Button>
                <Button asChild variant="outline"><Link to="/guest">Look around as a guest</Link></Button>
              </div>
            </div>
            <img src={sellerSetupScreen.url} alt="Afromart store setup screen" className="mx-auto w-40 rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase text-accent">Services marketplace</p>
          <div className="mt-2 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]"><div><h2 className="font-heading text-3xl font-bold sm:text-4xl">Find skilled services, close to you.</h2><p className="mt-3 max-w-2xl text-primary-foreground/75">Discover local professionals and continue the conversation inside Afromart.</p></div><Button asChild variant="secondary"><Link to="/services">Explore Services <ArrowRight className="h-4 w-4" /></Link></Button></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => <article key={service.title} className="overflow-hidden rounded-md bg-card text-card-foreground"><img src={service.image} alt={`${service.title} service in Africa`} className="aspect-[1.45/1] w-full object-cover" /><div className="p-4"><h3 className="font-heading font-bold">{service.title}</h3><p className="mt-1 text-sm text-muted-foreground">{service.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <img src={communityImage.url} alt="African business owners working together" className="aspect-[1.2/1] w-full rounded-lg object-cover" />
        <div>
          <p className="text-xs font-bold uppercase text-brand-gold">Grow your business</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Your business. A continent of customers.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Create a professional business profile, present your products or services, verify your identity and manage your Afromart presence from the web.</p>
          <ul className="mt-6 space-y-3 text-sm"><li className="flex gap-2"><BadgeCheck className="h-5 w-5 text-primary" />Create your verified seller profile</li><li className="flex gap-2"><BriefcaseBusiness className="h-5 w-5 text-primary" />Add products and services</li><li className="flex gap-2"><Globe2 className="h-5 w-5 text-primary" />Reach customers across African markets</li></ul>
          <Button asChild className="mt-7"><Link to="/business">Create Your Business Profile</Link></Button>
        </div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase text-brand-gold">Built for trusted commerce</p><h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Trade with greater confidence.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{trust.map((item) => <article key={item.title} className="rounded-md border bg-card p-5"><span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><item.icon className="h-5 w-5" /></span><h3 className="mt-4 font-heading font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase text-brand-gold">Simple from start to finish</p><h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">How Afromart works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <article key={step.number} className="border-l-2 border-accent bg-card p-5 shadow-sm"><span className="text-xs font-bold text-brand-gold">{step.number}</span><h3 className="mt-3 font-heading text-lg font-bold text-primary">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p></article>)}</div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <img src={craftsImage.url} alt="Handwoven African crafts from local makers" className="aspect-[1.35/1] w-full rounded-lg object-cover" />
          <div><p className="text-xs font-bold uppercase text-brand-gold">Local discovery, regional reach</p><h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Commerce that speaks your language.</h2><p className="mt-4 leading-7 text-muted-foreground">Afromart is designed for practical discovery and communication across African markets, with ten launch languages supporting a more inclusive experience.</p><div className="mt-6 flex flex-wrap gap-2">{languages.map((language) => <span key={language} className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold">{language}</span>)}</div></div>
        </div>
      </section>

      <section id="app-preview" className="overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,.8fr)_minmax(28rem,1.2fr)] lg:px-8 lg:py-20">
          <div><p className="text-xs font-bold uppercase text-accent">The full marketplace experience</p><h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Afromart lives in your pocket.</h2><p className="mt-4 max-w-xl leading-7 text-primary-foreground/75">Browse listings, connect with sellers, request services and manage marketplace activity in the Afromart mobile app.</p><StoreBadges className="mt-7" /></div>
          <div className="grid grid-cols-3 items-end gap-3 sm:gap-5"><img src={servicesScreen.url} alt="Afromart services app screen" className="w-full rounded-lg shadow-xl" /><img src={homeScreen.url} alt="Afromart marketplace app screen" className="w-full rounded-lg shadow-xl" /><img src={messagesScreen.url} alt="Afromart messaging app screen" className="w-full rounded-lg shadow-xl" /></div>
        </div>
      </section>
    </div>
  );
}