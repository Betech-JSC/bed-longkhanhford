"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Clock, Users, Coffee, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Wrench, Cpu } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import CountUpNumber from "@/components/common/CountUpNumber";
import { siteAssets } from "@/lib/site-assets";

// Gold Hour Slots
const availableSlots = [
  { time: "08:00 - 09:00", label: "Buổi sáng - Khung giờ vàng", status: "Còn chỗ" },
  { time: "10:00 - 11:00", label: "Buổi sáng - Khung giờ vàng", status: "Nhanh chóng" },
  { time: "14:00 - 15:00", label: "Buổi chiều - Khung giờ vàng", status: "Còn chỗ" },
  { time: "16:00 - 17:00", label: "Buổi chiều - Cuối ngày", status: "Ưu tiên" }
];

export default function ExpressMaintenanceLayout({ service }: { service?: any }) {
  const [selectedSlot, setSelectedSlot] = useState(0);

  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Bảo Dưỡng Nhanh 60 Phút Tier-1"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.express} />

      {/* Speed Metrics Banner */}
      <section className="w-full bg-[#002F6C] text-white py-8 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { target: 60, suffix: " Phút", label: "Tổng Thời Gian Làm Việc" },
              { target: 2, suffix: " KTV", label: "Thi Công Đồng Thời" },
              { target: 0, suffix: " Phút", label: "Chờ Đợi Khi Đặt Hẹn Trước" },
              { target: 100, suffix: "%", label: "Đầy Đủ Hạng Mục Bảo Dưỡng" },
            ].map((metric, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 100}>
                <div className="p-2 border-r border-white/10 last:border-0">
                  <div className="text-3xl md:text-4xl font-bold text-[#38bdf8] mb-1">
                    <CountUpNumber target={metric.target} suffix={metric.suffix} />
                  </div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-medium">{metric.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dual-Technician Parallel Workflow Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Bí Quyết Tiết Kiệm 50% Thời Gian</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            MÔ HÌNH BẢO DƯỠNG KÉP
          </h2>
          <p className="text-gray-600 text-sm mt-3">
            Hai kỹ thuật viên chứng chỉ Ford phối hợp nhịp nhàng theo quy trình phân công chuẩn hóa quốc tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Technician 1 Card */}
          <div className="bg-white border border-gray-200 p-8 rounded-none shadow-xs hover:border-[#066fef] transition-all">
            <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-150">
              <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] shrink-0 shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 uppercase">Kỹ Thuật Viên Khung Gầm &amp; Động Cơ</h3>
                  <span className="bg-[#002F6C]/10 text-[#002F6C] text-[11px] font-extrabold px-2.5 py-0.5 rounded-[4px] uppercase tracking-wider shrink-0">
                    KTV 01
                  </span>
                </div>
                <span className="text-xs text-[#066fef] font-semibold">Phụ trách khoang máy &amp; gầm xe</span>
              </div>
            </div>
            <ul className="space-y-3.5 text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Xả dầu động cơ &amp; thay lọc dầu chính hãng mới</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Kiểm tra rô-tuyn, thước lái, đệm cao su chân máy</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Bổ sung nước làm mát, dầu phanh, nước rửa kính</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Vệ sinh khoang động cơ bằng khí nén áp lực</span>
              </li>
            </ul>
          </div>

          {/* Technician 2 Card */}
          <div className="bg-white border border-gray-200 p-8 rounded-none shadow-xs hover:border-[#066fef] transition-all">
            <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-150">
              <div className="w-12 h-12 bg-[#066fef] text-white flex items-center justify-center rounded-[4px] shrink-0 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 uppercase">Kỹ Thuật Viên Phanh &amp; Điện Tử</h3>
                  <span className="bg-[#066fef]/10 text-[#066fef] text-[11px] font-extrabold px-2.5 py-0.5 rounded-[4px] uppercase tracking-wider shrink-0">
                    KTV 02
                  </span>
                </div>
                <span className="text-xs text-[#066fef] font-semibold">Phụ trách hệ thống phanh, lốp &amp; chẩn đoán</span>
              </div>
            </div>
            <ul className="space-y-3.5 text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Tháo kiểm tra, bảo dưỡng cúp-lê phanh 4 bánh</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Đo độ dầy má phanh, đĩa phanh và áp suất lốp</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Đọc quét toàn bộ mã lỗi bằng thiết bị Ford IDS</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                <span>Thay lọc gió điều hòa & kiểm tra hệ thống đèn</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flow Visual Banner */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-8 font-antenna">
        <div className="relative w-full aspect-[1440/480] rounded-none overflow-hidden border border-gray-200 shadow-xs">
          <Image
            src={siteAssets.expressFlow}
            alt="Sơ đồ quy trình bảo dưỡng nhanh 60 phút Long Khánh Ford"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* 5-Star VIP Lounge Experience Grid */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Trải Nghiệm Đẳng Cấp</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              PHÒNG CHỜ VIP 5 SAO TRONG KHI THƯ GIÃN
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Trong 60 phút ngắn ngủi, Quý khách thoải mái làm việc hoặc thư giãn tại không gian sang trọng của Long Khánh Ford.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#F8F8F8] p-6 border border-gray-150 rounded-none text-center">
              <Coffee className="w-8 h-8 text-[#066fef] mx-auto mb-3" />
              <h4 className="font-bold text-base text-gray-900 mb-1 uppercase">Cà Phê Ý & Đồ Uống Miễn Phí</h4>
              <p className="text-xs text-gray-500">Phục vụ menu đồ uống đa dạng từ Barista chuyên nghiệp.</p>
            </div>
            <div className="bg-[#F8F8F8] p-6 border border-gray-150 rounded-none text-center">
              <Sparkles className="w-8 h-8 text-[#066fef] mx-auto mb-3" />
              <h4 className="font-bold text-base text-gray-900 mb-1 uppercase">Ghế Massage Thư Giãn</h4>
              <p className="text-xs text-gray-500">Thả lỏng cơ thể với hệ thống ghế massage cao cấp.</p>
            </div>
            <div className="bg-[#F8F8F8] p-6 border border-gray-150 rounded-none text-center">
              <Clock className="w-8 h-8 text-[#066fef] mx-auto mb-3" />
              <h4 className="font-bold text-base text-gray-900 mb-1 uppercase">WiFi Tốc Độ Cao & Workstation</h4>
              <p className="text-xs text-gray-500">Góc làm việc riêng tư, đầy đủ ổ cắm điện & kết nối ổn định.</p>
            </div>
            <div className="bg-[#F8F8F8] p-6 border border-gray-150 rounded-none text-center">
              <Users className="w-8 h-8 text-[#066fef] mx-auto mb-3" />
              <h4 className="font-bold text-base text-gray-900 mb-1 uppercase">Vách Kính Quan Sát Trực Tiếp</h4>
              <p className="text-xs text-gray-500">Theo dõi trực tiếp xưởng dịch vụ làm việc trên xe của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Hour Slot Picker Selector */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="bg-[#00095B] text-white p-8 lg:p-12 border border-neutral-800 rounded-none shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Đặt Hẹn Giờ Vàng</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-3">
              CHỌN KHUNG GIỜ ƯU TIÊN BẢO DƯỠNG NHANH
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Đặt hẹn trước giúp chúng tôi chuẩn bị sẵn sàng cầu nâng, phụ tùng và 2 kỹ thuật viên chuyên trách ngay khi bạn tới xưởng.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
            {availableSlots.map((slot, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSlot(idx)}
                className={`p-4 border rounded-[4px] cursor-pointer transition-all flex items-center justify-between gap-6 ${
                  selectedSlot === idx
                    ? "bg-[#066fef] border-[#066fef] text-white font-bold"
                    : "bg-white/5 border-white/20 text-white/90 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{slot.time}</div>
                  <div className="text-xs text-white/70">{slot.label}</div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-[4px] uppercase tracking-wider font-semibold">
                  {slot.status}
                </span>
              </div>
            ))}
            <Link
              href="/lien-he"
              className="mt-2 bg-white text-[#00095B] hover:bg-gray-100 font-bold text-center px-6 py-3.5 rounded-[4px] text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Xác Nhận Đặt Khung Giờ Này</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
