"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "@/components/blocks/Blocks";
import ScrollReveal from "@/components/common/ScrollReveal";

// Vietnamese-accent-safe URL slug generator
const getVersionSlug = (verName: string) => {
  return verName.toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Extract version specific display name (e.g. "Titanium X" instead of "Ford Territory Titanium X")
const getVersionDisplayName = (verName: string, vehicleName: string) => {
  if (verName.toLowerCase().startsWith(vehicleName.toLowerCase())) {
    return verName.substring(vehicleName.length).trim();
  }
  return verName;
};

export default function VehicleVersionDetailClient() {
  const {
    vehicle,
    openQuoteDrawer
  } = useVehicle();

  const { id, versionSlug } = useParams() as { id: string; versionSlug: string };
  const router = useRouter();

  // 1. Resolve active version index by matching the slug from URL
  const activeVersionIndex = useMemo(() => {
    if (!vehicle || !vehicle.versions || vehicle.versions.length === 0) return 0;
    const idx = vehicle.versions.findIndex(
      (v: any) => getVersionSlug(v.name) === versionSlug
    );
    return idx !== -1 ? idx : 0;
  }, [vehicle, versionSlug]);

  // 2. Redirect/Replace state if path is invalid or matches placeholder `/phien-ban`
  useEffect(() => {
    if (!vehicle || !vehicle.versions || vehicle.versions.length === 0) return;
    const matchedIdx = vehicle.versions.findIndex(
      (v: any) => getVersionSlug(v.name) === versionSlug
    );
    if (matchedIdx === -1) {
      const firstSlug = getVersionSlug(vehicle.versions[0].name);
      router.replace(`/${id}/${firstSlug}`);
    }
  }, [vehicle, versionSlug, id, router]);

  const selectedVersion = vehicle?.versions?.[activeVersionIndex] || vehicle?.versions?.[0];

  const handleVersionSelect = (idx: number) => {
    if (vehicle && vehicle.versions[idx]) {
      const targetSlug = getVersionSlug(vehicle.versions[idx].name);
      router.push(`/${id}/${targetSlug}`);
    }
  };

  // 360 Viewer & Color Selection States
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [viewType, setViewType] = useState<"exterior" | "interior">("exterior");
  const [is360Active, setIs360Active] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // in degrees
  const [tilt, setTilt] = useState(0); // in degrees
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [openSpecsGroup, setOpenSpecsGroup] = useState<string | null>("Vận hành");

  // 360 preloading states
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [showDragHint, setShowDragHint] = useState(true);

  const getDetailedSpecs = () => {
    let rawSpecs = selectedVersion?.specs;
    if (typeof rawSpecs === 'string') {
      try {
        rawSpecs = JSON.parse(rawSpecs);
      } catch (e) {
        rawSpecs = null;
      }
    }

    if (Array.isArray(rawSpecs)) {
      return rawSpecs.map(s => ({
        category: s.title ?? s.category ?? '',
        content: s.content ?? ''
      }));
    }

    if (rawSpecs && typeof rawSpecs === 'object') {
      if (rawSpecs.detailed_specs && Array.isArray(rawSpecs.detailed_specs)) {
        return rawSpecs.detailed_specs.map((cat: any) => {
          const title = cat.title ?? cat.category ?? '';
          if (cat.content) {
            return { category: title, content: cat.content };
          }
          const items = cat.items || [];
          const listHtml = `<ul class="list-disc pl-4 space-y-1">${items.map((item: any) => {
            if (typeof item === 'string') return `<li>${item}</li>`;
            if (item.name && item.value) return `<li>${item.name.trim()}: <strong>${item.value.trim()}</strong></li>`;
            return `<li>${item.value || item.name || ''}</li>`;
          }).join('')}</ul>`;
          return { category: title, content: listHtml };
        });
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
        const val = rawSpecs[key];
        if (val != null && val !== '') {
          contentHtml += `<li>${keyLabelMap[key]}: <strong>${val}</strong></li>`;
          hasContent = true;
        }
      });
      Object.keys(rawSpecs).forEach(key => {
        if (!knownKeys.includes(key) && key !== 'detailed_specs') {
          const val = rawSpecs[key];
          if (val != null && val !== '') {
            contentHtml += `<li>${key}: <strong>${val}</strong></li>`;
            hasContent = true;
          }
        }
      });
      contentHtml += '</ul>';

      if (hasContent) {
        return [{ category: 'Thông số chung', content: contentHtml }];
      }
    }

    return [];
  };

  const colors = (selectedVersion?.colors && selectedVersion.colors.length > 0) ? selectedVersion.colors : [];
  const currentColor = (selectedColorIndex !== null && colors.length > 0) ? colors[selectedColorIndex] : null;

  // Detect if external or internal image sequence exists
  const hasExteriorSeq = (currentColor && currentColor.images_360 && currentColor.images_360.length > 0)
    || (vehicle && vehicle.images_360_external && vehicle.images_360_external.length > 0);

  const hasInteriorSeq = (currentColor && currentColor.images_360_internal && currentColor.images_360_internal.length > 0)
    || (vehicle && vehicle.images_360_internal && vehicle.images_360_internal.length > 0);

  const isImageSequence = (viewType === "exterior" && hasExteriorSeq) || (viewType === "interior" && hasInteriorSeq);

  const images360 = useMemo(() => {
    if (viewType === "exterior") {
      return (currentColor && currentColor.images_360 && currentColor.images_360.length > 0)
        ? currentColor.images_360
        : (vehicle?.images_360_external || []);
    } else {
      return (currentColor && currentColor.images_360_internal && currentColor.images_360_internal.length > 0)
        ? currentColor.images_360_internal
        : (vehicle?.images_360_internal || []);
    }
  }, [viewType, currentColor, vehicle]);

  // Preload 360 images in background sequentially/batches
  useEffect(() => {
    if (!is360Active || !isImageSequence || images360.length === 0) {
      setIsPreloaded(false);
      setPreloadProgress(0);
      return;
    }

    setIsPreloaded(false);
    setPreloadProgress(0);

    let loadedCount = 0;
    const total = images360.length;
    let isCancelled = false;

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = resolveImageUrl(url);
        img.onload = () => {
          if (isCancelled) return;
          loadedCount++;
          setPreloadProgress(Math.round((loadedCount / total) * 100));
          resolve();
        };
        img.onerror = () => {
          if (isCancelled) return;
          loadedCount++;
          setPreloadProgress(Math.round((loadedCount / total) * 100));
          resolve();
        };
      });
    };

    const batchSize = 4;
    const runBatches = async () => {
      for (let i = 0; i < total; i += batchSize) {
        if (isCancelled) break;
        const batch = images360.slice(i, i + batchSize).map((url: string) => preloadImage(url));
        await Promise.all(batch);
      }
      if (!isCancelled) {
        setIsPreloaded(true);
      }
    };

    runBatches();

    return () => {
      isCancelled = true;
    };
  }, [is360Active, isImageSequence, images360]);

  useEffect(() => {
    if (is360Active && isPreloaded) {
      setShowDragHint(true);
      const timer = setTimeout(() => {
        setShowDragHint(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [is360Active, isPreloaded]);

  const fallbackImageSrc = useMemo(() => {
    if (viewType === "interior") {
      return (currentColor?.images_360_internal && currentColor.images_360_internal.length > 0)
        ? currentColor.images_360_internal[0]
        : (currentColor?.image_360_internal || vehicle?.image_360_internal_url || currentColor?.image || selectedVersion?.image_url || vehicle?.image_url || "");
    }
    return (currentColor?.images_360 && currentColor.images_360.length > 0)
      ? currentColor.images_360[0]
      : (currentColor?.image || selectedVersion?.image_url || vehicle?.image_url || "");
  }, [viewType, currentColor, selectedVersion, vehicle]);

  const hasInteriorPhotos = useMemo(() => {
    if (currentColor) {
      if (currentColor.images_360_internal && currentColor.images_360_internal.length > 0) return true;
      if (currentColor.image_360_internal) return true;
    }
    if (vehicle) {
      if (vehicle.images_360_internal && vehicle.images_360_internal.length > 0) return true;
      if (vehicle.image_360_internal_url) return true;
    }
    return false;
  }, [currentColor, vehicle]);

  // Reset viewType to exterior if active version/color doesn't have interior photos
  useEffect(() => {
    if (!hasInteriorPhotos && viewType === "interior") {
      setViewType("exterior");
    }
  }, [hasInteriorPhotos, viewType]);

  // Reset 360 active state when color or version changes
  useEffect(() => {
    setIs360Active(false);
    setRotation(0);
    setTilt(0);
    setPan({ x: 0, y: 0 });
  }, [selectedColorIndex, activeVersionIndex]);

  // Auto-select first color when version changes or colors load
  useEffect(() => {
    if (colors && colors.length > 0) {
      if (selectedColorIndex === null || selectedColorIndex >= colors.length) {
        setSelectedColorIndex(0);
      }
    } else {
      setSelectedColorIndex(null);
    }
  }, [activeVersionIndex, colors, selectedColorIndex]);

  // Drag handlers for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPreloaded && isImageSequence) return; // Block drag during preload
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (!isPreloaded && isImageSequence) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    if (isImageSequence) {
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      if (viewType === "exterior") {
        setTilt((prev) => Math.max(-10, Math.min(10, prev - deltaY * 0.2)));
      }
    } else {
      setPan((prev) => ({
        x: Math.max(-300, Math.min(300, prev.x + deltaX)),
        y: Math.max(-150, Math.min(150, prev.y + deltaY)),
      }));
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (!isPreloaded && isImageSequence) return;
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    if (!isPreloaded && isImageSequence) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    if (isImageSequence) {
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      if (viewType === "exterior") {
        setTilt((prev) => Math.max(-10, Math.min(10, prev - deltaY * 0.2)));
      }
    } else {
      setPan((prev) => ({
        x: Math.max(-300, Math.min(300, prev.x + deltaX)),
        y: Math.max(-150, Math.min(150, prev.y + deltaY)),
      }));
    }
  };

  useEffect(() => {
    setRotation(0);
    setTilt(0);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [viewType]);

  // Format Prices
  const formatPrice = (price: any) => {
    const num = typeof price === 'string' ? parseFloat(price) : (price || 0);
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  // Render Exterior Sequence
  const renderExteriorSequence = () => {
    if (images360.length === 0) return null;
    const imagesCount = images360.length;
    const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / imagesCount)) % imagesCount;

    return (
      <div className="w-full h-full relative flex items-center justify-center">
        {!isPreloaded && (
          <div className="absolute inset-0 bg-[#f8f8f8]/90 z-30 flex flex-col items-center justify-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-10 h-10 border-4 border-gray-200 border-solid rounded-full"></div>
              <div className="absolute w-10 h-10 border-4 border-[#066fef] border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
            <div className="text-[11px] font-bold text-gray-500 tracking-wider font-antenna uppercase">
              Đang tải ảnh 3D... {preloadProgress}%
            </div>
            <div className="w-36 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#066fef] transition-all duration-150" 
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {images360[frameIdx] && (
          <img
            src={resolveImageUrl(images360[frameIdx])}
            alt={`${currentColor?.name || vehicle.name} exterior 360 view`}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-10"
          />
        )}
      </div>
    );
  };

  // Render Interior Sequence
  const renderInteriorSequence = () => {
    if (images360.length === 0) return null;
    const imagesCount = images360.length;
    const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / imagesCount)) % imagesCount;

    return (
      <div className="w-full h-full relative flex items-center justify-center">
        {!isPreloaded && (
          <div className="absolute inset-0 bg-[#f8f8f8]/90 z-30 flex flex-col items-center justify-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-10 h-10 border-4 border-gray-200 border-solid rounded-full"></div>
              <div className="absolute w-10 h-10 border-4 border-[#066fef] border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
            <div className="text-[11px] font-bold text-gray-500 tracking-wider font-antenna uppercase">
              Đang tải nội thất 3D... {preloadProgress}%
            </div>
            <div className="w-36 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#066fef] transition-all duration-150" 
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {images360[frameIdx] && (
          <img
            src={resolveImageUrl(images360[frameIdx])}
            alt={`${currentColor?.name || vehicle.name} interior 360 view`}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-10"
          />
        )}
      </div>
    );
  };

  // Extract Features for "Thiết kế chuẩn Ford" Carousel
  const features = useMemo(() => {
    const listBlock = vehicle?.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.features && listBlock.data.features.length > 0) {
      return listBlock.data.features.map((f: any) => ({
        title: f.title,
        desc: f.description || f.desc || "",
        image: f.image || vehicle.image_url
      }));
    }

    const gridBlock = vehicle?.layout_blocks?.find((b: any) => b.type === "FeaturesGrid");
    if (gridBlock && gridBlock.data) {
      const d = gridBlock.data;
      const list = [];
      if (d.title_1) list.push({ title: d.title_1, desc: "Thiết kế hiện đại và kiểu dáng khí động học đột phá.", image: d.image_1 || vehicle.images?.[0] });
      if (d.title_2) list.push({ title: d.title_2, desc: "Khoang lái thông minh, tinh tế và cao cấp hơn.", image: d.image_large || vehicle.images?.[1] });
      if (d.split_title) list.push({ title: d.split_title, desc: "Trang bị công nghệ hàng đầu cùng kết nối thông minh vượt trội.", image: d.split_image || vehicle.images?.[2] });
      if (list.length > 0) return list;
    }

    return [
      {
        title: "Diện mạo mới thêm phong cách",
        desc: "Mặt ca lăng lớn với lưới tản nhiệt chrome, các đường dập nổi sắc sảo đem đến dáng vẻ bề thế, tự tin đậm chất Ford.",
        image: vehicle?.images?.[1] || vehicle?.image_url || ""
      },
      {
        title: "Đèn pha LED đặc trưng sắc nét",
        desc: "Hệ thống chiếu sáng LED Matrix thông minh kết hợp dải đèn ban ngày ấn tượng tối ưu góc chiếu và an toàn tối đa.",
        image: vehicle?.images?.[2] || vehicle?.image_url || ""
      },
      {
        title: "Vành xe hợp kim nhôm hiện đại",
        desc: "Mâm xe hợp kim đúc thể thao kích thước lớn cứng cáp tôn thêm nét năng động, vững vàng trên mọi hành trình.",
        image: vehicle?.images?.[3] || vehicle?.image_url || ""
      },
      {
        title: "Thiết kế đuôi xe vững chãi",
        desc: "Cụm đèn hậu LED chữ L sắc sảo cùng đường dập gân phía sau tạo tổng thể thể thao khỏe khoắn đầy lôi cuốn.",
        image: vehicle?.images?.[0] || vehicle?.image_url || ""
      }
    ];
  }, [vehicle]);

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!vehicle) return null;

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans pb-24 select-none">
      <VehicleTabBar />

      {/* 1. Version Selector Section */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full pt-12 pb-4">
        <div className="w-full text-left">
          <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-[20px] text-gray-900 mb-2">
            Các phiên bản
          </h2>
          <div className="flex items-center overflow-x-auto scrollbar-none gap-6 py-2 w-full">
            {vehicle.versions?.map((ver: any, idx: number) => {
              const isActive = activeVersionIndex === idx;
              const imgUrl = ver.image_url || vehicle.image_url;

              return (
                <button
                  key={ver.id}
                  onClick={() => handleVersionSelect(idx)}
                  className={`flex flex-col items-center gap-2 cursor-pointer border-0 bg-transparent relative shrink-0 transition-transform group py-2 px-1 ${isActive ? "scale-102" : "hover:scale-[1.01] opacity-70 hover:opacity-95"
                    }`}
                >
                  <div className="w-[100px] aspect-[16/10] relative">
                    <img
                      src={resolveImageUrl(imgUrl)}
                      alt={ver.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className={`text-xs font-bold tracking-tight transition-colors uppercase ${isActive ? "text-[#066fef]" : "text-[#424242]"}`}>
                    {ver.name}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#066fef]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Selected Version Details & 360 Viewer Grid */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full pb-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Specifications & Info */}
          <div className="lg:col-span-5 flex flex-col items-start w-full">

            {/* Version Title & Short Description */}
            <div className="space-y-4 w-full text-left mt-2">
              <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[32px] sm:text-[38px] text-[#1a1a1a] leading-[1.1] tracking-tight">
                {vehicle.name === "Ford Mustang Mach-E" ? (
                  <>
                    Ford Mustang
                    <br />
                    Mach-E
                  </>
                ) : (
                  vehicle.name
                )}
                <br />
                {getVersionDisplayName(selectedVersion?.name || "", vehicle.name)}
              </h1>
              <p className="text-gray-600 text-xs sm:text-[14px] leading-relaxed max-w-md">
                {selectedVersion?.description || `${vehicle.name} ${selectedVersion?.name} phiên bản thế hệ mới sở hữu nét thiết kế đột phá, trang bị công nghệ lái an toàn hiện đại hàng đầu cùng cảm giác vận hành mạnh mẽ ưu việt.`}
              </p>
            </div>

            {/* Spec Sheets Details */}
            <div className="flex flex-col gap-6 text-left w-full mt-6">
              <div className="space-y-1 font-antenna">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Giá niêm yết từ</span>
                <span className="text-[28px] sm:text-[32px] font-extrabold text-[#066fef] block leading-none">
                  {selectedVersion ? formatPrice(selectedVersion.price) : formatPrice(vehicle.basePrice)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <button
                onClick={() => openQuoteDrawer(vehicle.id, selectedVersion?.id)}
                className="bg-[#066fef] hover:bg-[#01095c] transition-colors px-10 py-3 rounded-[4px] text-white text-[13px] font-bold cursor-pointer inline-flex items-center justify-center min-w-[140px] border-0 uppercase tracking-wider font-antenna"
              >
                Báo giá
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 360 Viewport & Colors Palette */}
          <div className="lg:col-span-7 flex flex-col items-center gap-6 w-full">
            {/* Viewport Box */}
            <div
              onMouseDown={is360Active && isImageSequence ? handleMouseDown : undefined}
              onMouseMove={is360Active && isImageSequence ? handleMouseMove : undefined}
              onMouseUp={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
              onMouseLeave={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
              onTouchStart={is360Active && isImageSequence ? handleTouchStart : undefined}
              onTouchMove={is360Active && isImageSequence ? handleTouchMove : undefined}
              onTouchEnd={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
              className={`w-full aspect-[16/10] bg-[#f8f8f8] rounded-none border border-gray-200 relative overflow-hidden flex items-center justify-center transition-all ${is360Active ? "cursor-grab active:cursor-grabbing shadow-inner" : "shadow-xs"
                }`}
            >
              {is360Active ? (
                viewType === "exterior" ? (
                  hasExteriorSeq ? renderExteriorSequence() : (
                    <div className="text-xs font-bold text-gray-400">Không có dữ liệu 3D ngoại thất</div>
                  )
                ) : (
                  hasInteriorSeq ? renderInteriorSequence() : (
                    <div className="text-xs font-bold text-gray-400">Không có dữ liệu 3D nội thất</div>
                  )
                )
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={resolveImageUrl(fallbackImageSrc)}
                    alt={currentColor?.name || selectedVersion?.name || vehicle.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {isImageSequence && (
                    <button
                      type="button"
                      onClick={() => setIs360Active(true)}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/15 hover:bg-black/35 transition-all p-3 rounded-full border border-white/20 cursor-pointer flex items-center justify-center size-[72px] z-10 text-white shadow-lg hover:scale-105 active:scale-95"
                    >
                      <svg className="w-10 h-10 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="M 82,50 A 32,32 0 1,1 72,28" strokeLinecap="round" />
                        <path d="M 60,28 L 73,28 L 73,40" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="50" y="56" fill="currentColor" fontSize="20" fontWeight="bold" textAnchor="middle" stroke="none">360°</text>
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Drag instruction overlay (fades out after 4 seconds) */}
              {is360Active && isPreloaded && showDragHint && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none select-none z-20 transition-opacity duration-1000 ease-in-out font-antenna uppercase tracking-wider shadow-md">
                  <svg className="w-4 h-4 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Kéo chuột hoặc vuốt màn hình để xoay 360°
                </div>
              )}

              {/* 360 active indicators */}
              {is360Active && (
                <button
                  type="button"
                  onClick={() => {
                    setIs360Active(false);
                    setRotation(0);
                  }}
                  className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white px-3.5 py-1.5 rounded-[4px] border-0 cursor-pointer text-xs font-bold transition-all shadow-md z-20 font-antenna uppercase tracking-wider"
                >
                  Tắt 360°
                </button>
              )}
            </div>

            {/* Paint Selector & View Type Toggle Row */}
            {((colors && colors.length > 0) || hasInteriorPhotos) && (
              <div className={`w-full flex items-center mt-6 ${colors && colors.length > 0 ? "justify-between" : "justify-end"}`}>
                {/* Left: Paint Selector */}
                {colors && colors.length > 0 && (
                  <div className="flex flex-col gap-2 items-start text-left">
                    <span className="text-sm font-bold text-gray-800">Bảng màu</span>
                    <div className="flex gap-2">
                      {colors.map((color: any, idx: number) => {
                        const isSelected = selectedColorIndex === idx || (selectedColorIndex === null && idx === 0 && !selectedVersion?.image_url);
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                              setSelectedColorIndex(idx);
                              setIs360Active(false);
                            }}
                            className={`w-9 h-9 rounded-md p-[2px] transition-all flex items-center justify-center cursor-pointer border ${isSelected ? "border-black ring-1 ring-black" : "border-gray-200 hover:scale-105"
                              }`}
                            title={color.name}
                          >
                            <div className="w-full h-full rounded-[4px] shadow-sm border border-black/5" style={{ backgroundColor: color.hex }} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Right: View Type Toggle Switch */}
                {hasInteriorPhotos && (
                  <div className="bg-white border border-gray-200 p-1 rounded-[4px] flex gap-1 shadow-xs self-end">
                    <button
                      type="button"
                      onClick={() => setViewType("exterior")}
                      className={`px-5 py-2 rounded-[4px] text-xs font-bold border-0 cursor-pointer transition-all uppercase tracking-wider ${viewType === "exterior" ? "bg-[#066fef] text-white shadow-xs" : "text-gray-500 hover:text-gray-900 bg-transparent"
                        }`}
                    >
                      Vẻ ngoài
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("interior")}
                      className={`px-5 py-2 rounded-[4px] text-xs font-bold border-0 cursor-pointer transition-all uppercase tracking-wider ${viewType === "interior" ? "bg-[#066fef] text-white shadow-xs" : "text-gray-500 hover:text-gray-900 bg-transparent"
                        }`}
                    >
                      Khoang Lái
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. "Thiết kế chuẩn Ford" Features Carousel */}
      {features.length > 0 && (
        <section className="bg-[#fafafa] border-t border-[#e5e5e5] py-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-10">

            {/* Header controls */}
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1 text-left font-antenna">
                <span className="text-xs font-bold uppercase tracking-wider text-[#066fef]">Đặc trưng dòng xe</span>
                <h2 className="font-display font-bold text-[32px] sm:text-[38px] text-[#1a1a1a] leading-tight uppercase tracking-wide">
                  Thiết kế chuẩn Ford
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollSlider('left')}
                  className="p-2.5 border border-gray-250 rounded-[4px] bg-white hover:bg-gray-55 transition shadow-xs cursor-pointer focus:outline-none flex items-center justify-center"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4.5 h-4.5 text-gray-650" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="p-2.5 border border-gray-250 rounded-[4px] bg-white hover:bg-gray-55 transition shadow-xs cursor-pointer focus:outline-none flex items-center justify-center"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4.5 h-4.5 text-gray-650" />
                </button>
              </div>
            </div>

            {/* Slider track container */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none w-full"
            >
              {features.map((feat: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white border border-gray-200 rounded-none overflow-hidden shadow-xs hover:shadow-sm transition-all shrink-0 w-[280px] sm:w-[340px] snap-start"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={resolveImageUrl(feat.image)}
                      alt={feat.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-2 text-left">
                    <h4 className="font-bold text-[#1a1a1a] text-md leading-tight">{feat.title}</h4>
                    <p className="text-xs text-gray-550 leading-relaxed font-normal">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 4. Detailed Technical Specifications Section */}
      <ScrollReveal direction="up" delay={150}>
        <section id="specs" className="w-full bg-[#f8f9fa] py-16 border-t border-[#e5e5e5]">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
            <div className="mb-10 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#066fef] block mb-2 font-antenna">Chi Tiết Kỹ Thuật</span>
              <h2 className="font-display font-bold text-2xl md:text-[32px] text-[#066fef] leading-tight tracking-tight uppercase tracking-wide">
                Thông số kỹ thuật của {vehicle.name === "Ford Mustang Mach-E" ? "Mach-E" : vehicle.name} {getVersionDisplayName(selectedVersion?.name || "", vehicle.name)}
              </h2>
            </div>

            <div className="flex flex-col w-full border-t border-[#e5e5e5]">
              {getDetailedSpecs().map((catGroup: any) => {
                const isOpen = openSpecsGroup === catGroup.category;
                return (
                  <div key={catGroup.category} className="border-b border-[#e5e5e5] w-full">
                    <button
                      onClick={() => setOpenSpecsGroup(isOpen ? null : catGroup.category)}
                      className={`flex justify-between items-center w-full text-left font-display font-bold text-base md:text-[18px] py-6 transition-colors cursor-pointer bg-transparent border-0 p-0 focus:outline-none uppercase tracking-wider ${isOpen ? "text-[#066fef]" : "text-[#424242] hover:text-[#066fef]"
                        }`}
                    >
                      <span>{catGroup.category}</span>
                      <span className="text-xl font-medium leading-none text-[#0562d2]">{isOpen ? "−" : "+"}</span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <div
                        className="px-0 pr-4 pb-8 text-[14px] md:text-[15px] text-[#424242] leading-relaxed font-normal whitespace-pre-line prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_p]:mb-1 [&_strong]:text-black"
                        dangerouslySetInnerHTML={{ __html: catGroup.content }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
