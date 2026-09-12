import { Link } from "@tanstack/react-router";
import { Plus, ShoppingBag } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/lib/products.types";
import fallbackImage from "@/assets/cat-crafts.jpg";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: ProductWithRelations;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl = product.product_images?.[0]?.url ?? fallbackImage;
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
      <CardContent className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <h3 className="font-heading text-base font-semibold leading-tight text-foreground hover:text-brand-green">
            {product.name}
          </h3>
        </Link>
        {!compact ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description ?? ""}</p> : null}
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pt-3">
          <p className="truncate font-heading font-bold text-primary">{formatPrice(product.price)}</p>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, imageUrl })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      {!compact ? <CardFooter className="p-4 pt-0">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="w-full">
          <Button variant="outline" className="w-full gap-2">
            View product
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter> : null}
    </Card>
  );
}
