import { Link } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/lib/language";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="md:col-span-2">
             <Link to="/" aria-label="Afromart home" className="inline-block rounded-sm bg-card p-2">
              <Logo variant="full" />
            </Link>

             <p className="mt-5 max-w-sm text-sm text-primary-foreground/70">
               A Pan-African mobile marketplace connecting people, businesses and service providers across the continent.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase text-accent">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-primary-foreground">About Afromart</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary-foreground">How it works</Link></li>
              <li><Link to="/download" className="hover:text-primary-foreground">Download app</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase text-accent">Businesses</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/business" className="hover:text-primary-foreground">For businesses</Link></li>
              <li><Link to="/sell/start" className="hover:text-primary-foreground">Create a profile</Link></li>
              <li><Link to="/auth" search={{redirect:"/seller"}} className="hover:text-primary-foreground">Business login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase text-accent">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/support" className="hover:text-primary-foreground">Help centre</Link></li>
              <li><Link to="/services" className="hover:text-primary-foreground">Services</Link></li>
            </ul>
            <div className="mt-6 text-sm text-primary-foreground/70">
              <li>
                <p className="mb-2 flex items-center gap-2"><Globe2 className="h-4 w-4 text-accent"/>Language</p><LanguageSelector />
              </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-8 text-center text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Afromart. Connecting African commerce.
        </div>
      </div>
    </footer>
  );
}
