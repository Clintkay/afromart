import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesOptions } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCategories() {
  const { data: categories, isLoading } = useSuspenseQuery(categoriesOptions);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">Shop by category</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category) => (
            <Link key={category.id} to="/products" search={{ categorySlug: category.slug }}>
              <Card className="group relative h-40 overflow-hidden border-0 bg-secondary transition-shadow hover:shadow-md">
                {category.image_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image_url})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                )}
                <CardContent className="relative flex h-full flex-col items-start justify-end p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{category.name}</h3>
                  {category.description ? (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{category.description}</p>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
