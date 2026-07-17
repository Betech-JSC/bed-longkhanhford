"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
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
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

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
    const image = v.image_thumbnail_url || v.image_url || v.images?.[0] || getPopularVehicleImage(id);
    
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
    const parsedSpecs = { engine: "", transmission: "", drivetrain: "" };
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== "") count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange) count++;
    if (selectedSeats.length > 0) count++;
    if (selectedFuels.length > 0) count++;
    if (selectedTransmissions.length > 0) count++;
    return count;
  };

  // Render Category Name
  const getCategoryTitle = (slug: string) => {
    const cat = categories.find((c: any) => c.slug === slug);
    return cat ? cat.title : slug;
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen font-sans pb-16 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 via-[#002F6C] to-[#01095c] text-white pt-32 pb-20 md:pb-24 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#066fef]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/50 font-bold flex items-center gap-1.5 mb-6 justify-center uppercase tracking-widest font-antenna">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white/90">Sản phẩm</span>
          </div>
          <div className="text-center font-antenna max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase leading-[1.1] mb-6 font-antenna">
              Dòng xe Ford thế hệ mới
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-antenna font-medium">
              Khám phá sức mạnh, công nghệ thông minh và sự đa dụng vượt trội của các dòng xe Ford chính hãng tại showroom Long Khánh Ford.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Category Navigation Tabs (Sticky Bar) */}
      <div className="sticky top-[80px] z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 w-full flex flex-col items-center transition-all duration-300 shadow-xs">
        <div className="max-w-[1440px] w-full px-4 xl:px-[80px] py-4 flex items-center justify-between gap-6">
          {/* Left side category tabs */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedCategories([])}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap ${
                selectedCategories.length === 0
                  ? "bg-[#002F6C] text-white shadow-md shadow-blue-900/10"
                  : "bg-gray-100 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900"
              }`}
            >
              Tất cả dòng xe
            </button>
            {categories.map((cat: any) => {
              const isSelected = selectedCategories.includes(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategories([cat.slug])}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#002F6C] text-white shadow-md shadow-blue-900/10"
                      : "bg-gray-100 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Right side search + filter toggle + compare */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Search Box */}
            <div className="relative hidden md:block w-48 lg:w-60">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dòng xe..."
                className="w-full text-xs bg-gray-50/80 hover:bg-gray-100/90 focus:bg-white text-black border border-gray-200 rounded-full py-2.5 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all font-semibold font-antenna"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer border-0 bg-transparent p-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Desktop Filters Toggle Button */}
            <button 
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer font-antenna ${
                isFiltersExpanded || getActiveFilterCount() > 0
                  ? "bg-[#066fef]/10 text-[#066fef] border-[#066fef]/30 shadow-xs" 
                  : "bg-gray-50/80 hover:bg-gray-100/90 border-gray-200 text-gray-700"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc</span>
              {getActiveFilterCount() > 0 && (
                <span className="w-4 h-4 bg-[#066fef] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Mobile Filter Toggle Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-1.5 bg-[#002F6C] hover:bg-[#00095b] text-white text-xs font-bold py-2.5 px-4 rounded-full cursor-pointer shadow-xs uppercase tracking-wider whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Lọc xe</span>
            </button>

            {/* Compare Link */}
            {compareIds.length > 0 && (
              <Link 
                href="/so-sanh"
                className="flex items-center gap-2 bg-[#00095b] hover:bg-[#066fef] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all duration-300 whitespace-nowrap uppercase tracking-wider hover:shadow-lg active:scale-95 shrink-0"
              >
                <GitCompare className="w-4 h-4" />
                <span>So sánh ({compareIds.length}/3)</span>
              </Link>
            )}
          </div>
        </div>

        {/* Dropdown Filters Panel (Desktop/Tablet) */}
        <AnimatePresence>
          {isFiltersExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] py-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chọn các tiêu chí lọc nâng cao:</span>
                  {hasActiveFilters && (
                    <button 
                      onClick={clearAllFilters}
                      className="text-xs font-bold text-[#D20000] hover:text-red-750 flex items-center gap-1.5 transition-colors cursor-pointer border-0 bg-transparent p-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Đặt lại bộ lọc
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  {/* Price Filter */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Khoảng giá</span>
                    <select
                      value={priceRange || ""}
                      onChange={(e) => setPriceRange(e.target.value || null)}
                      className="w-full text-xs font-bold bg-gray-50/60 hover:bg-gray-100/80 focus:bg-white border border-gray-250 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all cursor-pointer font-antenna text-gray-700"
                    >
                      <option value="">Tất cả</option>
                      <option value="under-800">Dưới 800 triệu</option>
                      <option value="800-1200">800 triệu - 1.2 tỷ</option>
                      <option value="over-1200">Trên 1.2 tỷ</option>
                    </select>
                  </div>

                  {/* Seats Filter */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Số chỗ ngồi</span>
                    <select
                      value={selectedSeats[0] || ""}
                      onChange={(e) => setSelectedSeats(e.target.value ? [e.target.value] : [])}
                      className="w-full text-xs font-bold bg-gray-50/60 hover:bg-gray-100/80 focus:bg-white border border-gray-250 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all cursor-pointer font-antenna text-gray-700"
                    >
                      <option value="">Tất cả</option>
                      <option value="5">5 chỗ</option>
                      <option value="7">7 chỗ</option>
                      <option value="16">16 chỗ</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nhiên liệu</span>
                    <select
                      value={selectedFuels[0] || ""}
                      onChange={(e) => setSelectedFuels(e.target.value ? [e.target.value] : [])}
                      className="w-full text-xs font-bold bg-gray-50/60 hover:bg-gray-100/80 focus:bg-white border border-gray-250 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all cursor-pointer font-antenna text-gray-700"
                    >
                      <option value="">Tất cả</option>
                      <option value="Xăng">Máy Xăng</option>
                      <option value="Diesel">Máy Diesel</option>
                    </select>
                  </div>

                  {/* Transmission Type */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Hộp số</span>
                    <select
                      value={selectedTransmissions[0] || ""}
                      onChange={(e) => setSelectedTransmissions(e.target.value ? [e.target.value] : [])}
                      className="w-full text-xs font-bold bg-gray-50/60 hover:bg-gray-100/80 focus:bg-white border border-gray-250 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all cursor-pointer font-antenna text-gray-700"
                    >
                      <option value="">Tất cả</option>
                      <option value="Số tự động">Số tự động</option>
                      <option value="Số sàn">Số sàn</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Sắp xếp theo</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full text-xs font-bold bg-gray-50/60 hover:bg-gray-100/80 focus:bg-white border border-gray-255 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#066fef]/20 transition-all cursor-pointer font-antenna text-gray-700"
                    >
                      <option value="featured">Phổ biến nhất</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Layout Area */}
      <section className="py-12 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] space-y-8">
          
          {/* Results Count Header */}
          <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
            <span className="text-xs text-gray-450 font-bold uppercase tracking-wider font-antenna">
              Đang hiển thị <strong className="text-[#066fef]">{sortedVehicles.length}</strong> mẫu xe Ford
            </span>
          </div>

          {/* Dynamic Active Tags Row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-white px-5 py-3 border border-gray-200/80 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Bộ lọc đang bật:</span>
              
              {selectedCategories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1.5 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/15 rounded-full px-3 py-1 text-xs font-bold font-antenna">
                  <span>Dòng {getCategoryTitle(cat)}</span>
                  <button onClick={() => toggleCategory(cat)} className="text-[#066fef]/65 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer flex items-center">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {priceRange && (
                <span className="inline-flex items-center gap-1.5 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/15 rounded-full px-3 py-1 text-xs font-bold font-antenna">
                  <span>{priceRange === "under-800" ? "Dưới 800 triệu" : priceRange === "800-1200" ? "800 triệu - 1.2 tỷ" : "Trên 1.2 tỷ"}</span>
                  <button onClick={() => setPriceRange(null)} className="text-[#066fef]/65 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer flex items-center">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSeats.map((seat) => (
                <span key={seat} className="inline-flex items-center gap-1.5 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/15 rounded-full px-3 py-1 text-xs font-bold font-antenna">
                  <span>{seat} Chỗ</span>
                  <button onClick={() => toggleSeats(seat)} className="text-[#066fef]/65 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer flex items-center">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedFuels.map((fuel) => (
                <span key={fuel} className="inline-flex items-center gap-1.5 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/15 rounded-full px-3 py-1 text-xs font-bold font-antenna">
                  <span>Máy {fuel}</span>
                  <button onClick={() => toggleFuel(fuel)} className="text-[#066fef]/65 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer flex items-center">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedTransmissions.map((trans) => (
                <span key={trans} className="inline-flex items-center gap-1.5 bg-[#066fef]/10 text-[#066fef] border border-[#066fef]/15 rounded-full px-3 py-1 text-xs font-bold font-antenna">
                  <span>{trans}</span>
                  <button onClick={() => toggleTransmission(trans)} className="text-[#066fef]/65 hover:text-[#066fef] border-0 bg-transparent p-0 cursor-pointer flex items-center">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button 
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#D20000] hover:text-red-700 underline cursor-pointer border-0 bg-transparent p-0 ml-auto font-antenna uppercase tracking-wider"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Grid Layout Container */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVehicles.map((vehicle: any) => {
                const vehicleId = vehicle.id;
                const vehicleName = vehicle.name;
                const vehicleImage = vehicle.image;
                const vehiclePrice = vehicle.price;
                const vehicleType = vehicle.typeName;

                return (
                  <div
                    key={vehicleId}
                    className="bg-white border border-gray-200/80 hover:border-[#066fef]/30 rounded-2xl p-5 flex flex-col hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 group relative"
                  >
                    {/* Compare Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(vehicleId);
                      }}
                      className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 border cursor-pointer ${
                        compareIds.includes(vehicleId)
                          ? "bg-[#066fef] text-white border-[#066fef] shadow-md shadow-blue-500/20"
                          : "bg-white/90 text-gray-500 hover:text-[#066fef] border-gray-200 shadow-sm"
                      }`}
                      title={compareIds.includes(vehicleId) ? "Xóa khỏi so sánh" : "Thêm vào so sánh"}
                    >
                      <GitCompare className={`w-4 h-4 ${compareIds.includes(vehicleId) ? "animate-pulse" : ""}`} />
                    </button>
                    
                    <div className="relative h-56 w-full bg-white overflow-hidden mb-4 flex items-center justify-center rounded-xl">
                      <Link
                        href={`/${vehicleId}`}
                        className="w-full h-full flex items-center justify-center block"
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
                      {/* Hover Overlay Detail Button */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto rounded-xl">
                        <Link
                          href={`/${vehicleId}`}
                          className="bg-gray-950/90 hover:bg-[#066fef] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider text-[11px] shadow-md active:scale-95 transform translate-y-3 group-hover:translate-y-0"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>

                    {/* Badges Container */}
                    <div className="flex gap-2 mb-2.5 items-center justify-center flex-wrap font-antenna">
                      {vehicleType && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#066fef] bg-[#066fef]/8 px-3 py-1 rounded-full">
                          {vehicleType}
                        </span>
                      )}
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Động cơ {vehicle.fuel}
                      </span>
                    </div>

                    {/* Title & Price */}
                    <h3 className="text-lg font-bold font-display tracking-tight uppercase text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 font-antenna text-center">
                      <Link href={`/${vehicleId}`} className="hover:text-[#066fef] transition-colors">
                        {vehicleName}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 font-medium font-antenna text-center mb-1">
                      Giá khởi điểm:{" "}
                      <span className="text-[#066fef] font-bold text-sm ml-0.5">
                        {formatPrice(vehiclePrice)}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {sortedVehicles.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl shadow-sm max-w-lg mx-auto w-full">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5 font-display uppercase tracking-wider">Không tìm thấy xe phù hợp</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6 font-antenna leading-relaxed">
                Không có dòng xe nào khớp với tất cả các tùy chọn lọc hiện tại của bạn.
              </p>
              <button 
                onClick={clearAllFilters}
                className="bg-[#002F6C] hover:bg-[#01095c] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

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
          <div className="relative bg-white w-full max-w-[420px] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300 rounded-l-3xl">
            {/* Header */}
            <div className="bg-[#002F6C] text-white p-5 flex items-center justify-between shrink-0 rounded-tl-3xl">
              <span className="text-[14px] font-bold font-antenna uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-300" />
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
                  className="w-full bg-red-55/60 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-full border border-red-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 animate-spin-reverse" />
                  Xóa tất cả bộ lọc
                </button>
              )}

              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Tìm kiếm xe</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên dòng xe..."
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-full py-3 pl-10 pr-8 focus:outline-none focus:border-[#066fef] text-black bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer border-0 bg-transparent p-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Dòng xe / Phân khúc</label>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat: any) => {
                    const isChecked = selectedCategories.includes(cat.slug);
                    const count = counts.categories[cat.slug as keyof typeof counts.categories] || 0;
                    return (
                      <label 
                        key={cat.slug} 
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/25 text-[#066fef]" 
                            : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.slug)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{cat.title}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
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
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Khoảng giá ước tính</label>
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
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isSelected 
                            ? "bg-[#066fef]/10 border-[#066fef]/25 text-[#066fef]" 
                            : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio"
                            name="mobilePriceRangeRadio"
                            checked={isSelected}
                            onChange={() => setPriceRange(range.slug)}
                            className="text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{range.label}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isSelected ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
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
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Số chỗ ngồi</label>
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
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/25 text-[#066fef]" 
                            : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSeats(seat.slug)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{seat.label}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
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
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Loại nhiên liệu</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Xăng", count: counts.fuels.gasoline },
                    { name: "Diesel", count: counts.fuels.diesel }
                  ].map((fuel) => {
                    const isChecked = selectedFuels.includes(fuel.name);
                    return (
                      <label 
                        key={fuel.name} 
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/25 text-[#066fef]" 
                            : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFuel(fuel.name)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>Máy {fuel.name}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isChecked ? "bg-[#066fef]/10 text-[#066fef]" : "bg-gray-100 text-gray-500"
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
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block font-antenna">Hộp số truyền động</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Số tự động", count: counts.transmissions.automatic },
                    { name: "Số sàn", count: counts.transmissions.manual }
                  ].map((trans) => {
                    const isChecked = selectedTransmissions.includes(trans.name);
                    return (
                      <label 
                        key={trans.name} 
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked 
                            ? "bg-[#066fef]/10 border-[#066fef]/25 text-[#066fef]" 
                            : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTransmission(trans.name)}
                            className="rounded border-gray-300 text-[#066fef] focus:ring-[#066fef] cursor-pointer w-4 h-4"
                          />
                          <span>{trans.name}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
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

            {/* Footer buttons */}
            <div className="p-4 border-t border-[#e5e5e5] flex gap-3 shrink-0 bg-gray-50 rounded-bl-3xl">
              <button 
                onClick={clearAllFilters}
                className="flex-1 text-center bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-3.5 rounded-full border border-gray-200 cursor-pointer shadow-sm"
              >
                Đặt lại
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 text-center bg-[#002F6C] hover:bg-[#066fef] text-white text-xs font-bold py-3.5 rounded-full cursor-pointer shadow-md border-0"
              >
                Xem {sortedVehicles.length} xe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
