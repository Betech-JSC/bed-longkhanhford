"use client";

import { useState, useEffect, useRef } from "react";
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
  const [prevSrc, setPrevSrc] = useState(src);
  const [prevFallbackSrc, setPrevFallbackSrc] = useState(fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  // Adjust state when props change (during render, as recommended by React docs)
  if (src !== prevSrc || fallbackSrc !== prevFallbackSrc) {
    setPrevSrc(src);
    setPrevFallbackSrc(fallbackSrc);
    setIsLoaded(false);
    setImgSrc(src || fallbackSrc);
  }

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        if (img.naturalWidth === 0) {
          // Failed to load
          if (imgSrc !== fallbackSrc) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setImgSrc(fallbackSrc);
          }
          setIsLoaded(true);
        } else {
          // Loaded successfully
          setIsLoaded(true);
        }
      }
    }
  }, [imgSrc, fallbackSrc]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${skeletonClass}`}>
      {/* Pulse Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-150 animate-pulse z-10 rounded-xl" style={{ backgroundColor: "#F2F4F7" }} />
      )}
      
      <Image
        {...props}
        ref={imgRef}
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
