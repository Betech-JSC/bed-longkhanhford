"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  RotateCcw, 
  ChevronRight,
  Filter,
  Check,
  Fuel,
  Users,
  Settings,
  GitCompare
} from "lucide-react";
import { vehiclesAPI } from "@/lib/api";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";
import BookingBanner from "@/components/services/BookingBanner";

const staticCategories = [
  { slug: "suv", title: "SUV" },
  { slug: "ban-tai", title: "Bán tải" },
  { slug: "thuong-mai", title: "Thương mại" },
];

export default function ProductsPage({ initialCategory }: { initialCategory?: string }) {
  const [apiVehicles, setApiVehicles] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Mobile drawer filter visibility
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Compare Vehicles State
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const loadCompareIds = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setCompareIds(ids);
            return;
          }
        } catch (e) {
          console.error("Error loading compare list:", e);
        }
      }
      setCompareIds([]);
    }
  };

  useEffect(() => {
    loadCompareIds();
    const handleUpdate = () => {
      loadCompareIds();
    };
    window.addEventListener("compare-updated", handleUpdate);
    return () => {
      window.removeEventListener("compare-updated", handleUpdate);
    };
  }, []);

  const toggleCompare = (vehicleId: string) => {
    let updated: string[];
    if (compareIds.includes(vehicleId)) {
      updated = compareIds.filter((id) => id !== vehicleId);
    } else {
      if (compareIds.length >= 3) {
        alert("Bạn chỉ có thể so sánh tối đa 3 xe cùng lúc!");
        return;
      }
      updated = [...compareIds, vehicleId];
    }
    localStorage.setItem("compare-vehicles", JSON.stringify(updated));
    setCompareIds(updated);
    window.dispatchEvent(new Event("compare-updated"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, categoriesData] = await Promise.all([
          vehiclesAPI.getAll({ with_versions: true }).catch(() => null),
          vehiclesAPI.getCategories().catch(() => null),
        ]);

        const vItems = (vehiclesData as any)?.data || vehiclesData;
        if (Array.isArray(vItems) && vItems.length > 0) {
          setApiVehicles(vItems);
        }

        const cItems = (categoriesData as any)?.data || categoriesData;
        if (Array.isArray(cItems) && cItems.length > 0) {
          setApiCategories(cItems);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Parse URL query parameters to pre-select category
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
      return;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setSelectedCategories([cat]);
      }
    }
  }, [initialCategory]);

  const categories = apiCategories.length > 0 ? apiCategories : staticCategories;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  // Helper to extend vehicle data with specs and properties for filtering
  const getExtendedVehicleData = (v: any) => {
    const price = typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || v.basePrice || 0);
    const id = v.slug || v.id;
    const name = v.title || v.name || "";
    const image = getPopularVehicleImage(id) || v.image_thumbnail_url || v.image_url || v.images?.[0] || "";
    
    let categorySlugs: string[] = [];
    if (v.category_ids && Array.isArray(v.category_ids)) {
      v.category_ids.forEach((id: number) => {
        const cat = apiCategories.find((c: any) => c.id === id);
        if (cat) categorySlugs.push(cat.slug);
      });
    } else if (v.category_id) {
      const cat = apiCategories.find((c: any) => c.id === v.category_id);
      if (cat) categorySlugs.push(cat.slug);
    }
    if (categorySlugs.length === 0 && v.type) {
      categorySlugs.push(v.type);
    }

    categorySlugs = categorySlugs.map((slug: string) => {
      let norm = slug;
      if (norm === "pickup") norm = "ban-tai";
      if (norm === "commercial") norm = "thuong-mai";
      return norm;
    });

    const categorySlug = categorySlugs[0] || "all";
    
    const seats = v.type_name || v.typeName || (
      name.toLowerCase().includes("transit") ? "16 Chỗ" : 
      (name.toLowerCase().includes("everest") || name.toLowerCase().includes("explorer")) ? "7 Chỗ" : 
      "5 Chỗ"
    );
    const seatsCount = seats.toLowerCase().includes("16") ? "16" : seats.toLowerCase().includes("7") ? "7" : "5";
    
    const firstVersionSpecs = v.versions?.[0]?.specs;
    
    // Parse real specifications from database
    let parsedSpecs = { engine: "", transmission: "", drivetrain: "" };
    if (Array.isArray(firstVersionSpecs)) {
      firstVersionSpecs.forEach((item: any) => {
        const title = (item.title || "").toLowerCase();
        const content = (item.content || "");
        
        // Strip HTML tags and normalize spacing
        const cleanText = content
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        const lowerText = cleanText.toLowerCase();

        // 1. Engine
        if (
          title.includes("động cơ") ||
          title.includes("vận hành") ||
          title.includes("hiệu năng") ||
          title.includes("thông số kỹ thuật")
        ) {
          if (lowerText.includes("3.0l") && (lowerText.includes("v6") || lowerText.includes("raptor") || lowerText.includes("lion"))) {
            if (lowerText.includes("xăng") || lowerText.includes("ecoboost")) {
              parsedSpecs.engine = "EcoBoost 3.0L V6";
            } else {
              parsedSpecs.engine = "Diesel 3.0L V6";
            }
          } else if (lowerText.includes("2.3l")) {
            if (lowerText.includes("xăng") || lowerText.includes("ecoboost")) {
              parsedSpecs.engine = "EcoBoost 2.3L";
            } else {
              parsedSpecs.engine = "Turbo Diesel 2.3L";
            }
          } else if (lowerText.includes("2.0l") || lowerText.includes("1996 cc") || lowerText.includes("1996cc")) {
            if (lowerText.includes("bi-turbo") || lowerText.includes("tăng áp kép") || lowerText.includes("210") || lowerText.includes("154.5")) {
              parsedSpecs.engine = "Bi-Turbo Diesel 2.0L";
            } else {
              parsedSpecs.engine = "Single-Turbo Diesel 2.0L";
            }
          } else if (lowerText.includes("1.5l")) {
            parsedSpecs.engine = "EcoBoost 1.5L";
          } else if (lowerText.includes("pin") || lowerText.includes("kwh")) {
            const pinMatch = cleanText.match(/(\d+\s*kWh)/i);
            parsedSpecs.engine = `Pin ${pinMatch ? pinMatch[1] : "87 kWh"}`;
          }
        }

        // 2. Transmission
        if (
          title.includes("hộp số") ||
          title.includes("động cơ") ||
          title.includes("vận hành") ||
          title.includes("thông số kỹ thuật")
        ) {
          if (lowerText.includes("số tự động")) {
            const match = cleanText.match(/(Số tự động\s*\d+\s*cấp)/i);
            parsedSpecs.transmission = match ? match[1] : "Số tự động";
          } else if (lowerText.includes("số sàn") || lowerText.includes("số tay") || lowerText.includes("mt")) {
            const match = cleanText.match(/(\d+\s*cấp\s*số\s*sàn)/i)
              || cleanText.match(/(số sàn\s*\d+\s*cấp)/i)
              || cleanText.match(/(\d+\s*số\s*tay)/i);
            parsedSpecs.transmission = match ? match[1] : "Số sàn";
          }
        }

        // 3. Drivetrain
        if (
          title.includes("dẫn động") ||
          title.includes("vận hành") ||
          title.includes("truyền động") ||
          title.includes("thông số kỹ thuật")
        ) {
          if (lowerText.includes("4x4") || lowerText.includes("hai cầu") || lowerText.includes("4wd")) {
            parsedSpecs.drivetrain = "Hai cầu (4x4)";
          } else if (lowerText.includes("awd") || lowerText.includes("4 bánh")) {
            parsedSpecs.drivetrain = "Hai cầu (AWD)";
          } else if (lowerText.includes("4x2") || lowerText.includes("một cầu") || lowerText.includes("fwd")) {
            parsedSpecs.drivetrain = "Một cầu (4x2)";
          } else if (lowerText.includes("cầu sau") || lowerText.includes("rwd")) {
            parsedSpecs.drivetrain = "Cầu sau (RWD)";
          }
        }
      });
    }

    // Post-processing and fallbacks
    let transmission = parsedSpecs.transmission;
    if (transmission) {
      transmission = transmission.charAt(0).toUpperCase() + transmission.slice(1);
      if (transmission.toLowerCase().includes("6 số tay") || transmission.toLowerCase().includes("6 cấp số sàn")) {
        transmission = "Số sàn 6 cấp";
      }
    } else {
      if (name.toLowerCase().includes("transit") || name.toLowerCase().includes("ranger xl")) {
        transmission = "Số sàn 6 cấp";
      } else {
        transmission = "Số tự động";
      }
    }

    let engine = parsedSpecs.engine;
    if (!engine) {
      if (name.toLowerCase().includes("raptor")) {
        engine = "EcoBoost 3.0L V6";
      } else if (name.toLowerCase().includes("stormtrak") || name.toLowerCase().includes("wildtrak") || name.toLowerCase().includes("platinum")) {
        engine = "Bi-Turbo Diesel 2.0L";
      } else if (name.toLowerCase().includes("everest") || name.toLowerCase().includes("ranger") || name.toLowerCase().includes("transit")) {
        engine = "Single-Turbo Diesel 2.0L";
      } else {
        engine = "EcoBoost 1.5L";
      }
    }

    let drivetrain = parsedSpecs.drivetrain;
    if (!drivetrain) {
      if (name.toLowerCase().includes("transit")) {
        drivetrain = "Cầu sau (RWD)";
      } else if (name.toLowerCase().includes("raptor") || name.toLowerCase().includes("wildtrak") || name.toLowerCase().includes("stormtrak")) {
        drivetrain = "Hai cầu (4x4)";
      } else {
        drivetrain = "Một cầu (4x2)";
      }
    }

    let fuel = "Xăng";
    if (engine.toLowerCase().includes("diesel") || engine.toLowerCase().includes("dầu")) {
      fuel = "Diesel";
    }

    return {
      ...v,
      id,
      name,
      price,
      image,
      categorySlug,
      categorySlugs,
      seatsCount,
      fuel,
      transmission,
      typeName: v.type_name || v.typeName || (seatsCount === "16" ? "Xe 16 Chỗ" : `${categorySlug === "ban-tai" ? "Bán tải" : "SUV"} ${seatsCount} Chỗ`),
      engine,
      transText: transmission,
      drivetrain
    };
  };

  const resolvedVehicles = apiVehicles.map(v => getExtendedVehicleData(v));

  // Perform dynamic filtering
  const filteredVehicles = resolvedVehicles.filter((v) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!v.name.toLowerCase().includes(term) && !v.typeName.toLowerCase().includes(term)) {
        return false;
      }
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      const hasMatchingCategory = v.categorySlugs.some((slug: string) => selectedCategories.includes(slug));
      if (!hasMatchingCategory) {
        return false;
      }
    }
    
    // Price filter
    if (priceRange) {
      if (priceRange === "under-800" && v.price >= 800000000) return false;
      if (priceRange === "800-1200" && (v.price < 800000000 || v.price > 1200000000)) return false;
      if (priceRange === "over-1200" && v.price <= 1200000000) return false;
    }
    
    // Seats filter
    if (selectedSeats.length > 0) {
      if (!selectedSeats.includes(v.seatsCount)) return false;
    }
    
    // Fuel filter
    if (selectedFuels.length > 0) {
      if (!selectedFuels.includes(v.fuel)) return false;
    }
    
    // Transmission filter
    if (selectedTransmissions.length > 0) {
      if (!selectedTransmissions.includes(v.transmission)) return false;
    }
    
    return true;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    // Default featured sorting
    const aBest = a.is_best_seller || a.isBestSeller ? 1 : 0;
    const bBest = b.is_best_seller || b.isBestSeller ? 1 : 0;
    if (bBest !== aBest) return bBest - aBest;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  // Calculate dynamic counts based on resolvedVehicles
  const getCounts = () => {
    const counts = {
      categories: { suv: 0, "ban-tai": 0, "thuong-mai": 0 },
      priceRanges: { under800: 0, from800to1200: 0, over1200: 0 },
      seats: { "5": 0, "7": 0, "16": 0 },
      fuels: { gasoline: 0, diesel: 0 },
      transmissions: { automatic: 0, manual: 0 }
    };

    resolvedVehicles.forEach((v) => {
      // Categories
      if (v.categorySlug === "suv") counts.categories.suv++;
      else if (v.categorySlug === "ban-tai" || v.categorySlug === "pickup") counts.categories["ban-tai"]++;
      else if (v.categorySlug === "thuong-mai" || v.categorySlug === "commercial") counts.categories["thuong-mai"]++;

      // Price Ranges
      if (v.price < 800000000) counts.priceRanges.under800++;
      else if (v.price >= 800000000 && v.price <= 1200000000) counts.priceRanges.from800to1200++;
      else if (v.price > 1200000000) counts.priceRanges.over1200++;

      // Seats
      if (v.seatsCount === "5") counts.seats["5"]++;
      else if (v.seatsCount === "7") counts.seats["7"]++;
      else if (v.seatsCount === "16") counts.seats["16"]++;

      // Fuel
      if (v.fuel === "Xăng") counts.fuels.gasoline++;
      else if (v.fuel === "Diesel") counts.fuels.diesel++;

      // Transmission
      if (v.transmission === "Số tự động") counts.transmissions.automatic++;
      else if (v.transmission === "Số sàn") counts.transmissions.manual++;
    });

    return counts;
  };

  const counts = getCounts();

  // Helper toggle functions
  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const toggleSeats = (seats: string) => {
    setSelectedSeats(prev => 
      prev.includes(seats) ? prev.filter(s => s !== seats) : [...prev, seats]
    );
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev => 
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (trans: string) => {
    setSelectedTransmissions(prev => 
      prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange(null);
    setSelectedSeats([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
  };

  const hasActiveFilters = 
    searchTerm !== "" || 
    selectedCategories.length > 0 || 
    priceRange !== null || 
    selectedSeats.length > 0 || 
    selectedFuels.length > 0 || 
    selectedTransmissions.length > 0;

  // Render Category Name
  const getCategoryTitle = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.title : slug;
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen font-sans pb-16 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 to-[#01095c] text-white pt-28 pb-16 md:pb-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/60 font-medium flex items-center gap-1.5 mb-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Sản phẩm</span>
          </div>
          <div className="text-center font-antenna">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-[1.2] mb-4 font-antenna">
              Các dòng xe Ford
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-antenna">
              Khám phá các dòng xe Ford thế hệ mới tại Long Khánh Ford — Từ dòng SUV thông minh, bán tải địa hình hầm hố cho đến các dòng xe thương mại đa dụng tối ưu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Layout Area */}
      <section className="py-12 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          
          <div className="lg:grid lg:grid-cols-4 lg:gap-8 items-start">
            
            {/* 1. FILTER SIDEBAR (Desktop only) */}
            <div className="hidden lg:block lg:col-span-1 bg-white border border-gray-200 rounded-none p-6 shadow-xs space-y-6 sticky top-[100px]">
              
              {/* Header Title with Reset */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-[15px] font-bold font-display text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#066fef]" />
                  Bộ lọc xe
                </span>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#D20000] hover:text-red-755 flex items-center gap-1 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Filter 1: Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Tìm kiếm</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tên xe..."
                    className="w-full text-xs bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-black border border-gray-200 rounded-[8px] py-2.5 pl-9 pr-8 focus:outline-none focus:border-[#066fef] transition-colors font-antenna"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer border-0 bg-transparent p-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter 2: Categories */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Dòng xe / Phân khúc</label>
                <div className="space-y-2">
                  {categories.map((cat: any) => {
                    const isChecked = selectedCategories.includes(cat.slug);
                    const count = counts.categories[cat.slug as keyof typeof counts.categories] || 0;
                    return (
                      <label 
                        key={cat.slug} 
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-bold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/20 text-[#066fef]" 
                            : "bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.slug)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{cat.title}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter 3: Price Range */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Khoảng giá</label>
                <div className="space-y-2">
                  {[
                    { slug: null, label: "Tất cả mức giá", count: resolvedVehicles.length },
                    { slug: "under-800", label: "Dưới 800 triệu", count: counts.priceRanges.under800 },
                    { slug: "800-1200", label: "800 triệu - 1.2 tỷ", count: counts.priceRanges.from800to1200 },
                    { slug: "over-1200", label: "Trên 1.2 tỷ", count: counts.priceRanges.over1200 }
                  ].map((range) => {
                    const isSelected = priceRange === range.slug;
                    return (
                      <label 
                        key={range.label} 
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-bold cursor-pointer transition-colors border ${
                          isSelected 
                            ? "bg-[#066fef]/10 border-[#066fef]/20 text-[#066fef]" 
                            : "bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="radio"
                            name="priceRangeRadio"
                            checked={isSelected}
                            onChange={() => setPriceRange(range.slug)}
                            className="text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{range.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold ${
                          isSelected ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {range.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter 4: Seats Capacity */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Số chỗ ngồi</label>
                <div className="space-y-2">
                  {[
                    { slug: "5", label: "Xe 5 chỗ", count: counts.seats["5"] },
                    { slug: "7", label: "Xe 7 chỗ", count: counts.seats["7"] },
                    { slug: "16", label: "Xe 16 chỗ", count: counts.seats["16"] }
                  ].map((seat) => {
                    const isChecked = selectedSeats.includes(seat.slug);
                    return (
                      <label 
                        key={seat.slug} 
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-bold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/20 text-[#066fef]" 
                            : "bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSeats(seat.slug)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{seat.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {seat.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter 5: Fuel Type */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Nhiên liệu</label>
                <div className="space-y-2">
                  {[
                    { name: "Xăng", code: "gasoline", count: counts.fuels.gasoline },
                    { name: "Diesel", code: "diesel", count: counts.fuels.diesel }
                  ].map((fuel) => {
                    const isChecked = selectedFuels.includes(fuel.name);
                    return (
                      <label 
                        key={fuel.name} 
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-bold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/20 text-[#066fef]" 
                            : "bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFuel(fuel.name)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>Động cơ {fuel.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {fuel.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter 6: Transmission */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Hộp số</label>
                <div className="space-y-2">
                  {[
                    { name: "Số tự động", code: "automatic", count: counts.transmissions.automatic },
                    { name: "Số sàn", code: "manual", count: counts.transmissions.manual }
                  ].map((trans) => {
                    const isChecked = selectedTransmissions.includes(trans.name);
                    return (
                      <label 
                        key={trans.name} 
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-bold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/20 text-[#066fef]" 
                            : "bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTransmission(trans.name)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{trans.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {trans.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 2. PRODUCT LIST & TOOLBAR (Right side on Desktop, full width on Mobile) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Product Header Toolbar */}
              <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs flex-wrap gap-4 rounded-none">
                <div className="text-left font-antenna">
                  <h2 className="text-base font-bold font-display text-gray-900 uppercase">
                    Danh sách xe Ford
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Tìm thấy <span className="text-[#066fef] font-bold">{sortedVehicles.length}</span> mẫu xe phù hợp
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  
                  {/* Mobile filter button trigger */}
                  <button 
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-[4px] border border-gray-200 cursor-pointer shadow-xs uppercase tracking-wider"
                  >
                    <Filter className="w-4 h-4 text-[#066fef]" />
                    <span>Lọc xe ({[
                      selectedCategories.length,
                      priceRange ? 1 : 0,
                      selectedSeats.length,
                      selectedFuels.length,
                      selectedTransmissions.length
                    ].reduce((a, b) => a + b, 0)})</span>
                  </button>

                  {/* Sort options dropdown wrapper */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap hidden sm:inline">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-200 text-xs font-semibold text-gray-800 py-2 px-3 rounded-[8px] focus:outline-none focus:border-[#066fef] cursor-pointer shadow-xs font-antenna"
                    >
                      <option value="featured">Phổ biến nhất</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap bg-white p-4 border border-gray-200 rounded-none shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Đang lọc theo:</span>
                  
                  {/* Category Tags */}
                  {selectedCategories.map((cat) => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/20 rounded-[4px] px-3 py-1 text-xs font-semibold font-antenna">
                      <span>Dòng {getCategoryTitle(cat)}</span>
                      <button onClick={() => toggleCategory(cat)} className="text-[#066fef]/60 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Price Tag */}
                  {priceRange && (
                    <span className="inline-flex items-center gap-1 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/20 rounded-[4px] px-3 py-1 text-xs font-semibold font-antenna">
                      <span>{priceRange === "under-800" ? "Dưới 800 triệu" : priceRange === "800-1200" ? "800 triệu - 1.2 tỷ" : "Trên 1.2 tỷ"}</span>
                      <button onClick={() => setPriceRange(null)} className="text-[#066fef]/60 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Seat Tags */}
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="inline-flex items-center gap-1 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/20 rounded-[4px] px-3 py-1 text-xs font-semibold font-antenna">
                      <span>{seat} Chỗ</span>
                      <button onClick={() => toggleSeats(seat)} className="text-[#066fef]/60 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Fuel Tags */}
                  {selectedFuels.map((fuel) => (
                    <span key={fuel} className="inline-flex items-center gap-1 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/20 rounded-[4px] px-3 py-1 text-xs font-semibold font-antenna">
                      <span>Máy {fuel}</span>
                      <button onClick={() => toggleFuel(fuel)} className="text-[#066fef]/60 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Transmission Tags */}
                  {selectedTransmissions.map((trans) => (
                    <span key={trans} className="inline-flex items-center gap-1 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/20 rounded-[4px] px-3 py-1 text-xs font-semibold font-antenna">
                      <span>{trans}</span>
                      <button onClick={() => toggleTransmission(trans)} className="text-[#066fef]/60 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#D20000] hover:text-red-700 underline cursor-pointer border-0 bg-transparent p-0 ml-auto font-antenna"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Dynamic Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVehicles.map((vehicle: any) => {
                  const vehicleId = vehicle.id;
                  const vehicleName = vehicle.name;
                  const vehicleImage = vehicle.image;
                  const vehiclePrice = vehicle.price;
                  const vehicleType = vehicle.typeName;

                  return (
                    <div
                      key={vehicleId}
                      className="bg-white border border-gray-200 hover:border-[#066fef]/55 rounded-none p-5 flex flex-col hover:shadow-xs transition-all duration-300 group relative"
                    >
                      {/* Compare Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCompare(vehicleId);
                        }}
                        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-[4px] flex items-center justify-center transition-all active:scale-95 border cursor-pointer ${
                          compareIds.includes(vehicleId)
                            ? "bg-[#066fef] text-white border-[#066fef] shadow-md"
                            : "bg-white/95 text-gray-555 hover:text-[#066fef] border-gray-200 hover:shadow-md"
                        }`}
                        title={compareIds.includes(vehicleId) ? "Xóa khỏi so sánh" : "Thêm vào so sánh"}
                      >
                        <GitCompare className={`w-4 h-4 ${compareIds.includes(vehicleId) ? "animate-pulse" : ""}`} />
                      </button>
                      <Link
                        href={`/${vehicleId}`}
                        className="relative h-48 w-full bg-white overflow-hidden mb-5 flex items-center justify-center block rounded-none border-b border-gray-100"
                      >
                        <Image
                          src={vehicleImage}
                          alt={vehicleName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          onError={handleImageError}
                        />
                      </Link>

                      {/* Badges Container */}
                      <div className="flex gap-2 mb-3 items-center flex-wrap font-antenna">
                        {vehicleType && (
                          <span className="inline-block text-[11px] font-bold text-[#066fef] bg-[#066fef]/10 px-2.5 py-0.5 rounded-[4px]">
                            {vehicleType}
                          </span>
                        )}
                        <span className="inline-block text-[11px] font-bold text-gray-650 bg-gray-100 px-2.5 py-0.5 rounded-[4px]">
                          Động cơ {vehicle.fuel}
                        </span>
                      </div>

                      {/* Title & Price */}
                      <h3 className="text-[17px] font-bold font-display tracking-tight uppercase text-gray-900 group-hover:text-[#066fef] transition-colors mb-1">
                        {vehicleName}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mb-4 font-antenna">
                        Giá khởi điểm:{" "}
                        <span className="text-[#066fef] font-bold text-sm">
                          {formatPrice(vehiclePrice)}
                        </span>
                      </p>

                      {/* Technical specifications panel on card */}
                      <div className="border-t border-gray-100 pt-3 mt-auto mb-4 text-[11px] text-gray-600 space-y-1.5 leading-tight text-left font-antenna">
                        <div className="flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5 text-gray-400" />
                          <span>Động cơ: <strong className="text-gray-800 font-semibold">{vehicle.engine}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-gray-400" />
                          <span>Hộp số: <strong className="text-gray-800 font-semibold">{vehicle.transText}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>Hệ dẫn động: <strong className="text-gray-800 font-semibold">{vehicle.drivetrain}</strong></span>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2 text-xs font-antenna">
                        <Link
                          href={`/${vehicleId}`}
                          className="flex-1 text-center bg-gray-950 hover:bg-[#066fef] border border-gray-950 hover:border-[#066fef] text-white font-bold py-2.5 rounded-[4px] transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
                        >
                          Chi tiết
                        </Link>
                        <Link
                          href="/lien-he"
                          className="flex-1 text-center border border-[#066fef] hover:bg-[#066fef] text-[#066fef] hover:text-white font-bold py-2.5 rounded-[4px] transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
                        >
                          Báo giá
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {sortedVehicles.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-none shadow-xs">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-[4px] flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 font-display">Không tìm thấy xe phù hợp</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 font-antenna">
                    Không có dòng xe nào khớp với tất cả các tùy chọn lọc hiện tại của bạn.
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-[#066fef] hover:bg-[#01095c] text-white text-xs font-bold px-6 py-2.5 rounded-[4px] transition-colors cursor-pointer border-0 uppercase tracking-wider"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Quick Links to Tools */}
      <section className="bg-white border-y border-gray-200 py-12 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <h2 className="text-xl md:text-2xl font-bold font-display text-[#00095B] text-center mb-8 uppercase tracking-wide">
            Công cụ hỗ trợ mua xe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bảng giá xe Ford",
                desc: "Giá niêm yết mới nhất cho tất cả dòng xe Ford",
                href: "/bang-gia",
              },
              {
                title: "Ước tính lăn bánh",
                desc: "Tính chi phí lăn bánh chi tiết theo tỉnh/thành phố",
                href: "/cong-cu/uoc-tinh-lan-banh",
              },
              {
                title: "Ước tính trả góp",
                desc: "Tính lãi suất và khoản trả hàng tháng",
                href: "/cong-cu/uoc-tinh-tra-gop",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between p-6 rounded-none border border-gray-200 hover:border-[#066fef] hover:shadow-xs transition-all group font-antenna no-underline"
              >
                <div>
                  <h3 className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#066fef] transition-colors font-display uppercase tracking-wide">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0562d2] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Banner */}
      <BookingBanner />

      {/* 3. MOBILE FILTER DRAWER SHEET */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 transition-opacity duration-300"
          />
          
          {/* Drawer Body Panel */}
          <div className="relative bg-white w-full max-w-[420px] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-[#00095b] text-white p-5 flex items-center justify-between shrink-0">
              <span className="text-[14px] font-bold font-['Ford_Antenna',sans-serif] uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Bộ lọc xe
              </span>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
              {/* Reset button inside content */}
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-lg border border-red-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Xóa tất cả bộ lọc hiện tại
                </button>
              )}

              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Tìm kiếm xe</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên dòng xe cần tìm..."
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg py-3 pl-9 pr-8 focus:outline-none focus:border-[#0562d2] text-black bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer border-0 bg-transparent p-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Dòng xe / Phân khúc</label>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat: any) => {
                    const isChecked = selectedCategories.includes(cat.slug);
                    const count = counts.categories[cat.slug as keyof typeof counts.categories] || 0;
                    return (
                      <label 
                        key={cat.slug} 
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-blue-50 border-blue-200 text-[#0562d2]" 
                            : "bg-transparent border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.slug)}
                            className="rounded border-gray-300 text-[#0562d2] focus:ring-[#0562d2] cursor-pointer w-4 h-4"
                          />
                          <span>{cat.title}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-blue-100 text-[#0562d2]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Khoảng giá ước tính</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { slug: null, label: "Tất cả mức giá", count: resolvedVehicles.length },
                    { slug: "under-800", label: "Dưới 800 triệu", count: counts.priceRanges.under800 },
                    { slug: "800-1200", label: "800 triệu - 1.2 tỷ", count: counts.priceRanges.from800to1200 },
                    { slug: "over-1200", label: "Trên 1.2 tỷ", count: counts.priceRanges.over1200 }
                  ].map((range) => {
                    const isSelected = priceRange === range.slug;
                    return (
                      <label 
                        key={range.label} 
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                          isSelected 
                            ? "bg-blue-50 border-blue-200 text-[#0562d2]" 
                            : "bg-transparent border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio"
                            name="mobilePriceRangeRadio"
                            checked={isSelected}
                            onChange={() => setPriceRange(range.slug)}
                            className="text-[#0562d2] focus:ring-[#0562d2] cursor-pointer w-4 h-4"
                          />
                          <span>{range.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? "bg-blue-100 text-[#0562d2]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {range.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Seats */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Số chỗ ngồi</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { slug: "5", label: "Xe 5 chỗ", count: counts.seats["5"] },
                    { slug: "7", label: "Xe 7 chỗ", count: counts.seats["7"] },
                    { slug: "16", label: "Xe 16 chỗ", count: counts.seats["16"] }
                  ].map((seat) => {
                    const isChecked = selectedSeats.includes(seat.slug);
                    return (
                      <label 
                        key={seat.slug} 
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-blue-50 border-blue-200 text-[#0562d2]" 
                            : "bg-transparent border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSeats(seat.slug)}
                            className="rounded border-gray-300 text-[#0562d2] focus:ring-[#0562d2] cursor-pointer w-4 h-4"
                          />
                          <span>{seat.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-blue-100 text-[#0562d2]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {seat.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fuels */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Loại nhiên liệu</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Xăng", count: counts.fuels.gasoline },
                    { name: "Diesel", count: counts.fuels.diesel }
                  ].map((fuel) => {
                    const isChecked = selectedFuels.includes(fuel.name);
                    return (
                      <label 
                        key={fuel.name} 
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-blue-50 border-blue-200 text-[#0562d2]" 
                            : "bg-transparent border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFuel(fuel.name)}
                            className="rounded border-gray-300 text-[#0562d2] focus:ring-[#0562d2] cursor-pointer w-4 h-4"
                          />
                          <span>Máy {fuel.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-blue-100 text-[#0562d2]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {fuel.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Transmissions */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Hộp số truyền động</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Số tự động", count: counts.transmissions.automatic },
                    { name: "Số sàn", count: counts.transmissions.manual }
                  ].map((trans) => {
                    const isChecked = selectedTransmissions.includes(trans.name);
                    return (
                      <label 
                        key={trans.name} 
                        className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-blue-50 border-blue-200 text-[#0562d2]" 
                            : "bg-transparent border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTransmission(trans.name)}
                            className="rounded border-gray-300 text-[#0562d2] focus:ring-[#0562d2] cursor-pointer w-4 h-4"
                          />
                          <span>{trans.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-blue-100 text-[#0562d2]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {trans.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-[#e5e5e5] flex gap-3 shrink-0 bg-gray-50">
              <button 
                onClick={clearAllFilters}
                className="flex-1 text-center bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-3.5 rounded-full border border-gray-200 cursor-pointer shadow-xs"
              >
                Đặt lại
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 text-center bg-[#0562d2] hover:bg-[#044ea7] text-white text-xs font-bold py-3.5 rounded-full cursor-pointer shadow-xs border-0"
              >
                Xem {sortedVehicles.length} kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
