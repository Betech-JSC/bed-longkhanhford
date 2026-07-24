"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Wrench, Flame, Sun, ChevronRight, CheckCircle2, Sliders } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { siteAssets } from "@/lib/site-assets";
import { accessoriesAPI } from "@/lib/api";
import { resolveImageUrl } from "@/components/blocks/Blocks";

const fallbackAccessories = [
  {
    id: "nap-thung-cuon-dien-option-4wd",
    title: "Nắp Thùng Cuộn Điện Option 4WD",
    code: "OP-ROLL-01",
    category_name: "Phụ Kiện Ngoại Thất",
    price: 19500000,
    image_url: "/images/categories/cat_exterior.png",
    brand: { title: "Option 4WD" }
  },
  {
    id: "man-hinh-android-bravigo-t-pro",
    title: "Màn Hình Android Bravigo T-Pro",
    code: "BR-TPRO-02",
    category_name: "Công Nghệ & Điện Tử",
    price: 14800000,
    image_url: "/images/categories/cat_tech.png",
    brand: { title: "Bravigo" }
  },
  {
    id: "phim-cach-nhiet-3m-crystalline",
    title: "Phim Cách Nhiệt 3M Crystalline",
    code: "3M-CRY-03",
    category_name: "Phụ Kiện Ngoại Thất",
    price: 16000000,
    image_url: "/images/categories/cat_exterior.png",
    brand: { title: "3M" }
  },
  {
    id: "den-bi-led-laser-domax-omega-laser",
    title: "Đèn Bi-LED Laser Domax Omega",
    code: "AO-DOM-04",
    category_name: "Công Nghệ & Điện Tử",
    price: 15500000,
    image_url: "/images/categories/cat_tech.png",
    brand: { title: "Domax" }
  }
];

export default function VehicleUpgradeLayout({ service }: { service?: any }) {
  const [featuredAccessories, setFeaturedAccessories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAccessories() {
      try {
        const response = await accessoriesAPI.getAll({ limit: 4 });
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          setFeaturedAccessories(response.data.slice(0, 4));
        } else {
          setFeaturedAccessories(fallbackAccessories);
        }
      } catch (err) {
        console.error("Failed to load featured accessories for upgrade layout:", err);
        setFeaturedAccessories(fallbackAccessories);
      } finally {
        setIsLoading(false);
      }
    }
    loadAccessories();
  }, []);

  const formatPrice = (price: any) => {
    const num = Number(price);
    if (!num || isNaN(num)) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  const handleImageError = (e: any) => {
    e.target.src = "/assets/img-gradient-1.png";
  };

  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Nâng Cấp Phụ Kiện & Đồ Chơi Xe Ford Chính Hãng"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.upgrade} />

      {/* Safety Guarantees */}
      <section className="w-full bg-[#002F6C] text-white py-8 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">100%</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Jack Cắm Zắc Zin Nguyên Bản</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">0%</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Không Cắt Trích Dây Điện Xe</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">24 Tháng</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Bảo Hành 1 Đổi 1 Phụ Kiện</div>
            </div>
            <div className="p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">Chuẩn 3S</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Kỹ Thuật Viên Lắp Đặt Chuẩn Hãng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade Categories replaced with Featured Showcase Accessories */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Đẳng Cấp & Cá Tính</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            DANH MỤC NÂNG CẤP XE FORD CHUYÊN NGHIỆP
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 p-4 rounded-none space-y-4 animate-pulse">
                <div className="aspect-square bg-neutral-100 w-full rounded-none" />
                <div className="h-4 bg-neutral-100 w-1/3 rounded-none" />
                <div className="h-5 bg-neutral-100 w-3/4 rounded-none" />
                <div className="h-4 bg-neutral-100 w-1/2 rounded-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAccessories.map((item) => {
              const id = item.slug || String(item.id);
              const title = item.title || item.name || "";
              const code = item.code || "";
              const brandName = item.brand?.title || "";
              const catName = item.category_name || item.categories?.[0]?.title || "Phụ kiện cao cấp";
              
              // Get first image url safely
              const firstImgUrl = item.images?.[0]?.url || item.image?.url || item.image_url || "/assets/img-gradient-1.png";
              const resolvedImg = resolveImageUrl(firstImgUrl);

              return (
                <Link
                  key={id}
                  href={`/phu-kien/${id}`}
                  className="group bg-white flex flex-col h-full border border-gray-200 hover:border-[#066fef] hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Image Box */}
                  <div className="aspect-square relative bg-gray-50 overflow-hidden w-full">
                    <img
                      src={resolvedImg}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>

                  {/* Card Content details */}
                  <div className="p-5 flex flex-col flex-1 justify-between text-left gap-4">
                    <div className="space-y-2">
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {brandName && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#066fef] bg-[#066fef]/8 px-2 py-0.5 rounded-sm">
                            {brandName}
                          </span>
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-550 bg-gray-100 px-2 py-0.5 rounded-sm">
                          {catName}
                        </span>
                      </div>

                      {/* Title & Code */}
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#066fef] transition-colors leading-snug line-clamp-2 uppercase">
                        {title}
                      </h4>
                      
                      {code && (
                        <p className="text-[10px] text-gray-400 font-medium font-mono">
                          Mã: {code}
                        </p>
                      )}
                    </div>

                    {/* Price & Action button */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
                      <span className="font-extrabold text-sm text-[#066fef]">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-400 group-hover:text-[#066fef] uppercase tracking-wider inline-flex items-center gap-0.5 transition-colors">
                        Chi tiết <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View all button below the grid */}
        <div className="w-full flex justify-center mt-12">
          <Link
            href="/phu-kien"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#066fef] hover:text-[#002f6c] border border-[#066fef]/30 hover:border-[#066fef] px-6 py-3 transition-all uppercase tracking-wider"
          >
            <span>Xem tất cả phụ kiện xe</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
