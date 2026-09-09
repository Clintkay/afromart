import { useState, type ImgHTMLAttributes } from "react";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ fallback = "https://placehold.co/600x600?text=Afro+Mart", src, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? fallback);

  return <img {...props} src={imgSrc} onError={() => setImgSrc(fallback)} />;
}
