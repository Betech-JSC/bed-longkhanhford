"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import { Search, ChevronRight, ChevronLeft, Plus, Minus, Loader2 } from "lucide-react";
import { accessoriesAPI } from "@/lib/api";

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

const mapAPIAccessoryToItem = (apiAcc: any): any => {
  const categoryIdOrSlug = apiAcc.categories?.[0]?.slug || apiAcc.categories?.[0]?.id || "";
  const categoryKey = getCategorySlugUnified(categoryIdOrSlug) || "exterior";

  // helper function to clean path
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
    if (typeof file === "object" && file.url) return file.url;
    return "";
  };

  return {
    id: apiAcc.slug || String(apiAcc.id),
    name: apiAcc.title || "",
    code: apiAcc.code || "",
    category: categoryKey,
    categoryName: apiAcc.category_name || apiAcc.categories?.[0]?.title || "Phụ Kiện Ngoại Thất",
    price: Number(apiAcc.price) || 0,
    description: apiAcc.description || "",
    images: Array.isArray(apiAcc.images) && apiAcc.images.length > 0
      ? apiAcc.images.map((img: any) => img?.url ? resolveFileUrl(img.url) : "").filter(Boolean)
      : (apiAcc.image?.url ? [resolveFileUrl(apiAcc.image.url)] : []),
    fitVehicles: apiAcc.fit_vehicles || [],
    vehicles: apiAcc.vehicles || [],
    features: apiAcc.features || [],
    compatibilityText: apiAcc.compatibility_text,
    safetyText: apiAcc.safety_text,
    productDescText: apiAcc.product_desc_text,
    brand: apiAcc.brand ? {
      id: apiAcc.brand.id,
      title: apiAcc.brand.title,
      slug: apiAcc.brand.slug
    } : null
  };
};

const staticCategories = [
  { id: "interior", name: "Phụ Kiện Nội Thất", image: "/images/categories/cat_interior.png" },
  { id: "exterior", name: "Phụ Kiện Ngoại Thất", image: "/images/categories/cat_exterior.png" },
  { id: "tech", name: "Công Nghệ & Điện Tử", image: "/images/categories/cat_tech.png" },
  { id: "wheels", name: "Mâm & Lốp Xe", image: "/images/categories/cat_wheels.png" },
  { id: "performance", name: "Phụ Tùng Hiệu Suất", image: "/images/categories/cat_performance.png" }
];

