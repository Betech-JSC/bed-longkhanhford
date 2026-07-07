"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Gauge,
  PhoneCall
} from "lucide-react";
import { usedVehiclesAPI } from "@/lib/api";

export default function UsedVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchUsedVehicles = async () => {
      try {
        const response = await usedVehiclesAPI.getAll();
        const data = response?.data || response || [];
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load used vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsedVehicles();
  }, []);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Liên hệ";
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(2).replace(/\.00$/, "") + " Tỷ";
    }
    return (price / 1000000).toFixed(0) + " Triệu";
  };

  const filteredVehicles = vehicles.filter((v) => {
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const title = (v.title || "").toLowerCase();
      const tagline = (v.tagline || "").toLowerCase();
      if (!title.includes(term) && !tagline.includes(term)) {
        return false;
      }
    }

    // Price
    if (priceFilter) {
      const price = parseFloat(v.price || 0);
      if (priceFilter === "under-800" && price >= 800000000) return false;
      if (priceFilter === "800-1200" && (price < 800000000 || price > 1200000000)) return false;
      if (priceFilter === "over-1200" && price <= 1200000000) return false;
    }

    return true;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter(null);
  };

  const hasActiveFilters = searchTerm !== "" || priceFilter !== null;

  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#0562d2] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-semibold">Xe đã qua sử dụng</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#000000] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_75%)] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Đại lý chính hãng Ford Assured</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight uppercase font-sans mb-6">
              Xe đã qua sử dụng chất lượng cao
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              Mỗi chiếc xe đã qua sử dụng tại Đồng Nai Ford đều được kiểm duyệt nghiêm ngặt qua quy trình 167 điểm của Ford toàn cầu, đảm bảo chất lượng tối ưu, pháp lý minh bạch và chế độ bảo hành dài hạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:090" className="inline-flex items-center gap-2 bg-[#0562d2] hover:bg-[#044eb0] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-900/30">
                <PhoneCall className="w-4 h-4" />
                Hotline Tư vấn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-10 flex flex-wrap items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="flex-1 min-w-[280px] relative">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mẫu xe, từ khóa..."
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-[#0562d2] focus:bg-white transition-all text-black"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 p-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Mức giá:</span>
              {[
                { slug: null, label: "Tất cả" },
                { slug: "under-800", label: "Dưới 800 Tr" },
                { slug: "800-1200", label: "800 Tr - 1.2 Tỷ" },
                { slug: "over-1200", label: "Trên 1.2 Tỷ" }
              ].map((item) => {
                const isSelected = priceFilter === item.slug;
                return (
                  <button
                    key={item.label}
                    onClick={() => setPriceFilter(item.slug)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#0562d2] border-[#0562d2] text-white shadow-sm" 
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-xs font-semibold text-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#0562d2] cursor-pointer shadow-xs"
              >
                <option value="featured">Sắp xếp mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>

          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <span className="text-xs text-gray-500">Bộ lọc đang kích hoạt:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-medium">
                  Từ khóa: &quot;{searchTerm}&quot;
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-900 border-0 bg-transparent p-0 cursor-pointer">
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {priceFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-medium">
                  Khoảng giá: {priceFilter === "under-800" ? "Dưới 800 triệu" : priceFilter === "800-1200" ? "800 triệu - 1.2 tỷ" : "Trên 1.2 tỷ"}
                  <button onClick={() => setPriceFilter(null)} className="hover:text-blue-900 border-0 bg-transparent p-0 cursor-pointer">
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-xs font-semibold text-red-500 hover:text-red-700 ml-2 border-0 bg-transparent cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse h-[400px]">
                  <div className="bg-gray-200 h-[220px]" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedVehicles.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto mt-10">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy xe phù hợp</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Rất tiếc, các bộ lọc hiện tại của bạn không khớp với bất kỳ chiếc xe đã qua sử dụng nào. Hãy thử xóa bớt tiêu chí lọc hoặc tìm kiếm lại.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                Xóa bộ lọc và xem tất cả
              </button>
            </div>
          ) : (
            /* Vehicle Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedVehicles.map((vehicle) => {
                const year = vehicle.year || "Đang cập nhật";
                const odo = vehicle.odo ? `${new Intl.NumberFormat("vi-VN").format(vehicle.odo)} km` : "Đang cập nhật";

                return (
                  <div 
                    key={vehicle.id} 
                    className="group bg-white border border-gray-200/60 hover:border-blue-500/30 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative h-[220px] bg-white overflow-hidden flex items-center justify-center border-b border-gray-100">
                      <Image 
                        src={vehicle.image_url || "/assets/images/placeholder_car.png"} 
                        alt={vehicle.title}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      />
                      
                      {/* Assured Badge */}
                      <div className="absolute top-4 left-4 bg-[#0562d2]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1 z-10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ford Assured</span>
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Highlights (odo, year) */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#0562d2]" />
                            Đời {year}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-[#0562d2]" />
                            {odo}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#0562d2] transition-colors leading-snug">
                          {vehicle.title}
                        </h3>

                        {/* Tagline */}
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                          {vehicle.tagline}
                        </p>
                      </div>

                      {/* Bottom Info */}
                      <div>
                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider mb-0.5">Giá ưu đãi</span>
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(vehicle.price)}
                            </span>
                          </div>
                          <Link 
                            href={`/xe-da-qua-su-dung/${vehicle.slug}`}
                            className="bg-gray-950 hover:bg-[#0562d2] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-xs"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
