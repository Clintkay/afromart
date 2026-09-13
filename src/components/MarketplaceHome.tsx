import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Grid2X2, Search, ShoppingBag, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { categoriesOptions, productsOptions } from "@/lib/queries";

export function MarketplaceHome() {
  const { data: products } = useSuspenseQuery(productsOptions({}));
  const { data: categories } = useSuspenseQuery(categoriesOptions);

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