import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Boxes, Loader2, MapPin, Package, Plus, RefreshCw, Store, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { myProductsOptions, myStoreOptions, sellerEarningsOptions, sellerOrdersOptions } from "@/lib/queries";
import { saveMyProduct, saveMyStore } from "@/lib/seller-store.functions";
import { addMyRole } from "@/lib/roles.functions";
import { myRolesOptions } from "@/lib/queries";
import { updateSellerOrderStatus, updateSellerPaymentStatus } from "@/lib/seller.functions";
import sellerHero from "@/assets/seller-hero.jpg";

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const paymentStatuses = ["pending", "paid", "refunded"] as const;

export function SellerDashboard() {
  const queryClient = useQueryClient();
  const { data: store, isLoading: storeLoading } = useQuery(myStoreOptions);
  const { data: products } = useQuery({ ...myProductsOptions, enabled: Boolean(store) });
  const { data: earnings } = useQuery({ ...sellerEarningsOptions, enabled: Boolean(store) });
  const {
    data: sellerOrders,
    isFetching: ordersFetching,
    refetch: refetchOrders,
  } = useQuery({ ...sellerOrdersOptions, enabled: Boolean(store), refetchInterval: 15000 });

  const saveStore = useServerFn(saveMyStore);
  const saveProduct = useServerFn(saveMyProduct);
  const updateStatus = useServerFn(updateSellerOrderStatus);
  const updatePayment = useServerFn(updateSellerPaymentStatus);

  const [busy, setBusy] = useState(false);
  const { data: roles } = useQuery(myRolesOptions);
  const claimSellerRole = useServerFn(addMyRole);

  useEffect(() => {
    if (!roles || roles.includes("seller")) return;
    claimSellerRole({ data: { role: "seller" } })
      .then(() => queryClient.invalidateQueries({ queryKey: myRolesOptions.queryKey }))
      .catch(() => undefined);
  }, [roles, claimSellerRole, queryClient]);
  const [storeForm, setStoreForm] = useState({
    name: store?.name ?? "",
    businessName: store?.business_name ?? "",
    description: store?.description ?? "",
    city: store?.city ?? "",
    country: store?.country ?? "Nigeria",
    responseTime: store?.response_time ?? "within 2 hours",
  });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", inventory: "" });

  const submitStore = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await saveStore({
        data: {
          name: storeForm.name.trim(),
          businessName: storeForm.businessName.trim() || undefined,
          description: storeForm.description.trim() || undefined,
          city: storeForm.city.trim() || undefined,
          country: storeForm.country.trim() || undefined,
          responseTime: storeForm.responseTime.trim() || undefined,
        },
      });
      await queryClient.invalidateQueries({ queryKey: myStoreOptions.queryKey });
      toast.success("Store details saved.");
    } catch {
      toast.error("Could not save your store details.");
    } finally {
      setBusy(false);
    }
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    const price = Math.round(Number(productForm.price) * 100);
    const inventory = Number(productForm.inventory || 0);
    if (!price || price < 1) {
      toast.error("Enter a price greater than zero.");
      return;
    }
    setBusy(true);
    try {
      await saveProduct({
        data: {
          name: productForm.name.trim(),
          description: productForm.description.trim() || undefined,
          price,
          inventoryCount: inventory,
        },
      });
      setProductForm({ name: "", description: "", price: "", inventory: "" });
      await queryClient.invalidateQueries({ queryKey: myProductsOptions.queryKey });
      toast.success("Product published.");
    } catch {
      toast.error("Could not publish the product.");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (orderId: string, status: string) => {
    setBusy(true);
    try {
      await updateStatus({ data: { orderId, status } });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sellerOrdersOptions.queryKey }),
        queryClient.invalidateQueries({ queryKey: sellerEarningsOptions.queryKey }),
      ]);
      toast.success(`Order marked ${status}.`);
    } catch {
      toast.error("Could not update the order.");
    } finally {
      setBusy(false);
    }
  };

  const changePayment = async (orderId: string, paymentStatus: string) => {
    setBusy(true);
    try {
      await updatePayment({ data: { orderId, paymentStatus } });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sellerOrdersOptions.queryKey }),
        queryClient.invalidateQueries({ queryKey: sellerEarningsOptions.queryKey }),
      ]);
      toast.success(paymentStatus === "paid" ? "Payment confirmed." : `Payment marked ${paymentStatus}.`);
    } catch {
      toast.error("Could not update the payment.");
    } finally {
      setBusy(false);
    }
  };


  if (storeLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <header className="overflow-hidden rounded-2xl border bg-card">
        <img src={sellerHero} alt="African business owner packing orders" className="h-36 w-full object-cover sm:h-48" />
        <div className="p-5 sm:p-7">
          <p className="text-xs font-bold uppercase text-primary">Seller workspace</p>
          <h1 className="mt-2 flex items-center gap-2 font-heading text-3xl font-bold">
            {store?.name ?? "Set up your store"}
            {store?.is_verified ? <BadgeCheck className="h-6 w-6 text-primary" /> : null}
          </h1>
          {store ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {[store.city, store.country].filter(Boolean).join(", ") || "Location not set"}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Add your business details to open your Afromart storefront.</p>
          )}
        </div>
      </header>

      {store ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Gross sales", value: formatPrice(earnings?.gross ?? 0), icon: Wallet },
            { label: "Paid to date", value: formatPrice(earnings?.paid ?? 0), icon: Wallet },
            { label: "Awaiting payment", value: formatPrice(earnings?.awaitingPayment ?? 0), icon: Wallet },
            { label: "Available payout", value: formatPrice(earnings?.available ?? 0), icon: Wallet },
            { label: "Orders", value: `${earnings?.orders ?? 0} · ${earnings?.delivered ?? 0} delivered`, icon: Package },
            { label: "Listings", value: String(products?.length ?? 0), icon: Boxes },
          ].map((card) => (
            <article key={card.label} className="rounded-xl border bg-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary"><card.icon className="h-5 w-5" /></span>
              <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">{card.label}</p>
              <p className="mt-1 font-heading text-2xl font-bold">{card.value}</p>
            </article>
          ))}
        </section>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold"><Store className="h-5 w-5 text-primary" />Store information</h2>
          <form onSubmit={submitStore} className="mt-4 space-y-3 rounded-xl border bg-card p-5">
            <div>
              <label htmlFor="store-name" className="text-sm font-semibold">Store name</label>
              <Input id="store-name" required value={storeForm.name} onChange={(event) => setStoreForm({ ...storeForm, name: event.target.value })} className="mt-1.5" placeholder="Lagos Fabrics" />
            </div>
            <div>
              <label htmlFor="store-business" className="text-sm font-semibold">Registered business name</label>
              <Input id="store-business" value={storeForm.businessName} onChange={(event) => setStoreForm({ ...storeForm, businessName: event.target.value })} className="mt-1.5" placeholder="Lagos Fabrics Ltd" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="store-city" className="text-sm font-semibold">City</label>
                <Input id="store-city" value={storeForm.city} onChange={(event) => setStoreForm({ ...storeForm, city: event.target.value })} className="mt-1.5" placeholder="Lagos" />
              </div>
              <div>
                <label htmlFor="store-country" className="text-sm font-semibold">Country</label>
                <Input id="store-country" value={storeForm.country} onChange={(event) => setStoreForm({ ...storeForm, country: event.target.value })} className="mt-1.5" placeholder="Nigeria" />
              </div>
            </div>
            <div>
              <label htmlFor="store-reply" className="text-sm font-semibold">Typical reply time</label>
              <Input id="store-reply" value={storeForm.responseTime} onChange={(event) => setStoreForm({ ...storeForm, responseTime: event.target.value })} className="mt-1.5" placeholder="within 2 hours" />
            </div>
            <div>
              <label htmlFor="store-about" className="text-sm font-semibold">About your store</label>
              <Textarea id="store-about" rows={3} value={storeForm.description} onChange={(event) => setStoreForm({ ...storeForm, description: event.target.value })} className="mt-1.5" placeholder="What you sell and where you ship" />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : store ? "Save store details" : "Create my store"}
            </Button>
          </form>
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold"><Plus className="h-5 w-5 text-primary" />Add a product</h2>
          <form onSubmit={submitProduct} className="mt-4 space-y-3 rounded-xl border bg-card p-5">
            <div>
              <label htmlFor="product-name" className="text-sm font-semibold">Product name</label>
              <Input id="product-name" required disabled={!store} value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="mt-1.5" placeholder="Handwoven Aso Oke set" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="product-price" className="text-sm font-semibold">Price</label>
                <Input id="product-price" required disabled={!store} inputMode="decimal" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="mt-1.5" placeholder="45000" />
              </div>
              <div>
                <label htmlFor="product-stock" className="text-sm font-semibold">Stock</label>
                <Input id="product-stock" required disabled={!store} inputMode="numeric" value={productForm.inventory} onChange={(event) => setProductForm({ ...productForm, inventory: event.target.value })} className="mt-1.5" placeholder="12" />
              </div>
            </div>
            <div>
              <label htmlFor="product-about" className="text-sm font-semibold">Description</label>
              <Textarea id="product-about" rows={3} disabled={!store} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="mt-1.5" placeholder="Materials, sizes, delivery time" />
            </div>
            <Button type="submit" disabled={busy || !store} className="w-full">Publish product</Button>
            {!store ? <p className="text-xs text-muted-foreground">Create your store first to add products.</p> : null}
          </form>

          {(products ?? []).length > 0 ? (
            <ul className="mt-5 space-y-2">
              {(products ?? []).map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.inventory_count ?? 0} in stock · {product.status}</span>
                  </span>
                  <strong>{formatPrice(product.price)}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      <section className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold"><Package className="h-5 w-5 text-primary" />Orders to fulfil</h2>
          <Button variant="outline" size="sm" className="gap-1.5" disabled={ordersFetching} onClick={() => { void refetchOrders(); void queryClient.invalidateQueries({ queryKey: sellerEarningsOptions.queryKey }); }}>
            {ordersFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Updates automatically every 15 seconds. Buyers are notified each time you change an order.</p>
        {(sellerOrders?.orders ?? []).length === 0 ? (
          <p className="mt-3 rounded-xl border bg-card p-6 text-sm text-muted-foreground">No orders yet. They appear here as soon as a buyer checks out.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(sellerOrders?.orders ?? []).map((order) => (
              <li key={order.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at ?? "").toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <strong className="block">{formatPrice(order.order_items.reduce((sum, item) => sum + item.total, 0))}</strong>
                    <span className={`text-[11px] font-bold uppercase ${order.payment_status === "paid" ? "text-primary" : "text-muted-foreground"}`}>
                      Payment {order.payment_status}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {order.order_items.map((item) => (
                    <li key={item.id}>{item.quantity} × {item.name}</li>
                  ))}
                </ul>
                <div className="mt-3 border-t pt-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Delivery status</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {orderStatuses.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.status === status ? "default" : "outline"}
                        disabled={busy}
                        onClick={() => changeStatus(order.id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 border-t pt-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Payment</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {paymentStatuses.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.payment_status === status ? "default" : "outline"}
                        disabled={busy}
                        onClick={() => changePayment(order.id, status)}
                      >
                        {status === "paid" ? "Payment received" : status === "refunded" ? "Refunded" : "Awaiting payment"}
                      </Button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
