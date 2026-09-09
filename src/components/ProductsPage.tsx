import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsOptions, categoriesOptions } from "@/lib/queries";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ProductsPage() {
  const { categorySlug } = useSearch({ from: "/products" });
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data: categories } = useSuspenseQuery(categoriesOptions);
  const { data: products, isLoading } = useSuspenseQuery(
    productsOptions({
      ...(categorySlug ? { categorySlug } : {}),
      ...(appliedSearch ? { search: appliedSearch } : {}),
    }),
  );

  const activeCategory = categories?.find((c) => c.slug === categorySlug);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">
        {activeCategory ? activeCategory.name : "All products"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {activeCategory?.description ?? "Explore our curated selection of African goods."}
      </p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="mt-6">
            <h2 className="font-heading text-sm font-semibold">Categories</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <Link
                  to="/products"
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    !categorySlug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  All products
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to="/products"
                    search={{ categorySlug: category.slug }}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      categorySlug === category.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          {products && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card py-16 text-center">
              <p className="text-muted-foreground">No products found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setAppliedSearch("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
