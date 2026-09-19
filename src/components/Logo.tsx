import logoHorizontal from "@/assets/logo-horizontal.png";
import logoFull from "@/assets/logo-full.png";
import logoMark from "@/assets/logo-mark.png";

interface LogoProps {
  className?: string;
  /** "horizontal" = mark + stacked wordmark, "full" = wordmark with tagline, "mark" = symbol only */
  variant?: "horizontal" | "full" | "mark";
}

const sources = {
  horizontal: { src: logoHorizontal, width: 884, height: 314, className: "h-10 w-auto" },
  full: { src: logoFull, width: 1362, height: 272, className: "h-9 w-auto" },
  mark: { src: logoMark, width: 609, height: 563, className: "h-10 w-auto" },
} as const;

export function Logo({ className = "", variant = "horizontal" }: LogoProps) {
  const asset = sources[variant];

  return (
    <img
      src={asset.src}
      alt="Afromart — Connecting African Commerce"
      width={asset.width}
      height={asset.height}
      className={`${asset.className} ${className}`}
    />
  );
}
