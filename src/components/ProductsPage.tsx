import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { categoriesOptions, productsOptions } from "@/lib/queries";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Sort = "newest" | "price-asc" | "price-desc" | "rating";

export function ProductsPage() {
  const search = useSearch({ from: "/products" });
  const navigate = useNavigate();
  const { data: categories } = useSuspenseQuery(categoriesOptions);
  const { data: products } = useSuspenseQuery(
    productsOptions({
      ...(search.search ? { search: search.search } : {}),
      ...(search.categorySlug ? { categorySlug: search.categorySlug } : {}),
    }),
  );

  const [term, setTerm] = useState(search.search ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");

  const activeCategory = categories.find((category) => category.slug === search.categorySlug);

  const visible = useMemo(() => {
    const min = minPrice ? Number(minPrice) * 100 : null;
    const max = maxPrice ? Number(maxPrice) * 100 : null;
    const list = products.filter((product) => {
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;
      if (verifiedOnly && !product.stores?.is_verified) return false;
      if (inStockOnly && (product.inventory_count ?? 0) <= 0) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return Number(b.stores?.rating ?? 0) - Number(a.stores?.rating ?? 0);
      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    });
  }, [products, minPrice, maxPrice, verifiedOnly, inStockOnly, sort]);

  const setCategory = (slug?: string) =>
    navigate({ to: "/products", search: { ...(slug ? { categorySlug: slug } : {}), ...(search.search ? { search: search.search } : {}) } });

  const clearAll = () => {
    setTerm("");
    setMinPrice("");
    setMaxPrice("");
    setVerifiedOnly(false);
    setInStockOnly(false);
    setSort("newest");
    navigate({ to: "/products", search: {} });
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">{activeCategory ? activeCategory.name : "Explore Afromart"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {activeCategory?.description ?? "Browse listings from verified African sellers. Sign in to save, message or order."}
      </p>

      <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:flex-row lg:gap-8">
        <aside className="w-full shrink-0 space-y-5 lg:w-64">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ to: "/products", search: { ...(term.trim() ? { search: term.trim() } : {}), ...(search.categorySlug ? { categorySlug: search.categorySlug } : {}) } });
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search in results…" className="pl-9" value={term} onChange={(event) => setTerm(event.target.value)} />
          </form>

          <div className="rounded-xl border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="h-4 w-4 text-primary" />Filters</p>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">Category</p>
              <div className="mt-2 flex flex-wrap gap-2 lg:flex-col">
                <button
                  type="button"
                  onClick={() => setCategory()}
                  className={`rounded-full border px-3 py-1.5 text-left text-sm lg:rounded-lg ${!search.categorySlug ? "border-primary bg-primary/10 font-semibold text-primary" : ""}`}
                >
                  All categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategory(category.slug)}
                    className={`rounded-full border px-3 py-1.5 text-left text-sm lg:rounded-lg ${search.categorySlug === category.slug ? "border-primary bg-primary/10 font-semibold text-primary" : ""}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase text-muted-foreground">Price range</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Input inputMode="numeric" placeholder="Min" value={minPrice} onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ""))} aria-label="Minimum price" />
                <Input inputMode="numeric" placeholder="Max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))} aria-label="Maximum price" />
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
                Verified sellers only
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
                In stock only
              </label>
            </div>

            <div className="mt-5">
              <label htmlFor="sort" className="text-xs font-bold uppercase text-muted-foreground">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Best rated sellers</option>
              </select>
            </div>

            <Button variant="outline" className="mt-5 w-full" onClick={clearAll}>Clear filters</Button>
          </div>
        </aside>

        <div className="flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "product" : "products"}
            {minPrice || maxPrice ? ` · ${formatPrice(Number(minPrice || 0) * 100)} – ${maxPrice ? formatPrice(Number(maxPrice) * 100) : "any"}` : ""}
          </p>
          {visible.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card py-16 text-center">
              <p className="text-muted-foreground">No products match these filters.</p>
              <Button variant="outline" className="mt-4" onClick={clearAll}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
