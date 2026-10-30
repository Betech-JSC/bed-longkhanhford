"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useVehicle } from "./VehicleLayoutClient";
import VehicleLayoutClient from "./VehicleLayoutClient";
import Blocks, { resolveImageUrl } from "@/components/blocks/Blocks";
import { Phone, Car } from "lucide-react";
import { formatPersonName } from "@/lib/formatters";

const ZaloIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="white" />
    <text x="50" y="63" fontStyle="normal" fontWeight="900" fontSize="32" fill="#0068FF" textAnchor="middle">Zalo</text>
  </svg>
);

const resolveZaloUrl = (zaloUrl?: string, phone?: string): string => {
  const target = (zaloUrl || phone || "").trim();
  if (!target) return "";
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  if (target.startsWith("zalo.me/")) {
    return `https://${target}`;
  }
  const cleanPhone = target.replace(/[^0-9]/g, "");
  if (cleanPhone) {
    return `https://zalo.me/${cleanPhone}`;
  }
  return target;
};

function LdpInnerContent({ salesConsultant, landingPageId, salesEmail, layoutBlocks, promotions, vehicle, allVehicles }: any) {
  const { openQuoteDrawer, openDriveDrawer } = useVehicle();
  const finalZaloUrl = resolveZaloUrl(salesConsultant?.zalo_url, salesConsultant?.phone);

  // Cuộn mượt xuống phần giới thiệu xe, tự động đo và bù trừ chiều cao thanh tab cố định
  const scrollToVehicleIntro = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById("ldp-vehicle-intro") || document.getElementById("ldp-vehicles-tabs");
    if (target) {
      const tabsBar = document.getElementById("ldp-vehicles-tabs");
      const headerOffset = tabsBar ? tabsBar.getBoundingClientRect().height : 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#ldp-vehicle-intro" || hash === "#ldp-vehicles-tabs") {
        // Chờ DOM cập nhật xong trước khi cuộn
        const timer = setTimeout(scrollToVehicleIntro, 60);
        return () => clearTimeout(timer);
      }
    }
  }, [vehicle?.slug, vehicle?.id]);

  // Backwards compatibility dynamic injection for existing LDP pages
  // Chuẩn hóa và map các block legacy (nếu có)
  let resolvedBlocks = [...layoutBlocks]
    .filter((b: any) => b && b.type !== "ThreeSixtyViewer" && b.type !== "LdpVehiclesGrid")
    .map((b: any) => {
      if (b.type === "HeroBanner") return { ...b, type: "LdpHeroBanner" };
      if (b.type === "AccordionFAQs") return { ...b, type: "LdpFaq" };
      return b;
    });

  // Chỉ nạp block mặc định nếu LDP hoàn toàn chưa có cấu hình layout_blocks nào (fallback)
  const isBlocksEmpty = resolvedBlocks.length === 0;

  if (isBlocksEmpty) {
    resolvedBlocks = [
      {
        id: 'default-hero-banner',
        type: 'LdpHeroBanner',
        data: {}
      },
      {
        id: 'default-sales-consultant',
        type: 'LdpSalesConsultant',
        data: {}
      },
      {
        id: 'default-ldp-promotions',
        type: 'LdpPromotions',
        data: {
          title: "Chương Trình Khuyến Mãi Đặc Biệt",
          description: "Nhận ưu đãi độc quyền từ chuyên viên kinh doanh khi đăng ký mua xe trong tháng này."
        }
      },
      {
        id: 'default-ldp-technology',
        type: 'LdpTechnology',
        data: {}
      },
      {
        id: 'default-ldp-services',
        type: 'LdpServices',
        data: {}
      },
      {
        id: 'default-ldp-used-vehicles',
        type: 'LdpUsedVehicles',
        data: {}
      },
      {
        id: 'default-ldp-faq',
        type: 'LdpFaq',
        data: {}
      }
    ];
  }

  // Chia danh sách block linh hoạt theo vị trí của HeroBanner (cho phép kéo block lên trước cả Hero)
  const heroIndex = resolvedBlocks.findIndex((b: any) => b.type === "HeroBanner" || b.type === "LdpHeroBanner");
  const topBlocks = heroIndex > 0 ? resolvedBlocks.slice(0, heroIndex) : [];
  const heroBlock = heroIndex !== -1 ? resolvedBlocks[heroIndex] : null;
  const bottomBlocks = heroIndex !== -1 ? resolvedBlocks.slice(heroIndex + 1) : resolvedBlocks;
  const hasVehiclesGrid = bottomBlocks.some((b: any) => b.type === "LdpVehiclesGrid");

  const consultantSlug = salesConsultant?.slug || salesConsultant?.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="relative pb-16 md:pb-0">
      {/* 0. CÁC BLOCK ĐƯỢC ĐẶT TRƯỚC HERO (nếu admin kéo lên đầu trang) */}
      {topBlocks.length > 0 && (
        <Blocks
          layout={topBlocks}
          vehicle={vehicle}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
          startIndex={0}
          salesConsultant={salesConsultant}
          promotions={promotions}
          allVehicles={allVehicles}
          landingPageId={landingPageId}
          salesEmail={salesEmail}
        />
      )}

      {/* 1. HERO BANNER */}
      {heroBlock && (
        <Blocks
          layout={[heroBlock]}
          vehicle={vehicle}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
          startIndex={topBlocks.length}
          salesConsultant={salesConsultant}
          promotions={promotions}
          allVehicles={allVehicles}
          landingPageId={landingPageId}
          salesEmail={salesEmail}
        />
      )}

      {/* MULTI-VEHICLE SWITCHER TAB BAR */}
      {allVehicles && allVehicles.length > 1 && (
        <div id="ldp-vehicles-tabs" className="bg-[#0b192e] text-white py-3.5 px-4 border-y border-white/10 sticky top-0 z-[40] shadow-md scroll-mt-2">
          <div className="max-w-[1152px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 shrink-0">
              <Car className="w-4 h-4 text-[#0562D2]" />
              <span>Dòng xe Chuyên viên kinh doanh {salesConsultant?.name ? `${formatPersonName(salesConsultant.name)} ` : ""}phụ trách ({allVehicles.length}):</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {allVehicles.map((v: any) => {
                const isActive = (v.slug || v.id) === (vehicle.slug || vehicle.id);
                const vehicleSlug = v.slug || v.id;
                const href = salesConsultant.custom_domain
                  ? `/${vehicleSlug}`
                  : `/ldp/${consultantSlug}/${vehicleSlug}`;
                const targetHref = `${href}#ldp-vehicle-intro`;

                return (
                  <Link
                    key={v.id}
                    href={targetHref}
                    scroll={false}
                    onClick={(e) => {
                      // Nếu chọn chính xe đang hiển thị, cuộn ngay xuống phần giới thiệu xe
                      if (isActive) {
                        e.preventDefault();
                        scrollToVehicleIntro();
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                      isActive
                        ? "bg-[#0562D2] text-white border-[#0562D2] shadow-sm"
                        : "bg-white/10 text-gray-200 border-white/10 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {v.title || v.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. CÁC BLOCK BÊN DƯỚI (theo đúng thứ tự admin kéo thả trong CMS) */}
      {!hasVehiclesGrid && (
        <div id="ldp-vehicle-intro" className="scroll-mt-28 md:scroll-mt-24 pointer-events-none" />
      )}
      <Blocks
        layout={bottomBlocks}
        vehicle={vehicle}
        openQuoteDrawer={openQuoteDrawer}
        openDriveModal={() => openDriveDrawer()}
        startIndex={topBlocks.length + (heroBlock ? 1 : 0)}
        salesConsultant={salesConsultant}
        promotions={promotions}
        allVehicles={allVehicles}
        landingPageId={landingPageId}
        salesEmail={salesEmail}
      />

      {/* FLOATING SALES CONSULTANT WIDGET */}
      {/* Đã hạ vị trí bottom về mép dưới sau khi bỏ sticky bottom bar */}
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 md:right-6 z-[99] flex flex-col items-end gap-2.5 font-sans">
        {/* Zalo Button */}
        {finalZaloUrl && (
          <a
            href={finalZaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-[#0068ff] hover:bg-[#0057d6] text-white rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30"
            title="Liên hệ Zalo"
          >
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center">
              <ZaloIcon className="w-full h-full" />
            </div>
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Liên hệ Zalo</span>
          </a>
        )}
        
        {/* Hotline Button */}
        {salesConsultant.phone && (
          <a
            href={`tel:${salesConsultant.phone}`}
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full shadow-lg shadow-green-600/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Hotline: {salesConsultant.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function LdpDetailClient({ initialData }: { initialData: any }) {
  const { vehicle, vehicles, sales_consultant, layout_blocks, promotions } = initialData;
  const allVehicles = (vehicles && vehicles.length > 0) ? vehicles : [vehicle];

  return (
    <VehicleLayoutClient
      initialVehicle={vehicle}
      allVehicles={allVehicles}
      salesConsultant={sales_consultant}
      salesConsultantId={sales_consultant?.id}
      salesEmail={initialData.sales_email || sales_consultant?.email}
      landingPageId={initialData.id}
    >
      <LdpInnerContent
        salesConsultant={sales_consultant}
        landingPageId={initialData.id}
        salesEmail={initialData.sales_email || sales_consultant?.email}
        layoutBlocks={layout_blocks}
        promotions={promotions}
        vehicle={vehicle}
        allVehicles={allVehicles}
      />
    </VehicleLayoutClient>
  );
}
