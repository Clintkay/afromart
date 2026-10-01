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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Afromart home" className="shrink-0">
          <Logo variant="full" className="h-7 sm:h-8" />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1 xl:flex"><Globe2 className="h-4 w-4 text-muted-foreground"/><LanguageSelector /></div>
          {!user ? (
            <>
              <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex"><Link to="/auth">Log in</Link></Button>
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex"><Link to="/auth" search={{ mode: "signup" }}>Join Afromart</Link></Button>
            </>
          ) : null}
          <Button asChild size="sm" className="hidden whitespace-nowrap lg:inline-flex"><Link to="/home">Browse marketplace</Link></Button>
          {user ? (
            <Button asChild variant="outline" size="icon" className="shrink-0 rounded-full" aria-label="My account" title="My account"><Link to="/account"><UserRound className="h-5 w-5"/></Link></Button>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 xl:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t bg-background px-4 py-4 sm:px-6 xl:hidden">
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
            {user ? (
              <Link to="/account" className="flex items-center gap-2 text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}><UserRound className="h-5 w-5" />My account</Link>
            ) : (
              <>
                <Link to="/auth" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                <Link to="/auth" search={{ mode: "signup" }} className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Join Afromart</Link>
              </>
            )}
            <Button asChild className="mt-1"><Link to="/home" onClick={() => setMobileMenuOpen(false)}>Browse marketplace</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
