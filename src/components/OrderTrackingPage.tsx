import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, Circle, Clock3, Headphones, MapPin, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { OrderWithItems } from "@/lib/orders.functions";

const stages = [
  { key: "pending", title: "Order confirmed", note: "Your order was received.", icon: Check },
  { key: "processing", title: "Seller is preparing it", note: "Items are being packed for dispatch.", icon: PackageCheck },
  { key: "shipped", title: "On the way", note: "Your delivery partner has the package.", icon: Truck },
  { key: "delivered", title: "Delivered", note: "The order has reached its destination.", icon: MapPin },
] as const;

const stageIndex: Record<string, number> = { pending: 0, confirmed: 0, processing: 1, shipped: 2, out_for_delivery: 2, delivered: 3 };

export function OrderTrackingPage({ order }: { order: OrderWithItems }) {
  const activeIndex = stageIndex[order.status] ?? 0;
  const address = order.shipping_address && typeof order.shipping_address === "object" && !Array.isArray(order.shipping_address)
    ? order.shipping_address as Record<string, unknown>
    : {};
  const destination = [address.address_line1, address.city, address.state, address.country].filter((value): value is string => typeof value === "string" && value.length > 0).join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
      <Button asChild variant="ghost" className="-ml-3"><Link to="/account"><ChevronLeft className="h-4 w-4" />Back to orders</Link></Button>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase text-primary">Order #{order.id.slice(0, 8).toUpperCase()}</p><h1 className="mt-1 font-heading text-3xl font-bold">Track your order</h1><p className="mt-2 text-sm text-muted-foreground">Placed {new Date(order.created_at ?? "").toLocaleDateString(undefined, { dateStyle: "long" })}</p></div>
        <Badge className="capitalize">{order.status.replaceAll("_", " ")}</Badge>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-lg border bg-card p-5 sm:p-7">
          <h2 className="font-heading text-xl font-bold">Delivery progress</h2>
          <div className="mt-6">
            {stages.map((stage, index) => {
              const complete = index <= activeIndex;
              const Icon = complete ? stage.icon : Circle;
              return (
                <div key={stage.key} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${complete ? "bg-primary text-primary-foreground" : "border bg-background text-muted-foreground"}`}><Icon className="h-4 w-4" /></span>
                    {index < stages.length - 1 ? <span className={`h-14 w-0.5 ${index < activeIndex ? "bg-primary" : "bg-border"}`} /> : null}
                  </div>
                  <div className="pb-7"><p className={`font-semibold ${complete ? "text-foreground" : "text-muted-foreground"}`}>{stage.title}</p><p className="mt-1 text-sm text-muted-foreground">{stage.note}</p>{index === activeIndex ? <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"><Clock3 className="h-3.5 w-3.5" />Current status</span> : null}</div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border bg-card p-5"><h2 className="font-heading font-bold">Order summary</h2><ul className="mt-4 space-y-3">{order.order_items.map((item) => <li key={item.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0"><span className="block truncate font-medium">{item.name}</span><span className="text-muted-foreground">Qty {item.quantity}</span></span><span className="font-semibold">{formatPrice(item.total)}</span></li>)}</ul><div className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div></section>
          {destination ? <section className="rounded-lg border bg-card p-5"><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-heading font-bold">Delivering to</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{destination}</p></div></div></section> : null}
          <Button asChild variant="outline" className="w-full"><Link to="/support"><Headphones className="h-4 w-4" />Get order help</Link></Button>
        </aside>
      </div>
    </div>
  );
}