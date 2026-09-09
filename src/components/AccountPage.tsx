import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, User, Package } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ordersOptions, addressesOptions } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders } = useSuspenseQuery(ordersOptions);
  const { data: addresses } = useSuspenseQuery(addressesOptions);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">My account</h1>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>{user?.email ?? "Account"}</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your profile, orders and addresses.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-semibold">Orders</h2>
            {orders.length === 0 ? (
              <div className="mt-3 rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
                You haven't placed any orders yet.
              </div>
            ) : (
              <ul className="mt-3 space-y-3">
                {orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at ?? "").toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold">Addresses</h2>
            {addresses.length === 0 ? (
              <div className="mt-3 rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
                No saved addresses yet. Add one at checkout.
              </div>
            ) : (
              <ul className="mt-3 space-y-3">
                {addresses.map((addr) => (
                  <li key={addr.id} className="rounded-lg border p-4 text-sm">
                    <p className="font-medium">{addr.full_name} {addr.is_default && <span className="text-primary">(Default)</span>}</p>
                    <p className="text-muted-foreground">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                    <p className="text-muted-foreground">{addr.city}{addr.state ? `, ${addr.state}` : ""}, {addr.country}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/products">
              <Button variant="outline">Continue shopping</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={async () => {
                await signOut();
                navigate({ to: "/auth" });
              }}
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
