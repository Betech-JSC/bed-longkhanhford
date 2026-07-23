"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench, ShieldCheck, Cpu, Flame, CheckCircle2, ChevronRight, Award, CarFront } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const repairPillars = [
  {
    icon: Cpu,
    title: "Sửa Chữa Máy - Gầm - Điện",
    desc: "Chẩn đoán chính xác tuyệt đối bằng máy vi tính Ford IDS. Xử lý triệt để các lỗi động cơ, hộp số tự động, thước lái điện & hệ thống treo cao cấp.",
    highlights: ["Máy chẩn đoán chuyên dụng Ford IDS/FDRS", "Kỹ thuật viên chứng chỉ Master Ford", "Phụ tùng chính hãng bảo hành 12 tháng"]
  },
  {
    icon: Flame,
    title: "Đồng Sơn & Phục Hồi Thân Vỏ",
    desc: "Xưởng đồng sơn quy mô lớn trang bị phòng sơn sấy gốc nước hiện đại. Khôi phục 99.9% màu sơn nguyên bản nhà máy mà không để lại vết mờ.",
    highlights: ["Pha màu vi tính chính xác 100%", "Phòng sơn hấp sấy Ý cao cấp", "Bảo hành lớp sơn bóng 24 tháng"]
  }
];

const insurancePartners = [
  { name: "Bảo Việt Insurance", badge: "Bồi thường trực tiếp" },
  { name: "PVI Insurance", badge: "Giám định tại xưởng" },
  { name: "PJICO Insurance", badge: "Bảo lãnh nhanh 24h" },
  { name: "MIC Insurance", badge: "Miễn trừ thủ tục" },
  { name: "PTI Insurance", badge: "Hotline 24/7" },
  { name: "Liberty Insurance", badge: "Sửa chữa chính hãng" }
];

export default function GeneralRepairLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Sửa Chữa Máy Gầm & Đồng Sơn Chuẩn Ford 3S"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.repair} />

      {/* Intro Metrics */}
      <section className="w-full bg-[#002F6C] text-white py-8 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">30+</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Khoang Sửa Chữa Hiện Đại</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">2 Phòng</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Phòng Sơn Hấp Tiêu Chuẩn Ý</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">100%</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Phụ Tùng Ford Nhập Khẩu</div>
            </div>
            <div className="p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">12 Tháng</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Bảo Hành Sửa Chữa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Repair Pillars */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Chuyên Môn Cao Cấp</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            HAI TRỤ CỘT DỊCH VỤ SỬA CHỮA TẠI LONG KHÁNH FORD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {repairPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white border border-gray-200 p-8 lg:p-10 rounded-none shadow-xs hover:border-[#066fef] transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-[4px] mb-6 group-hover:bg-[#066fef] group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase group-hover:text-[#066fef] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-700 border-t border-gray-150 pt-5">
                    {pillar.highlights.map((item, hidx) => (
                      <li key={hidx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#066fef] shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/lien-he?reason=Yêu cầu sửa chữa xe"
                  className="mt-8 bg-[#002F6C] hover:bg-[#066fef] text-white text-xs font-bold uppercase px-6 py-3.5 rounded-[4px] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Tư Vấn & Báo Giá Sửa Chữa</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Insurance Direct Billing Banner */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-12 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 border-b border-gray-150 pb-6">
            <div>
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Liên Kết Bảo Hiểm Vật Tư</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                DỊCH VỤ SỬA CHỮA BẢO HIỂM BẢO LÃNH TRỰC TIẾP
              </h2>
              <p className="text-xs text-gray-500 mt-1">Giám định xe và bảo lãnh chi phí trực tiếp tại xưởng Long Khánh Ford, không cần làm thủ tục rườm rà.</p>
            </div>
            <Link
              href="/lien-he?reason=Tư vấn bảo hiểm vật chất"
              className="bg-[#066fef] hover:bg-[#00095B] text-white text-xs font-bold uppercase px-6 py-3 rounded-[4px] transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <span>Hỗ Trợ Thủ Tục Bảo Hiểm</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {insurancePartners.map((partner, idx) => (
              <div key={idx} className="bg-[#F8F8F8] border border-gray-200 p-4 rounded-none text-center flex flex-col items-center justify-center gap-1.5 hover:border-[#066fef] transition-all">
                <ShieldCheck className="w-6 h-6 text-[#066fef]" />
                <span className="font-bold text-xs text-gray-900 uppercase">{partner.name}</span>
                <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-[2px] border border-gray-200">{partner.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
