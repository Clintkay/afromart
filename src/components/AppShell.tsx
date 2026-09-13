import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Grid2X2, Headphones, Home, MessageCircle, Search, ShoppingBag, Store, UserRound, Wrench } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import type { ReactNode } from "react";

const primaryNav = [
  { to: "/home" as const, label: "Home", icon: Home },
  { to: "/products" as const, label: "Explore", icon: Grid2X2 },
  { to: "/guest" as const, label: "Services", icon: Wrench },
  { to: "/support" as const, label: "Messages", icon: MessageCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user } = useAuth();
  const { totalItems } = useCart();
  const isAuth = pathname === "/auth" || pathname === "/";
  const accountTarget = user ? "/account" : "/auth";

  if (isAuth) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 flex-col border-r bg-card px-6 py-7 md:flex">
        <Link to="/home" aria-label="Afro Mart home" className="inline-flex">
          <Logo className="h-12" />
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-2" aria-label="Main navigation">
          {primaryNav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/cart"
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${pathname === "/cart" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <span className="flex items-center gap-3"><ShoppingBag className="h-5 w-5" />Cart</span>
            {totalItems > 0 ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">{totalItems}</span> : null}
          </Link>
          {user ? (
            <Link to="/account" className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${pathname === "/account" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <UserRound className="h-5 w-5" />My account
            </Link>
          ) : (
            <Link to="/auth" search={{ redirect: "/account" }} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <UserRound className="h-5 w-5" />Sign in
            </Link>
          )}
        </nav>

        <div className="rounded-lg bg-primary p-4 text-primary-foreground">
          <p className="text-xs font-semibold uppercase text-primary-foreground/70">Sell on Afro Mart</p>
          <p className="mt-1 text-sm font-semibold">Grow your business across Africa.</p>
          <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
            <Link to="/sell/start"><Store className="h-4 w-4" />Start selling</Link>
          </Button>
        </div>
      </aside>

      <div className="min-w-0 md:col-start-2">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
          <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 md:h-20 lg:px-10">
            <Link to="/home" className="md:hidden" aria-label="Afro Mart home"><Logo variant="mark" className="h-9" /></Link>
            <Link to="/products" search={{}} className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full border bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search goods, stores and services</span>
            </Link>
            <div className="flex shrink-0 items-center gap-1">
              <Button asChild variant="ghost" size="icon" aria-label="Support">
                <Link to="/support"><Headphones className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Notifications">
                {user ? <Link to="/account"><Bell className="h-5 w-5" /></Link> : <Link to="/auth" search={{ redirect: "/account" }}><Bell className="h-5 w-5" /></Link>}
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] pb-24 md:min-h-[calc(100vh-5rem)] md:pb-0">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid h-18 grid-cols-5 border-t bg-card/95 px-2 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden" aria-label="Mobile navigation">
        {[
          { to: "/home" as const, label: "Home", icon: Home },
          { to: "/products" as const, label: "Explore", icon: Grid2X2 },
          { to: "/cart" as const, label: "Cart", icon: ShoppingBag, badge: totalItems },
          { to: "/support" as const, label: "Messages", icon: MessageCircle },
          { to: accountTarget, label: "Profile", icon: UserRound },
        ].map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            item.to === "/auth" ? (
              <Link key={item.label} to="/auth" search={{ redirect: "/account" }} className={`flex min-w-0 flex-col items-center gap-1 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                <span className="relative"><item.icon className="h-5 w-5" /></span><span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <Link key={item.label} to={item.to} className={`flex min-w-0 flex-col items-center gap-1 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                <span className="relative"><item.icon className="h-5 w-5" />{"badge" in item && item.badge ? <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] text-accent-foreground">{item.badge}</span> : null}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            )
          );
        })}
      </nav>
    </div>
  );
}