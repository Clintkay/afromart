import { useState, type ImgHTMLAttributes } from "react";
import fallbackImage from "@/assets/cat-crafts.jpg";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ fallback = fallbackImage, src, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? fallback);

  return <img {...props} src={imgSrc} onError={() => setImgSrc(fallback)} />;
}
