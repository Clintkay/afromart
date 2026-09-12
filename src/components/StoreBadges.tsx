function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.19 3.02-.9.97-2.06 1.53-3.05 1.45-.07-1.1.42-2.24 1.15-3.02.83-.9 2.17-1.55 3.09-1.45zM20.9 17.02c-.53 1.23-.79 1.78-1.48 2.87-.96 1.52-2.32 3.41-4 3.43-1.5.01-1.89-.98-3.93-.97-2.04.01-2.47.99-3.97.97-1.68-.02-2.97-1.73-3.93-3.24C.9 16.8.62 12.03 2.33 9.5c1.21-1.8 3.12-2.85 4.92-2.85 1.83 0 2.98 1 4.49 1 1.47 0 2.36-1 4.48-1 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.82.17 8.99z" />
    </svg>
  );
}

function GooglePlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M3.6 1.84a1.6 1.6 0 0 0-.5 1.19v17.94c0 .47.19.9.5 1.19l9.31-10.16L3.6 1.84z" fill="#34A853" />
      <path d="M16.9 8.53 13.4 6.5 4.32 1.24A1.63 1.63 0 0 0 3.6 1.84l9.31 10.16L16.9 8.53z" fill="#EA4335" />
      <path d="M16.9 15.47 12.91 12l-9.31 10.16c.44.4 1.09.47 1.62.16l11.68-6.85z" fill="#FBBC04" />
      <path d="m20.6 10.5-3.7-2.17L12.91 12l3.99 3.47 3.7-2.17c1.07-.63 1.07-2.17 0-2.8z" fill="#4285F4" />
    </svg>
  );
}

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href="#app-preview"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
      >
        <AppleIcon className="h-6 w-6 text-foreground" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Download on the</span>
          <span className="font-heading text-base font-semibold">App Store</span>
        </span>
      </a>

      <a
        href="#app-preview"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
      >
        <GooglePlayIcon className="h-6 w-6" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Get it on</span>
          <span className="font-heading text-base font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
