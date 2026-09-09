import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const navItems = [
  { to: "/" as const, label: "Home" },
  { to: "/sell" as const, label: "Become a seller" },
  { to: "/coming-soon" as const, label: "Get the app" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="h-1 w-full bg-gradient-to-r from-brand-green via-brand-gold to-brand-terracotta" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Afro Mart home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-semibold text-foreground transition-colors hover:text-brand-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/support"
            className="hidden text-sm font-semibold text-foreground transition-colors hover:text-brand-green md:block"
          >
            Support
          </Link>
          <Link to="/coming-soon" className="hidden md:block">
            <Button size="sm" className="bg-brand-gold text-brand-ink hover:bg-brand-gold/90">
              Get the app
            </Button>
          </Link>

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
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-base font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/support" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
