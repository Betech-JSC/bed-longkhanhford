"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LdpTechnologyBlockProps {
  data?: any;
  salesConsultant?: any;
  openDriveModal?: () => void;
  openQuoteDrawer?: () => void;
  anchorId?: string;
  isEditMode?: boolean;
}

const DEFAULT_TECH_SLIDES = [
  {
    title: "Ứng dụng Ford",
    description: "Ứng dụng Ford mang đến cho bạn trải nghiệm sở hữu trọn vẹn và dễ dàng trong tầm tay. Khi truy cập vào ứng dụng này, bạn có đầy đủ thông tin các tính năng của xe và kiểm tra về tình trạng xe.",
    image: "/assets/cq5dam.web.1280.1280.webp",
    category: "Lái xe",
  },
  {
    title: "Ford Co-Pilot360",
    description: "Dù trong thành phố hay ra xa lộ, hệ thống Ford Co-Pilot360™ - Công nghệ An toàn Hỗ trợ Người lái được thiết kế để giúp bạn cảm thấy tự tin hơn khi lái xe.",
    image: "/assets/blis-everest.webp",
    category: "Lái xe",
  },
  {
    title: "Hệ thống âm thanh cao cấp",
    description: "Hệ thống loa B&O cho trải nghiệm âm thanh tuyệt vời với chất âm trung thực và rõ ràng đến từng chi tiết.",
    image: "/assets/ford-raptor-tabbed-desktop.webp",
    category: "Giải trí",
  }
];

export default function LdpTechnologyBlock({
  data,
  salesConsultant,
  openDriveModal,
  openQuoteDrawer,
  anchorId = "technology",
  isEditMode = false,
}: LdpTechnologyBlockProps) {
  const slides = (data?.slides && Array.isArray(data.slides) && data.slides.length > 0)
    ? data.slides
    : DEFAULT_TECH_SLIDES;

  const [activeTab, setActiveTab] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);

  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragOffset < -60 && activeTab < slides.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else if (dragOffset > 60 && activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  const handleCta = () => {
    if (openDriveModal) {
      openDriveModal();
    } else if (openQuoteDrawer) {
      openQuoteDrawer();
    }
  };

  return (
    <section id={anchorId} className="w-full bg-[#00095b] py-20 text-white overflow-hidden relative select-none">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
        <div className="max-w-[1152px] mx-auto w-full">

          {/* Title Block */}
          <div className="mb-12">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
              Công nghệ
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-[-0.96px]">
              {data?.title || "Khơi nguồn trải nghiệm lái hoàn hảo"}
            </h2>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-8 mb-12">
            {slides.map((slide: any, idx: number) => (
              <div
                key={idx}
                className="flex-1 cursor-pointer group"
                onClick={() => setActiveTab(idx)}
              >
                <div className="pb-4 relative border-b border-white/10">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${activeTab === idx ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                    {slide.title}
                  </h3>
                  <div
                    className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0562d2] transition-transform duration-300 origin-left ${
                      activeTab === idx ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                    }`}
                  />
                </div>
                <p className={`mt-4 text-sm leading-relaxed transition-opacity duration-300 ${activeTab === idx ? "text-white/95 font-medium" : "text-white/60 font-light"}`}>
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Tabs */}
          <div className="flex md:hidden overflow-x-auto whitespace-nowrap gap-5 pb-3 mb-6 scrollbar-none border-b border-white/15">
            {slides.map((slide: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className="relative pb-2 flex-shrink-0 cursor-pointer border-0 bg-transparent"
              >
                <span className={`text-sm font-semibold transition-colors ${activeTab === idx ? "text-white" : "text-white/60"}`}>
                  {slide.title}
                </span>
                {activeTab === idx && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0562d2]" />
                )}
              </button>
            ))}
          </div>

          {/* Slider Container */}
          <div
            className="relative w-full overflow-hidden [--slide-width:85vw] md:[--slide-width:760px]"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            <div
              className="flex gap-6 cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${activeTab} * (var(--slide-width) + 24px) + ${dragOffset}px))`
              }}
            >
              {slides.map((slide: any, idx: number) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-[#121824] flex-shrink-0 w-[var(--slide-width)] select-none border border-white/10 shadow-2xl group"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 760px"
                    className="object-cover pointer-events-none group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Fraction Indicator */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                    {idx + 1}/{slides.length}
                  </div>

                  {/* Category tag */}
                  <div className="absolute bottom-4 left-4 bg-[#0562d2] text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase select-none">
                    {slide.category || "Công nghệ"}
                  </div>

                  {/* Navigation Chevrons */}
                  {activeTab === idx && idx < slides.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab((prev) => prev + 1);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg z-20 group-hover:scale-110 active:scale-95"
                      aria-label="Slide tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {activeTab === idx && idx > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab((prev) => prev - 1);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg z-20 group-hover:scale-110 active:scale-95"
                      aria-label="Slide trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Description */}
          <div className="block md:hidden mt-5 text-white/80 text-sm leading-relaxed min-h-[50px]">
            <p>{slides[activeTab]?.description}</p>
          </div>

          {/* CTA Action Button */}
          <div className="mt-8 flex justify-start">
            <button
              onClick={handleCta}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white border border-white text-white hover:text-[#00095b] px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-md group cursor-pointer active:scale-95"
            >
              <span>Trải nghiệm ngay</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
