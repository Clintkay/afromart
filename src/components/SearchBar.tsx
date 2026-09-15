import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, X } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { categoriesOptions, productsOptions } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import fallbackImage from "@/assets/cat-crafts.jpg";

export function SearchBar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const enabled = debounced.length >= 2;
  const { data: results, isFetching } = useQuery({
    ...productsOptions({ search: debounced }),
    enabled,
  });
  const { data: categories } = useQuery(categoriesOptions);

  const categoryMatches = useMemo(() => {
    if (!enabled || !categories) return [];
    return categories.filter((category) => category.name.toLowerCase().includes(debounced.toLowerCase())).slice(0, 3);
  }, [categories, debounced, enabled]);

  const products = (results ?? []).slice(0, 6);

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const value = term.trim();
    if (!value) return;
    setOpen(false);
    navigate({ to: "/products", search: { search: value } });
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full min-w-0 max-w-2xl">
      <form onSubmit={submit} role="search" className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-sm sm:gap-3 sm:px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("Search Afromart")}
          aria-label={t("Search Afromart")}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {isFetching && enabled ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" /> : null}
        {term ? (
          <button type="button" aria-label="Clear search" onClick={() => { setTerm(""); setOpen(false); }} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      {open && enabled ? (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border bg-card p-2 shadow-lg">
          {categoryMatches.length > 0 ? (
            <div className="mb-1">
              <p className="px-2 py-1 text-[11px] font-bold uppercase text-muted-foreground">Categories</p>
              {categoryMatches.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/products", search: { categorySlug: category.slug } });
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold hover:bg-secondary"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  {category.name}
                </button>
              ))}
            </div>
          ) : null}

          <p className="px-2 py-1 text-[11px] font-bold uppercase text-muted-foreground">Products</p>
          {products.length > 0 ? (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/products/$slug", params: { slug: product.slug } });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-secondary"
              >
                <SafeImage
                  src={product.product_images?.[0]?.url ?? fallbackImage}
                  alt={product.name}
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{product.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {product.stores?.business_name ?? product.stores?.name ?? "Afromart seller"}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(product.price)}</span>
              </button>
            ))
          ) : (
            <p className="px-2 py-3 text-sm text-muted-foreground">{isFetching ? "Searching…" : "No matches yet."}</p>
          )}

          <button
            type="button"
            onClick={submit}
            onMouseDown={(event) => event.preventDefault()}
            className="mt-1 w-full rounded-lg bg-secondary px-2 py-2 text-sm font-semibold hover:bg-secondary/70"
          >
            See all results for “{debounced}”
          </button>
        </div>
      ) : null}
    </div>
  );
}
