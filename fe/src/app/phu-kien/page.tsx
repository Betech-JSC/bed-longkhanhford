"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, ChevronLeft, Plus, Minus, Loader2 } from "lucide-react";
import { AccessoryItem } from "@/data/accessories";
import { handleImageError } from "@/lib/site-assets";
import { accessoriesAPI } from "@/lib/api";

import { resolveImageUrl } from "@/components/blocks/Blocks";

const getCategorySlugUnified = (slugOrId: string | number): string => {
  const str = String(slugOrId).toLowerCase();
  if (str === "1" || str.includes("noi-that") || str.includes("interior")) return "interior";
  if (str === "2" || str.includes("ngoai-that") || str.includes("exterior")) return "exterior";
  if (str === "3" || str.includes("cong-nghe") || str.includes("tech")) return "tech";
  if (str === "4" || str.includes("mam-lop") || str.includes("wheel") || str.includes("tire")) return "wheels";
  if (str === "5" || str.includes("hieu-suat") || str.includes("performance")) return "performance";
  return str;
};

const getCategoryFallbackImage = (slug: string): string => {
  if (slug.includes("noi-that") || slug.includes("interior")) return "/images/categories/cat_interior.png";
  if (slug.includes("ngoai-that") || slug.includes("exterior")) return "/images/categories/cat_exterior.png";
  if (slug.includes("cong-nghe") || slug.includes("tech")) return "/images/categories/cat_tech.png";
  if (slug.includes("mam-lop") || slug.includes("wheel")) return "/images/categories/cat_wheels.png";
  if (slug.includes("hieu-suat") || slug.includes("performance")) return "/images/categories/cat_performance.png";
  return "/images/categories/cat_exterior.png";
};

const mapAPIAccessoryToItem = (apiAcc: any): AccessoryItem => {
  const categoryIdOrSlug = apiAcc.categories?.[0]?.slug || apiAcc.categories?.[0]?.id || "";
  const categoryKey = getCategorySlugUnified(categoryIdOrSlug) || "exterior";

  return {
    id: apiAcc.slug || String(apiAcc.id),
    name: apiAcc.title || "",
    code: apiAcc.code || "",
    category: categoryKey,
    categoryName: apiAcc.category_name || apiAcc.categories?.[0]?.title || "Phụ Kiện Ngoại Thất",
    price: Number(apiAcc.price) || 0,
    description: apiAcc.description || "",
    images: Array.isArray(apiAcc.images) && apiAcc.images.length > 0
      ? apiAcc.images.map((img: any) => img?.url ? resolveImageUrl(img.url) : "").filter(Boolean)
      : (apiAcc.image?.url ? [resolveImageUrl(apiAcc.image.url)] : []),
    fitVehicles: apiAcc.fit_vehicles || [],
    features: apiAcc.features || [],
    compatibilityText: apiAcc.compatibility_text,
    safetyText: apiAcc.safety_text,
    productDescText: apiAcc.product_desc_text,
    brand: apiAcc.brand ? {
      id: apiAcc.brand.id,
      title: apiAcc.brand.title,
      slug: apiAcc.brand.slug
    } : null,
    vehicles: apiAcc.vehicles || []
  };
};

const staticCategories = [
  { id: "interior", name: "Phụ Kiện Nội Thất", image: "/images/categories/cat_interior.png" },
  { id: "exterior", name: "Phụ Kiện Ngoại Thất", image: "/images/categories/cat_exterior.png" },
  { id: "tech", name: "Công Nghệ & Điện Tử", image: "/images/categories/cat_tech.png" },
  { id: "wheels", name: "Mâm & Lốp Xe", image: "/images/categories/cat_wheels.png" },
  { id: "performance", name: "Phụ Tùng Hiệu Suất", image: "/images/categories/cat_performance.png" }
];

