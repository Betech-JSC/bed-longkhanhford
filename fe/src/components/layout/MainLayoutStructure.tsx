"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientWidgets from "@/components/shared/ClientWidgets";
import PageTransitionLoader from "@/components/shared/PageTransitionLoader";

export default function MainLayoutStructure({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLdp = pathname?.startsWith("/ldp/") ?? false;

  return (
    <>
      {isLdp ? (
        <header className="bg-white border-b border-gray-200/80 py-2.5 sm:py-3 select-none bg-white/95 backdrop-blur-xs">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-[144px] flex items-center justify-between">
            <div className="flex items-center gap-[5.2px]">
              <div className="h-[32px] w-[85.3px] relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ford_logo.svg"
                  alt="Ford Oval Logo"
                  className="block size-full object-contain"
                />
              </div>
              <span className="font-['Ford_Antenna',sans-serif] font-extrabold text-[#00095b] text-[13px] sm:text-sm tracking-tight leading-none uppercase">
                LONG KHANH FORD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#002C6C]/5 border border-[#002C6C]/12 text-[#002C6C] text-[10px] sm:text-xs font-bold tracking-wider uppercase font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0562D2] shrink-0" />
              Đại lý ủy quyền chính thức
              </span>
            </div>
          </div>
        </header>
      ) : (
        <Navbar />
      )}

      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>

      <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>

      {!isLdp && <Footer />}

      <ClientWidgets isLdp={isLdp} />
    </>
  );
}

