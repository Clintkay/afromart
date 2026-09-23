import { useEffect, useState, type ImgHTMLAttributes } from "react";
import fallbackImage from "@/assets/cat-crafts.jpg";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ fallback = fallbackImage, src, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? fallback);

  // Keep the shown picture in step with the item being displayed: without this,
  // reusing this component for a different product kept the previous image.
  useEffect(() => {
    setImgSrc(src ?? fallback);
  }, [src, fallback]);

  return <img {...props} src={imgSrc} onError={() => setImgSrc(fallback)} />;
}
