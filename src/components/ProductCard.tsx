import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/lib/products.types";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.product_images?.[0]?.url ?? "https://placehold.co/400x400?text=Afro+Mart";
  const imageAlt = product.product_images?.[0]?.alt_text ?? product.name;

  return (
    <Card className="group flex flex-col overflow-hidden border bg-card transition-shadow hover:shadow-md">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-muted">
        <SafeImage
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        {product.categories ? (
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
            {product.categories.name}
          </span>
        ) : null}
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-1 font-heading text-base font-semibold leading-tight text-foreground hover:text-brand-green">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description ?? ""}</p>
        <p className="mt-auto pt-4 font-heading font-bold text-brand-green">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="w-full">
          <Button variant="outline" className="w-full gap-2">
            Take a look
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
