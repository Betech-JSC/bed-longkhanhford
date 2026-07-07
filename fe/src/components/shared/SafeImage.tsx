"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { imageFallbackSvg } from "@/lib/site-assets";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string | null | undefined;
  fallbackSrc?: string;
  skeletonClass?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = imageFallbackSvg,
  className = "",
  skeletonClass = "",
  ...props
}: SafeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    // Reset loading state and update source when src changes
    setIsLoaded(false);
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${skeletonClass}`}>
      {/* Pulse Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-150 animate-pulse z-10 rounded-xl" style={{ backgroundColor: "#F2F4F7" }} />
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt || "Hình ảnh"}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
          setIsLoaded(true);
        }}
      />
    </div>
  );
}
