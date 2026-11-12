"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannersAPI } from "@/lib/api";
import { siteAssets, resolveImageUrl, getPopularVehicleImage } from "@/lib/site-assets";
import { formatPersonName } from "@/lib/formatters";

const getYoutubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface LdpHeroBannerBlockProps {
  data?: any;
  salesConsultant?: any;
  vehicle?: any;
  openQuoteDrawer?: (vehicleId?: any, versionId?: any) => void;
  openDriveModal?: (vehicleId?: any) => void;
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
  isConsultantSlide?: boolean;
  roleTitle?: string;
  consultantName?: string;
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
  vehicle,
  openQuoteDrawer,
  openDriveModal,
  anchorId = "hero-banner",
  isEditMode = false,
}: LdpHeroBannerBlockProps) {
  const consultantCoverUrl = resolveImageUrl(salesConsultant?.cover_image_url || salesConsultant?.cover_image);
  const consultantName = salesConsultant?.name ? formatPersonName(salesConsultant.name) : "";

  // 1. Dành riêng cho trang chi tiết xe của LDP: Cố định thông tin & hình ảnh/video của đúng dòng xe đang xem
  const vehicleRawImage = vehicle
    ? data?.background_image ||
      (Array.isArray(vehicle.images) && vehicle.images.length > 0 ? vehicle.images[0] : null) ||
      vehicle.image_url ||
      vehicle.image ||
      getPopularVehicleImage(vehicle.slug || vehicle.id)
    : null;
  const vehicleImage = vehicleRawImage ? resolveImageUrl(vehicleRawImage) : null;

  // Kiểm tra video nền chuẩn 100% như trang chi tiết xe chính thức (/san-pham/[slug])
  const youtubeId = vehicle ? getYoutubeId(data?.background_video || vehicle?.video_url) : null;
  const hasVehicleVideo = vehicle?.video && (
    (typeof vehicle.video === "string" && vehicle.video.trim() !== "") ||
    (typeof vehicle.video === "object" && (vehicle.video.url || vehicle.video.static_url || vehicle.video.path))
  );
  const bgVideo = vehicle && !youtubeId
    ? (data?.background_video ||
       (typeof vehicle?.video_url === "string" && (vehicle.video_url.endsWith(".mp4") || vehicle.video_url.includes(".mp4")) ? vehicle.video_url : null) ||
       (hasVehicleVideo ? resolveImageUrl(vehicle.video) : null))
    : null;

  const videoRef = (el: HTMLVideoElement | null) => {
    if (el) {
      el.muted = true;
      el.setAttribute("muted", "true");
      el.setAttribute("playsinline", "true");
      el.setAttribute("webkit-playsinline", "true");
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const vehicleTitle = (
    data?.title ||
    vehicle?.name ||
    vehicle?.title ||
    "LONG KHÁNH FORD"
  ).toUpperCase();

  const vehicleSubtitle =
    data?.tagline ||
    data?.subtitle ||
    vehicle?.tagline ||
    (vehicle?.typeName
      ? `Dòng xe ${vehicle.typeName} thế hệ mới tại Long Khánh Ford`
      : "Trải nghiệm sức mạnh, công nghệ và sự an toàn vượt trội cùng Ford Việt Nam.");

  const vehicleSlide: BannerSlide = {
    id: `vehicle-${vehicle?.id || vehicle?.slug || "lead"}`,
    title: vehicleTitle,
    subtitle: vehicleSubtitle,
    image: vehicleImage || siteAssets.heroSlides[0],
    imageMobile: vehicleImage || siteAssets.heroSlides[0],
    buttonText: "Đăng ký lái thử",
  };

  const prependCoverSlide = (list: BannerSlide[]): BannerSlide[] => {
    if (!consultantCoverUrl) return list;
    const roleTitle = (salesConsultant?.job_title || "CHUYÊN VIÊN KINH DOANH").toUpperCase();
    const formattedName = consultantName ? consultantName.toUpperCase() : "";
    return [
      {
        id: "consultant-cover-slide",
        isConsultantSlide: true,
        roleTitle,
        consultantName: formattedName,
        title: formattedName ? `${roleTitle} ${formattedName}` : (list[0]?.title || "LONG KHÁNH FORD"),
        subtitle: salesConsultant?.short_bio || "Tư vấn tận tâm — Báo giá lăn bánh ưu đãi nhất — Giao xe tận nhà",
        image: consultantCoverUrl,
        imageMobile: consultantCoverUrl,
        buttonText: "Đăng ký lái thử",
      },
      ...list,
    ];
  };

  const [slides, setSlides] = useState<BannerSlide[]>(() => {
    if (vehicle) {
      return [vehicleSlide];
    }
    if (data?.banners && Array.isArray(data.banners) && data.banners.length > 0) {
      return prependCoverSlide(data.banners);
    }
    return prependCoverSlide(DEFAULT_SLIDES);
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Nạp banner chính thức từ hệ thống nếu chưa có trong cấu hình block VÀ không phải trang chi tiết xe
  useEffect(() => {
    if (vehicle) {
      setSlides([vehicleSlide]);
      setActiveIndex(0);
      return;
    }

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
              image: resolveImageUrl(item.image_url || item.image) || siteAssets?.heroSlides?.[0] || DEFAULT_SLIDES[0].image,
              imageMobile: resolveImageUrl(item.image_mobile_url || item.image_url || item.image) || siteAssets?.heroSlides?.[0] || DEFAULT_SLIDES[0].image,
              buttonText: item.button_text || "Đăng ký lái thử",
              buttonLink: item.button_link || "#consultant-vehicles",
            }));

          if (formatted.length > 0) {
            setSlides(prependCoverSlide(formatted));
          }
        }
      })
      .catch(() => {
        // Giữ fallback mặc định nếu API lỗi
      });
  }, [data, consultantCoverUrl, vehicle?.id, vehicle?.slug, vehicleImage, vehicleTitle, vehicleSubtitle]);

  // Tự động chuyển slide sau mỗi 6s (chỉ chạy khi có nhiều slide)
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
      document.getElementById("ldp-vehicles-grid") ||
      document.getElementById("showroom") ||
      document.getElementById("default-versions-grid") ||
      document.getElementById("consultant-vehicles") ||
      document.getElementById("ldp-vehicles") ||
      document.getElementById("ldp-vehicle-intro") ||
      document.querySelector("[data-block-type='LdpVehiclesGrid']");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section
      id={anchorId}
      className={`relative h-[62vh] min-h-[460px] sm:h-[70vh] sm:min-h-[520px] md:h-[calc(100vh-112px)] md:min-h-[680px] flex flex-col justify-end bg-black text-white overflow-hidden select-none w-full ${
        slides.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      onMouseDown={(e) => { if (slides.length > 1) handleDragStart(e.clientX); }}
      onMouseUp={(e) => { if (slides.length > 1) handleDragEnd(e.clientX); }}
      onMouseLeave={() => { isDragging.current = false; }}
      onTouchStart={(e) => { if (slides.length > 1) handleDragStart(e.touches[0].clientX); }}
      onTouchEnd={(e) => { if (slides.length > 1) handleDragEnd(e.changedTouches[0].clientX); }}
    >
      {/* Background Media: Video nền nếu xe có video (chuẩn như trang chi tiết chính), ngược lại hiển thị Slides/Image */}
      {youtubeId ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&playsinline=1&enablejsapi=1`}
            className="absolute inset-0 w-full h-full object-cover scale-125 z-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 z-1" />
        </div>
      ) : bgVideo ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={bgVideo}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 z-1" />
        </div>
      ) : (
        /* Background Slides */
        slides.map((slide, idx) => (
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
                className={`object-cover w-full h-full transform transition-transform duration-10000 ${
                  slide.isConsultantSlide ? "object-[15%_center]" : "object-center"
                }`}
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
                className={`object-cover w-full h-full transform transition-transform duration-10000 ${
                  slide.isConsultantSlide ? "object-[15%_center]" : "object-center"
                }`}
              />
            </div>
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
          </div>
        ))
      )}

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-[144px] flex flex-col items-center justify-end text-center relative z-10 mt-auto pt-20 pb-8 md:pb-[24px]">
        <div key={activeIndex} className="max-w-3xl flex flex-col items-center text-center animate-fade-in">
          <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-bold tracking-tight leading-[1.2] text-white uppercase">
            {currentSlide.consultantName ? (
              <span className="flex flex-col items-center tracking-tight leading-tight uppercase animate-fade-in">
                <span className="text-xs sm:text-lg md:text-2xl font-semibold text-white/90 tracking-wider">
                  {currentSlide.roleTitle || "CHUYÊN VIÊN KINH DOANH"}
                </span>
                <span className="text-xl sm:text-3xl lg:text-[46px] font-black text-white mt-1">
                  {currentSlide.consultantName}
                </span>
              </span>
            ) : (
              currentSlide.title
            )}
          </h1>
          <p className="mt-2 text-xs sm:text-lg md:text-[22px] font-medium text-white/85 leading-[1.3] max-w-[92%] mx-auto">
            {currentSlide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row justify-center gap-3 pt-5 md:pt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (openDriveModal) openDriveModal(vehicle?.id);
                else if (openQuoteDrawer) openQuoteDrawer(vehicle?.id);
              }}
              className="bg-[#0562d2] hover:bg-[#066FEF] text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-xs md:text-base font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30 border-0 active:scale-95"
            >
              {vehicle ? "Đăng ký lái thử" : (currentSlide.buttonText || "Đăng ký lái thử")}
            </button>
            {vehicle ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (openQuoteDrawer) openQuoteDrawer(vehicle?.id);
                }}
                className="bg-transparent hover:bg-white/10 border border-white text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-xs md:text-base font-semibold tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                Nhận báo giá lăn bánh
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToVehicles();
                }}
                className="bg-transparent hover:bg-white/10 border border-white text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full text-xs md:text-base font-semibold tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                Khám phá dòng xe
              </button>
            )}
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
