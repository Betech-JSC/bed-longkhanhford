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
        <header className="bg-white border-b border-gray-150 py-3 select-none">
          <div className="max-w-[1152px] mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-[5.2px]">
              <div className="h-[32px] w-[85.3px] relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ford_logo.svg"
                  alt="Ford Oval Logo"
                  className="block size-full object-contain"
                />
              </div>
              <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[13px] tracking-tight leading-none uppercase">
                LONG KHANH FORD
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
              Đại lý ủy quyền chính thức
            </span>
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
