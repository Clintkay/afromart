import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productOptions } from "@/lib/queries";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, ShoppingCart, Truck } from "lucide-react";

export function ProductDetail() {
  const { slug } = useParams({ from: "/products/$slug" });
  const { data: product, isLoading } = useSuspenseQuery(productOptions(slug));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

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
  const [selectedImage, setSelectedImage] = useState(images[0] ?? fallbackImage);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: selectedImage.url,
      },
      quantity,
    );
  };

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
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted ${
                    selectedImage.url === img.url ? "border-primary" : "border-transparent"
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
            <p className="text-sm font-medium text-muted-foreground">{product.categories.name}</p>
          ) : null}
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-foreground">{formatPrice(product.price)}</p>
          {product.compare_at_price ? (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </p>
          ) : null}

          <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="px-3 py-2 text-foreground hover:bg-secondary disabled:opacity-50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                className="px-3 py-2 text-foreground hover:bg-secondary"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" className="gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
          </div>

          <div className="mt-8 rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
