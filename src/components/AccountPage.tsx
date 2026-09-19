import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Settings,
  Bell,
  Store,
  BadgeCheck,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ordersOptions, addressesOptions, profileOptions, myRolesOptions } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  { to: "/products", label: "Keep shopping", icon: Package },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/notifications", label: "Inbox", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders } = useSuspenseQuery(ordersOptions);
  const { data: addresses } = useSuspenseQuery(addressesOptions);
  const { data: profile } = useSuspenseQuery(profileOptions);
  const { data: roles } = useSuspenseQuery(myRolesOptions);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSeller = (roles ?? []).some((role) => role === "seller" || role === "service_provider");
  const name = profile?.display_name || profile?.full_name || user?.email?.split("@")[0] || "Afromart member";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const spent = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
  const location = [profile?.country].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-24 bg-gradient-to-r from-primary via-primary/85 to-accent/70 sm:h-32" />
        <div className="-mt-10 flex flex-col gap-4 px-5 pb-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:pb-6">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-primary font-heading text-2xl font-bold text-primary-foreground sm:h-24 sm:w-24">
              {initials || "AM"}
            </div>
            <div className="pb-1">
              <p className="flex items-center gap-1.5 font-heading text-xl font-bold sm:text-2xl">
                {name}
                {isSeller ? <BadgeCheck className="h-5 w-5 text-primary" /> : null}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {location ? (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {location}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/settings"><Settings className="h-4 w-4" />Edit profile</Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link to="/seller"><Store className="h-4 w-4" />{isSeller ? "Seller dashboard" : "Start selling"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Orders", value: String(orders.length) },
          { label: "Total spent", value: formatPrice(spent) },
          { label: "Addresses", value: String(addresses.length) },
          { label: "Account", value: isSeller ? "Buyer + seller" : "Buyer" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-heading text-lg font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 transition hover:border-primary/40 hover:bg-secondary/40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-semibold">{label}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Recent orders</h2>
            <Link to="/products" className="text-sm font-semibold text-primary">Shop more</Link>
          </div>
          {orders.length === 0 ? (
            <div className="mt-4 rounded-xl bg-secondary/50 p-5 text-center">
              <Heart className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No orders yet — your first Afromart order will show here.</p>
              <Button asChild className="mt-4" size="sm"><Link to="/products">Browse products</Link></Button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.slice(0, 6).map((order) => (
                <li key={order.id}>
                  <Link
                    to="/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="flex items-center justify-between rounded-xl border p-4 transition hover:border-primary/35 hover:bg-secondary/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Package className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at ?? "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div>
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="h-fit rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold">Delivery addresses</h2>
          {addresses.length === 0 ? (
            <p className="mt-3 rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
              No saved addresses yet. You can add one at checkout.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {addresses.map((addr) => (
                <li key={addr.id} className="rounded-xl border p-4 text-sm">
                  <p className="font-semibold">
                    {addr.full_name}
                    {addr.is_default ? <span className="ml-1 text-primary">(Default)</span> : null}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.address_line1}
                    {addr.address_line2 ? `, ${addr.address_line2}` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}, {addr.country}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Button
            variant="outline"
            className="mt-5 w-full gap-2"
            onClick={async () => {
              await signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="h-4 w-4" />Sign out
          </Button>
        </section>
      </div>
    </div>
  );
}
