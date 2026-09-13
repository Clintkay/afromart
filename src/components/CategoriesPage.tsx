import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Grid2X2 } from "lucide-react";
import { categoriesOptions, productsOptions } from "@/lib/queries";

export function CategoriesPage() {
  const { data: categories } = useSuspenseQuery(categoriesOptions);
  const { data: products } = useSuspenseQuery(productsOptions({}));

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase text-primary">Shop by category</p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Find exactly what you need</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Explore authentic products from trusted African sellers.</p>
      </header>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {categories.map((category, index) => {
          const count = products.filter((product) => product.category_id === category.id).length;
          const tones = ["bg-brand-gold/15", "bg-brand-leaf/15", "bg-brand-coral/15", "bg-brand-indigo/10"];
          return (
            <Link
              key={category.id}
              to="/products"
              search={{ categorySlug: category.slug }}
              className="group grid min-h-36 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border bg-card p-5 transition hover:border-primary/35 hover:shadow-md"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-lg text-primary ${tones[index % tones.length] ?? "bg-secondary"}`}>
                <Grid2X2 className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-lg font-bold">{category.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{category.description ?? `${count} marketplace listings`}</span>
              </span>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}