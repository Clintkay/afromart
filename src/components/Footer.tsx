import { Link } from "@tanstack/react-router";
import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-foreground">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold">Afro Mart</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Authentic African groceries, skincare, fashion, and crafts delivered to your door. Celebrating culture, one order at a time.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-foreground">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/products" search={{ categorySlug: "food-groceries" }} className="hover:text-foreground">
                  Food & groceries
                </Link>
              </li>
              <li>
                <Link to="/products" search={{ categorySlug: "skincare-wellness" }} className="hover:text-foreground">
                  Skincare & wellness
                </Link>
              </li>
              <li>
                <Link to="/products" search={{ categorySlug: "fashion-textiles" }} className="hover:text-foreground">
                  Fashion & textiles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/auth" className="hover:text-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-foreground">
                  My account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Afro Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
