import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productOptions } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Smartphone, Truck } from "lucide-react";

export function ProductDetail() {
  const { slug } = useParams({ from: "/products/$slug" });
  const { data: product, isLoading } = useSuspenseQuery(productOptions(slug));
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  const fallbackImage = { url: "https://placehold.co/600x600?text=Afro+Mart", alt_text: product.name };
  const images = product.product_images?.length ? product.product_images : [fallbackImage];
  const selectedImage = images[Math.min(selectedIndex, images.length - 1)] ?? fallbackImage;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-muted">
            <SafeImage
              src={selectedImage.url}
              alt={selectedImage.alt_text ?? product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted ${
                    idx === selectedIndex ? "border-brand-gold" : "border-transparent"
                  }`}
                >
                  <SafeImage src={img.url} alt={img.alt_text ?? product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories ? (
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-terracotta">
              {product.categories.name}
            </p>
          ) : null}
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>
          <p className="mt-4 font-heading text-2xl font-bold text-brand-green">{formatPrice(product.price)}</p>
          {product.compare_at_price ? (
            <p className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</p>
          ) : null}

          <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/coming-soon">
              <Button size="lg" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Order in the app
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline">
                Keep browsing
              </Button>
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-brand-cream p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-green" />
              <span>Verified sellers, tracked delivery and secure payment inside the app.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
