"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

type LdpStickyNavProps = {
  vehicles: any[];
  activeSlug?: string;
  consultantSlug: string;
  customDomain?: boolean | string;
  onOpenQuote: () => void;
  onActiveClick?: () => void;
};

export default function LdpStickyNav({
  vehicles, activeSlug, consultantSlug, customDomain, onOpenQuote, onActiveClick,
}: LdpStickyNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const safeVehicles = Array.isArray(vehicles) ? vehicles.filter((v: any) => v && (v.slug || v.id)) : [];
  const safeConsultantSlug = consultantSlug || "tu-van";

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [vehicles]);

  const handleScroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  if (!safeVehicles || safeVehicles.length <= 1) return null;

  return (
    <div id="ldp-vehicles-tabs" className="bg-[#0b192e]/95 backdrop-blur-md text-white py-2 border-y border-white/10 sticky top-0 z-[40] shadow-lg">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-[144px] flex items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0 flex items-center">
          {canScrollLeft && (
            <button type="button" onClick={() => handleScroll("left")} aria-label="Cuộn sang trái" className="absolute left-0 z-10 p-1 rounded-full bg-[#0b192e]/90 text-white border border-white/20 shadow-md hover:bg-[#0562D2] transition-colors shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div ref={scrollRef} onScroll={checkScroll} className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full scroll-smooth py-0.5 px-1">
            {safeVehicles.map((v: any, index: number) => {
              const vSlug = v.slug || v.id;
              const isActive = activeSlug && (vSlug === activeSlug || String(v.id) === String(activeSlug));
              const href = customDomain ? `/${vSlug}#ldp-vehicle-intro` : `/ldp/${safeConsultantSlug}/${vSlug}#ldp-vehicle-intro`;
              // Luôn hiển thị in hoa, không phụ thuộc việc title trong CMS đã được viết hoa hay chưa.
              const displayName = (v.title || v.name || "").replace(/^FORD\s+/i, "").toUpperCase();

              return (
                <Link
                  key={v.id || vSlug || index}
                  href={href}
                  scroll={false}
                  onClick={(e) => {
                    if (isActive && onActiveClick) {
                      e.preventDefault();
                      onActiveClick();
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all shrink-0 whitespace-nowrap border ${
                    isActive
                      ? "bg-[#0562D2] text-white border-[#388bfd] shadow-[0_0_12px_rgba(5,98,210,0.5)] font-bold"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25"
                  }`}
                >
                  {displayName}
                </Link>
              );
            })}
          </div>

          {canScrollRight && (
            <button type="button" onClick={() => handleScroll("right")} aria-label="Cuộn sang phải" className="absolute right-0 z-10 p-1 rounded-full bg-[#0b192e]/90 text-white border border-white/20 shadow-md hover:bg-[#0562D2] transition-colors shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenQuote}
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 bg-[#0562D2] hover:bg-[#0451B0] text-white border border-[#388bfd]/60 shadow-[0_2px_8px_rgba(5,98,210,0.35)] cursor-pointer flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Nhận báo giá</span>
        </button>
      </div>
    </div>
  );
}
