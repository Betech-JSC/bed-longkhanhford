"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Car, Wrench, FileText, ChevronRight, HelpCircle, X } from "lucide-react";
import { handleImageError } from "@/lib/site-assets";
import { vehiclesAPI, accessoriesAPI, postsAPI } from "@/lib/api";
import { resolveImageUrl } from "@/components/blocks/Blocks";

// Helper function to remove Vietnamese accents for fuzzy searching
function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const POPULAR_KEYWORDS = ["Everest", "Raptor", "Nắp thùng", "Khuyến mãi", "Bảo dưỡng"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "vehicles" | "accessories" | "articles">("all");

  const [apiVehicles, setApiVehicles] = useState<any[]>([]);
  const [apiAccessories, setApiAccessories] = useState<any[]>([]);
  const [apiArticles, setApiArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page when tab or query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, initialQuery]);



  // Keep search input state updated with URL changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Fetch all CMS data on mount
  useEffect(() => {
    let active = true;
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [vehsRes, accsRes, postsRes] = await Promise.all([
          vehiclesAPI.getAll({ with_versions: 1 }).catch(() => null),
          accessoriesAPI.getAll().catch(() => null),
          postsAPI.getAll().catch(() => null),
        ]);

        if (!active) return;

        const vehs = vehsRes?.data || vehsRes;
        const accs = accsRes?.data || accsRes;
        const postsData = (postsRes as any)?.posts?.data || (postsRes as any)?.posts || (postsRes as any)?.data || postsRes;

        if (Array.isArray(vehs)) {
          setApiVehicles(vehs);
        }
        if (Array.isArray(accs)) {
          setApiAccessories(accs);
        }
        if (Array.isArray(postsData)) {
          setApiArticles(postsData);
        }
      } catch (err) {
        console.error("Error loading search page CMS data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAllData();
    return () => {
      active = false;
    };
  }, []);

  // Handle search submit (updates URL query parameter)
  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    const trimmed = queryToUse.trim();

    if (trimmed) {
      router.push(`/tim-kiem?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/tim-kiem");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.push("/tim-kiem");
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearchSubmit(undefined, keyword);
  };

  // Map API data to standard frontend models
  const { mappedVehicles, mappedAccessories, mappedArticles } = useMemo(() => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
      } catch {
        return dateStr;
      }
    };

    const mv = apiVehicles.map((v: any) => {
      const id = v.slug || String(v.id);
      const name = v.title || v.name || "";
      const price = typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || v.basePrice || 0);
      const image = resolveImageUrl(v.image_thumbnail_url || v.image_url || v.images?.[0] || "");
      
      let typeName = "SUV";
      const titleLower = name.toLowerCase();
      if (titleLower.includes("territory")) {
        typeName = "SUV 5 Chỗ";
      } else if (titleLower.includes("everest")) {
        typeName = "SUV 7 Chỗ";
      } else if (titleLower.includes("mach-e")) {
        typeName = "SUV điện 5 Chỗ";
      } else if (titleLower.includes("mustang")) {
        typeName = "Xe thể thao 4 Chỗ";
      } else if (titleLower.includes("ranger") || titleLower.includes("raptor")) {
        typeName = "Bán tải 5 Chỗ";
      } else if (titleLower.includes("transit")) {
        typeName = "Thương mại 16 Chỗ";
      } else {
        typeName = v.type_name || v.typeName || (v.type === 'suv' ? 'SUV' : v.type === 'pickup' ? 'Bán tải' : 'Thương mại');
      }

      return {
        id,
        name,
        basePrice: price,
        typeName,
        fuel: v.fuel || (titleLower.includes("territory") ? "Xăng" : "Diesel"),
        tagline: v.tagline || "",
        description: v.description || "",
        images: [image],
        versions: v.versions || [],
        isBestSeller: v.is_best_seller || v.isBestSeller || false
      };
    });

    const ma = apiAccessories.map((a: any) => {
      const id = a.slug || String(a.id);
      const name = a.title || a.name || "";
      const price = typeof a.price === 'string' ? parseFloat(a.price) : (a.price || 0);
      const image = resolveImageUrl(a.image_url || a.images?.[0]?.url || a.image || "");
      const categoryName = a.category_name || a.categoryName || "Phụ Kiện";
      
      return {
        id,
        name,
        code: a.code || "",
        price,
        categoryName,
        description: a.description || "",
        images: [image]
      };
    });

    const mart = apiArticles.map((art: any) => {
      const id = art.slug || String(art.id);
      const title = art.title || "";
      const content = art.description || art.content || "";
      const date = formatDate(art.published_at || art.created_at);
      const category = art.category?.title || art.category || "Tin tức";
      const image = resolveImageUrl(art.image?.url || art.image_url || art.image || "/placeholder-news.jpg");

      return {
        id,
        title,
        content,
        date,
        category,
        image,
        body: []
      };
    });

    return { mappedVehicles: mv, mappedAccessories: ma, mappedArticles: mart };
  }, [apiVehicles, apiAccessories, apiArticles]);

  // Perform search matching
  const searchResults = useMemo(() => {
    const query = removeAccents(initialQuery.trim());
    if (!query) {
      return {
        vehiclesList: mappedVehicles,
        accessoriesList: mappedAccessories,
        articlesList: mappedArticles,
        totalCount: mappedVehicles.length + mappedAccessories.length + mappedArticles.length
      };
    }

    // 1. Filter Vehicles
    const vehiclesList = mappedVehicles.filter((v: any) => {
      const nameMatch = removeAccents(v.name).includes(query);
      const typeMatch = removeAccents(v.typeName).includes(query);
      const taglineMatch = removeAccents(v.tagline).includes(query);
      const descMatch = removeAccents(v.description).includes(query);
      const versionMatch = v.versions.some((ver: any) => removeAccents(ver.name || "").includes(query));
      return nameMatch || typeMatch || taglineMatch || descMatch || versionMatch;
    });

    // 2. Filter Accessories
    const accessoriesList = mappedAccessories.filter((a: any) => {
      const nameMatch = removeAccents(a.name).includes(query);
      const codeMatch = removeAccents(a.code).includes(query);
      const descMatch = removeAccents(a.description).includes(query);
      const catMatch = removeAccents(a.categoryName).includes(query);
      return nameMatch || codeMatch || descMatch || catMatch;
    });

    // 3. Filter Articles
    const articlesList = mappedArticles.filter((art: any) => {
      const titleMatch = removeAccents(art.title).includes(query);
      const contentMatch = removeAccents(art.content).includes(query);
      const catMatch = removeAccents(art.category).includes(query);
      return titleMatch || contentMatch || catMatch;
    });

    const totalCount = vehiclesList.length + accessoriesList.length + articlesList.length;

    return { vehiclesList, accessoriesList, articlesList, totalCount };
  }, [initialQuery, mappedVehicles, mappedAccessories, mappedArticles]);

  const { vehiclesList, accessoriesList, articlesList, totalCount } = searchResults;

  const { paginatedVehicles, paginatedAccessories, paginatedArticles, totalPages } = useMemo(() => {
    if (activeTab === "all") {
      return {
        paginatedVehicles: vehiclesList.slice(0, 6),
        paginatedAccessories: accessoriesList.slice(0, 8),
        paginatedArticles: articlesList.slice(0, 6),
        totalPages: 1
      };
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (activeTab === "vehicles") {
      return {
        paginatedVehicles: vehiclesList.slice(startIndex, endIndex),
        paginatedAccessories: [],
        paginatedArticles: [],
        totalPages: Math.ceil(vehiclesList.length / ITEMS_PER_PAGE)
      };
    } else if (activeTab === "accessories") {
      return {
        paginatedVehicles: [],
        paginatedAccessories: accessoriesList.slice(startIndex, endIndex),
        paginatedArticles: [],
        totalPages: Math.ceil(accessoriesList.length / ITEMS_PER_PAGE)
      };
    } else {
      return {
        paginatedVehicles: [],
        paginatedAccessories: [],
        paginatedArticles: articlesList.slice(startIndex, endIndex),
        totalPages: Math.ceil(articlesList.length / ITEMS_PER_PAGE)
      };
    }
  }, [activeTab, currentPage, vehiclesList, accessoriesList, articlesList]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  // Best seller vehicles to suggest when no results are found
  const suggestedVehicles = useMemo(() => {
    return mappedVehicles.filter((v: any) => v.isBestSeller).slice(0, 3);
  }, [mappedVehicles]);

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20 text-[#1a1a1a]">
      {/* 1. HERO SEARCH CONTAINER (Deep Navy & Accent Blue) */}
      <section className="bg-gradient-to-br from-[#00095B] via-[#00095B] to-[#00224b] text-white py-16 px-4">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[32px] md:text-[40px] leading-tight uppercase tracking-wide">
              Tìm kiếm thông tin
            </h1>
            <p className="text-white/70 text-sm md:text-base font-normal font-sans max-w-xl mx-auto">
              Nhập từ khóa để tìm nhanh dòng xe, phụ kiện chính hãng hoặc tin tức khuyến mãi mới nhất tại đại lý Long Khánh Ford.
            </p>
          </div>

          {/* Search Box Wrapper */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative mt-4">
            <div className="relative flex items-center bg-white rounded-lg shadow-2xl overflow-hidden border border-white/10 group focus-within:ring-4 focus-within:ring-[#0562D2]/35 focus-within:border-[#0562D2] transition duration-200">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên xe, phụ kiện, tin khuyến mãi..."
                className="w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-400 text-sm md:text-base outline-none bg-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-32 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer bg-transparent border-0"
                  aria-label="Xóa từ khóa"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#0562D2] hover:bg-[#003478] text-white px-6 font-semibold text-sm rounded-md transition-colors duration-200 cursor-pointer border-0 flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Popular keywords tags list */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs mt-2">
            <span className="text-white/60 font-semibold uppercase tracking-wider">Từ khóa gợi ý:</span>
            {POPULAR_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 px-3.5 py-1.5 rounded-full border border-white/10 transition cursor-pointer text-xs font-semibold"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. RESULTS FILTER TABS */}
      {!loading && (
        <section className="bg-white border-b border-[#e5e5e5] z-30 shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex items-center justify-start overflow-x-auto scrollbar-none gap-2">
            {[
              { id: "all", label: "Tất cả", count: totalCount, icon: HelpCircle },
              { id: "vehicles", label: "Xe Ford", count: vehiclesList.length, icon: Car },
              { id: "accessories", label: "Phụ Kiện", count: accessoriesList.length, icon: Wrench },
              { id: "articles", label: "Tin tức", count: articlesList.length, icon: FileText }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap bg-transparent border-0
                    ${isActive 
                      ? "text-[#0562D2] border-[#0562D2]" 
                      : "text-gray-500 border-transparent hover:text-[#0562D2] hover:border-gray-300"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                    ${isActive ? "bg-[#0562D2]/10 text-[#0562D2]" : "bg-gray-100 text-gray-500"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. SEARCH RESULTS LISTING */}
      <main className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full py-12">
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-[#0562D2] border-t-transparent rounded-full" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu tìm kiếm...</p>
          </div>
        ) : totalCount === 0 ? (
          // No results found page state
          <div className="space-y-16">
            <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-xl shadow-xs max-w-3xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-xl text-gray-800">
                Không tìm thấy kết quả
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa <strong className="text-gray-900">&ldquo;{initialQuery}&rdquo;</strong>. 
                Vui lòng thử lại với các từ khóa khác hoặc xem qua các dòng xe nổi bật bên dưới.
              </p>
            </div>

            {/* CRO vehicle recommendations when empty */}
            <div className="space-y-6">
              <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-[24px] text-gray-900 text-center uppercase tracking-wide">
                Các mẫu xe Ford nổi bật
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white border border-gray-200/80 hover:border-[#066fef]/30 rounded-2xl p-5 flex flex-col hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group relative"
                  >
                    <div className="relative h-56 w-full bg-white overflow-hidden mb-4 flex items-center justify-center rounded-xl">
                      <Link
                        href={`/${v.id}`}
                        className="w-full h-full flex items-center justify-center block"
                      >
                        <img
                          src={v.images[0]}
                          alt={v.name}
                          className="object-contain object-center select-none max-h-full max-w-full pointer-events-none"
                          onError={handleImageError}
                        />
                      </Link>
                      {/* Hover Overlay Detail Button */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto rounded-xl">
                        <Link
                          href={`/${v.id}`}
                          className="bg-gray-950/90 hover:bg-[#066fef] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider text-[11px] shadow-md active:scale-95 transform translate-y-3 group-hover:translate-y-0"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>

                    {/* Badges Container */}
                    <div className="flex gap-2 mb-2.5 items-center justify-center flex-wrap font-antenna">
                      {v.typeName && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#066fef] bg-[#066fef]/8 px-3 py-1 rounded-full">
                          {v.typeName}
                        </span>
                      )}
                      {v.fuel && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Động cơ {v.fuel}
                        </span>
                      )}
                    </div>

                    {/* Title & Price */}
                    <h3 className="text-lg font-bold font-display tracking-tight uppercase text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 font-antenna text-center">
                      <Link href={`/${v.id}`} className="hover:text-[#066fef] transition-colors">
                        {v.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 font-medium font-antenna text-center mb-1">
                      Giá khởi điểm:{" "}
                      <span className="text-[#066fef] font-bold text-sm ml-0.5">
                        {formatPrice(v.basePrice)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Results list section layout
          <div className="space-y-12">
            {/* 3.1. Vehicles Block */}
            {(activeTab === "all" || activeTab === "vehicles") && vehiclesList.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e5e5e5]">
                  <Car className="w-5 h-5 text-[#0562D2]" />
                  <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-[20px] text-[#00095B] uppercase tracking-wide">
                    Dòng xe Ford ({vehiclesList.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paginatedVehicles.map((v) => (
                    <div
                      key={v.id}
                      className="bg-white border border-gray-200/80 hover:border-[#066fef]/30 rounded-2xl p-5 flex flex-col hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group relative"
                    >
                      <div className="relative h-56 w-full bg-white overflow-hidden mb-4 flex items-center justify-center rounded-xl">
                        <Link
                          href={`/${v.id}`}
                          className="w-full h-full flex items-center justify-center block"
                        >
                          <img
                            src={v.images[0]}
                            alt={v.name}
                            className="object-contain object-center select-none max-h-full max-w-full pointer-events-none"
                            onError={handleImageError}
                          />
                        </Link>
                        {/* Hover Overlay Detail Button */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto rounded-xl">
                          <Link
                            href={`/${v.id}`}
                            className="bg-gray-950/90 hover:bg-[#066fef] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider text-[11px] shadow-md active:scale-95 transform translate-y-3 group-hover:translate-y-0"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>

                      {/* Badges Container */}
                      <div className="flex gap-2 mb-2.5 items-center justify-center flex-wrap font-antenna">
                        {v.typeName && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#066fef] bg-[#066fef]/8 px-3 py-1 rounded-full">
                            {v.typeName}
                          </span>
                        )}
                        {v.fuel && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Động cơ {v.fuel}
                          </span>
                        )}
                      </div>

                      {/* Title & Price */}
                      <h3 className="text-lg font-bold font-display tracking-tight uppercase text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 font-antenna text-center">
                        <Link href={`/${v.id}`} className="hover:text-[#066fef] transition-colors">
                          {v.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium font-antenna text-center mb-1">
                        Giá khởi điểm:{" "}
                        <span className="text-[#066fef] font-bold text-sm ml-0.5">
                          {formatPrice(v.basePrice)}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3.2. Accessories Block */}
            {(activeTab === "all" || activeTab === "accessories") && accessoriesList.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e5e5e5]">
                  <Wrench className="w-5 h-5 text-[#0562D2]" />
                  <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-[20px] text-[#00095B] uppercase tracking-wide">
                    Phụ kiện chính hãng ({accessoriesList.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {paginatedAccessories.map((a) => (
                    <Link
                      key={a.id}
                      href={`/phu-kien/${a.id}`}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                    >
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <img
                          src={a.images[0]}
                          alt={a.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          onError={handleImageError}
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          {a.categoryName.replace("Phụ Kiện ", "")}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-[14px] text-gray-900 group-hover:text-[#0562D2] transition-colors leading-[1.4] line-clamp-2">
                            {a.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 block">Mã sản phẩm: {a.code}</span>
                        </div>
                        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between mt-3.5">
                          <span className="text-sm font-bold text-[#0562D2]">{formatPrice(a.price)}</span>
                          <span className="text-[11px] font-bold text-[#0562D2] group-hover:underline">Chi tiết</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 3.3. Articles Block */}
            {(activeTab === "all" || activeTab === "articles") && articlesList.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e5e5e5]">
                  <FileText className="w-5 h-5 text-[#0562D2]" />
                  <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-[20px] text-[#00095B] uppercase tracking-wide">
                    Tin tức & Khuyến mãi ({articlesList.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paginatedArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/${art.id}`}
                      className="bg-white rounded-lg overflow-hidden border border-[#e5e5e5] shadow-xs hover:shadow-md transition-premium group flex flex-col h-full"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden w-full bg-gray-100">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          onError={handleImageError}
                        />
                        <div className="absolute top-3 left-3 bg-[#0562D2] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                          {art.category}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 gap-2.5">
                        <span className="text-[11px] font-medium text-gray-400">
                          {art.date}
                        </span>
                        <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-[16px] leading-[1.4] text-[#1a1a1a] group-hover:text-[#0562D2] transition-colors duration-200 line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#424242] leading-relaxed line-clamp-3 mt-1">
                          {art.content}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {activeTab !== "all" && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 font-antenna">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-10 h-10 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-650 hover:border-[#0562D2] hover:text-[#0562D2] disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white cursor-pointer"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-[#0562D2] text-white shadow-md shadow-[#0562D2]/25"
                        : "border border-neutral-300 text-neutral-600 hover:border-[#0562D2] hover:text-[#0562D2] bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="w-10 h-10 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-650 hover:border-[#0562D2] hover:text-[#0562D2] disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white cursor-pointer"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#fafafa] min-h-screen py-24 text-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-[#0562D2] border-t-transparent rounded-full"
            role="status"
          >
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
