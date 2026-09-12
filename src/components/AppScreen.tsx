type AppScreenProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function AppScreen({ src, alt, className = "", priority = false }: AppScreenProps) {
  return (
    <div className={`overflow-hidden rounded-[2rem] border-[7px] border-brand-ink bg-card shadow-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="block h-auto w-full"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}