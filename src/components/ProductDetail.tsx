import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { productOptions } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, Clock, Loader2, MapPin, MessageCircle, Package, ShoppingBag, Star, Store, Truck } from "lucide-react";
import fallbackAsset from "@/assets/cat-crafts.jpg";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { startConversation } from "@/lib/chat.functions";
import { sellerLabel, sellerLocation } from "@/components/ProductCard";

export function ProductDetail() {
  const { slug } = useParams({ from: "/products/$slug" });
  const { data: product, isLoading } = useSuspenseQuery(productOptions(slug));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const openChat = useServerFn(startConversation);

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

  const fallbackImage = { url: fallbackAsset, alt_text: product.name };
  const images = product.product_images?.length ? product.product_images : [fallbackImage];
  const selectedImage = images[Math.min(selectedIndex, images.length - 1)] ?? fallbackImage;
  const store = product.stores;
  const location = sellerLocation(store);
  const inStock = (product.inventory_count ?? 0) > 0;

  const startChat = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/products/${product.slug}` } });
      return;
    }
    if (!store?.id) {
      toast.error("This product has no seller attached yet.");
      return;
    }
    const body = message.trim() || `Hello, I have a question about ${product.name}.`;
    setSending(true);
    try {
      const result = await openChat({
        data: { storeId: store.id, productId: product.id, subject: product.name, message: body },
      });
      navigate({ to: "/messages/$conversationId", params: { conversationId: result.conversationId } });
    } catch {
      toast.error("Could not start the chat. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
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
                    idx === selectedIndex ? "border-accent" : "border-transparent"
                  }`}
                >
                  <SafeImage src={img.url} alt={img.alt_text ?? product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          {product.categories ? (
            <Link to="/products" search={{ categorySlug: product.categories.slug }} className="text-xs font-bold uppercase text-primary">
              {product.categories.name}
            </Link>
          ) : null}
          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <p className="font-heading text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
            {product.compare_at_price ? (
              <p className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</p>
            ) : null}
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${inStock ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {inStock ? `${product.inventory_count} in stock` : "Out of stock"}
            </span>
          </div>

          <section className="mt-6">
            <h2 className="font-heading text-lg font-bold">Product description</h2>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-muted-foreground">
              {product.description ?? "The seller has not added a description for this product yet."}
            </p>
          </section>

          {product.product_variants?.length ? (
            <section className="mt-6">
              <h2 className="font-heading text-lg font-bold">Options</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <li key={variant.id} className="rounded-full border px-3 py-1.5 text-sm">
                    {variant.name}
                    {variant.price ? <span className="ml-1 font-semibold text-primary">{formatPrice(variant.price)}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-6 rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Store className="h-5 w-5 text-primary" />Seller information</h2>
            <p className="mt-3 flex min-w-0 items-center gap-1.5 font-heading font-bold">
              <span className="truncate">{sellerLabel(store)}</span>
              {store?.is_verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified seller" /> : null}
            </p>
            <p className="mt-2 text-sm font-medium">{store?.is_verified ? "Verified store" : "Not verified by Afromart"}</p>
            {store?.description && <p className="mt-2 text-sm text-muted-foreground">{store.description}</p>}
            <dl className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {location ? (
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{location}</span></div>
              ) : null}
              {store?.response_time ? (
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" />Replies {store.response_time}</div>
              ) : null}
              {store?.rating ? (
                <div className="flex items-center gap-2"><Star className="h-4 w-4 shrink-0 text-accent" />{Number(store.rating).toFixed(1)} seller rating</div>
              ) : null}
              {store?.total_sales ? (
                <div className="flex items-center gap-2"><Package className="h-4 w-4 shrink-0" />{store.total_sales} orders completed</div>
              ) : null}
            </dl>
            {store?.slug ? (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/stores/$slug" params={{ slug: store.slug }}>View business profile</Link>
              </Button>
            ) : null}
          </section>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="gap-2"
              disabled={!inStock}
              onClick={() => addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, imageUrl: selectedImage.url })}
            >
              <ShoppingBag className="h-4 w-4" />Add to cart
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setChatOpen((open) => !open)}>
              <MessageCircle className="h-4 w-4" />Chat with seller
            </Button>
          </div>

          {chatOpen ? (
            <div className="mt-4 rounded-xl border bg-secondary/40 p-4">
              <p className="text-sm font-semibold">Message {sellerLabel(store)}</p>
              <Textarea
                className="mt-2 bg-background"
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`Hello, is ${product.name} available?`}
                aria-label="Message to seller"
              />
              <Button className="mt-3 gap-2" onClick={startChat} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                Send message
              </Button>
            </div>
          ) : null}

          <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Verified sellers, tracked delivery and secure payment inside Afromart.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
