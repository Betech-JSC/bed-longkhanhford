"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, PhoneCall, ShieldCheck, HeartHandshake, Award, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

// Detailing & Car Care Packages
const detailingPackages = [
  {
    title: "Phủ Ceramic Bảo Vệ Sơn",
    desc: "Công nghệ phủ bóng gương Nano Ceramic nhập khẩu giúp bảo vệ lớp sơn zin chống trầy xước nhẹ & chống tia UV.",
    badge: "Bảo vệ 3-5 năm"
  },
  {
    title: "Dán Phim Cách Nhiệt 3M Chính Hãng",
    desc: "Cản 99% tia hồng ngoại & UV, giữ cabin luôn mát mẻ và nâng cao tính riêng tư đẳng cấp.",
    badge: "Bảo hành 10 năm"
  },
  {
    title: "Vệ Sinh Nội Thất & Diệt Khuẩn Ozone",
    desc: "Làm sạch sâu ghế da, trần nỉ, thảm sàn và diệt 99.9% vi khuẩn bằng máy tạo khí Ozone chuyên dụng.",
    badge: "Chăm sóc toàn diện"
  },
  {
    title: "Phủ Gầm Chống Rỉ & Giảm Ồn",
    desc: "Sử dụng dung dịch cao su non nhập khẩu Đức bảo vệ gầm xe khỏi đá văng & mặn kiềm vùng bãi biển.",
    badge: "Chống rỉ sét"
  }
];

export default function CustomerCareLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Chăm Sóc Khách Hàng & Cứu Hộ 24/7"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.customerCare} />

      {/* Emergency Roadside Assistance Callout Banner */}
      <section className="w-full bg-[#00095B] text-white py-10 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="bg-[#002F6C] border border-white/10 p-8 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#066fef] text-white rounded-[4px] flex items-center justify-center shrink-0 shadow-md">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#066fef] uppercase tracking-widest block mb-1">Hỗ Trợ Sự Cố Đường Bộ 24/7</span>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">ĐỘI CỨU HỘ GIAO THÔNG LONG KHÁNH FORD</h3>
                <p className="text-xs md:text-sm text-white/80 mt-1">Cứu hộ xe chết máy, kích bình ắc quy, kéo xe gặp sự cố về xưởng 3S an toàn.</p>
              </div>
            </div>
            <a
              href="tel:0879276699"
              className="bg-[#066fef] hover:bg-white hover:text-[#00095B] text-white text-xs font-bold uppercase px-8 py-4 rounded-[4px] transition-colors shrink-0 tracking-wider shadow-lg"
            >
              Gọi Cứu Hộ: 0879 276 699
            </a>
          </div>
        </div>
      </section>

      {/* Quality Care Global Standard Showcase */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Quy Trình Chuẩn Quốc Tế</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
                TIÊU CHUẨN DỊCH VỤ FORD QUALITY CARE TOÀN CẦU
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Quy trình dịch vụ tiêu chuẩn Ford Quality Care được áp dụng nghiêm ngặt tại xưởng 3S Long Khánh Ford. Hàng năm, các chuyên gia Ford Châu Á Thái Bình Dương tiến hành khảo sát và đánh giá nhằm đảm bảo mức độ hài lòng cao nhất từ phía khách hàng.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-[#F8F8F8] p-4 border border-gray-150">
                  <Award className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 uppercase">Top 1 Chất Lượng CVP</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Xếp hạng cao về chỉ số hài lòng khách hàng.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#F8F8F8] p-4 border border-gray-150">
                  <HeartHandshake className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 uppercase">Cam Kết Đồng Hành</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Lắng nghe và giải quyết mọi phản hồi nhanh nhất.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[380px] h-[380px] max-w-full">
                <Image
                  src={siteAssets.qualityCareBadge}
                  alt="Ford Quality Care Badge"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto Detailing & Car Care Packages */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-12 font-antenna">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Chăm Sóc & Làm Đẹp Xe</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              GÓI DỊCH VỤ AUTO DETAILING CAO CẤP
            </h2>
            <p className="text-gray-600 text-sm mt-3">
              Giữ cho xế cưng của bạn luôn sạch sẽ, sang trọng và giữ giá trị lâu dài theo thời gian.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {detailingPackages.map((pkg, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100}>
              <div className="bg-white border border-gray-200 p-6 rounded-none shadow-xs flex flex-col justify-between hover:border-[#066fef] transition-all group h-full">
                <div>
                  <span className="bg-[#066fef]/10 text-[#066fef] text-[11px] font-bold px-3 py-1 rounded-[4px] inline-block mb-4 uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                  <h3 className="font-bold text-base text-gray-900 mb-2 uppercase group-hover:text-[#066fef] transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {pkg.desc}
                  </p>
                </div>
                <Link
                  href="/lien-he"
                  className="text-[#066fef] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:gap-2 transition-all border-t border-gray-100 pt-4"
                >
                  <span>Tư vấn chi tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* PDF Checklist Download Callout Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-10 rounded-none shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#002F6C] text-white rounded-[4px] flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 uppercase">PHIẾU KIỂM TRA TÌNH TRẠNG XE CHÍNH THỨC</h3>
              <p className="text-xs text-gray-600 mt-1">Tải về bản mẫu phiếu kiểm tra 83 điểm tiêu chuẩn của kỹ thuật viên Ford.</p>
            </div>
          </div>
          <a
            href="/assets/express-maintenance-flow.png"
            download
            className="bg-[#066fef] hover:bg-[#00095B] text-white text-xs font-bold uppercase px-6 py-3.5 rounded-[4px] transition-colors inline-flex items-center gap-2 shrink-0 tracking-wider shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Tải Mẫu Phiếu PDF</span>
          </a>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
