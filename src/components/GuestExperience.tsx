import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Grid2X2, Home, LockKeyhole, MessageCircle, Store, UserRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppScreen } from "@/components/AppScreen";
import homeScreen from "@/assets/app-screens/home.png.asset.json";
import categoriesScreen from "@/assets/app-screens/categories.png.asset.json";
import servicesScreen from "@/assets/app-screens/services-home.png.asset.json";
import storeScreen from "@/assets/app-screens/product-detail.png.asset.json";
import messagesScreen from "@/assets/app-screens/messages-list.png.asset.json";

const tabs = [
  { id: "discover", label: "Home", icon: Home, screen: homeScreen.url },
  { id: "categories", label: "Categories", icon: Grid2X2, screen: categoriesScreen.url },
  { id: "services", label: "Services", icon: Wrench, screen: servicesScreen.url },
  { id: "stores", label: "Stores", icon: Store, screen: storeScreen.url },
  { id: "messages", label: "Messages", icon: MessageCircle, screen: messagesScreen.url, gated: true },
] as const;

export function GuestExperience() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("discover");
  const [gateOpen, setGateOpen] = useState(false);
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const selectTab = (tab: (typeof tabs)[number]) => {
    if ("gated" in tab && tab.gated) {
      setGateOpen(true);
      return;
    }
    setActiveTab(tab.id);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] brand-soft px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <section className="lg:sticky lg:top-28">
          <span className="text-sm font-bold uppercase text-brand-green">Guest preview</span>
          <h1 className="mt-4 max-w-xl font-heading text-4xl font-bold text-foreground sm:text-5xl">Step inside the real Afro Mart app.</h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">Choose a screen to explore. You can browse freely; messaging, saving, booking and ordering need an account.</p>
          <nav className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Guest app preview screens">
            {tabs.map((tab) => <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} className="justify-start" onClick={() => selectTab(tab)}><tab.icon className="h-4 w-4" />{tab.label}</Button>)}
          </nav>
          <Button variant="ghost" className="mt-5" onClick={() => setGateOpen(true)}><LockKeyhole className="h-4 w-4" /> Try an account action</Button>
        </section>

        <section className="flex justify-center" aria-live="polite">
          <AppScreen src={active.screen} alt={`Afro Mart ${active.label} app screen`} priority className="w-full max-w-[360px]" />
        </section>
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