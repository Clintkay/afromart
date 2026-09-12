import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Heart, Home, LockKeyhole, MessageCircle, Search, Store, UserRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import foodImage from "@/assets/cat-food.jpg";
import fabricImage from "@/assets/cat-fabric.jpg";
import craftImage from "@/assets/cat-crafts.jpg";
import serviceImage from "@/assets/cat-services.jpg";

const tabs = [
  { id: "discover", label: "Discover", icon: Home },
  { id: "stores", label: "Stores", icon: Store },
  { id: "services", label: "Services", icon: Wrench },
] as const;

const content = {
  discover: [
    { title: "Abeni Foods", subtitle: "Lagos · Pantry essentials", image: foodImage },
    { title: "Kente House", subtitle: "Accra · Textiles & design", image: fabricImage },
  ],
  stores: [
    { title: "Bolga Makers", subtitle: "Verified craft collective", image: craftImage },
    { title: "Abeni Foods", subtitle: "Family-run since 1998", image: foodImage },
  ],
  services: [
    { title: "Tailoring near you", subtitle: "Fittings, alterations & custom work", image: serviceImage },
    { title: "Event catering", subtitle: "Menus for every gathering", image: foodImage },
  ],
};

export function GuestExperience() {
  const [activeTab, setActiveTab] = useState<keyof typeof content>("discover");
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <span className="text-sm font-semibold text-brand-terracotta">Guest mode</span>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Experience Afro Mart before you create an account.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Search, open stores, explore services and view details freely. We only ask you to sign in when you want to
            save, message or order.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {content[activeTab].map((item) => (
              <article key={item.title} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <h2 className="font-heading text-lg font-bold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                  <Button variant="outline" className="mt-5 w-full" onClick={() => setGateOpen(true)}>
                    <Heart className="h-4 w-4" /> Save for later
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-foreground bg-card shadow-xl">
            <div className="flex items-center justify-between px-5 pb-3 pt-7">
              <Logo variant="horizontal" className="h-7" />
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="px-5 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search Afro Mart" className="bg-secondary pl-9" />
              </div>
            </div>
            <div className="min-h-96 bg-secondary/60 p-5">
              <p className="text-xs font-semibold uppercase text-brand-green">Explore freely</p>
              <h2 className="mt-2 font-heading text-2xl font-bold">{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
              <div className="mt-5 space-y-3">
                {content[activeTab].map((item) => (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setGateOpen(true)}
                    className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left"
                  >
                    <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <span>
                      <span className="block text-sm font-bold">{item.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">View details</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <nav className="grid grid-cols-3 border-t bg-card p-2" aria-label="Guest app preview">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold ${
                    activeTab === tab.id ? "bg-brand-green/10 text-brand-green" : "text-muted-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {gateOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-card p-7 shadow-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-green">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-heading text-2xl font-bold">You can keep exploring</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Saving, messaging and ordering need an account. Browsing stays open to everyone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setGateOpen(false)}>Keep browsing</Button>
              <Link to="/auth" search={{ redirect: "/account" }} className="flex-1">
                <Button className="w-full"><UserRound className="h-4 w-4" /> Create account</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}