"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, ChevronDown, Phone, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { mediaAPI } from "@/lib/api";

const formatUploadError = (err: any): string => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    if (err.data && typeof err.data === "object" && err.data.message) {
      return err.data.message;
    }
    if (err.message) return err.message;
    if (err.statusText) return `${err.statusText} (${err.status})`;
  }
  return "Đã xảy ra lỗi không xác định";
};

export const resolveImageUrl = (img: any): string => {
  if (!img) return "/assets/img-gradient-1.png";
  let path = "";
  if (typeof img === "string") {
    path = img;
  } else if (typeof img === "object") {
    path = img.url || img.path || "";
  }
  if (!path) return "/assets/img-gradient-1.png";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/") || path.startsWith("//")) {
    return path;
  }
  if (/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]+)?\//.test(path)) {
    return `https://${path}`;
  }
  const cleanPath = path.startsWith("uploads/") ? path.replace("uploads/", "") : path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const baseDomain = apiUrl.replace(/\/api$/, "");
  return `${baseDomain}/static/${cleanPath}`;
};

export const hasImageField = (img: any): boolean => {
  if (!img) return false;
  let path = "";
  if (typeof img === "string") {
    path = img;
  } else if (typeof img === "object") {
    path = img.url || img.path || "";
  }
  return typeof path === "string" && path.trim() !== "";
};

export const getYoutubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};


interface BlocksProps {
  layout?: any[];
  vehicle: any;
  openQuoteDrawer: (vehicleId?: string, versionId?: string) => void;
  openDriveModal: () => void;
  isEditMode?: boolean;
  onChangeBlock?: (index: number, updatedData: any) => void;
  onMoveBlock?: (index: number, direction: 'up' | 'down') => void;
  onDeleteBlock?: (index: number) => void;
  threeSixtyProps?: any;
  startIndex?: number;
  totalBlocks?: number;
  activeIndex?: number | null;
  onSelectBlock?: (index: number) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  draggedIndex?: number | null;
  draggedOverIndex?: number | null;
}