const sidebarModels = [
  {
    name: "Dòng Xe Bán Tải",
    subModels: ["Ford Ranger", "Ranger Raptor"]
  },
  {
    name: "Dòng Xe SUV",
    subModels: ["Ford Everest", "Ford Territory", "Ford Mustang"]
  },
  {
    name: "Dòng Xe Thương Mại",
    subModels: ["Ford Transit"]
  }
];

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [categories, setCategories] = useState<any[]>(staticCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load Categories from API
        try {
          const catRes = await accessoriesAPI.getCategories();
          if (catRes && catRes.success && Array.isArray(catRes.data)) {
            const mappedCats = catRes.data.map((cat: any) => ({
              id: getCategorySlugUnified(cat.slug || cat.id),
              name: cat.title,
              image: resolveImageUrl(cat.image_url || getCategoryFallbackImage(cat.slug || ""))
            }));
            setCategories(mappedCats);
          }
        } catch (catErr) {
          console.error("Failed to load accessory categories from API:", catErr);
        }

        // Load Accessories from API
        const response = await accessoriesAPI.getAll();
        if (response && response.success && Array.isArray(response.data)) {
          const mapped = response.data.map(mapAPIAccessoryToItem);
          setAccessories(mapped);
        }
      } catch (err) {
        console.error("Failed to load accessories from API, falling back to static data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const vehicleParam = params.get("vehicle");
      if (vehicleParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedVehicle(vehicleParam);

        // Find which group contains this vehicle and expand it
        const matchedGroup = sidebarModels.find(model =>
          model.subModels.some(sub =>
            sub.toLowerCase().includes(vehicleParam.toLowerCase()) ||
            vehicleParam.toLowerCase().includes(sub.toLowerCase())
          )
        );
        if (matchedGroup) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setExpandedSidebar(prev => ({
            ...prev,
            [matchedGroup.name]: true
          }));
        }
      }
    }
  }, []);

  const [expandedSidebar, setExpandedSidebar] = useState<Record<string, boolean>>({
    "Dòng Xe SUV": true,
    "Thương Hiệu": true
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      }
    }

    const result: (number | string)[] = [];
    let prev: number | null = null;

    for (const page of pages) {
      if (prev !== null) {
        if (page - prev === 2) {
          result.push(prev + 1);
        } else if (page - prev > 2) {
          result.push("...");
        }
      }
      result.push(page);
      prev = page;
    }

    return result;
  };

  const toggleSidebar = (modelName: string) => {
    setExpandedSidebar(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }));
  };

  const handleVehicleSelect = (vehicle: string) => {
    if (selectedVehicle === vehicle) {
      setSelectedVehicle(null); // Clear filter
    } else {
      setSelectedVehicle(vehicle);
    }
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory("all"); // Toggle to reset
    } else {
      setActiveCategory(categoryId);
    }
    setCurrentPage(1);
  };

  // Extract unique brands dynamically
  const brands = Array.from(
    new Map(
      accessories
        .map((acc) => acc.brand)
        .filter((brand): brand is { id: number; title: string; slug: string } => !!brand)
        .map((brand) => [brand.slug, brand])
    ).values()
  );

  // Filter Logic
  const filteredAccessories = accessories.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPivot = Array.isArray(item.vehicles) && item.vehicles.some(v => {
      const vTitle = String(v.title || "").toLowerCase();
      const vSlug = String(v.slug || "").toLowerCase();
      const selVal = String(selectedVehicle).toLowerCase();
      return String(v.id) === selVal || 
        vSlug === selVal || 
        vTitle === selVal ||
        vTitle.includes(selVal) ||
        selVal.includes(vTitle);
    });

    const matchesVehicle = !selectedVehicle || matchesPivot;

    const matchesBrand = !selectedBrand || (item.brand?.slug === selectedBrand);

    return matchesCategory && matchesSearch && matchesVehicle && matchesBrand;
  });

  // Paginated Items
  const totalPages = Math.max(1, Math.ceil(filteredAccessories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccessories = filteredAccessories.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numericPrice || numericPrice <= 0) return "Liên hệ";
    return "₫" + new Intl.NumberFormat("vi-VN").format(numericPrice);
  };

  const scrollCategoryRight = () => {
    const el = document.getElementById("category-slider-track");
    if (el) {
      el.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-16">

      {/* 1. Featured Category Slider Section */}
      <section className="bg-[#fafafa] border-b border-[#d6d6d6] py-[40px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-[24px]">

          <div className="flex flex-col gap-[8px]">
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] text-[#1a1a1a] leading-[1.2]">
              Sản Phẩm Nổi Bật
            </h1>
            <p className="font-['Ford_Antenna',sans-serif] font-normal text-[18px] text-[#555] leading-[1.5]">
              Khám phá các phụ kiện Ford được yêu thích nhất ngay hôm nay!
            </p>
          </div>

          {/* Categories slider hidden from FE */}
        </div>
      </section>

      {/* 2. Main Content Grid & Sidebar */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-[72px]">
        <div className="flex flex-col md:flex-row gap-[48px] items-start justify-center">

          {/* Left Filter Sidebar - Flat, Clean Accordion List */}
          <div className="w-full md:w-[280px] flex flex-col gap-0 shrink-0">
            {sidebarModels.map((model) => {
              const isExpanded = expandedSidebar[model.name];
              const hasSubModels = model.subModels.length > 0;

              return (
                <div key={model.name} className="flex flex-col border-b border-[#e5e5e5] py-[16px] w-[280px]">
                  <button
                    onClick={() => {
                      if (hasSubModels) {
                        toggleSidebar(model.name);
                      } else {
                        handleVehicleSelect(model.name);
                      }
                    }}
                    className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent transition-colors py-1"
                  >
                    <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] ${selectedVehicle === model.name || isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] hover:text-[#0562d2]"}`}>
                      {model.name}
                    </span>
                    {hasSubModels ? (
                      isExpanded ? (
                        <Minus className="w-[20px] h-[20px] text-[#0562d2]" />
                      ) : (
                        <Plus className="w-[20px] h-[20px] text-[#0562d2]" />
                      )
                    ) : null}
                  </button>

                  {hasSubModels && isExpanded && (
                    <div className="flex flex-col gap-[12px] pt-[12px] pb-[4px]">
                      {model.subModels.map((sub) => {
                        const isSelected = !!selectedVehicle && (
                          sub.toLowerCase().includes(selectedVehicle.toLowerCase()) ||
                          selectedVehicle.toLowerCase().includes(sub.toLowerCase())
                        );
                        return (
                          <button
                            key={sub}
                            onClick={() => handleVehicleSelect(sub)}
                            className={`text-left text-[16px] font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors
                              ${isSelected ? "text-[#0562d2] font-semibold" : "text-[#333] hover:text-[#0562d2]"}`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Brand Filter Accordion Section */}
            {brands.length > 0 && (
              <div className="flex flex-col border-b border-[#e5e5e5] py-[16px] w-[280px]">
                <button
                  onClick={() => setIsBrandExpanded(!isBrandExpanded)}
                  className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent transition-colors py-1"
                >
                  <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] ${selectedBrand || isBrandExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] hover:text-[#0562d2]"}`}>
                    Thương Hiệu
                  </span>
                  {isBrandExpanded ? (
                    <Minus className="w-[20px] h-[20px] text-[#0562d2]" />
                  ) : (
                    <Plus className="w-[20px] h-[20px] text-[#0562d2]" />
                  )}
                </button>

                {isBrandExpanded && (
                  <div className="flex flex-col gap-[12px] pt-[12px] pb-[4px]">
                    {brands.map((brand) => {
                      const isSelected = selectedBrand === brand.slug;
                      return (
                        <button
                          key={brand.slug}
                          onClick={() => {
                            setSelectedBrand(isSelected ? null : brand.slug);
                            setCurrentPage(1);
                          }}
                          className={`text-left text-[16px] font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors flex items-center justify-between
                            ${isSelected ? "text-[#0562d2] font-semibold" : "text-[#333] hover:text-[#0562d2]"}`}
                        >
                          <span>{brand.title}</span>
                          {isSelected && <span className="text-xs text-[#0562d2] font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Accessories Grid panel */}
          <div className="flex-1 flex flex-col gap-[24px] min-w-0">
            {/* Search Input bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d6d6d6] pb-4">
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm phụ kiện..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-[#d6d6d6] rounded-[800px] py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-[#0562D2]"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-500">
                Hiển thị {filteredAccessories.length} phụ kiện
              </div>
            </div>

            {/* Catalog Grid - Borderless Cards with Active Hover states */}
            {paginatedAccessories.length === 0 ? (
              <div className="bg-white rounded-[8px] py-20 text-center border border-gray-100 p-8 space-y-4">
                <p className="text-gray-500 font-medium text-sm">
                  Không tìm thấy sản phẩm phụ kiện nào phù hợp.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setSelectedVehicle(null);
                    setSelectedBrand(null);
                    setCurrentPage(1);
                  }}
                  className="btn-ford-primary text-xs py-2 px-5 font-bold uppercase cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {paginatedAccessories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/phu-kien/${item.id}`}
                    className="group bg-white flex flex-col h-full rounded-[8px] overflow-hidden border border-transparent hover:border-[#0562D2] hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-gray-50 overflow-hidden">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        onError={handleImageError}
                      />
                    </div>
                    {/* Content */}
                    <div className="px-[16px] py-[12px] flex flex-col gap-[4px] items-center text-center flex-1 justify-between">
                      <div className="flex flex-col items-center gap-[4px]">
                        {item.brand && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0562D2] bg-[#0562D2]/10 px-2.5 py-0.5 rounded-full font-sans mb-1">
                            {item.brand.title}
                          </span>
                        )}
                        <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] text-[#1a1a1a] group-hover:text-[#0562D2] transition-colors leading-[1.5] line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                      <p className="font-['Ford_Antenna',sans-serif] font-medium text-[14px] text-[#0562d2] mt-auto leading-[1.4]">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pill-shaped Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="bg-white border border-[#e5e5e5] flex gap-[16px] items-center justify-center px-[12px] py-[8px] rounded-[400px]">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="disabled:opacity-40 p-1 text-[#808080] hover:text-[#1a1a1a] transition-colors cursor-pointer border-0 bg-transparent flex items-center"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-[24px] h-[24px]" />
                  </button>

                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-[44px] h-[44px] flex items-center justify-center text-gray-400 font-semibold text-[16px] select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = page as number;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-[44px] h-[44px] flex items-center justify-center font-['Ford_Antenna',sans-serif] font-semibold text-[16px] transition-all cursor-pointer border-0
                          ${isActive ? "bg-[#044ea7] text-white rounded-[4px]" : "bg-transparent text-[#808080] hover:text-[#1a1a1a]"}`}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="disabled:opacity-40 p-1 text-[#808080] hover:text-[#1a1a1a] transition-colors cursor-pointer border-0 bg-transparent flex items-center"
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-[24px] h-[24px]" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}

