import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";
import { StoreBadges } from "@/components/StoreBadges";

const categories = [
  { slug: "groceries", label: "Food & groceries" },
  { slug: "beauty", label: "Beauty & wellness" },
  { slug: "fashion", label: "Fashion & fabric" },
  { slug: "home", label: "Home & craft" },
];

export function Footer() {
  return (
    <footer className="border-t bg-brand-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" aria-label="Afro Mart home" className="inline-block rounded-2xl bg-white px-4 py-3 shadow-lg">
              <Logo variant="full" />
            </Link>

            <p className="mt-5 max-w-sm text-sm text-white/70">
              A Pan-African marketplace connecting buyers with makers, growers, traders and service providers across the
              continent — and the diaspora.
            </p>
            <StoreBadges className="mt-6" />
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-brand-gold"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-gold">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <Link to="/products" className="hover:text-white">
                  All products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link to="/products" search={{ categorySlug: category.slug }} className="hover:text-white">
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/sell" className="hover:text-white">
                  Become a seller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-gold">Help</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <Link to="/support" className="hover:text-white">
                  Support centre
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-white">
                  Get the app
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white">
                  Browse as a guest
                </Link>
              </li>

            </ul>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gold" /> help@afromart.app
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-gold" /> +234 800 000 0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold" /> Lagos • Nairobi • Accra
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Afro Mart. Connecting African commerce.
        </div>
      </div>
    </footer>
  );
}
