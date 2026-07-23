"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Phone, ShieldAlert, Truck, BatteryCharging, Wrench, Fuel, MapPin, ChevronRight, Zap } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const rescueServices = [
  {
    icon: Truck,
    title: "Cứu Hộ Kéo Xe Sàn Trượt",
    desc: "Hệ thống xe cứu hộ chuyên dụng sàn trượt hiện đại, bảo vệ tuyệt đối gầm xe, cản trước/sau và hệ dẫn động 4WD/AWD của xe Ford."
  },
  {
    icon: BatteryCharging,
    title: "Kích Bình & Thay Ắc Quy Tận Nơi",
    desc: "Đội mô tô ứng cứu nhanh trang bị bộ kích bình điện tử áp lực cao, thay thế ắc quy Ford Motorcraft chính hãng tận nơi."
  },
  {
    icon: Wrench,
    title: "Thay Lốp Dự Phòng & Vá Cơ Động",
    desc: "Xử lý nhanh chóng các sự cố nổ lốp, cán đinh trên đường cao tốc hoặc đường trường với thiết bị tháo siết ốc chuyên dụng."
  },
  {
    icon: Fuel,
    title: "Mở Khóa Cabin & Tiếp Nhiên Liệu",
    desc: "Hỗ trợ kỹ thuật mở cửa xe an toàn không gây trầy xước khi quên chìa khóa bên trong hoặc tiếp nhiên liệu khẩn cấp."
  }
];

const highways = [
  "Cao tốc TP.HCM — Long Thành — Dầu Giây",
  "Cao tốc Dầu Giây — Phan Thiết",
  "Tuyến Quốc lộ 1A qua địa phận Đồng Nai",
  "Tuyến Quốc lộ 20 hướng đi Lâm Đồng",
  "Toàn bộ khu vực TP. Long Khánh & các huyện lân cận"
];

export default function RoadsideAssistanceLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Brand Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Cứu Hộ Giao Thông & Ứng Cứu Khẩn Cấp 24/7"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.roadside} />

      {/* Direct Call Banner - Refined Theme */}
      <section className="w-full bg-white py-8 border-b border-gray-200 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="bg-[#002F6C] text-white p-6 lg:p-8 rounded-none shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-[#066fef]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/10 text-white rounded-[4px] flex items-center justify-center shrink-0 border border-white/20">
                <PhoneCall className="w-6 h-6 text-[#38bdf8] animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-widest block mb-1">
                  Ứng Cứu Khẩn Cấp 24/7
                </span>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                  XE GẶP SỰ CỐ TRÊN ĐƯỜNG?
                </h3>
                <p className="text-xs md:text-sm text-gray-300 mt-1">
                  Bấm nút gọi ngay để kết nối trực tiếp tới Tổng đài trưởng Cứu hộ Long Khánh Ford.
                </p>
              </div>
            </div>
            <a
              href="tel:0879276699"
              className="bg-[#066fef] hover:bg-white hover:text-[#002F6C] text-white text-xs font-bold uppercase px-7 py-3.5 rounded-[4px] transition-all duration-300 shrink-0 tracking-wider shadow-sm flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline Cứu Hộ: 0879 276 699</span>
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Rescue Categories */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Hỗ Trợ Toàn Diện</span>
            <h2 className="text-3xl font-bold text-[#002F6C] uppercase tracking-tight">4 Dịch Vụ Cứu Hộ Giao Thông Trọng Tâm</h2>
            <div className="w-16 h-1 bg-[#066fef] mx-auto mt-4"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rescueServices.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100}>
              <div className="bg-white p-6 border border-gray-200 hover:border-[#066fef] transition-all duration-300 shadow-sm hover:shadow-xl group h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] mb-5 group-hover:bg-[#066fef] transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#002F6C] mb-2 group-hover:text-[#066fef] transition-colors">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">{item.desc}</p>
                </div>
                <a
                  href="tel:0879276699"
                  className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#066fef] font-bold"
                >
                  <span>Ứng Cứu Nhanh</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Coverage Highways Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 border-b border-gray-150 pb-6">
            <div>
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Tuyến Đường Phục Vụ Trọng Điểm</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                ĐỘI CỨU HỘ THƯỜNG TRỰC TRÊN CÁC TUYẾN CAO TỐC
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highways.map((hw, idx) => (
              <div key={idx} className="bg-[#F8F8F8] border border-gray-150 p-4 rounded-none flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#066fef] shrink-0" />
                <span className="font-bold text-sm text-gray-800">{hw}</span>
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
