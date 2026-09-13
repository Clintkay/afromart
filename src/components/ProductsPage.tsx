import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsOptions } from "@/lib/queries";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data: products, isLoading } = useSuspenseQuery(
    productsOptions({
      ...(appliedSearch ? { search: appliedSearch } : {}),
    }),
  );

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
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">Explore Afro Mart</h1>
      <p className="mt-2 text-muted-foreground">
        Browse listings as a guest. Sign in is only needed to save, message or order.
      </p>

      <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:flex-row lg:gap-6">
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

          <p className="mt-4 text-xs leading-5 text-muted-foreground">Search across products, stores and services. Guest access stays open.</p>
        </aside>

        <div className="flex-1">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
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
