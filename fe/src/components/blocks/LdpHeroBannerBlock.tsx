"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannersAPI } from "@/lib/api";
import { siteAssets } from "@/lib/site-assets";

interface LdpHeroBannerBlockProps {
  data?: any;
  salesConsultant?: any;
  openQuoteDrawer?: () => void;
  openDriveModal?: () => void;
  anchorId?: string;
  isEditMode?: boolean;
}

interface BannerSlide {
  id?: number | string;
  title: string;
  subtitle: string;
  image: string;
  imageMobile?: string;
  buttonText?: string;
  buttonLink?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    title: "KHÁM PHÁ CÁC DÒNG XE FORD THẾ HỆ MỚI",
    subtitle: "Trải nghiệm sức mạnh, công nghệ và sự an toàn vượt trội cùng Long Khánh Ford",
    image: siteAssets.heroSlides[0],
    imageMobile: siteAssets.heroSlides[0],
    buttonText: "Đăng ký lái thử",
  },
  {
    title: "ƯU ĐÃI ĐẶC QUYỀN TỪ CHUYÊN VIÊN KINH DOANH",
    subtitle: "Hỗ trợ trả góp lãi suất ưu đãi, thủ tục nhanh chóng, giao xe tận nơi",
    image: siteAssets.heroSlides[1],
    imageMobile: siteAssets.heroSlides[1],
    buttonText: "Nhận báo giá ngay",
  },
  {
    title: "DỊCH VỤ CHÍNH HÃNG TIÊU CHUẨN 3S",
    subtitle: "Đồng hành và chăm sóc khách hàng trọn đời cùng Ford Việt Nam",
    image: siteAssets.heroSlides[2],
    imageMobile: siteAssets.heroSlides[2],
    buttonText: "Tư vấn trực tiếp",
  }
];

export default function LdpHeroBannerBlock({
  data,
  salesConsultant,
  openQuoteDrawer,
  openDriveModal,
  anchorId = "hero-banner",
  isEditMode = false,
}: LdpHeroBannerBlockProps) {
  const [slides, setSlides] = useState<BannerSlide[]>(() => {
    if (data?.banners && Array.isArray(data.banners) && data.banners.length > 0) {
      return data.banners;
    }
    return DEFAULT_SLIDES;
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Nạp banner chính thức từ hệ thống nếu chưa có trong cấu hình block
  useEffect(() => {
    if (data?.banners && Array.isArray(data.banners) && data.banners.length > 0) {
      return;
    }

    bannersAPI
      .getAll()
      .then((res: any) => {
        const raw = res?.data || res || [];
        if (Array.isArray(raw) && raw.length > 0) {
          const formatted = raw
            .filter((b: any) => b.is_active !== false && b.status !== "INACTIVE")
            .map((item: any) => ({
              id: item.id,
              title: item.title || "LONG KHÁNH FORD",
              subtitle: item.subtitle || item.description || "Đại lý ủy quyền chính hãng chuẩn Signature tại Long Khánh",
              image: item.image_url || siteAssets?.heroSlides?.[0] || DEFAULT_SLIDES[0].image,
              imageMobile: item.image_mobile_url || item.image_url || siteAssets?.heroSlides?.[0] || DEFAULT_SLIDES[0].image,
              buttonText: item.button_text || "Đăng ký lái thử",
              buttonLink: item.button_link || "#consultant-vehicles",
            }));

          if (formatted.length > 0) {
            setSlides(formatted);
          }
        }
      })
      .catch(() => {
        // Giữ fallback mặc định nếu API lỗi
      });
  }, [data]);

  // Tự động chuyển slide sau mỗi 6s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDragStart = (x: number) => {
    touchStartX.current = x;
    isDragging.current = true;
  };

  const handleDragEnd = (x: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchStartX.current - x;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const scrollToVehicles = () => {
    const target =
      document.getElementById("consultant-vehicles") ||
      document.getElementById("ldp-vehicles") ||
      document.querySelector("[data-block-type='LdpVehiclesGrid']");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section
      id={anchorId}
      className="relative h-[85vh] min-h-[580px] md:h-[calc(100vh-112px)] md:min-h-[680px] flex flex-col justify-end bg-black text-white overflow-hidden select-none cursor-grab active:cursor-grabbing w-full"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onMouseLeave={() => { isDragging.current = false; }}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
            activeIndex === idx ? "opacity-95 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {/* Desktop Image */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover w-full h-full object-center transform transition-transform duration-10000"
            />
          </div>
          {/* Mobile Image */}
          <div className="block md:hidden relative w-full h-full">
            <Image
              src={slide.imageMobile || slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover w-full h-full object-center transform transition-transform duration-10000"
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-[144px] flex flex-col items-center justify-end text-center relative z-10 mt-auto pt-20 pb-8 md:pb-[24px]">
        {salesConsultant?.name && (
          <div className="mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide uppercase">
            <span>Showroom Chuyên Viên Kinh Doanh: {salesConsultant.name}</span>
          </div>
        )}

        <div key={activeIndex} className="max-w-3xl flex flex-col items-center text-center animate-fade-in">
          <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-bold tracking-tight leading-[1.2] text-white uppercase">
            {currentSlide.title}
          </h1>
          <p className="mt-2 text-sm sm:text-lg md:text-[22px] font-medium text-white/85 leading-[1.3] max-w-[90%] mx-auto">
            {currentSlide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row justify-center gap-3 pt-5 md:pt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (openDriveModal) openDriveModal();
                else if (openQuoteDrawer) openQuoteDrawer();
              }}
              className="bg-[#0562d2] hover:bg-[#066FEF] text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-xs md:text-base font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30 border-0 active:scale-95"
            >
              {currentSlide.buttonText || "Đăng ký lái thử"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToVehicles();
              }}
              className="bg-transparent hover:bg-white/10 border border-white text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-xs md:text-base font-semibold tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
            >
              Khám phá dòng xe
            </button>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 transition-all text-white z-20 cursor-pointer hidden md:flex items-center justify-center border-0 backdrop-blur-sm"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 transition-all text-white z-20 cursor-pointer hidden md:flex items-center justify-center border-0 backdrop-blur-sm"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Desktop Tabs */}
      {slides.length > 1 && (
        <div className="w-full hidden md:flex justify-center items-start relative z-10 pb-0">
          <div className="flex flex-row justify-center items-start gap-0 max-w-[960px] w-full">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`flex-1 text-center transition-all duration-300 text-sm lg:text-base font-semibold cursor-pointer border-r-0 border-l-0 border-b-0 px-2 line-clamp-1 ${
                  activeIndex === idx
                    ? "border-t-[3px] border-white text-white opacity-100 pt-[8px] pb-[16px]"
                    : "border-t-[1px] border-white/30 text-white opacity-60 hover:opacity-100 pt-[10px] pb-[16px]"
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Dots */}
      {slides.length > 1 && (
        <div className="w-full flex md:hidden justify-center items-center relative z-10 pb-4">
          <div className="flex flex-row gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`w-7 h-1 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                  activeIndex === idx ? "bg-[#0562d2]" : "bg-white/40"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
