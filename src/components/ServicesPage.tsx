import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, Camera, ChevronRight, Code2, Languages, Paintbrush, Search, Star, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const serviceCategories = [
  { name: "Design & Creative", icon: Paintbrush, tone: "bg-brand-coral/15" },
  { name: "Technology", icon: Code2, tone: "bg-brand-indigo/10" },
  { name: "Photography", icon: Camera, tone: "bg-brand-gold/15" },
  { name: "Video & Animation", icon: Video, tone: "bg-brand-leaf/15" },
  { name: "Translation", icon: Languages, tone: "bg-secondary" },
  { name: "Business", icon: BriefcaseBusiness, tone: "bg-primary/10" },
] as const;

const featured = [
  { title: "Professional brand identity design", seller: "Kemi Creative", rating: "4.9", price: "₦45,000", category: "Design" },
  { title: "Responsive website for your business", seller: "Nairobi Web Studio", rating: "4.8", price: "₦120,000", category: "Technology" },
  { title: "Product photography and editing", seller: "Lens Lagos", rating: "5.0", price: "₦35,000", category: "Photography" },
] as const;

export function ServicesPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <section className="rounded-lg bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase text-primary-foreground/70">Services marketplace</p>
        <h1 className="mt-2 max-w-2xl font-heading text-3xl font-bold sm:text-5xl">Find African talent for your next project.</h1>
        <div className="relative mt-6 max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-13 bg-card pl-12 text-foreground" placeholder="What service are you looking for?" /></div>
      </section>

      <section className="mt-8"><h2 className="font-heading text-2xl font-bold">Explore services</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{serviceCategories.map(({ name, icon: Icon, tone }) => <article key={name} className="rounded-lg border bg-card p-4"><span className={`grid h-10 w-10 place-items-center rounded-lg text-primary ${tone}`}><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-sm font-bold">{name}</h3></article>)}</div></section>

      <section className="mt-9"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase text-primary">Top professionals</p><h2 className="mt-1 font-heading text-2xl font-bold">Popular services</h2></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.map((service) => <article key={service.title} className="overflow-hidden rounded-lg border bg-card"><div className="grid aspect-[16/9] place-items-center bg-secondary"><BriefcaseBusiness className="h-12 w-12 text-primary/35" /></div><div className="p-5"><p className="text-xs font-bold uppercase text-primary">{service.category}</p><h3 className="mt-2 font-heading text-lg font-bold leading-snug">{service.title}</h3><div className="mt-3 flex items-center justify-between text-sm"><span className="text-muted-foreground">{service.seller}</span><span className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 fill-accent text-accent" />{service.rating}</span></div><div className="mt-5 flex items-center justify-between border-t pt-4"><span><span className="text-xs text-muted-foreground">Starting at</span><strong className="block">{service.price}</strong></span>{user ? <Button asChild size="sm"><Link to="/support">Continue <ChevronRight className="h-4 w-4" /></Link></Button> : <Button asChild size="sm"><Link to="/auth" search={{ redirect: "/services" }}>Continue <ChevronRight className="h-4 w-4" /></Link></Button>}</div></div></article>)}</div></section>
    </div>
  );
}