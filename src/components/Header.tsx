import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingCart, User, Store } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, signOut, isLoading } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight">Afro Mart</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Shop
          </Link>
          <Link
            to="/products"
            search={{ categorySlug: "food-groceries" }}
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Groceries
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full p-2 text-foreground transition-colors hover:bg-secondary hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {!isLoading && (
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/account">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          )}

          <button
            className="rounded-md p-2 text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link
              to="/products"
              search={{ categorySlug: "food-groceries" }}
              className="text-base font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Groceries
            </Link>
            {user ? (
              <>
                <Link to="/account" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Account
                </Link>
                <button
                  className="text-left text-base font-medium text-foreground"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
