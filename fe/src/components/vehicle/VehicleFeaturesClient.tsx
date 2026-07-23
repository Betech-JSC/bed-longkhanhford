"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import BookingBanner from "@/components/services/BookingBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Calendar, Calculator, ChevronLeft, ChevronRight } from "lucide-react";

interface FeatureItem {
  title: string;
  desc: string;
  image: string;
  category: string;
}

const resolveFileUrl = (file: any): string => {
  if (!file) return "";
  if (typeof file === "string") {
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("/")) {
      return file;
    }
    const cleanPath = file.startsWith("uploads/") ? file.replace("uploads/", "") : file;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    let apiHost = "http://localhost:8000";
    try {
      apiHost = new URL(apiBase).origin;
    } catch (e) { }
    return `${apiHost}/static/${cleanPath}`;
  }
  if (typeof file === "object") {
    if (file.url) return file.url;
    if (file.path) {
      const cleanPath = file.path.startsWith("uploads/") ? file.path.replace("uploads/", "") : file.path;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      let apiHost = "http://localhost:8000";
      try {
        apiHost = new URL(apiBase).origin;
      } catch (e) { }
      return `${apiHost}/static/${cleanPath}`;
    }
  }
  return "";
};

interface FeatureSectionSliderProps {
  sec: {
    id: string;
    label: string;
    subLabel: string;
    title: string;
    desc: string;
    features: FeatureItem[];
  };
  openDriveDrawer: () => void;
}

