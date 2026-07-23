"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Wrench, Flame, Sun, ChevronRight, CheckCircle2, Sliders } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const upgradeCategories = [
  {
    icon: Flame,
    title: "Độ Nắp Thùng & Off-road Ranger/Raptor",
    desc: "Nắp thùng cuộn điện Option 4wd, cản trước/sau thép Hamer, tời kéo & phuộc nâng gầm cao cấp chuẩn xe bán tải chuyên nghiệp.",
    tag: "Đặc quyền Pickup"
  },
  {
    icon: Sparkles,
    title: "Nâng Cấp Tiện Nghi & Công Nghệ Cabin",
    desc: "Màn hình Android cắm giắc Zắc 100%, Camera 360 độ quan sát toàn cảnh, cảm biến áp suất lốp & gập gương tự động.",
    tag: "Công nghệ hiện đại"
  },
  {
    icon: Sun,
    title: "Phim Cách Nhiệt 3M & Cách Âm Chống Ồn",
    desc: "Dán phim cách nhiệt 3M Crystalline chính hãng chống nóng 99%, kết hợp dán vật liệu dập nốt cách âm chống ồn hốc lốp.",
    tag: "Thư giãn êm ái"
  },
  {
    icon: Sliders,
    title: "Nâng Cấp Ánh Sáng Đèn Bi-LED Laser",
    desc: "Độ đèn Bi-LED Laser tăng sáng gấp 5 lần đèn zin nguyên bản, cắt nốt chuẩn không gây chói mắt người đối diện.",
    tag: "An toàn ban đêm"
  }
];

export default function VehicleUpgradeLayout({ service }: { service?: any }) {
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

      {/* Upgrade Categories */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Đẳng Cấp & Cá Tính</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            DANH MỤC NÂNG CẤP XE FORD CHUYÊN NGHIỆP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upgradeCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white border border-gray-200 p-6 rounded-none shadow-xs hover:border-[#066fef] transition-all flex flex-col justify-between group">
                <div>
                  <span className="bg-[#066fef]/10 text-[#066fef] text-[11px] font-bold px-3 py-1 rounded-[4px] inline-block mb-4 uppercase tracking-wider">
                    {cat.tag}
                  </span>
                  <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2 uppercase group-hover:text-[#066fef] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                </div>
                <Link
                  href="/lien-he?reason=Tư vấn nâng cấp phụ kiện"
                  className="text-[#066fef] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:gap-2 transition-all border-t border-gray-100 pt-4"
                >
                  <span>Báo giá phụ kiện</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