export default function Blocks({
  layout,
  vehicle,
  openQuoteDrawer,
  openDriveModal,
  isEditMode = false,
  onChangeBlock = () => { },
  onMoveBlock = () => { },
  onDeleteBlock = () => { },
  threeSixtyProps,
  startIndex = 0,
  totalBlocks,
  activeIndex = null,
  onSelectBlock,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedIndex = null,
  draggedOverIndex = null
}: BlocksProps) {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {layout.map((block, index) => {
        let blockComponent = null;

        switch (block.type) {
          case "HeroBanner":
            blockComponent = (
              <HeroBannerBlock
                blockIndex={startIndex + index}
                data={block.data}
                vehicle={vehicle}
                openQuoteDrawer={openQuoteDrawer}
                openDriveModal={openDriveModal}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "Promotions":
            blockComponent = (
              <PromotionsBlock
                blockIndex={startIndex + index}
                data={block.data}
                vehicle={vehicle}
                openQuoteDrawer={openQuoteDrawer}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "ThreeSixtyViewer":
            blockComponent = (
              <ThreeSixtyViewerBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                threeSixtyProps={threeSixtyProps}
                anchorId={block.anchorId}
              />
            );
            break;
          case "FeaturesGrid":
            blockComponent = (
              <FeaturesGridBlock
                blockIndex={startIndex + index}
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "VersionsGrid":
            blockComponent = (
              <VersionsGridBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                openQuoteDrawer={openQuoteDrawer}
                anchorId={block.anchorId}
              />
            );
            break;
          case "SpecsGrid":
            blockComponent = (
              <SpecsGridBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                openQuoteDrawer={openQuoteDrawer}
                anchorId={block.anchorId}
              />
            );
            break;
          case "FeaturesList":
            blockComponent = (
              <FeaturesListBlock
                blockIndex={startIndex + index}
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "AccordionFAQs":
            blockComponent = (
              <AccordionFAQsBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "BookingBanner":
            blockComponent = (
              <BookingBannerBlock
                blockIndex={startIndex + index}
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          default:
            blockComponent = null;
        }

        if (!blockComponent) return null;

        if (isEditMode) {
          const getBlockLabel = (type: string) => {
            switch (type) {
              case "HeroBanner": return "Banner lớn";
              case "Promotions": return "Khuyến mãi";
              case "ThreeSixtyViewer": return "Xoay 360°";
              case "FeaturesGrid": return "Lưới tính năng";
              case "VersionsGrid": return "Danh sách phiên bản";
              case "SpecsGrid": return "Thông số kỹ thuật";
              case "FeaturesList": return "Danh sách tính năng dọc";
              case "AccordionFAQs": return "Hỏi đáp (FAQs)";
              case "BookingBanner": return "Tư vấn & Đặt lịch";
              default: return type;
            }
          };

          return (
            <div
              key={block.id || `edit-wrapper-${index}`}
              draggable
              onDragStart={(e) => onDragStart && onDragStart(e, startIndex + index)}
              onDragOver={(e) => onDragOver && onDragOver(e, startIndex + index)}
              onDrop={(e) => onDrop && onDrop(e, startIndex + index)}
              onDragEnd={onDragEnd}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
                  return;
                }
                onSelectBlock && onSelectBlock(startIndex + index);
              }}
              className={`relative transition-all overflow-hidden group/block cursor-pointer
                ${activeIndex === startIndex + index ? "outline-[3px] outline-solid outline-[#008060] outline-offset-[-3px]" : "outline-[1.5px] outline-dashed outline-[#008060]/30 hover:outline-[#008060] outline-offset-[-1.5px]"}
                ${draggedIndex === startIndex + index ? "opacity-35 scale-[0.98] outline-dashed outline-gray-400" : ""}
                ${draggedOverIndex === startIndex + index ? "outline-amber-400 bg-amber-500/5" : ""}
              `}
            >
              {/* Block Action Controls Overlay */}
              <div className="absolute top-3 right-3 z-45 bg-white/95 backdrop-blur-xs shadow-md border border-gray-200 rounded-full px-4 py-1.5 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 uppercase mr-2 select-none">
                  #{startIndex + index + 1} {getBlockLabel(block.type)}
                </span>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={startIndex + index === 0}
                  onClick={() => onMoveBlock(index, 'up')}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Di chuyển lên"
                >
                  ↑
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={startIndex + index === (totalBlocks !== undefined ? totalBlocks : layout.length) - 1}
                  onClick={() => onMoveBlock(index, 'down')}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Di chuyển xuống"
                >
                  ↓
                </button>

                <div className="w-[1px] h-4 bg-gray-200" />

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteBlock(index)}
                  className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Xóa block"
                >
                  🗑️
                </button>
              </div>

              {blockComponent}
            </div>
          );
        }

        return (
          <div key={block.id || `wrapper-${index}`}>
            {blockComponent}
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   1. HERO BANNER BLOCK
   ========================================================================== */
function HeroBannerBlock({ blockIndex, data, vehicle, openQuoteDrawer, openDriveModal, isEditMode, onChangeData, anchorId }: any) {
  const [isVideoReady, setIsVideoReady] = React.useState(false);

  const title = data.title || vehicle.name;
  const tagline = data.tagline || vehicle.tagline;
  const btnText = data.button_text || "Book Lái thử";
  const btnLink = data.button_link || "#drive";
  const youtubeId = getYoutubeId(data.background_video || vehicle.video_url);
  const hasVehicleVideo = vehicle.video && (
    (typeof vehicle.video === 'string' && vehicle.video.trim() !== '') ||
    (typeof vehicle.video === 'object' && (vehicle.video.url || vehicle.video.path))
  );
  const bgVideo = youtubeId ? null : (
    data.background_video ||
    vehicle.video_url ||
    (hasVehicleVideo ? resolveImageUrl(vehicle.video) : null)
  );

  // Alignment classes
  const alignClass = data.align === 'left' ? 'items-start text-left'
    : data.align === 'right' ? 'items-end text-right ml-auto'
      : 'items-center text-center mx-auto';

  const btnAlignClass = data.align === 'center' ? 'justify-center'
    : data.align === 'right' ? 'justify-end'
      : 'justify-start';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px] md:text-[56px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-[28px] sm:text-[36px] md:text-[42px]";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[44px] sm:text-[58px] md:text-[68px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const taglineStyle = data.tagline_color ? { color: data.tagline_color } : {};

  const handleBtnClick = (e: React.MouseEvent) => {
    if (btnLink === "#drive" || btnText.toLowerCase().includes("lái thử")) {
      e.preventDefault();
      openDriveModal();
    } else if (btnLink === "#quote" || btnText.toLowerCase().includes("báo giá") || btnText.toLowerCase().includes("nhận báo giá")) {
      e.preventDefault();
      openQuoteDrawer();
    }
  };

  return (
    <section id={anchorId || undefined} className="relative h-[550px] sm:h-[650px] flex items-end overflow-hidden bg-black text-white pb-[68px] w-full">
      <div className="absolute inset-0 z-0">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&playsinline=1&enablejsapi=1`}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-5 scale-110 transition-opacity duration-1000 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsVideoReady(true)}
          />
        ) : bgVideo ? (
          <video
            src={bgVideo}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-5 transition-opacity duration-1000 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            onPlay={() => setIsVideoReady(true)}
            onPlaying={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent h-[250px] z-10" />

        {isEditMode && (
          <div className="absolute top-24 left-4 z-30 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md flex flex-col gap-2.5 max-w-[240px]">
            <div>
              <span className="block mb-1 font-bold text-[10px] uppercase tracking-wider text-gray-500">Video nền (URL MP4):</span>
              <input
                type="text"
                placeholder="https://example.com/video.mp4"
                value={data.background_video || ""}
                onChange={(e) => onChangeData({ ...data, background_video: e.target.value })}
                className="block w-full text-xs text-gray-800 px-2.5 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#008060] w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full relative z-20">
        <div className={`flex flex-col gap-[16px] sm:gap-[24px] py-[24px] w-full ${alignClass}`}>
          <h1
            className={`font-['Ford_Antenna',sans-serif] font-semibold text-white tracking-[-0.96px] leading-[1.15] uppercase ${titleSizeClass}
              ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
            style={titleStyle}
          >
            {title}
          </h1>

          <div className={`flex flex-wrap gap-[12px] items-start mt-2 w-full ${btnAlignClass}`}>
            <a
              href={btnLink}
              onClick={handleBtnClick}
              className={`bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[28px] py-[12px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20
                ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2' : ''}`}
            >
              {btnText}
            </a>
            <button
              onClick={() => openQuoteDrawer()}
              className="bg-transparent hover:bg-white/10 border border-solid border-white flex gap-[8px] items-center justify-center overflow-clip px-[28px] py-[12px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer"
            >
              Nhận Báo Giá
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function parseSpecs(specs: any, vehicleName: string): any[] {
  const parseDetailedItem = (item: any) => {
    if (item.content) {
      return {
        title: item.title ?? item.category ?? item.label ?? '',
        content: item.content
      };
    }
    if (Array.isArray(item.items)) {
      let contentHtml = '<ul class="list-disc pl-4 space-y-1">';
      item.items.forEach((subItem: any) => {
        const name = subItem.name || subItem.title || '';
        const value = subItem.value || subItem.content || '';
        if (name || value) {
          contentHtml += `<li>${name}: <strong>${value}</strong></li>`;
        }
      });
      contentHtml += '</ul>';
      return {
        title: item.title ?? item.category ?? item.label ?? '',
        content: contentHtml
      };
    }
    return {
      title: item.title ?? item.category ?? item.label ?? '',
      content: item.value ?? ''
    };
  };

  if (Array.isArray(specs)) {
    if (specs.length > 0 && (specs[0].items || specs[0].content)) {
      return specs.map(parseDetailedItem);
    }
    return specs.map(item => ({
      title: item.title ?? item.label ?? item.category ?? '',
      content: item.content ?? item.value ?? ''
    }));
  }

  if (specs && typeof specs === "object") {
    if (specs.detailed_specs && Array.isArray(specs.detailed_specs)) {
      return specs.detailed_specs.map(parseDetailedItem);
    }

    const keyLabelMap: Record<string, string> = {
      engine: 'Động cơ',
      power: 'Công suất cực đại',
      torque: 'Mô-men xoắn cực đại',
      transmission: 'Hộp số',
      drivetrain: 'Hệ dẫn động',
      dimensions: 'Kích thước (DxRxC)',
      clearance: 'Khoảng sáng gầm',
      fuelEconomy: 'Tiêu hao nhiên liệu'
    };
    const knownKeys = ['engine', 'power', 'torque', 'transmission', 'drivetrain', 'dimensions', 'clearance', 'fuelEconomy'];

    let contentHtml = '<ul class="list-disc pl-4 space-y-1">';
    let hasContent = false;
    knownKeys.forEach(key => {
      const val = specs[key];
      if (val != null && val !== '') {
        contentHtml += `<li>${keyLabelMap[key]}: <strong>${val}</strong></li>`;
        hasContent = true;
      }
    });
    Object.keys(specs).forEach(key => {
      if (!knownKeys.includes(key) && key !== 'detailed_specs') {
        const val = specs[key];
        if (val != null && val !== '') {
          contentHtml += `<li>${key}: <strong>${val}</strong></li>`;
          hasContent = true;
        }
      }
    });
    contentHtml += '</ul>';

    if (hasContent) {
      return [{ title: 'Thông số chung', content: contentHtml }];
    }
  }

  return [];
}

function VersionSpecsAccordion({ specs }: { specs: any[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  if (!specs || specs.length === 0) {
    return <div className="p-4 text-xs text-gray-400 italic text-center w-full">Chưa có thông số kỹ thuật.</div>;
  }

  return (
    <div className="w-full flex flex-col bg-white border-t border-gray-100">
      {specs.map((item: any, idx: number) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-b border-gray-100 w-full">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full py-4 px-4 flex items-center justify-between text-left font-semibold text-[#00095b] hover:text-[#0562d2] transition-colors duration-200 focus:outline-none cursor-pointer bg-white"
            >
              <span className="text-[14px] leading-tight font-medium">{item.title}</span>
              <span className="text-[#0562d2] font-normal text-lg select-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'
                }`}
            >
              <div
                className="px-4 text-[13px] text-gray-600 leading-relaxed font-normal whitespace-pre-line prose prose-sm max-w-none [&_p]:mb-1 [&_strong]:text-black"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpecsGridBlock({ data, vehicle, isEditMode, onChangeData, openQuoteDrawer, anchorId }: any) {
  const versions = vehicle.versions || [];

  if (versions.length === 0) return null;

  const compareItems = versions.map((ver: any, idx: number) => ({
    id: ver.id,
    name: ver.name,
    price: ver.price,
    image: resolveImageUrl(ver.image_thumbnail_url || ver.image_url || ver.image || vehicle.image_thumbnail_url || vehicle.image_url || vehicle.images?.[idx] || vehicle.images?.[0] || (idx === 0
      ? "/assets/territory-hero.png"
      : idx === 1
        ? "/assets/territory-tech-split.png"
        : "/assets/territory-promo.png")),
    specs: ver.specs || {},
    isExternal: false
  }));

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -392 : 392; // card width (368) + gap (24)
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const justifyClass = compareItems.length <= 3 ? 'lg:justify-center' : 'lg:justify-start';

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full pt-16 pb-12">
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">So sánh trực quan</span>
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[32px] sm:text-[40px] uppercase tracking-[-0.96px] leading-[1.2]">
              So sánh các phiên bản {vehicle.name.replace("NEW ", "")}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Bảng đối chiếu thông số kỹ thuật và trang bị trực quan giữa các phiên bản xe
            </p>
          </div>
          {compareItems.length > 3 && (
            <div className="flex gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-100 transition shadow-sm cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4.5 h-4.5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-100 transition shadow-sm cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4.5 h-4.5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          className={`flex flex-row gap-6 justify-start ${justifyClass} items-stretch w-full overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none`}
        >
          {compareItems.map((item: any) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200/60 drop-shadow-[0px_4px_4px_rgba(16,24,40,0.06)] flex flex-col items-stretch relative w-[280px] sm:w-[320px] md:w-[368px] shrink-0 rounded-[12px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg snap-start"
            >
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="aspect-[800/550] relative shrink-0 w-full bg-gray-50 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 368px"
                    className="object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                  />
                </div>
                <div className="content-stretch flex items-center justify-between p-[16px] relative shrink-0 w-full border-b border-gray-100 bg-white">
                  <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Ford_Antenna',sans-serif] font-semibold justify-center leading-[1.3] text-[#0562d2] text-[18px] tracking-[0.18px]">
                    <p>{item.name}</p>
                  </div>
                </div>
              </div>

              {/* specs */}
              <VersionSpecsAccordion specs={parseSpecs(item.specs, vehicle.name)} />

              <div className="p-4 bg-white flex flex-col items-center justify-center shrink-0 w-full border-t border-gray-100/50">
                <button
                  onClick={() => openQuoteDrawer(vehicle.id, item.id)}
                  className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-xs w-full"
                >
                  Báo giá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   3. FEATURES LIST BLOCK
   ========================================================================== */
function FeaturesListBlock({ blockIndex, data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const features = data.features || [];

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [features]);

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
    if (target.closest("button") || target.closest("input") || target.closest("a")) return;

    e.preventDefault();
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
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

  const handleFeatureTextChange = (idx: number, key: string, val: string) => {
    const newFeatures = [...features];
    newFeatures[idx] = { ...newFeatures[idx], [key]: val };
    onChangeData({ ...data, features: newFeatures });
  };

  const handleUploadFeatureImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        const newFeatures = [...features];
        newFeatures[idx] = { ...newFeatures[idx], image: res.url };
        onChangeData({ ...data, features: newFeatures });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  const handleAddFeature = () => {
    const newFeatures = [...features, {
      title: "TÍNH NĂNG MỚI",
      description: "Nhập mô tả tính năng ở đây để thu hút khách hàng.",
      image: ""
    }];
    onChangeData({ ...data, features: newFeatures });
  };

  const handleRemoveFeature = (idx: number) => {
    const newFeatures = features.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, features: newFeatures });
  };

  const align = data.align || 'center';
  const alignClass = align === 'left' ? 'text-left mr-auto ml-0'
    : align === 'right' ? 'text-right ml-auto mr-0'
      : 'text-center mx-auto';

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-150 pb-4">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">Tính năng vượt trội</span>
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[32px] sm:text-[40px] uppercase tracking-[-0.96px] leading-[1.2]">
              Trang Bị & Tiện Nghi
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Khám phá các trang bị công nghệ hiện đại và tiện ích đỉnh cao trên xe
            </p>
          </div>
          {features.length > 3 && (
            <div className="flex gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!showLeftArrow}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                  ${showLeftArrow
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                    : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                aria-label="Previous features"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!showRightArrow}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                  ${showRightArrow
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                    : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                aria-label="Next features"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative w-full">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-6 cursor-grab active:cursor-grabbing pb-4 w-full"
          >
            {features.map((feat: any, idx: number) => {
              const hasImg = hasImageField(feat.image);
              const featImg = hasImg ? resolveImageUrl(feat.image) : "";
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EAECF0] rounded-2xl p-5 flex flex-col hover:shadow-lg hover:border-[#0562d2]/40 transition-all duration-300 group relative shrink-0 snap-start
                    w-[85vw] sm:w-[45vw] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]"
                >
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="absolute top-2 right-2 z-25 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer font-semibold shadow-xs"
                    >
                      ✕ Xóa
                    </button>
                  )}

                  {(hasImg || isEditMode) && (
                    <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden mb-5 rounded-xl">
                      {hasImg ? (
                        <Image
                          src={featImg}
                          alt={feat.title || `Tính năng ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                          Chưa chọn ảnh
                        </div>
                      )}
                      {isEditMode && (
                        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-3 z-20">
                          <span className="text-[10px] font-bold text-gray-755 mb-2">Đổi ảnh:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadFeatureImage(idx, e)}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                window.parent.postMessage({
                                  type: "OPEN_FILE_MANAGER",
                                  index: blockIndex,
                                  field: "features",
                                  subIndex: idx
                                }, "*");
                              }
                            }}
                            className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                          >
                            📁 Chọn từ Quản lý file
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="inline-block text-xs font-bold text-[#0562D2] bg-blue-50 px-3 py-1 rounded-full mb-3 w-fit">
                    Nổi bật
                  </span>

                  <h3 className={`text-lg font-bold tracking-tight text-[#1A1A1A] mb-2 font-display uppercase group-hover:text-[#0562d2] transition-colors w-full
                    ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
                    {feat.title || "Tính năng mới"}
                  </h3>
                  <p className={`text-sm text-gray-600 leading-relaxed w-full
                    ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
                    {feat.description || "Mô tả tính năng vượt trội."}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Hover Side Navigation Arrows for Desktop Overlay */}
          {features.length > 3 && (
            <>
              <button
                type="button"
                onClick={() => scroll("left")}
                className={`absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 transition-all duration-300 cursor-pointer z-10 hover:bg-gray-50 active:scale-95 md:flex hidden
                  ${showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                aria-label="Previous features scroll overlay"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
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

        {isEditMode && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-colors shadow-md border-0"
            >
              + Thêm Tính năng mới
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   4. ACCORDION FAQS BLOCK
   ========================================================================== */
function AccordionFAQsBlock({ data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const colorListStr = vehicle?.colors?.map((c: any) => c.name).join(", ");
  const faqs = data.faqs || [
    {
      q: `Xe ${vehicle?.name || "Ford"} có những màu ngoại thất nào?`,
      a: `Dòng xe ${vehicle?.name || "Ford"} hiện đang phân phối tại Long Khánh Ford với các lựa chọn màu sắc ngoại thất: ${colorListStr || 'các phiên bản màu tiêu chuẩn'}.`
    },
    {
      q: `Chính sách bảo hành xe mới như thế nào?`,
      a: `Bảo hành chính hãng 3 năm hoặc 100.000 km tùy điều kiện nào đến trước.`
    }
  ];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const handleFaqTextChange = (idx: number, key: string, val: string) => {
    const newFaqs = [...faqs];
    newFaqs[idx] = { ...newFaqs[idx], [key]: val };
    onChangeData({ ...data, faqs: newFaqs });
  };

  const handleAddFaq = () => {
    const newFaqs = [...faqs, { q: "Câu hỏi thường gặp mới?", a: "Nhập câu trả lời ở đây." }];
    onChangeData({ ...data, faqs: newFaqs });
  };

  const handleRemoveFaq = (idx: number) => {
    const newFaqs = faqs.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, faqs: newFaqs });
  };

  const align = data.align || 'left';
  const alignClass = align === 'right' ? 'text-right'
    : align === 'center' ? 'text-center'
      : 'text-left';

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[80px] items-start justify-center">

        <div className={`lg:col-span-4 space-y-3 ${alignClass}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">Giải đáp thắc mắc</span>
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] uppercase">
            Hỏi đáp thường gặp
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Một số thắc mắc phổ biến của khách hàng khi tìm hiểu về dòng xe này.
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col items-start overflow-hidden rounded-[12px] border border-gray-200/50 w-full bg-white shadow-xs">
          {faqs.map((faq: any, idx: number) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={`w-full transition-all duration-300 px-[24px] py-[20px] bg-white relative
                  ${isExpanded ? "border-b-3 border-[#0562d2]" : "border-b border-[#f0f0f0] last:border-b-0"}`}
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-2 right-2 z-25 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer font-semibold"
                  >
                    ✕ Xóa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent py-1 transition-colors group"
                >
                  <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.5]
                      ${isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] group-hover:text-[#0562d2]"}
                      ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
                  >
                    {faq.q || "Câu hỏi thường gặp?"}
                  </span>
                  {isExpanded ? (
                    <Minus className="w-[20px] h-[20px] text-[#0562d2] shrink-0 ml-4" />
                  ) : (
                    <Plus className="w-[20px] h-[20px] text-gray-500 group-hover:text-[#0562d2] shrink-0 ml-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="pt-4 pb-2 text-sm text-[#424242] leading-relaxed transition-all duration-200 w-full">
                    <p className={`font-['Ford_Antenna',sans-serif] font-normal whitespace-pre-line w-full
                      ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
                    >
                      {faq.a || "Câu trả lời."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isEditMode && (
          <div className="flex justify-end mt-4 lg:col-span-12">
            <button
              type="button"
              onClick={handleAddFaq}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-colors shadow-md border-0"
            >
              + Thêm Câu hỏi mới
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

/* ==========================================================================
   5. PROMOTIONS BLOCK
   ========================================================================== */
function PromotionsBlock({ blockIndex, data, isEditMode, onChangeData, openQuoteDrawer, vehicle, anchorId }: any) {
  const title = data.title || "Ưu Đãi Đặc Biệt";
  const desc = data.description || "Nhập chương trình khuyến mãi tháng...";
  const hasImage = hasImageField(data.image);
  const bgImg = hasImage ? resolveImageUrl(data.image) : "";
  const btnText = data.button_text || "Báo giá";

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, image: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  // Alignment classes
  const alignClass = data.align === 'center' ? 'items-center text-center mx-auto'
    : data.align === 'right' ? 'items-end text-right ml-auto'
      : 'items-start text-left';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl sm:text-2xl md:text-3xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[40px] sm:text-[52px] md:text-[58px]";
  }

  // Desc Size Classes
  let descSizeClass = "text-[18px]";
  if (data.desc_size === 'small') {
    descSizeClass = "text-[14px] sm:text-[16px]";
  } else if (data.desc_size === 'large') {
    descSizeClass = "text-[20px] sm:text-[22px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const descStyle = data.desc_color ? { color: data.desc_color } : {};

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16">
      <div className="flex flex-col gap-[32px] w-full">
        <div className={`flex flex-col gap-[24px] pt-[32px] w-full max-w-[1152px] mx-auto ${alignClass}`}>
          <div className={`flex flex-col gap-[12px] w-full ${data.align === 'center' ? 'items-center' : data.align === 'right' ? 'items-end' : 'items-start'}`}>
            <h2
              className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] tracking-[-0.96px] leading-[1.2] ${titleSizeClass} w-full
                ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
              style={titleStyle}
            >
              {title}
            </h2>
            <p
              className={`font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] leading-[1.5] ${descSizeClass} w-full
                ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
              style={descStyle}
            >
              {desc}
            </p>
          </div>

          <button
            onClick={() => openQuoteDrawer(vehicle?.id)}
            className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-md hover:shadow-blue-500/20"
          >
            {btnText}
          </button>
        </div>

        {(hasImage || isEditMode) && (
          <div className="w-full mt-4 relative">
            {hasImage ? (
              <img
                src={bgImg}
                alt="Promotion Banner"
                className="object-cover rounded-[12px] w-full h-auto shadow-xs max-h-[500px]"
              />
            ) : (
              <div className="w-full h-[250px] bg-gray-50 border border-dashed border-gray-350 rounded-[12px] flex flex-col items-center justify-center text-xs text-gray-400">
                <span className="font-semibold text-gray-500 mb-1">Chưa chọn ảnh khuyến mãi</span>
                <span className="text-[10px] text-gray-400">Ảnh sẽ ẩn trên giao diện thực tế</span>
              </div>
            )}
            {isEditMode && (
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Ảnh khuyến mãi:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="block w-full text-xs text-gray-500 file:mr-2.5 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.parent.postMessage({
                        type: "OPEN_FILE_MANAGER",
                        index: blockIndex,
                        field: "image"
                      }, "*");
                    }
                  }}
                  className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                >
                  📁 Chọn từ Quản lý file
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   6. 360 VIEWER BLOCK
   ========================================================================== */
function ThreeSixtyViewerBlock({ data, vehicle, isEditMode, onChangeData, threeSixtyProps, anchorId }: any) {
  const title = data.title || (vehicle?.id === "mustang-fastback" ? "360° Colorizer & Viewer" : "Khám phá không gian đa chiều");
  const desc = data.description || (vehicle?.id === "mustang-fastback"
    ? "Tùy biến ngoại thất và nội thất theo phong cách riêng của bạn. Kéo để xoay 360 độ hoặc chọn màu sơn và mâm xe."
    : "Diện mạo mới đầy cuốn hút! Trải nghiệm góc nhìn đa chiều và chọn màu sắc ngoại thất yêu thích.");

  // Alignment classes
  const alignClass = data.align === 'center' ? 'items-center text-center mx-auto'
    : data.align === 'right' ? 'items-end text-right ml-auto'
      : 'items-start text-left';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl sm:text-2xl md:text-3xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[40px] sm:text-[52px] md:text-[58px]";
  }

  // Desc Size Classes
  let descSizeClass = "text-[18px]";
  if (data.desc_size === 'small') {
    descSizeClass = "text-[14px] sm:text-[16px]";
  } else if (data.desc_size === 'large') {
    descSizeClass = "text-[20px] sm:text-[22px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const descStyle = data.desc_color ? { color: data.desc_color } : {};

  if (!threeSixtyProps) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16 border-t border-[#e5e5e5] text-center text-gray-400">
        360 Viewer đang tải...
      </section>
    );
  }

  const {
    selectedColorIndex, setSelectedColorIndex,
    activeVersionIndex, setActiveVersionIndex,
    viewType, setViewType,
    is360Active, setIs360Active,
    rotation, setRotation,
    tilt, setTilt,
    pan, setPan,
    isDragging, setIsDragging,
    isTrimDropdownOpen, setIsTrimDropdownOpen,
    isMobileColorOpen, setIsMobileColorOpen,
    isMobileInteriorColorOpen, setIsMobileInteriorColorOpen,
    isMobileWheelOpen, setIsMobileWheelOpen,
    selectedInteriorColorIndex, setSelectedInteriorColorIndex,
    failedImages, setFailedImages,
    selectedWheel, setSelectedWheel,
    renderCarPicture,
    renderInteriorCarPicture,
    handleMouseDown, handleMouseMove, handleMouseUpOrLeave, handleTouchStart, handleTouchMove,
    threeRef,
    media
  } = threeSixtyProps;

  const activeVersion = vehicle?.versions?.[activeVersionIndex];
  const colors = (activeVersion?.colors && activeVersion.colors.length > 0) ? activeVersion.colors : [];
  const currentColor = colors.length > 0 ? colors[selectedColorIndex] : null;
  const hasInteriorSequence = (currentColor && currentColor.images_360_internal && currentColor.images_360_internal.length > 0)
    || (vehicle && (vehicle as any).images_360_internal && (vehicle as any).images_360_internal.length > 0);

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[32px] items-start w-full">
        <div className={`flex flex-col pt-[32px] w-full max-w-[1152px] gap-[12px] ${alignClass}`}>
          <h2
            className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] tracking-[-0.96px] leading-[1.2] uppercase ${titleSizeClass} w-full
              ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
            style={titleStyle}
          >
            {title}
          </h2>
          <p
            className={`font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] leading-[1.5] ${descSizeClass} w-full
              ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}
            style={descStyle}
          >
            {desc}
          </p>
        </div>

        <div className="cmp-360-colorizer-wrapper w-full">
          <div id="360Colorizer" aria-label="360 Viewer" className="cmp-360-colorizer">
            <div className={`model-wrapper ${viewType}`}>

              <div className="cmp-360-colorizer__vehicle-variation-container">
                <div
                  className="dropdown trimAware__dropdown dropdown-trim dropdownWrapper"
                  aria-expanded={isTrimDropdownOpen}
                >
                  <div
                    className="dropdown-trigger"
                    role="combobox"
                    tabIndex={0}
                    aria-expanded={isTrimDropdownOpen}
                    onClick={() => setIsTrimDropdownOpen(!isTrimDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsTrimDropdownOpen(false), 200)}
                  >
                    <div className="dropdown-activeTrim">{vehicle.versions[activeVersionIndex]?.name || vehicle.name}</div>
                    <div className="dropdown-active__icon">
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  <div className="dropdown-menu-wrapper" role="listbox" tabIndex={-1}>
                    {vehicle.versions.map((ver: any, idx: number) => (
                      <div
                        key={ver.id}
                        className={`dropdown-item trimAware__item trimAware__item--enable ${activeVersionIndex === idx ? "active-option" : ""}`}
                        role="option"
                        aria-selected={activeVersionIndex === idx}
                        onClick={() => {
                          setActiveVersionIndex(idx);
                          setIsTrimDropdownOpen(false);
                        }}
                      >
                        {ver.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="toggle-wrapper">
                <div className="model-view toggle-container">
                  <div className="toggle" role="tablist">
                    <button
                      type="button"
                      className={`toggle-option border-0 cursor-pointer ${viewType === "exterior" ? "active" : "bg-transparent"}`}
                      onClick={() => setViewType("exterior")}
                    >
                      Exterior
                    </button>
                    <button
                      type="button"
                      className={`toggle-option border-0 cursor-pointer ${viewType === "interior" ? "active" : "bg-transparent"}`}
                      onClick={() => {
                        setViewType("interior");
                        setIs360Active(true);
                      }}
                    >
                      Interior
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className={`view-wrapper ${viewType === "exterior" ? "show" : ""}`}>
                  {colors && colors.length > 0 && (
                    <div className="exteriorPaint">
                      <div className="color-selector-container">
                        <div className="color-selector" role="radiogroup">
                          {colors.map((color: any, idx: number) => (
                            <div
                              key={color.name}
                              className={`color-container ${selectedColorIndex === idx ? "selected" : ""}`}
                              onClick={() => setSelectedColorIndex(idx)}
                              title={color.name}
                            >
                              <div className="color" style={{ backgroundColor: color.hex }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="paint-color">
                        Paint Color: <span className="uppercase text-[#0562D2]">{colors[selectedColorIndex]?.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`view-wrapper ${viewType === "interior" ? "show" : ""}`}>
                  <div className="interiorColors">
                    <div className="color-selector-container">
                      <div className="color-selector interior" role="radiogroup">
                        <div
                          className={`color-container ${selectedInteriorColorIndex === 0 ? "selected" : ""}`}
                          onClick={() => setSelectedInteriorColorIndex(0)}
                          title="Black Onyx"
                        >
                          <div className="color" style={{ backgroundColor: "#1b1a1a" }}></div>
                        </div>
                        <div
                          className={`color-container ${selectedInteriorColorIndex === 1 ? "selected" : ""}`}
                          onClick={() => setSelectedInteriorColorIndex(1)}
                          title="Space Gray"
                        >
                          <div className="color" style={{ backgroundColor: "#c8c6c4" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="paint-color interior">
                      Interior: <span className="uppercase text-[#0562D2]">{selectedInteriorColorIndex === 0 ? "Black Onyx" : "Space Gray"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="car-image-container select-none cursor-grab active:cursor-grabbing w-full h-[400px] md:h-[580px] relative overflow-hidden"
                onMouseDown={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleMouseDown : undefined}
                onMouseMove={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleMouseMove : undefined}
                onMouseUp={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleMouseUpOrLeave : undefined}
                onMouseLeave={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleMouseUpOrLeave : undefined}
                onTouchStart={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleTouchStart : undefined}
                onTouchMove={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleTouchMove : undefined}
                onTouchEnd={is360Active && (viewType === "exterior" || (viewType === "interior" && hasInteriorSequence)) ? handleMouseUpOrLeave : undefined}
              >
                {is360Active ? (
                  viewType === "exterior" ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
                      <div
                        className="absolute bottom-8 w-[60%] h-6 bg-black/15 blur-md rounded-[100%] transition-transform duration-100 pointer-events-none"
                        style={{
                          transform: `scaleX(${1 - Math.abs(tilt) / 40}) scaleY(${1 - Math.abs(rotation % 180 - 90) / 180}) rotateZ(${rotation * 0.05}deg)`,
                        }}
                      />
                      {renderCarPicture()}
                    </div>
                  ) : (
                    hasInteriorSequence ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
                        {renderInteriorCarPicture()}
                      </div>
                    ) : (
                      (vehicle.image_360_internal_url && !vehicle.image_360_internal_url.match(/\.(jpg|jpeg|png|webp|gif)/i)) ? (
                        <div className="w-full h-full relative overflow-hidden bg-black">
                          <iframe
                            src={vehicle.image_360_internal_url}
                            className="w-full h-full border-0 absolute inset-0"
                            allowFullScreen
                            allow="gyroscope; accelerometer"
                          />
                        </div>
                      ) : (
                        <div ref={threeRef} className="w-full h-full relative overflow-hidden bg-black" />
                      )
                    )
                  )
                ) : (
                  <>
                    <img
                      src={resolveImageUrl(vehicle.id === "mustang-fastback"
                        ? `/images/360/mustang/ecoboostfastback/exterior/desktop/adriatic-blue-green/64f/001-adriatic-blue-green-64f.jpeg`
                        : vehicle.id === "new-territory"
                          ? (viewType === "exterior" ? "/assets/territory-3d.png" : "/assets/territory-interior.png")
                          : (viewType === "exterior"
                            ? (() => {
                              const colorImg = (colors?.[selectedColorIndex] || colors?.[0])?.image;
                              if (colorImg) {
                                return colorImg;
                              }
                              return vehicle.images?.[0] || vehicle.image_url || "/assets/car-everest.png";
                            })()
                            : media.splitLeft))}
                      alt="3D vehicle preview"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIs360Active(true)}
                      className="absolute bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 transition-all p-[12px] rounded-[800px] border-0 cursor-pointer flex flex-col items-center justify-center size-[96px] z-10 text-white gap-1 group left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider group-hover:underline">Bật 360°</span>
                    </button>
                  </>
                )}

                {is360Active && (
                  <button
                    type="button"
                    onClick={() => {
                      setIs360Active(false);
                      setRotation(0);
                      setTilt(0);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="absolute top-[80px] right-4 md:top-[28px] md:left-[368px] md:right-auto bg-black/75 hover:bg-black text-white px-4 py-2 rounded-full border-0 cursor-pointer text-xs font-bold transition-all shadow-md z-40 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Tắt 360°</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   7. FEATURES GRID BLOCK
   ========================================================================== */
function FeaturesGridBlock({ blockIndex, data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const title_1 = data.title_1 || "Thiết kế hiện đại, sắc sảo, đầy cuốn hút";
  
  const hasImg1 = hasImageField(data.image_1);
  const image_1 = hasImg1 ? resolveImageUrl(data.image_1) : "";

  const hasImg2 = hasImageField(data.image_2);
  const image_2 = hasImg2 ? resolveImageUrl(data.image_2) : "";

  const hasImg3 = hasImageField(data.image_3);
  const image_3 = hasImg3 ? resolveImageUrl(data.image_3) : "";

  const title_2 = data.title_2 || "Không gian nội thất rộng rãi, tiện nghi";
  
  const hasImgLarge = hasImageField(data.image_large);
  const image_large = hasImgLarge ? resolveImageUrl(data.image_large) : "";

  const hasImgLarge2 = hasImageField(data.image_large_2);
  const image_large_2 = hasImgLarge2 ? resolveImageUrl(data.image_large_2) : "";

  const hasImgLarge3 = hasImageField(data.image_large_3);
  const image_large_3 = hasImgLarge3 ? resolveImageUrl(data.image_large_3) : "";

  const title_3 = data.title_3 || "Nâng tầm công nghệ và tiện nghi Tận hưởng trên mọi hành trình";
  
  const hasSplitImg = hasImageField(data.split_image);
  const split_image = hasSplitImg ? resolveImageUrl(data.split_image) : "";

  const split_title = data.split_title || "Tiện nghi thông minh";
  const split_features = data.split_features || [];

  const handleUploadImage = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, [key]: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  const handleFeatureChange = (idx: number, key: string, val: string) => {
    const newFeatures = [...split_features];
    newFeatures[idx] = { ...newFeatures[idx], [key]: val };
    onChangeData({ ...data, split_features: newFeatures });
  };

  const handleAddFeature = () => {
    const newFeatures = [...split_features, { value: "Giá trị", label: "Mô tả nhãn" }];
    onChangeData({ ...data, split_features: newFeatures });
  };

  const handleRemoveFeature = (idx: number) => {
    const newFeatures = split_features.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, split_features: newFeatures });
  };

  const align = data.align || 'center';
  const alignClass = align === 'left' ? 'items-start text-left'
    : align === 'right' ? 'items-end text-right'
      : 'items-center text-center';

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[48px] items-center">

        <div className={`flex flex-col pt-[32px] px-[48px] w-full max-w-[1152px] text-black ${alignClass}`}>
          <h2 className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] w-full
            ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
            {title_1}
          </h2>
        </div>

        {(hasImg1 || hasImg2 || hasImg3 || isEditMode) && (
          <div className="flex flex-col gap-[24px] items-start w-full">
            {(hasImg1 || isEditMode) && (
              <div className="aspect-[1100/600] relative rounded-[12px] overflow-hidden w-full bg-gray-150 shadow-xs">
                {hasImg1 ? (
                  <img src={image_1} alt="Grid 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 min-h-[300px]">
                    Chưa chọn ảnh 1
                  </div>
                )}
                {isEditMode && (
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                    <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh 1:</span>
                    <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_1", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.parent.postMessage({
                            type: "OPEN_FILE_MANAGER",
                            index: blockIndex,
                            field: "image_1"
                          }, "*");
                        }
                      }}
                      className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                    >
                      📁 Chọn từ Quản lý file
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {(hasImg2 || hasImg3 || isEditMode) && (
              <div className="flex gap-[24px] items-start w-full flex-col sm:flex-row">
                {(hasImg2 || isEditMode) && (
                  <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
                    {hasImg2 ? (
                      <img src={image_2} alt="Grid 2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 min-h-[150px]">
                        Chưa chọn ảnh 2
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                        <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh 2:</span>
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_2", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.parent.postMessage({
                                type: "OPEN_FILE_MANAGER",
                                index: blockIndex,
                                field: "image_2"
                              }, "*");
                            }
                          }}
                          className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                        >
                          📁 Chọn từ Quản lý file
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {(hasImg3 || isEditMode) && (
                  <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
                    {hasImg3 ? (
                      <img src={image_3} alt="Grid 3" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 min-h-[150px]">
                        Chưa chọn ảnh 3
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                        <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh 3:</span>
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_3", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.parent.postMessage({
                                type: "OPEN_FILE_MANAGER",
                                index: blockIndex,
                                field: "image_3"
                              }, "*");
                            }
                          }}
                          className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                        >
                          📁 Chọn từ Quản lý file
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col pt-[32px] px-[48px] w-full max-w-[1152px] mt-8 text-black ${alignClass}`}>
          <h2 className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] w-full
            ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
            {title_2}
          </h2>
        </div>

        {(hasImgLarge || hasImgLarge2 || hasImgLarge3 || isEditMode) && (
          <div className="flex gap-0 items-stretch w-full flex-col lg:flex-row min-h-[400px] lg:h-[600px] rounded-[12px] overflow-hidden shadow-xs">
            {/* Left large image */}
            {(hasImgLarge || isEditMode) && (
              <div className={`aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[300px]
                ${(hasImgLarge2 || hasImgLarge3 || isEditMode) ? "flex-1 lg:flex-[2]" : "w-full flex-1"}`}>
                {hasImgLarge ? (
                  <img src={image_large} alt="Interior Large" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                    Chưa chọn ảnh nội thất lớn
                  </div>
                )}
                {isEditMode && (
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                    <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh lớn (Trái):</span>
                    <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.parent.postMessage({
                            type: "OPEN_FILE_MANAGER",
                            index: blockIndex,
                            field: "image_large"
                          }, "*");
                        }
                      }}
                      className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                    >
                      📁 Chọn từ Quản lý file
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Right stacked images */}
            {(hasImgLarge2 || hasImgLarge3 || isEditMode) && (
              <div className={`flex flex-col gap-0 w-full min-h-[300px]
                ${(hasImgLarge || isEditMode) ? "flex-1" : "w-full flex-1"}`}>
                {(hasImgLarge2 || isEditMode) && (
                  <div className="flex-1 aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[140px]">
                    {hasImgLarge2 ? (
                      <img src={image_large_2} alt="Interior Small 1" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                        Chưa chọn ảnh phụ 1
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                        <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh phụ 1 (Phải trên):</span>
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large_2", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.parent.postMessage({
                                type: "OPEN_FILE_MANAGER",
                                index: blockIndex,
                                field: "image_large_2"
                              }, "*");
                            }
                          }}
                          className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                        >
                          📁 Chọn từ Quản lý file
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {(hasImgLarge3 || isEditMode) && (
                  <div className="flex-1 aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[140px]">
                    {hasImgLarge3 ? (
                      <img src={image_large_3} alt="Interior Small 2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                        Chưa chọn ảnh phụ 2
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                        <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh phụ 2 (Phải dưới):</span>
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large_3", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.parent.postMessage({
                                type: "OPEN_FILE_MANAGER",
                                index: blockIndex,
                                field: "image_large_3"
                              }, "*");
                            }
                          }}
                          className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                        >
                          📁 Chọn từ Quản lý file
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col pt-[32px] px-[48px] w-full max-w-[1152px] mt-8 text-black ${alignClass}`}>
          <h2 className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] w-full
            ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
            {title_3}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-[4px] h-auto lg:h-[660px] items-stretch justify-center w-full">
          {(hasSplitImg || isEditMode) && (
            <div className="flex-1 min-h-[350px] relative rounded-t-[12px] lg:rounded-t-none lg:rounded-l-[12px] overflow-hidden bg-gray-150 shadow-xs">
              {hasSplitImg ? (
                <img src={split_image} alt="Split Detail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  Chưa chọn ảnh công nghệ
                </div>
              )}
              {isEditMode && (
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
                  <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Thay thế ảnh trái:</span>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage("split_image", e)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.parent.postMessage({
                          type: "OPEN_FILE_MANAGER",
                          index: blockIndex,
                          field: "split_image"
                        }, "*");
                      }
                    }}
                    className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
                  >
                    📁 Chọn từ Quản lý file
                  </button>
                </div>
              )}
            </div>
          )}

          <div className={`bg-[#0562d2] flex flex-col h-full items-start px-[24px] py-[32px] rounded-b-[12px] lg:rounded-b-none lg:rounded-r-[12px] shrink-0 w-full text-white
            ${(hasSplitImg || isEditMode) ? "lg:w-[480px]" : "flex-grow"}`}>
            <div className="flex flex-col justify-between h-full w-full min-h-[400px]">
              <h3 className={`font-['Ford_Antenna',sans-serif] font-semibold text-[32px] sm:text-[36px] leading-[1.32] pb-6 border-b border-white/20 w-full
                ${isEditMode ? 'outline-[1px] outline-dashed outline-white/50 hover:outline-white outline-offset-2 cursor-pointer transition-all' : ''}`}>
                {split_title}
              </h3>

              <div className="flex flex-col gap-[28px] pt-8 flex-grow">
                {split_features.map((feat: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-[4px] items-start w-full relative group">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="absolute -top-1 -right-2 text-white/50 hover:text-white text-xs border-0 bg-transparent cursor-pointer font-bold"
                      >
                        ✕ Xóa
                      </button>
                    )}
                    <p className={`font-['Ford_Antenna',sans-serif] font-semibold text-[32px] leading-[1.2] w-full
                      ${isEditMode ? 'outline-[1px] outline-dashed outline-white/50 hover:outline-white outline-offset-2 cursor-pointer transition-all' : ''}`}>
                      {feat.value}
                    </p>
                    <p className={`font-['Ford_Antenna',sans-serif] font-normal text-[16px] leading-[1.5] text-white/90 w-full
                      ${isEditMode ? 'outline-[1px] outline-dashed outline-white/50 hover:outline-white outline-offset-2 cursor-pointer transition-all' : ''}`}>
                      {feat.label}
                    </p>
                  </div>
                ))}

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full border-0 cursor-pointer w-fit"
                  >
                    + Thêm chỉ số
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   8. VERSIONS GRID BLOCK
   ========================================================================== */
function VersionsGridBlock({ data, vehicle, isEditMode, onChangeData, anchorId, openQuoteDrawer }: any) {
  const vehicleName = vehicle?.name || "";
  const cleanName = vehicleName.toLowerCase().startsWith("ford")
    ? vehicleName.slice(4).trim()
    : vehicleName;
  const title = data.title || `Các mẫu xe Ford ${cleanName.replace("NEW ", "") || ""}`;
  const descriptions = data.descriptions || [];
  const versions = vehicle?.versions || [];

  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDescChange = (idx: number, val: string) => {
    const newDescs = [...descriptions];
    newDescs[idx] = val;
    onChangeData({ ...data, descriptions: newDescs });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };



  const align = data.align || 'center';
  const alignClass = align === 'left' ? 'text-left'
    : align === 'right' ? 'text-right'
      : 'text-center';

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[32px] items-center w-full">

        <div className="flex items-center justify-between w-full max-w-[1152px] gap-4">
          <div className={`flex-grow text-black ${alignClass}`}>
            <h2 className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[32px] sm:text-[42px] tracking-[-0.96px] leading-[1.2] uppercase w-full
              ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
              {title}
            </h2>
          </div>
          {/* Slider Buttons */}
          {!isEditMode && versions.length > 3 && (
            <div className="flex justify-end gap-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="p-2 border border-gray-200 rounded-full bg-white hover:bg-gray-100 transition shadow-xs cursor-pointer focus:outline-none"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 border border-gray-200 rounded-full bg-white hover:bg-gray-100 transition shadow-xs cursor-pointer focus:outline-none"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Outer container */}
        <div className="relative w-full overflow-hidden">
          {/* Horizontal scroll container */}
          <div
            ref={sliderRef}
            className="flex gap-[24px] overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none w-full pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {versions.map((ver: any, idx: number) => {
              const defaultDesc = idx === 0
                ? `Phiên bản Ford ${cleanName} ${ver.name} 2026 sở hữu nhiều nâng cấp đắt giá về cả thiết kế ngoại thất lẫn nội thất.`
                : `Trải nghiệm vận hành ấn tượng cùng công nghệ kết nối thông minh vượt trội của Ford ${cleanName} ${ver.name}.`;

              const desc = descriptions[idx] || defaultDesc;

              // Quyết định ảnh: Lấy ảnh đại diện (thumbnail) của phiên bản nếu có, nếu không lấy ảnh đặc trưng, nếu không lấy ảnh trong images array theo index, nếu không lấy ảnh chính của xe
              const versionImage = ver.image_thumbnail_url || ver.image_url || vehicle?.images?.[idx] || vehicle?.images?.[0] || vehicle?.image;
              const imgUrl = mounted ? resolveImageUrl(versionImage) : "/assets/img-gradient-1.png";

              return (
                <div
                  key={ver.id}
                  onClick={isEditMode ? undefined : () => openQuoteDrawer?.(vehicle?.id, ver.id)}
                  className={`flex flex-col items-center overflow-hidden rounded-[12px] text-left border border-gray-200/60 p-5 bg-white transition-all duration-300 shadow-xs h-auto justify-between snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${isEditMode ? "" : "hover:scale-[1.01] hover:shadow-md cursor-pointer group hover:border-[#0562d2]/40"
                    }`}
                >
                  <div className="aspect-[4/3] relative rounded-[8px] overflow-hidden w-full bg-white flex items-center justify-center shrink-0">
                    <img
                      src={imgUrl}
                      alt={ver.name}
                      className="w-full h-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  </div>

                  <div className="flex flex-col items-start pt-[20px] w-full flex-grow justify-between">
                    <div className="flex flex-col gap-[10px] items-start w-full">
                      <p className="font-['Ford_Antenna',sans-serif] font-bold text-[#1a1a1a] text-[18px] sm:text-[20px] leading-[1.3] group-hover:text-[#0562d2] transition-colors">
                        {ver.name}
                      </p>
                      <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[15px] sm:text-[16px]">
                        {formatPrice(ver.price)}
                      </p>

                      <p className={`font-['Ford_Antenna',sans-serif] font-normal text-[#616161] text-[13px] sm:text-[14px] leading-[1.5] line-clamp-3 w-full
                        ${isEditMode ? 'outline-[1px] outline-dashed outline-[#008060]/70 hover:outline-[#008060] outline-offset-2 cursor-pointer transition-all' : ''}`}>
                        {desc}
                      </p>
                    </div>

                    {!isEditMode && (
                      <div className="mt-5 font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[13px] sm:text-[14px] flex items-center gap-1 group-hover:text-[#044ea7] transition-colors">
                        <span>Xem chi tiết &amp; Ước tính lăn bánh</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   9. BOOKING BANNER BLOCK
   ========================================================================== */
function BookingBannerBlock({ blockIndex, data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const title = data.title || "Kết nối ngay với chuyên viên Long Khánh Ford";
  const phone = data.phone || "1800 55 68 58";
  const btnText = data.btn_text || "Đặt lịch hẹn";
  const btnLink = data.btn_link || "/lien-he";
  const hasCarImage = hasImageField(data.car_image) || vehicle?.image_url;
  const carImage = hasImageField(data.car_image) ? resolveImageUrl(data.car_image) : "/assets/everest_platinum.png";

  const handleUploadCarImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, car_image: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  // Title Size Classes
  let titleSizeClass = "text-3xl lg:text-[38px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl lg:text-2xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[38px] lg:text-[44px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};

  const align = data.align || 'left';
  const alignClass = align === 'center' ? 'items-center text-center mx-auto'
    : align === 'right' ? 'items-end text-right ml-auto'
      : 'items-start text-left';

  const btnAlignClass = align === 'center' ? 'justify-center'
    : align === 'right' ? 'justify-end'
      : 'justify-start';

  return (
    <section id={anchorId || undefined} className="w-full relative h-[420px] md:h-[480px] flex items-center overflow-hidden border-t border-gray-100">
      {/* Background Image */}
      <img
        src={carImage}
        alt="Ford Lifestyle Banner"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      {/* Overlay to darken image slightly for better contrast on the card's backdrop */}
      <div className="absolute inset-0 bg-black/25 z-0" />

      {/* Main Content Area */}
      <div className="max-w-[1440px] w-full mx-auto px-4 xl:px-[80px] relative z-10 flex items-center h-full">
        {/* Floating White Card */}
        <div className={`bg-white p-8 md:p-10 rounded-[20px] shadow-2xl max-w-[480px] w-full flex flex-col gap-5 text-gray-900 border border-gray-100 ${alignClass}`}>
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#002F6C] bg-[#002F6C]/10 px-3 py-1.5 rounded-full w-fit font-antenna">
            Tư vấn &amp; Hỗ trợ 24/7
          </span>

          <h3
            className={`font-bold font-display leading-tight text-[#00095B] tracking-tight ${titleSizeClass} w-full
                ${isEditMode ? 'outline-[1px] outline-dashed outline-gray-300 hover:outline-gray-400 outline-offset-2 cursor-pointer transition-all' : ''}`}
            style={titleStyle}
          >
            {title.includes("Long Khánh Ford") ? (
              <>
                {title.replace("Long Khánh Ford", "").trim()}{" "}
                <span className="text-[#0562d2]">Long Khánh Ford</span>
              </>
            ) : title}
          </h3>

          <p className="text-xs md:text-sm text-gray-500 font-medium font-antenna leading-relaxed">
            Hãy để chúng tôi đồng hành cùng bạn. Đội ngũ chuyên viên tư vấn giàu kinh nghiệm luôn sẵn sàng giải đáp thắc mắc, gửi báo giá tốt nhất và đăng ký lịch lái thử xe nhanh chóng.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 w-full ${btnAlignClass} mt-1`}>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className={`flex items-center justify-center gap-2.5 bg-[#002F6C] hover:bg-[#001D4A] text-white font-bold px-6 py-3.5 rounded-full text-xs md:text-sm transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0 font-antenna uppercase tracking-wider flex-1
                  ${isEditMode ? 'outline-[1px] outline-dashed outline-gray-300 hover:outline-gray-400 outline-offset-2 cursor-pointer transition-all' : ''}`}
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
            <a
              href={btnLink}
              className="flex items-center justify-center gap-2.5 bg-transparent hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-black font-bold px-6 py-3.5 rounded-full text-xs md:text-sm transition-all duration-300 active:scale-95 cursor-pointer shrink-0 font-antenna uppercase tracking-wider flex-1"
            >
              <Bookmark className="w-4 h-4" />
              <span>{btnText}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Background Image Upload for Visual Editor (Admin Mode) */}
      {isEditMode && (
        <div className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-md">
          <span className="block mb-2 font-bold text-[10px] uppercase tracking-wider text-gray-500">Ảnh nền banner:</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadCarImage}
            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.parent.postMessage({
                  type: "OPEN_FILE_MANAGER",
                  index: blockIndex,
                  field: "car_image"
                }, "*");
              }
            }}
            className="w-full mt-1.5 py-1 px-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-[10px] font-bold rounded cursor-pointer border-0 transition-colors"
          >
            📁 Chọn từ Quản lý file
          </button>
        </div>
      )}
    </section>
  );
}
