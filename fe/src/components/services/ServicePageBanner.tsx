import type { ReactNode } from "react";
import Image from "next/image";
import { siteAssets } from "@/lib/site-assets";

type ServicePageBannerProps = {
  title: string;
  backgroundImage?: string | null;
  children?: ReactNode;
};

export default function ServicePageBanner({
  title,
  backgroundImage,
  children,
}: ServicePageBannerProps) {
  const bgSrc = backgroundImage || siteAssets.serviceBannerBg;
  return (
    <div className="relative h-[480px] w-full flex items-end justify-center pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgSrc}
          alt={title}
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        {!backgroundImage && (
          <Image
            src={siteAssets.serviceBannerFg}
            alt=""
            fill
            sizes="100vw"
            priority
            aria-hidden
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] relative z-10 flex flex-col items-center gap-6 py-6 text-center">
        <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-4xl md:text-5xl text-white tracking-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
