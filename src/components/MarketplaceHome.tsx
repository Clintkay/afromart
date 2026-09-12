import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Grid2X2, Search, ShieldCheck, ShoppingBag, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { categoriesOptions, productsOptions } from "@/lib/queries";
import foodImage from "@/assets/cat-food.jpg";
import beautyImage from "@/assets/cat-beauty.jpg";
import craftsImage from "@/assets/cat-crafts.jpg";

const WELCOME_KEY = "afromart-welcome-complete";

export function MarketplaceHome() {
  const { data: products } = useSuspenseQuery(productsOptions({}));
  const { data: categories } = useSuspenseQuery(categoriesOptions);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setShowWelcome(localStorage.getItem(WELCOME_KEY) !== "true");
  }, []);

  const enterApp = () => {
    localStorage.setItem(WELCOME_KEY, "true");
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-card px-5 py-8 md:min-h-[calc(100vh-5rem)] md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div className="order-2 lg:order-1">
            <Logo variant="full" className="h-12 sm:h-14" />
            <p className="mt-6 text-sm font-semibold uppercase text-primary">Connecting African commerce</p>
            <h1 className="mt-3 max-w-xl font-heading text-4xl font-bold leading-tight sm:text-5xl">Everything African, closer to you.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Discover authentic goods, trusted services, and independent African businesses in one connected marketplace.</p>
            <div className="mt-8 grid gap-3 sm:max-w-md sm:grid-cols-2">
              <Button asChild size="lg" className="h-12"><Link to="/auth" search={{ redirect: "/account" }}>Get started <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" className="h-12" onClick={enterApp}>Continue as guest</Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Guest browsing is open. Sign in when you are ready to buy or message.</p>
          </div>

          <div className="order-1 grid h-[360px] grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-lg bg-secondary p-3 sm:h-[520px] lg:order-2">
            <img src={foodImage} alt="African food and ingredients" className="h-full w-full rounded-md object-cover" />
            <img src={beautyImage} alt="African beauty products" className="row-span-2 h-full w-full rounded-md object-cover" />
            <img src={craftsImage} alt="African artisan crafts" className="h-full w-full rounded-md object-cover" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <section className="relative overflow-hidden rounded-lg bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-accent-foreground"><Sparkles className="h-3.5 w-3.5" />Discover authenticity</span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">Unbox the heart of Africa.</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/75">Shop independent African brands, book local services, and connect directly with trusted sellers.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg"><Link to="/products">Explore marketplace <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" className="border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground shadow-none hover:bg-primary-foreground/15"><Link to="/sell/start"><Store className="h-4 w-4" />Start selling</Link></Button>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full border-[44px] border-accent/20" aria-hidden="true" />
      </section>

      <section className="mt-9">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0"><p className="text-xs font-bold uppercase text-primary">Browse your way</p><h2 className="mt-1 truncate font-heading text-2xl font-bold">Popular categories</h2></div>
          <Button asChild variant="ghost" size="sm"><Link to="/products">See all <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.slice(0, 6).map((category, index) => {
            const Icon = [ShoppingBag, Wrench, Sparkles, Store, Grid2X2, Search][index % 6] ?? Grid2X2;
            return <Link key={category.id} to="/products" search={{ categorySlug: category.slug }} className="flex min-w-24 shrink-0 flex-col items-center gap-2 text-center text-xs font-semibold"><span className="grid h-16 w-16 place-items-center rounded-full border bg-card text-primary shadow-sm transition-transform hover:-translate-y-1"><Icon className="h-6 w-6" /></span>{category.name}</Link>;
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="text-xs font-bold uppercase text-primary">From verified sellers</p><h2 className="mt-1 truncate font-heading text-2xl font-bold">Trending now</h2></div><Button asChild variant="ghost" size="sm"><Link to="/products">View all <ArrowRight className="h-4 w-4" /></Link></Button></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} compact />)}</div>
      </section>
    </div>
  );
}