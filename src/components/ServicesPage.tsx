import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Clock, Loader2, MapPin, MessageCircle, Search, Send, Star, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SafeImage } from "@/components/SafeImage";
import { useAuth } from "@/lib/auth-context";
import { serviceRequestsOptions, conversationsOptions } from "@/lib/queries";
import { serviceListingsOptions, type ServiceListing } from "@/lib/service-listings";
import { createServiceRequest } from "@/lib/services.functions";
import { startConversation } from "@/lib/chat.functions";
import { formatPrice } from "@/lib/utils";
import serviceFallback from "@/assets/cat-services.jpg";

export function ServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const request = useServerFn(createServiceRequest);
  const openChat = useServerFn(startConversation);
  const { data: listings, isLoading } = useQuery(serviceListingsOptions);
  const { data: requests } = useQuery({ ...serviceRequestsOptions, enabled: Boolean(user) });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<ServiceListing | null>(null);
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatting, setChatting] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set((listings ?? []).map((item) => item.category).filter(Boolean) as string[])),
    [listings],
  );

  const visible = (listings ?? []).filter((service) => {
    const haystack = `${service.title} ${service.category ?? ""} ${service.description ?? ""} ${service.stores?.business_name ?? service.stores?.name ?? ""} ${service.city ?? ""}`.toLowerCase();
    const matchesSearch = search.trim().length < 2 || haystack.includes(search.trim().toLowerCase());
    const matchesCategory = !activeCategory || service.category === activeCategory;
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
          details: details.trim(),
          ...(selected.category ? { category: selected.category } : {}),
          ...(selected.country ? { country: selected.country } : {}),
          ...(budget.trim() ? { budget: Math.round(Number(budget) * 100) } : {}),
        },
      });
      setSelected(null);
      setDetails("");
      setBudget("");
      await queryClient.invalidateQueries({ queryKey: serviceRequestsOptions.queryKey });
      toast.success("Request sent. The provider will reply in Messages.");
    } catch {
      toast.error("Could not send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const contactProvider = async (service: ServiceListing) => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/services" } });
      return;
    }
    setChatting(service.id);
    try {
      const result = await openChat({
        data: {
          storeId: service.store_id,
          subject: service.title,
          message: `Hello, I am interested in your service "${service.title}". Can you share more details?`,
        },
      });
      await queryClient.invalidateQueries({ queryKey: conversationsOptions.queryKey });
      navigate({ to: "/messages/$conversationId", params: { conversationId: result.conversationId } });
    } catch {
      toast.error("Could not open the chat. Please try again.");
    } finally {
      setChatting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <section className="rounded-lg bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase text-primary-foreground/70">Services marketplace</p>
        <h1 className="mt-2 max-w-2xl font-heading text-3xl font-bold sm:text-5xl">Hire trusted African professionals.</h1>
        <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">Tailors, dispatch riders, caterers and technicians — message them directly and agree the work before you pay.</p>
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-13 bg-card pl-12 text-foreground"
            placeholder="Search tailoring, delivery, catering, repairs…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search services"
          />
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="mt-7">
          <h2 className="font-heading text-2xl font-bold">Browse by category</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveCategory(activeCategory === name ? null : name)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-primary/40 ${activeCategory === name ? "border-primary bg-primary/10 text-primary" : "bg-card"}`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-9">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Available now</p>
            <h2 className="mt-1 font-heading text-2xl font-bold">{activeCategory ?? "Popular services"}</h2>
          </div>
          {activeCategory ? <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>Clear filter</Button> : null}
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div key={key} className="h-72 animate-pulse rounded-lg border bg-muted/40" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-5 rounded-xl border bg-card p-6 text-sm text-muted-foreground">No services match that search yet. Try another category.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service) => {
              const provider = service.stores?.business_name ?? service.stores?.name ?? "Afromart provider";
              const location = [service.city, service.country].filter(Boolean).join(", ");
              return (
                <article key={service.id} className="flex flex-col overflow-hidden rounded-lg border bg-card">
                  <SafeImage
                    src={service.image_url ?? undefined}
                    fallback={serviceFallback}
                    alt={`${service.title} by ${provider}`}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase text-primary">{service.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{service.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        {provider}
                        {service.stores?.is_verified ? <BadgeCheck className="h-3.5 w-3.5 text-primary" /> : null}
                      </span>
                      {location ? <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{location}</span> : null}
                      {service.delivery_days ? <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{service.delivery_days} day turnaround</span> : null}
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{service.rating ?? "New"} ({service.orders_count ?? 0})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t pt-4">
                      <span>
                        <span className="text-xs text-muted-foreground">Starting at</span>
                        <strong className="block">{formatPrice(service.price_from ?? 0)}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          disabled={chatting === service.id}
                          onClick={() => contactProvider(service)}
                        >
                          {chatting === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                          Chat
                        </Button>
                        {user ? (
                          <Button size="sm" onClick={() => setSelected(service)}>Continue</Button>
                        ) : (
                          <Button asChild size="sm"><Link to="/auth" search={{ redirect: "/services" }}>Continue</Link></Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selected ? (
        <section className="mt-9 rounded-xl border bg-card p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-primary">{selected.category}</p>
              <h2 className="mt-1 font-heading text-2xl font-bold">Request: {selected.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell the provider what you need. Replies arrive in Messages and your inbox.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close request form" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="service-details" className="text-sm font-semibold">What do you need?</label>
              <Textarea id="service-details" required minLength={5} rows={4} value={details} onChange={(event) => setDetails(event.target.value)} className="mt-1.5" placeholder="Scope, deadline, and anything the provider should know" />
            </div>
            <div className="sm:max-w-xs">
              <label htmlFor="service-budget" className="text-sm font-semibold">Budget in naira (optional)</label>
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
