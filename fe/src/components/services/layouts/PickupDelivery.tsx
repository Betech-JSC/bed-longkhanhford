"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MapPin, PhoneCall, Car, CheckCircle2, ChevronRight, Sparkles, Navigation } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import CountUpNumber from "@/components/common/CountUpNumber";
import { siteAssets } from "@/lib/site-assets";

type StepItem = {
  title: string;
  icon: string;
  bullets: string[];
  note?: string;
};

const steps: StepItem[] = [
  {
    title: "1. Liên Hệ Đặt Hẹn",
    icon: "/assets/icon-contact.svg",
    bullets: [
      "Khách hàng liên hệ hotline 1900 888 992 hoặc đăng ký hẹn trực tuyến.",
      "Cố vấn dịch vụ xác nhận địa điểm và khung giờ lấy xe tận nhà mong muốn.",
      "Thông báo danh tính & hình ảnh tài xế phụ trách nhận xe."
    ]
  },
  {
    title: "2. Tiếp Nhận & Khử Khuẩn Tận Nơi",
    icon: "/assets/icon-booking.svg",
    bullets: [
      "Tài xế mặc phục trang chuẩn Ford đến tận nơi tiếp nhận chìa khóa.",
      "Chụp ảnh 360 độ kiểm kê tài sản & khử khuẩn tay nắm cửa, vô lăng.",
      "Bàn giao biên bản tiếp nhận điện tử trực tiếp qua SMS/Zalo."
    ]
  },
  {
    title: "3. Di Chuyển An Toàn Về Xưởng 3S",
    icon: "/assets/icon-delivery.svg",
    bullets: [
      "Tài xế di chuyển xe tuân thủ 100% luật giao thông và giới hạn tốc độ.",
      "Bảo hiểm trách nhiệm phương tiện được kích hoạt trong toàn bộ hành trình.",
      "Hệ thống định vị GPS cập nhật trạng thái di chuyển theo thời gian thực."
    ]
  },
  {
    title: "4. Tiến Hành Bảo Dưỡng & Vệ Sinh",
    icon: "/assets/icon-service.svg",
    bullets: [
      "Kỹ thuật viên thực hiện các hạng mục bảo dưỡng theo đúng yêu cầu.",
      "Cố vấn gửi video/hình ảnh chẩn đoán trực tiếp cho khách hàng phê duyệt.",
      "Rửa xe hút bụi và vệ sinh khoang lái chu đáo sau khi hoàn tất."
    ]
  },
  {
    title: "5. Giao Xe Tận Nhà & Thanh Toán QR",
    icon: "/assets/icon-handover.svg",
    bullets: [
      "Tài xế đưa xe về đúng địa điểm ban đầu theo đúng khung giờ hẹn.",
      "Khách hàng kiểm tra nghiệm thu tình trạng xe thực tế.",
      "Hỗ trợ thanh toán không dùng tiền mặt qua mã QR / Chuyển khoản an toàn."
    ]
  }
];

const coverageAreas = [
  { region: "TP. Long Khánh", desc: "Tất cả các phường Xuân An, Xuân Bình, Xuân Hòa, Phú Bình, Bảo Vinh..." },
  { region: "Huyện Xuân Lộc", desc: "Gia Ray, Suối Cát, Xuân Hiệp, Xuân Tâm, Bảo Hòa..." },
  { region: "Huyện Cẩm Mỹ", desc: "Long Giao, Nhân Nghĩa, Sông Ray, Bảo Bình..." },
  { region: "Huyện Thống Nhất", desc: "Dầu Giây, Gia Kiệm, Quang Trung, Hưng Lộc..." },
  { region: "Huyện Định Quán", desc: "Định Quán, Phú Cường, Túc Trưng, La Ngà..." },
  { region: "Khu vực lân cận", desc: "Hỗ trợ giao nhận linh hoạt theo yêu cầu riêng của Quý khách." }
];

export default function PickupDeliveryLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Concierge VIP Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Nhận & Giao Xe Tận Nơi Đẳng Cấp Concierge"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.delivery} />

      {/* Pickup & Delivery Metrics Banner */}
      <section className="w-full bg-[#002F6C] text-white py-8 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { target: 0, suffix: " đ", label: "Phí Giao Nhận Nội Thành" },
              { target: 100, suffix: "%", label: "Bảo Hiểm Trách Nhiệm" },
              { target: 15, suffix: " Phút", label: "Phản Hồi Xác Nhận" },
              { target: 360, suffix: "°", label: "Kiểm Kê Xe Điện Tử" },
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

      {/* 3-Layer Security Guarantees Banner */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pt-16 pb-12 font-antenna">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs">
            <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Bảo Hiểm Trách Nhiệm 100%</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Toàn bộ quá trình di chuyển của xe được bảo vệ bởi gói bảo hiểm trách nhiệm phương tiện trong suốt hành trình.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs">
            <div className="w-12 h-12 bg-[#066fef] text-white flex items-center justify-center rounded-[4px] mb-5">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Kiểm Kê 360° Minh Bạch</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Tài xế tiến hành chụp ảnh xác nhận tình trạng xe và số ODO ngay lúc bàn giao biên bản điện tử cho khách hàng.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs">
            <div className="w-12 h-12 bg-[#00095B] text-white flex items-center justify-center rounded-[4px] mb-5">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Khử Khuẩn & Sạch Sẽ</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Xe được vệ sinh khử khuẩn khu vực khoang lái và rửa sạch ngoại thất trước khi trả lại tận tay gia chủ.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Process Timeline Cards */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-12 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Quy Trình 5 Bước An Toàn</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            CÁCH THỨC DỊCH VỤ NHẬN VÀ GIAO XE TẬN NƠI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-200 p-6 rounded-none shadow-xs flex flex-col justify-between hover:border-[#066fef] transition-all"
            >
              <div>
                <div className="w-10 h-10 bg-[#066fef]/10 text-[#066fef] rounded-[4px] flex items-center justify-center font-bold text-sm mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-3 uppercase tracking-wide">
                  {step.title}
                </h3>
                <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
                  {step.bullets.map((b, bidx) => (
                    <li key={bidx} className="flex items-start gap-1.5">
                      <span className="text-[#066fef] mt-1 shrink-0 size-1 bg-[#066fef] rounded-full" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Coverage Area Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 border-b border-gray-150 pb-6">
            <div>
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Phạm Vi Phục Vụ Rộng Khắp</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                KHU VỰC HỖ TRỢ GIAO NHẬN TẠI ĐỒNG NAI
              </h2>
            </div>
            <Link
              href="/lien-he"
              className="bg-[#002F6C] hover:bg-[#066fef] text-white text-xs font-bold uppercase px-6 py-3 rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>Kiểm Tra Địa Chỉ Của Bạn</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverageAreas.map((area, idx) => (
              <div key={idx} className="bg-[#F8F8F8] border border-gray-150 p-6 rounded-none flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#066fef] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-base text-gray-900 mb-1 uppercase">{area.region}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{area.desc}</p>
                </div>
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