export default function VehicleAccessoriesClient() {
  const { vehicle } = useVehicle();

  const [accessories, setAccessories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(staticCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Load Categories from API
        try {
          const catRes = await accessoriesAPI.getCategories();
          if (catRes && catRes.success && Array.isArray(catRes.data)) {
            const mappedCats = catRes.data.map((cat: any) => {
              const resolveFileUrl = (url: string) => {
                if (!url) return "";
                if (url.startsWith("http") || url.startsWith("/")) return url;
                const apiHost = "http://localhost:8000";
                return `${apiHost}/static/${url}`;
              };
              return {
                id: getCategorySlugUnified(cat.slug || cat.id),
                name: cat.title,
                image: resolveFileUrl(cat.image_url || getCategoryFallbackImage(cat.slug || ""))
              };
            });
            setCategories(mappedCats);
          }
        } catch (catErr) {
          console.error("Failed to load accessory categories:", catErr);
        }

        // Load Accessories from API
        const response = await accessoriesAPI.getAll();
        if (response && response.success && Array.isArray(response.data)) {
          const mapped = response.data.map(mapAPIAccessoryToItem);
          setAccessories(mapped);
        }
      } catch (err) {
        console.error("Failed to load accessories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? "all" : categoryId);
    setCurrentPage(1);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/assets/img-gradient-1.png";
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

  // Filter Logic: Filter accessories matching the current vehicle
  const filteredAccessories = accessories.filter((item) => {
    // Check via Many-to-Many vehicles relation
    const matchesVehicle = Array.isArray(item.vehicles) && item.vehicles.some((v: any) => 
      String(v.id) === String(vehicle?.id) || 
      (v.slug && String(v.slug).toLowerCase() === String(vehicle?.slug).toLowerCase())
    );

    if (!matchesVehicle) return false;

    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = !selectedBrand || (item.brand?.slug === selectedBrand);

    return matchesCategory && matchesSearch && matchesBrand;
  });

  // Paginated Items
  const totalPages = Math.max(1, Math.ceil(filteredAccessories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccessories = filteredAccessories.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numericPrice || numericPrice <= 0) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(numericPrice) + " đ";
  };

  const scrollCategoryRight = () => {
    const el = document.getElementById("category-slider-track");
    if (el) {
      el.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-24">
      <VehicleTabBar />
      {/* 1. Category Selector Header Slider */}
      <section className="bg-[#fafafa] border-b border-[#d6d6d6] py-8">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0562d2]">
              Phụ kiện dòng xe
            </span>
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] text-[#1a1a1a] leading-none mt-1">
              Phụ Kiện Chính Hãng Ford {vehicle?.name}
            </h1>
          </div>

          {/* Categories slider hidden from FE */}
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-12">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
          
          {/* Left Sidebar Filter */}
          <div className="w-full md:w-[260px] flex flex-col gap-0 shrink-0 select-none">
            {/* Category Accordion */}
            <div className="flex flex-col border-b border-[#e5e5e5] py-4 w-full">
              <button
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent transition-colors py-1"
              >
                <span className="font-['Ford_Antenna',sans-serif] font-semibold text-sm text-[#1a1a1a]">
                  Danh Mục Phụ Kiện
                </span>
                {isCategoryExpanded ? (
                  <Minus className="w-4 h-4 text-[#0562d2]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#0562d2]" />
                )}
              </button>
              {isCategoryExpanded && (
                <div className="flex flex-col gap-2.5 pt-3 pb-1">
                  <button
                    onClick={() => { setActiveCategory("all"); setCurrentPage(1); }}
                    className={`text-left text-sm font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors
                      ${activeCategory === "all" ? "text-[#0562d2] font-semibold" : "text-[#424242] hover:text-[#0562d2]"}`}
                  >
                    Tất cả phụ kiện
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`text-left text-sm font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors
                        ${activeCategory === cat.id ? "text-[#0562d2] font-semibold" : "text-[#424242] hover:text-[#0562d2]"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="flex flex-col border-b border-[#e5e5e5] py-4 w-full">
                <button
                  onClick={() => setIsBrandExpanded(!isBrandExpanded)}
                  className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent transition-colors py-1"
                >
                  <span className="font-['Ford_Antenna',sans-serif] font-semibold text-sm text-[#1a1a1a]">
                    Thương Hiệu
                  </span>
                  {isBrandExpanded ? (
                    <Minus className="w-4 h-4 text-[#0562d2]" />
                  ) : (
                    <Plus className="w-4 h-4 text-[#0562d2]" />
                  )}
                </button>
                {isBrandExpanded && (
                  <div className="flex flex-col gap-2.5 pt-3 pb-1">
                    {brands.map((brand) => {
                      const isSelected = selectedBrand === brand.slug;
                      return (
                        <button
                          key={brand.slug}
                          onClick={() => {
                            setSelectedBrand(isSelected ? null : brand.slug);
                            setCurrentPage(1);
                          }}
                          className={`text-left text-sm font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors flex items-center justify-between
                            ${isSelected ? "text-[#0562d2] font-semibold" : "text-[#424242] hover:text-[#0562d2]"}`}
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

          {/* Right Catalog Grid */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Search Input bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d6d6d6] pb-4">
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Tìm phụ kiện xe..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-[#d6d6d6] rounded-full py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0562D2] text-black"
                />
                <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-500">
                Tìm thấy {filteredAccessories.length} sản phẩm tương thích
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0562d2]" />
                <p className="text-xs font-semibold text-gray-450 mt-2">Đang tải danh sách phụ kiện...</p>
              </div>
            ) : paginatedAccessories.length === 0 ? (
              <div className="bg-white rounded-xl py-20 text-center border border-gray-100 p-8 space-y-4">
                <p className="text-gray-500 font-medium text-sm">
                  Dòng xe {vehicle.name} hiện chưa cập nhật phụ kiện thuộc mục này.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setSelectedBrand(null);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] text-white text-xs py-2 px-5 font-bold uppercase cursor-pointer rounded-full transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedAccessories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/phu-kien/${item.id}`}
                    className="group bg-white flex flex-col h-full rounded-[8px] overflow-hidden border border-transparent hover:border-[#0562D2] hover:shadow-lg transition-all duration-300 no-underline"
                  >
                    <div className="aspect-square relative bg-gray-50 overflow-hidden">
                      <img
                        src={item.images[0] || "/assets/img-gradient-1.png"}
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="px-4 py-3.5 flex flex-col gap-1.5 items-center text-center flex-1 justify-between">
                      <div className="flex flex-col items-center gap-1">
                        {item.brand && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0562D2] bg-[#0562D2]/10 px-2 py-0.5 rounded-full mb-1">
                            {item.brand.title}
                          </span>
                        )}
                        <h4 className="font-['Ford_Antenna',sans-serif] font-bold text-sm text-[#1a1a1a] group-hover:text-[#0562D2] transition-colors leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                      </div>
                      <p className="font-['Ford_Antenna',sans-serif] font-semibold text-xs text-[#0562d2] mt-auto">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="bg-white border border-[#e5e5e5] flex gap-3.5 items-center justify-center px-3 py-2 rounded-full">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="disabled:opacity-40 p-1 text-[#808080] hover:text-[#1a1a1a] transition-colors cursor-pointer border-0 bg-transparent flex items-center"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 font-semibold text-sm select-none"
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
                        className={`w-9 h-9 flex items-center justify-center font-['Ford_Antenna',sans-serif] font-semibold text-sm transition-all cursor-pointer border-0
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
                    <ChevronRight className="w-5 h-5" />
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
