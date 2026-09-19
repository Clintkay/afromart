import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe2, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/lib/language";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { to: "/about" as const, label: "About" },
  { to: "/services" as const, label: "Services" },
  { to: "/business" as const, label: "For Businesses" },
  { to: "/how-it-works" as const, label: "How It Works" },
  { to: "/support" as const, label: "Help" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="bg-primary py-1.5 text-center text-[10px] font-semibold text-primary-foreground">One marketplace. Many African markets.</div>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Afromart home">
          <Logo variant="full" className="h-8 sm:h-9" />
        </Link>

        <nav className="hidden items-center justify-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
               activeProps={{ className: "text-primary" }}
               className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 xl:flex"><Globe2 className="h-4 w-4 text-muted-foreground"/><LanguageSelector /></div>
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label={user ? "Business account" : "Log in"}><Link to={user ? "/account" : "/auth"} {...(!user ? { search: { redirect: "/seller" } } : {})}><UserRound className="h-5 w-5"/></Link></Button>
          {!user ? (
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex"><Link to="/auth" search={{ redirect: "/seller" }}>Join Afromart</Link></Button>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/home">Browse marketplace</Link></Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 lg:hidden">
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
            <div className="mt-2 border-t pt-4"><LanguageSelector /></div>
            <Link to={user ? "/account" : "/auth"} {...(!user ? { search: { redirect: "/seller" } } : {})} className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>{user ? "Business account" : "Log in"}</Link>
            <Button asChild className="mt-1"><Link to="/home" onClick={() => setMobileMenuOpen(false)}>Download App</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
