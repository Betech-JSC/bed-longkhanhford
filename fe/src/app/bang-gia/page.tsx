"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { vehiclesAPI } from "@/lib/api";
import { formatVND } from "@/lib/rolling-cost";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { ChevronRight, Calculator, FileText, Info } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import { motion, AnimatePresence } from "motion/react";
import { APIVehicle } from "@/types/api";

interface VersionItem {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  image_thumbnail_url?: string;
  specs: Record<string, string | undefined>;
}

interface ColorItem {
  name: string;
  hex: string;
  image_path: string | null;
}

interface GroupedVehicle {
  id: string;
  name: string;
  type: string;
  typeName: string;
  image_url: string;
  versions: VersionItem[];
  colors: ColorItem[];
}

// Helper function to group individual dynamic variants into parent model series
function groupVehiclesBySeries(apiVehicles: APIVehicle[]): GroupedVehicle[] {
  const groups: Record<string, GroupedVehicle> = {};

  apiVehicles.forEach((vehicle) => {
    let seriesKey = "";
    let seriesName = "";
    let typeName = "";
    
    const titleLower = vehicle.title.toLowerCase();
    if (titleLower.includes("territory")) {
      seriesKey = "ford-territory";
      seriesName = "FORD TERRITORY";
      typeName = "SUV 5 Chỗ";
    } else if (titleLower.includes("everest")) {
      seriesKey = "ford-everest";
      seriesName = "FORD EVEREST";
      typeName = "SUV 7 Chỗ";
    } else if (titleLower.includes("ranger") || titleLower.includes("raptor")) {
      seriesKey = "ford-ranger";
      seriesName = "FORD RANGER";
      typeName = "Bán tải 5 Chỗ";
    } else if (titleLower.includes("transit")) {
      seriesKey = "ford-transit-2024";
      seriesName = "FORD TRANSIT";
      typeName = "Thương mại 16 Chỗ";
    } else if (titleLower.includes("tourneo")) {
      seriesKey = "new-tourneo";
      seriesName = "FORD TOURNEO";
      typeName = "MPV 7 Chỗ";
    } else {
      seriesKey = vehicle.slug || `vehicle-${vehicle.id}`;
      seriesName = vehicle.title;
      seriesKey = seriesKey === "ranger-wildtrak" ? "ford-ranger" : seriesKey;
      seriesKey = seriesKey === "everest-titanium-plus" ? "ford-everest" : seriesKey;
      seriesKey = seriesKey === "territory-titanium-x" ? "ford-territory" : seriesKey;
      seriesKey = seriesKey === "transit-premium" ? "ford-transit-2024" : seriesKey;
      seriesName = vehicle.title;
      typeName = vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại";
    }

    const vehicleColors = (vehicle.colors || []) as unknown as ColorItem[];

    if (!groups[seriesKey]) {
      groups[seriesKey] = {
        id: seriesKey,
        name: seriesName,
        type: vehicle.type || "suv",
        typeName: typeName,
        image_url: vehicle.image_thumbnail_url || vehicle.image_url || "",
        versions: [],
        colors: vehicleColors
      };
    } else {
      // Merge colors
      if (vehicleColors.length > 0) {
        vehicleColors.forEach((col) => {
          if (!groups[seriesKey].colors.some((existingCol) => existingCol.hex === col.hex)) {
            groups[seriesKey].colors.push(col);
          }
        });
      }
    }

    const vehicleVersions = vehicle.versions && vehicle.versions.length > 0
      ? vehicle.versions.map(v => ({
          id: v.id,
          name: v.name || v.version_name || vehicle.title,
          price: typeof v.price === 'string' ? parseFloat(v.price) : Number(v.price || 0),
          image_url: v.image_url,
          image_thumbnail_url: v.image_thumbnail_url,
          specs: (v.specs || {}) as Record<string, string | undefined>
        }))
      : [{
          id: vehicle.slug || `version-${vehicle.id}`,
          name: vehicle.title,
          price: typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : Number(vehicle.base_price || 0),
          specs: {} as Record<string, string | undefined>
        }];

    vehicleVersions.forEach((v) => {
      groups[seriesKey].versions.push({
        id: v.id || `v-${v.name}`,
        name: v.name,
        price: v.price,
        specs: v.specs
      });
    });
  });

  const seriesList = Object.values(groups);
  seriesList.forEach((group) => {
    group.versions.sort((a, b) => b.price - a.price);
  });

  return seriesList;
}

