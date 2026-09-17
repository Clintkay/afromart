import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { categoriesOptions, productsOptions } from "@/lib/queries";
import { SafeImage } from "@/components/SafeImage";
import { categoryImage } from "@/lib/category-images";

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

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const count = products.filter((product) => product.category_id === category.id).length;
          return (
            <Link
              key={category.id}
              to="/products"
              search={{ categorySlug: category.slug }}
              className="group overflow-hidden rounded-xl border bg-card transition hover:border-primary/35 hover:shadow-md"
            >
              <span className="block aspect-[16/9] overflow-hidden bg-muted">
                <SafeImage
                  src={category.image_url ?? categoryImage(category.slug, index)}
                  fallback={categoryImage(category.slug, index)}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                <span className="min-w-0">
                  <span className="block font-heading text-lg font-bold">{category.name}</span>
                  <span className="mt-1 block truncate text-sm text-muted-foreground">
                    {category.description ?? `${count} ${count === 1 ? "listing" : "listings"}`}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