function FeatureSectionSlider({ sec, openDriveDrawer }: FeatureSectionSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [sec.features]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    e.preventDefault();
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;
    let isDragging = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDragging = true;
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <section
      key={sec.id}
      id={sec.id}
      className="w-full py-16 border-b border-[#e5e5e5] bg-white transition-colors duration-300 relative group/slider"
    >
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">

        {/* Section Header with "Bắt đầu mua xe" on the right */}
        <div className="flex flex-row justify-between items-center border-b border-gray-150 pb-4 mb-8">
          <h2 className="font-['Ford_Antenna',sans-serif] font-extrabold text-2xl md:text-3xl text-[#00095b] tracking-tight">
            {sec.label}
          </h2>
          <div className="flex items-center gap-3.5">
            {/* Scroll navigation arrows */}
            {sec.features.length > 4 && (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!showLeftArrow}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                    ${showLeftArrow
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                      : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                  aria-label="Previous features"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!showRightArrow}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                    ${showRightArrow
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                      : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                  aria-label="Next features"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => openDriveDrawer()}
              className="flex items-center gap-1 border border-[#0562d2]/70 hover:border-[#0562d2] text-[#0562d2] hover:bg-[#0562d2] hover:text-white bg-transparent font-bold px-4 py-1.5 rounded-full text-[10px] md:text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
            >
              <span>Bắt đầu mua xe</span>
            </button>
          </div>
        </div>

        {/* Slider Layout for Cards */}
        {sec.features.length > 0 ? (
          <div className="relative w-full">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              className="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-6 cursor-grab active:cursor-grabbing pb-4"
            >
              {sec.features.map((feat) => (
                <div
                  key={feat.title}
                  className="group flex flex-col items-start text-left bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-1.5 shrink-0 snap-start h-auto
                    w-[85vw] sm:w-[45vw] md:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]"
                >
                  {/* Image container with scale effect on hover */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Text details */}
                  <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-sm md:text-[15px] text-[#1a1a1a] mt-4 mb-2 line-clamp-2 min-h-[40px] md:min-h-[44px]">
                    {feat.title}
                  </h3>
                  <p className="text-[#616161] text-xs md:text-[13px] leading-relaxed font-normal line-clamp-4">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Hover Side Navigation Arrows for Desktop Overlay */}
            {sec.features.length > 4 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className={`absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 transition-all duration-300 cursor-pointer z-10 hover:bg-gray-50 active:scale-95 md:flex hidden
                    ${showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  aria-label="Previous features scroll overlay"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className={`absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 transition-all duration-300 cursor-pointer z-10 hover:bg-gray-50 active:scale-95 md:flex hidden
                    ${showRightArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  aria-label="Next features scroll overlay"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 italic py-8">Chưa có tính năng nào trong mục này.</p>
        )}

      </div>
    </section>
  );
}

export default function VehicleFeaturesClient() {
  const {
    vehicle,
    openDriveDrawer,
    openQuoteDrawer
  } = useVehicle();

  // 1. Parse raw features from CMS API
  const parsedCMSFeatures = useMemo<FeatureItem[]>(() => {
    if (!vehicle) return [];

    const rawFeatures: { title: string; desc: string; image: string; category?: any }[] = [];

    // Parse from FeaturesList block
    const listBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.features && listBlock.data.features.length > 0) {
      listBlock.data.features.forEach((f: any) => {
        rawFeatures.push({
          title: f.title || "",
          desc: f.description || f.desc || "",
          image: resolveFileUrl(f.image || vehicle.image_url || ""),
          category: f.category || undefined
        });
      });
    }

    // Dynamic Categorization based on keywords (matching performance, design, tech, safety)
    return rawFeatures.map((f) => {
      const text = (f.title + " " + f.desc).toLowerCase();
      let category = f.category || "Thiết kế";

      if (!f.category) {
        if (
          text.includes("động cơ") ||
          text.includes("vận hành") ||
          text.includes("hộp số") ||
          text.includes("ecoboost") ||
          text.includes("mã lực") ||
          text.includes("dẫn động") ||
          text.includes("4wd") ||
          text.includes("4x4") ||
          text.includes("treo") ||
          text.includes("cầu")
        ) {
          category = "Vận hành";
        } else if (
          text.includes("an toàn") ||
          text.includes("phanh") ||
          text.includes("túi khí") ||
          text.includes("cảnh báo") ||
          text.includes("kiểm soát") ||
          text.includes("bám đường") ||
          text.includes("hỗ trợ lái") ||
          text.includes("giữ làn") ||
          text.includes("va chạm") ||
          text.includes("điểm mù")
        ) {
          category = "An toàn";
        } else if (
          text.includes("công nghệ") ||
          text.includes("sync") ||
          text.includes("kết nối") ||
          text.includes("màn hình") ||
          text.includes("sạc không dây") ||
          text.includes("apple") ||
          text.includes("android") ||
          text.includes("usb") ||
          text.includes("bluetooth") ||
          text.includes("âm thanh")
        ) {
          category = "Công nghệ";
        }
      }

      return {
        ...f,
        category
      };
    });
  }, [vehicle]);

  // 2. Assemble sections (CMS only)
  const sections = useMemo(() => {
    const getCategoryKey = (catName: string): string => {
      const c = catName.trim().toLowerCase();
      if (c === "thiết kế" || c === "design") return "design";
      if (c === "vận hành" || c === "performance") return "performance";
      if (c === "công nghệ" || c === "tech") return "tech";
      if (c === "an toàn" || c === "safety") return "safety";
      return catName; // custom category name
    };

    // Load custom categories list from CMS, fallback to the default 4
    let cmsCategories: string[] = ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
    const listBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.categories && Array.isArray(listBlock.data.categories)) {
      cmsCategories = listBlock.data.categories;
    }

    const standardMeta: Record<string, { subLabel: string; title: string; desc: string }> = {
      design: {
        subLabel: "THIẾT KẾ & TIỆN NGHI",
        title: "Diện Mạo Kiêu Hãnh & Không Gian Sang Trọng",
        desc: "Sự kết hợp hoàn hảo giữa kiểu dáng hầm hố, tinh tế bên ngoài cùng khoang cabin rộng rãi, tiện ích cao cấp bên trong."
      },
      performance: {
        subLabel: "HIỆU NĂNG & VẬN HÀNH",
        title: "Sức Mạnh Cơ Bắp & Khả Năng Vận Hành Ưu Việt",
        desc: "Khám phá thế hệ động cơ mạnh mẽ cùng hệ truyền động tiên tiến, giúp xe chinh phục mọi cung đường một cách êm ái và đầy hứng khởi."
      },
      tech: {
        subLabel: "CÔNG NGHỆ THÔNG MINH",
        title: "Kết Nối Không Giới Hạn & Trải Nghiệm Tiện Nghi",
        desc: "Những trang bị công nghệ đỉnh cao giúp tối ưu hóa sự kết nối giữa người lái và xe, mang lại hành trình thoải mái và thông minh hơn."
      },
      safety: {
        subLabel: "AN TOÀN VƯỢT TRỘI",
        title: "Hỗ Trợ Lái Thông Minh & Bảo Vệ Toàn Diện",
        desc: "Hệ thống hỗ trợ người lái tiên tiến Co-Pilot360 chủ động bảo vệ bạn và gia đình trước mọi tình huống giao thông phức tạp."
      }
    };

    const categoriesList = cmsCategories.map((catName) => {
      const key = getCategoryKey(catName);
      const isStandard = ["design", "performance", "tech", "safety"].includes(key);
      const meta = isStandard
        ? standardMeta[key]
        : {
          subLabel: `${catName.toUpperCase()} & TIỆN NGHI`,
          title: `Trang Bị ${catName} & Tiện Nghi Nổi Bật`,
          desc: `Khám phá các tính năng và trang bị nổi bật thuộc nhóm ${catName} của dòng xe.`
        };

      return {
        id: key,
        label: catName,
        ...meta
      };
    });

    const result: { id: string; label: string; subLabel: string; title: string; desc: string; features: FeatureItem[] }[] = [];

    categoriesList.forEach((cat) => {
      const catFeatures = parsedCMSFeatures.filter(
        (f) => getCategoryKey(f.category) === cat.id
      );

      // Only render if there are active features configured
      if (catFeatures.length > 0) {
        result.push({
          ...cat,
          features: catFeatures
        });
      }
    });

    return result;
  }, [vehicle, parsedCMSFeatures]);

  if (!vehicle) return null;

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans pb-16 selection:bg-[#0562d2] selection:text-white">

      {/* 1. Hero Banner Section */}
      <section className="relative h-[400px] md:h-[480px] w-full overflow-hidden bg-slate-950 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-10" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full relative z-10 text-white flex flex-col gap-5 items-start text-left">
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-3xl md:text-5xl lg:text-[48px] tracking-tight max-w-2xl leading-[1.15] text-white">
            Trang bị ưu việt cùng Ford {vehicle.name}
          </h1>
          <p className="text-xs md:text-[15px] text-gray-300 max-w-xl leading-relaxed">
            Sự kết hợp hoàn hảo giữa công nghệ lái thông minh vượt trội, khả năng vận hành off-road hầm hố chuẩn Mỹ và các giải pháp an toàn tối ưu bảo vệ cả gia đình.
          </p>
          <div className="flex flex-wrap gap-3.5 mt-2">
            <button
              onClick={() => openDriveDrawer()}
              className="flex items-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] text-white font-bold px-6 py-3 rounded-full text-[11px] uppercase tracking-wider transition-all hover:scale-102 cursor-pointer shadow-lg shadow-blue-500/15 active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đăng ký lái thử</span>
            </button>
            <button
              onClick={() => openQuoteDrawer(vehicle.id)}
              className="flex items-center gap-2 bg-transparent hover:bg-white/10 border border-white/60 text-white font-bold px-6 py-3 rounded-full text-[11px] uppercase tracking-wider transition-all hover:scale-102 cursor-pointer active:scale-98"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Dự toán chi phí</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vehicle Secondary Navigation Tab Bar */}
      <VehicleTabBar />

      {/* 3. Feature Sections Content (Slider/Carousel) */}
      {sections.map((sec, i) => (
        <ScrollReveal key={sec.id} direction="up" delay={Math.min(i * 100, 300)}>
          <FeatureSectionSlider
            sec={sec}
            openDriveDrawer={openDriveDrawer}
          />
        </ScrollReveal>
      ))}

      {/* 4. Shared Booking Call To Action Banner */}
      <div className="mt-16">
        <BookingBanner />
      </div>
    </div>
  );
}
