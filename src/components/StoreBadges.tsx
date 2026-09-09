import { Link } from "@tanstack/react-router";
import { Apple, Play } from "lucide-react";

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        to="/coming-soon"
        className="flex items-center gap-3 rounded-xl bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
      >
        <Apple className="h-6 w-6" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest opacity-80">Download on the</span>
          <span className="font-heading text-base font-semibold">App Store</span>
        </span>
      </Link>

      <Link
        to="/coming-soon"
        className="flex items-center gap-3 rounded-xl bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
      >
        <Play className="h-6 w-6" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest opacity-80">Get it on</span>
          <span className="font-heading text-base font-semibold">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
