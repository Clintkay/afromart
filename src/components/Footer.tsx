import { Link } from "@tanstack/react-router";
import { Facebook, Globe2, Instagram, Mail, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";
import { StoreBadges } from "@/components/StoreBadges";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" aria-label="Afro Mart home" className="inline-block">
              <Logo variant="full" />
            </Link>

            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              A Pan-African marketplace connecting buyers with makers, growers, traders and service providers across the
              continent — and the diaspora.
            </p>
            <StoreBadges className="mt-6" />
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/5 text-brand-green"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase text-brand-green">Afro Mart</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/guest" className="hover:text-brand-green">
                  Preview the app
                </Link>
              </li>
              <li>
                 <Link to="/sell/start" className="hover:text-brand-green">
                   Become a seller
                 </Link>
               </li>
               <li>
                 <Link to="/support" className="hover:text-brand-green">
                   Contact support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase text-brand-green">Help</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/support" className="hover:text-brand-green">
                  Support centre
                </Link>
              </li>
              <li>
                 <Link to="/sell/start" className="hover:text-brand-green">
                   Seller onboarding
                </Link>
              </li>
              <li>
                <Link to="/guest" className="hover:text-brand-green">
                  Guest access
                </Link>
              </li>
            </ul>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>
                <label htmlFor="footer-language" className="flex items-center gap-2 text-foreground">
                  <Globe2 className="h-4 w-4 text-brand-gold" /> Language
                </label>
                <select id="footer-language" className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option>English</option><option>Français</option><option>العربية</option><option>Português</option>
                  <option>Kiswahili</option><option>Hausa</option><option>Yorùbá</option><option>isiZulu</option>
                  <option>አማርኛ</option><option>Igbo</option>
                </select>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gold" /> help@afromart.app
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Afro Mart. Connecting African commerce.
        </div>
      </div>
    </footer>
  );
}
