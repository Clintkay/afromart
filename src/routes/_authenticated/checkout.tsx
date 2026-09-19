import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addressesOptions } from "@/lib/queries";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/orders.functions";
import { createAddress } from "@/lib/addresses.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { countryOptions, countryNameOf, deliveryQuote } from "@/lib/delivery";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout | Afro Mart" },
      { name: "description", content: "Complete your Afro Mart order." },
    ],
  }),
});

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: addresses } = useSuspenseQuery(addressesOptions);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [countryCode, setCountryCode] = useState("NG");
  const [form, setForm] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    phone: "",
  });

  const selectedAddress = addresses.find((a) => a.is_default) ?? addresses[0];
  const activeCountry = showForm || !selectedAddress
    ? countryCode
    : countryOptions.find((c) => c.name === selectedAddress.country)?.code ?? countryCode;
  const delivery = deliveryQuote(activeCountry, subtotal);
  const shipping = delivery.cost;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add a few items before checking out.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let address = addresses.find((a) => a.is_default) ?? addresses[0];
      if (showForm || !address) {
        address = await createAddress({ data: { ...form, country: countryNameOf(countryCode), is_default: true } });
      }

      await createOrder({
        data: {
          subtotal,
          shippingCost: shipping,
          total,
          shippingAddress: {
            full_name: address.full_name,
            address_line1: address.address_line1,
            address_line2: address.address_line2,
            city: address.city,
            state: address.state,
            country: address.country,
            phone: address.phone,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            storeId: null,
          })),
        },
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate({ to: "/account" });
    } catch (err) {
      toast.error("Could not place order. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">Shipping address</h2>
            {addresses.length > 0 && !showForm ? (
              <div className="mt-4 space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className="flex items-start gap-3 rounded-lg border p-4">
                    <input
                      type="radio"
                      name="address"
                      defaultChecked={addr.is_default ?? false}
                      className="mt-1 accent-primary"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.full_name}</p>
                      <p className="text-muted-foreground">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                      <p className="text-muted-foreground">{addr.city}{addr.state ? `, ${addr.state}` : ""}, {addr.country}</p>
                      {addr.is_default && <span className="mt-1 inline-block text-xs font-medium text-primary">Default</span>}
                    </div>
                  </label>
                ))}
                <Button variant="outline" type="button" onClick={() => setShowForm(true)}>
                  Add new address
                </Button>
              </div>
            ) : (
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <div className="sm:col-span-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address_line1">Address line 1</Label>
                  <Input id="address_line1" value={form.address_line1} onChange={(e) => setForm((f) => ({ ...f, address_line1: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address_line2">Address line 2 (optional)</Label>
                  <Input id="address_line2" value={form.address_line2} onChange={(e) => setForm((f) => ({ ...f, address_line2: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {countryOptions.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {delivery.label}
                <span className="block text-xs">To {countryNameOf(activeCountry)} · {delivery.eta}</span>
              </span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Payment collection will be connected next.
          </p>
        </div>
      </div>
    </div>
  );
}
