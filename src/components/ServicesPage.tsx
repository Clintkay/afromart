import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BriefcaseBusiness, Camera, Code2, Languages, Loader2, Paintbrush, Search, Send, Star, Video, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { serviceRequestsOptions } from "@/lib/queries";
import { createServiceRequest } from "@/lib/services.functions";
import serviceImage from "@/assets/cat-services.jpg";

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
  const queryClient = useQueryClient();
  const request = useServerFn(createServiceRequest);
  const { data: requests } = useQuery({ ...serviceRequestsOptions, enabled: Boolean(user) });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ title: string; category: string } | null>(null);
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);

  const visible = featured.filter((service) => {
    const matchesSearch = search.trim().length < 2 || `${service.title} ${service.category} ${service.seller}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || service.category.toLowerCase().includes(activeCategory.split(" ")[0]!.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    try {
      await request({
        data: {
          serviceTitle: selected.title,
          category: selected.category,
          details: details.trim(),
          ...(budget.trim() ? { budget: Math.round(Number(budget) * 100) } : {}),
        },
      });
      setSelected(null);
      setDetails("");
      setBudget("");
      await queryClient.invalidateQueries({ queryKey: serviceRequestsOptions.queryKey });
      toast.success("Request sent. Matching professionals will reply in Messages.");
    } catch {
      toast.error("Could not send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <section className="rounded-lg bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase text-primary-foreground/70">Services marketplace</p>
        <h1 className="mt-2 max-w-2xl font-heading text-3xl font-bold sm:text-5xl">Find African talent for your next project.</h1>
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-13 bg-card pl-12 text-foreground"
            placeholder="What service are you looking for?"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search services"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-2xl font-bold">Explore services</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {serviceCategories.map(({ name, icon: Icon, tone }) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveCategory(activeCategory === name ? null : name)}
              className={`rounded-lg border bg-card p-4 text-left transition hover:border-primary/35 ${activeCategory === name ? "border-primary bg-primary/5" : ""}`}
            >
              <span className={`grid h-10 w-10 place-items-center rounded-lg text-primary ${tone}`}><Icon className="h-5 w-5" /></span>
              <span className="mt-4 block text-sm font-bold">{name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Top professionals</p>
            <h2 className="mt-1 font-heading text-2xl font-bold">Popular services</h2>
          </div>
          {activeCategory ? <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>Clear filter</Button> : null}
        </div>
        {visible.length === 0 ? (
          <p className="mt-5 rounded-xl border bg-card p-6 text-sm text-muted-foreground">No services match that search yet. Try another category.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service) => (
              <article key={service.title} className="overflow-hidden rounded-lg border bg-card">
                <img src={serviceImage} alt={`${service.category} service by ${service.seller}`} className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase text-primary">{service.category}</p>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{service.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{service.seller}</span>
                    <span className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 fill-accent text-accent" />{service.rating}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span><span className="text-xs text-muted-foreground">Starting at</span><strong className="block">{service.price}</strong></span>
                    {user ? (
                      <Button size="sm" onClick={() => setSelected({ title: service.title, category: service.category })}>Continue</Button>
                    ) : (
                      <Button asChild size="sm"><Link to="/auth" search={{ redirect: "/services" }}>Continue</Link></Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected ? (
        <section className="mt-9 rounded-xl border bg-card p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-primary">{selected.category}</p>
              <h2 className="mt-1 font-heading text-2xl font-bold">Request: {selected.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell the professional what you need. Replies arrive in Messages and your inbox.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close request form" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="service-details" className="text-sm font-semibold">What do you need?</label>
              <Textarea id="service-details" required minLength={5} rows={4} value={details} onChange={(event) => setDetails(event.target.value)} className="mt-1.5" placeholder="Scope, deadline, and anything the professional should know" />
            </div>
            <div className="sm:max-w-xs">
              <label htmlFor="service-budget" className="text-sm font-semibold">Budget (optional)</label>
              <Input id="service-budget" inputMode="decimal" value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-1.5" placeholder="50000" />
            </div>
            <Button type="submit" disabled={busy} className="gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send request
            </Button>
          </form>
        </section>
      ) : null}

      {user && (requests ?? []).length > 0 ? (
        <section className="mt-9">
          <h2 className="font-heading text-2xl font-bold">Your service requests</h2>
          <ul className="mt-4 space-y-3">
            {(requests ?? []).map((item) => (
              <li key={item.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate font-heading font-bold">{item.service_title}</p>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase text-primary">{item.status}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.details}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
