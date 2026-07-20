"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, Trash2, ArrowRight } from "lucide-react";
import { type Vehicle } from "@/data/vehicles";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";
import { vehiclesAPI } from "@/lib/api";

interface ApiVehicleData {
  id: string | number;
  slug: string;
  title?: string;
  name?: string;
  image_url?: string;
  images?: string[];
  base_price?: string | number;
  basePrice?: number;
  type_name?: string;
  typeName?: string;
  type?: string;
}

export default function CompareDrawer() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  // Sync with localStorage
  const loadCompareList = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setSelectedIds(ids);
            // Open drawer if there are items
            setIsOpen(ids.length > 0);
            return;
          }
        } catch (e) {
          console.error("Error parsing compare storage:", e);
        }
      }
      setSelectedIds([]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await vehiclesAPI.getAll({ with_versions: true }).catch(() => null);
        const items = res?.data || res;
        if (Array.isArray(items) && items.length > 0) {
          const mapped: Vehicle[] = items.map((v: ApiVehicleData) => {
            const id = v.slug || String(v.id);
            const name = v.title || v.name || "";
            const image = (v as any).image_thumbnail_url || v.image_url || v.images?.[0] || "";
            const price = typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || v.basePrice || 0);
            return {
              id,
              name,
              type: (v.type === 'suv' || v.type === 'pickup' || v.type === 'commercial' ? v.type : 'suv') as "suv" | "pickup" | "commercial",
              typeName: v.type_name || v.typeName || (v.type === 'suv' ? 'SUV' : v.type === 'pickup' ? 'Bán tải' : 'Thương mại'),
              basePrice: price,
              tagline: (v as any).tagline || "",
              description: (v as any).description || "",
              images: [image],
              colors: (v as any).colors || [],
              versions: (v as any).versions || []
            } as any;
          });
          setAllVehicles(mapped);
        }
      } catch (err) {
        console.error("Error loading vehicles in CompareDrawer:", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    // Call asynchronously to avoid calling setState synchronously during render/effect mount phase
    const timer = setTimeout(() => {
      loadCompareList();
    }, 0);

    // Listen for global comparison updates
    const handleUpdate = () => {
      loadCompareList();
    };

    window.addEventListener("compare-updated", handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("compare-updated", handleUpdate);
    };
  }, []);

  const handleRemove = (id: string) => {
    const updated = selectedIds.filter((item) => item !== id);
    localStorage.setItem("compare-vehicles", JSON.stringify(updated));
    setSelectedIds(updated);
    
    // Trigger global update event
    window.dispatchEvent(new Event("compare-updated"));
  };

  const handleClearAll = () => {
    localStorage.removeItem("compare-vehicles");
    setSelectedIds([]);
    setIsOpen(false);
    window.dispatchEvent(new Event("compare-updated"));
  };

  if (selectedIds.length === 0) return null;

  // Resolve vehicles details
  const compareVehicles = selectedIds
    .map((id) => {
      return allVehicles.find((v) => v.id === id);
    })
    .filter((v): v is Vehicle => !!v);

  return (
    <div
      className={`fixed z-50 bg-[#00095B]/95 backdrop-blur-md border border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-in-out overflow-hidden bottom-4 left-4 right-4 sm:left-auto sm:right-24 sm:bottom-6 sm:w-80 ${
        isOpen ? "max-h-[520px]" : "max-h-12"
      }`}
    >
      {/* Header bar / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 flex items-center justify-between px-5 cursor-pointer border-b border-white/10 hover:bg-white/5 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide uppercase">
            So sánh xe ({compareVehicles.length}/3)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-white/70">
          <span>{isOpen ? "Thu nhỏ" : "Mở rộng"}</span>
          <div className="w-3 h-3 flex items-center justify-center">
            <span
              className={`block w-1.5 h-1.5 border-r border-b border-white transform transition-transform duration-300 ${
                isOpen ? "rotate-45 -translate-y-0.5" : "-rotate-135 translate-y-0.5"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Content body */}
      <div className="p-4 flex flex-col gap-4">
        {/* Vehicles list - Stacked Vertically */}
        <div className="flex flex-col gap-3 w-full">
          {compareVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3 relative transition-all duration-200 group"
            >
              {/* Image Preview */}
              <div className="relative w-16 h-10 flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
                <Image
                  src={
                    vehicle.images?.[0] && !vehicle.images[0].includes("uploads/vehicles/") && (vehicle.images[0].startsWith("http") || vehicle.images[0].startsWith("/"))
                      ? vehicle.images[0]
                      : getPopularVehicleImage(vehicle.id, vehicle.images?.[0] || "")
                  }
                  alt={vehicle.name}
                  fill
                  sizes="64px"
                  className="object-contain"
                  onError={handleImageError}
                />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold truncate uppercase text-white">
                  {vehicle.name}
                </h4>
                <p className="text-xs text-blue-400 font-medium whitespace-nowrap">
                  {formatPriceShort(vehicle.basePrice)}
                </p>
              </div>

              {/* Individual Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(vehicle.id);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-white/50 transition-all cursor-pointer absolute -top-1.5 -right-1.5 border-0"
                title="Xóa khỏi danh sách so sánh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Empty placeholders to reach 3 items */}
          {Array.from({ length: 3 - compareVehicles.length }).map((_, i) => {
            const availableVehicles = allVehicles.filter((v) => !selectedIds.includes(v.id));
            
            return (
              <div
                key={i}
                className="relative border border-dashed border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center h-[66px] text-xs text-white/40 font-medium transition-all hover:bg-white/5 group cursor-pointer"
              >
                {availableVehicles.length > 0 ? (
                  <>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const updated = [...selectedIds, val];
                          localStorage.setItem("compare-vehicles", JSON.stringify(updated));
                          setSelectedIds(updated);
                          window.dispatchEvent(new Event("compare-updated"));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value=""
                    >
                      <option value="" disabled>+ Chọn xe so sánh</option>
                      {availableVehicles.map((v) => (
                        <option key={v.id} value={v.id} className="text-black bg-white">
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <span className="group-hover:text-blue-400 transition-colors">+ Trống</span>
                  </>
                ) : (
                  <span>+ Trống</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button panel - Stacked Vertically */}
        <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
          <Link
            href={`/cong-cu/so-sanh-xe?ids=${selectedIds.join(",")}`}
            className="flex items-center justify-center gap-2 bg-[#0562D2] hover:bg-[#044ea7] hover:scale-102 active:scale-98 text-white font-bold uppercase text-xs tracking-wider py-2.5 rounded-xl transition-all shadow-md cursor-pointer border-0 w-full"
          >
            <span>So sánh ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white/60 hover:text-red-400 py-2.5 px-4 rounded-xl transition-colors cursor-pointer bg-transparent border border-solid border-white/20 hover:border-red-550/30 w-full"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      </div>
    </div>
  );
}
