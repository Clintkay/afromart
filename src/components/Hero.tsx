import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-primary-foreground">
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Taste the motherland, wherever you are.
          </h1>
          <p className="mt-6 text-lg/8 text-primary-foreground/90">
            Afro Mart brings authentic African groceries, skincare, fashion, and crafts straight to your door. Fresh staples, heritage brands, and handpicked goods — shipped with care.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="gap-2">
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/products" search={{ categorySlug: "food-groceries" }}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Browse groceries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