export default function PriceListPage() {
  const [vehicles, setVehicles] = useState<GroupedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [selectedColorNames, setSelectedColorNames] = useState<Record<string, string>>({});
  const [selectedVersionIds, setSelectedVersionIds] = useState<Record<string, string | number>>({});

  useEffect(() => {
    vehiclesAPI
      .getAll({ with_versions: 1 })
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const grouped = groupVehiclesBySeries(res.data);
          setVehicles(grouped);
        }
      })
      .catch((err) => {
        console.error("Error loading vehicles for price list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: "all", name: "Tất cả dòng xe" },
    { id: "suv", name: "Dòng xe SUV" },
    { id: "pickup", name: "Dòng xe bán tải" },
    { id: "commercial", name: "Xe thương mại" }
  ];

  const filteredVehicles = activeTab === "all"
    ? vehicles
    : vehicles.filter(v => v.type === activeTab);

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 to-[#00095b] text-white pt-28 pb-14 md:pb-18 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/60 font-medium flex items-center gap-1.5 mb-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Bảng giá xe Ford</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-[1.2] mb-3 font-antenna">
              Bảng giá xe Ford 2026
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto font-antenna">
              Giá niêm yết chính hãng mới nhất, cập nhật liên tục. Liên hệ
              Hotline <strong className="text-white">0918 90 90 60</strong> để
              nhận ưu đãi tốt nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Listing Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin inline-block w-10 h-10 border-4 border-[#066fef] border-t-transparent rounded-full" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Đang tải bảng giá xe mới nhất...</p>
            </div>
          ) : (
            <>
              {/* Category Segment Tabs */}
              <div className="flex items-center justify-center border-b border-neutral-200 mb-12">
                <div className="flex gap-8 overflow-x-auto no-scrollbar py-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap cursor-pointer ${
                        activeTab === cat.id
                          ? "text-[#066fef]"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {cat.name}
                      {activeTab === cat.id && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#066fef]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Model Blocks */}
              <motion.div layout className="space-y-12">
                <AnimatePresence mode="popLayout">
                  {filteredVehicles.map((vehicle) => {
                    const specs = vehicle.versions[0]?.specs || {};
                    
                    // Get active version selection
                    const defaultVersion = vehicle.versions[0];
                    const activeVersionId = selectedVersionIds[vehicle.id] !== undefined
                      ? selectedVersionIds[vehicle.id]
                      : defaultVersion?.id;
                    const activeVersion = vehicle.versions.find(v => v.id === activeVersionId) || defaultVersion;

                    // Find the first color matching active image_url to highlight on initial load
                    const firstMatchIdx = vehicle.colors.findIndex(c => c.image_path && (
                      c.image_path === vehicle.image_url ||
                      (typeof window !== 'undefined' && `${window.location.origin}/storage/${c.image_path}` === vehicle.image_url)
                    ));
                    const defaultActiveIdx = firstMatchIdx !== -1 ? firstMatchIdx : 0;
                    
                    const activeImg = selectedColors[vehicle.id] 
                      || activeVersion?.image_url 
                      || activeVersion?.image_thumbnail_url 
                      || vehicle.image_url 
                      || getPopularVehicleImage(vehicle.id);
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        key={vehicle.id}
                        className="bg-white border border-neutral-200 rounded-none overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                          {/* Left Panel: Visual, Color selector & Specs */}
                          <div className="lg:col-span-6 p-6 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col justify-between">
                            <div>
                              {/* Vehicle Type Name Tag */}
                              <span className="text-[10px] font-bold tracking-widest text-[#066fef] uppercase bg-[#066fef]/10 px-2.5 py-1 rounded-[4px] inline-block mb-4">
                                {vehicle.typeName}
                              </span>
                              
                              {/* Large Visual Container */}
                              <div className="relative w-full h-[200px] md:h-[280px] flex items-center justify-center overflow-hidden mb-6 group">
                                <Image
                                  src={activeImg}
                                  alt={vehicle.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-contain transition-transform duration-500 group-hover:scale-103"
                                  onError={handleImageError}
                                  unoptimized={true}
                                  priority
                                />
                              </div>

                              {/* Color selector dots */}
                              {vehicle.colors && vehicle.colors.length > 0 && (
                                <div className="mb-6">
                                  <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-3 block">
                                    Màu sắc ngoại thất
                                  </span>
                                  <div className="flex flex-wrap gap-3">
                                    {vehicle.colors.map((color, idx) => {
                                      const colorImg = color.image_path || "";
                                      const colorHex = color.hex || "#ffffff";
                                      
                                      // Determine if this color is currently active
                                      const isSelected = selectedColorNames[vehicle.id]
                                          ? selectedColorNames[vehicle.id] === color.name
                                          : idx === defaultActiveIdx;

                                      return (
                                        <button
                                          key={idx}
                                          onClick={() => {
                                            setSelectedColorNames(prev => ({ ...prev, [vehicle.id]: color.name }));
                                            if (colorImg) {
                                              setSelectedColors(prev => ({ ...prev, [vehicle.id]: colorImg }));
                                            }
                                          }}
                                          className={`w-7 h-7 rounded-full border relative flex items-center justify-center transition-all duration-200 ${
                                            isSelected 
                                              ? "border-[#066fef] ring-2 ring-offset-2 ring-[#066fef] scale-110" 
                                              : "border-neutral-300 hover:scale-105"
                                          } ${!colorImg ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                          style={{ backgroundColor: colorHex }}
                                          title={color.name || "Màu xe"}
                                        >
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Specs Breakdown */}
                            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100">
                              <div className="bg-neutral-50 p-3 border border-neutral-100 rounded-none">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Động cơ</span>
                                <span className="text-xs font-bold text-neutral-700 block truncate" title={specs.engine || "Liên hệ"}>
                                  {specs.engine || "Liên hệ"}
                                </span>
                              </div>
                              <div className="bg-neutral-50 p-3 border border-neutral-100 rounded-none">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Hộp số</span>
                                <span className="text-xs font-bold text-neutral-700 block truncate" title={specs.transmission || "Liên hệ"}>
                                  {specs.transmission || "Liên hệ"}
                                </span>
                              </div>
                              <div className="bg-neutral-50 p-3 border border-neutral-100 rounded-none">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Công suất</span>
                                <span className="text-xs font-bold text-neutral-700 block truncate" title={specs.power || "Liên hệ"}>
                                  {specs.power || "Liên hệ"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Panel: Versions List & Actions */}
                          <div className="lg:col-span-6 p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-neutral-50/20">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-6 font-antenna uppercase">
                                {vehicle.name}
                              </h2>

                              <div className="divide-y divide-neutral-200/60">
                                {vehicle.versions.map((version) => {
                                  const isVersionActive = version.id === activeVersionId;
                                  return (
                                    <div
                                      key={version.id}
                                      onClick={() => {
                                        setSelectedVersionIds(prev => ({ ...prev, [vehicle.id]: version.id }));
                                        if (version.image_url || version.image_thumbnail_url) {
                                          setSelectedColors(prev => ({ ...prev, [vehicle.id]: "" }));
                                          setSelectedColorNames(prev => ({ ...prev, [vehicle.id]: "" }));
                                        }
                                      }}
                                      className={`py-4 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/row transition-all rounded-[6px] cursor-pointer ${
                                        isVersionActive 
                                          ? "bg-[#066fef]/5 border-l-4 border-l-[#066fef] pl-2" 
                                          : "hover:bg-neutral-50/50 border-l-4 border-l-transparent"
                                      }`}
                                    >
                                      <div>
                                        <h4 className={`font-bold text-sm uppercase transition-colors ${
                                          isVersionActive ? "text-[#066fef]" : "text-[#1a1a1a] group-hover/row:text-[#066fef]"
                                        }`}>
                                          {version.name}
                                        </h4>
                                        {version.specs?.drivetrain && (
                                          <span className="text-[11px] text-neutral-400 font-medium uppercase mt-0.5 block">
                                            Hệ dẫn động: {version.specs.drivetrain}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap sm:flex-nowrap">
                                        <span className="font-extrabold text-[#066fef] text-sm md:text-base whitespace-nowrap">
                                          {formatVND(version.price)}
                                        </span>

                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/cong-cu/uoc-tinh-lan-banh?vehicle=${vehicle.id}&version=${version.id}`}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-neutral-300 hover:border-[#066fef] text-neutral-600 hover:text-[#066fef] font-semibold text-xs rounded-[4px] transition-colors bg-white shadow-xs"
                                            title="Ước tính lăn bánh"
                                          >
                                            <Calculator className="w-3 h-3" />
                                            Lăn bánh
                                          </Link>
                                          <Link
                                            href="/lien-he"
                                            className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 bg-[#066fef] hover:bg-[#00095b] text-white font-semibold text-xs rounded-[4px] transition-colors uppercase tracking-wider text-[10px]"
                                          >
                                            <FileText className="w-3 h-3" />
                                            Báo giá
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Bottom Action Footer for the model */}
                            <div className="pt-6 border-t border-neutral-200/60 mt-8 flex items-center justify-between">
                              <span className="text-xs text-neutral-400 font-medium">
                                * Liên hệ đại lý để nhận thêm ưu đãi đặc quyền.
                              </span>
                              <Link
                                href={`/${vehicle.id}`}
                                className="text-xs font-bold uppercase tracking-wider text-[#066fef] hover:text-[#00095b] transition-colors inline-flex items-center gap-1"
                              >
                                Khám phá dòng xe
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Disclaimer */}
              <div className="mt-12 bg-neutral-50 border-l-4 border-l-[#066fef] p-6 text-xs text-neutral-500 leading-relaxed shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#066fef] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-700 font-bold block mb-1">LƯU Ý QUAN TRỌNG:</strong>
                    Giá hiển thị trên đây là Giá bán lẻ khuyến nghị của Ford Việt Nam (đã bao gồm thuế GTGT). Giá này chưa bao gồm các khoản phí đăng ký, đăng kiểm, thuế trước bạ, bảo hiểm đường bộ và các phụ phí khác để xe lăn bánh hợp pháp. Ưu đãi thực tế tại đại lý có thể thay đổi tùy thời điểm. Vui lòng sử dụng công cụ <Link href="/cong-cu/uoc-tinh-lan-banh" className="text-[#066fef] font-bold hover:underline">Ước tính Lăn bánh</Link> hoặc liên hệ trực tiếp hotline để nhận được mức báo giá chính xác nhất.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
