"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, ChevronRight, HelpCircle, HardHat } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Phụ tùng chính hãng mới",
    desc: "Thay thế phụ tùng mới chính hãng 100% không tính khấu hao theo thời gian sử dụng, giúp khôi phục chiếc xe về trạng thái an toàn nhất."
  },
  {
    icon: Award,
    title: "Sửa chữa tại Đại lý Ủy quyền toàn quốc",
    desc: "Được hỗ trợ sửa chữa chuyên nghiệp tại bất kỳ đại lý ủy quyền nào của Ford Việt Nam trên toàn quốc bởi các kỹ thuật viên lành nghề."
  },
  {
    icon: HeartHandshake,
    title: "Bảo vệ ngập nước (Thủy kích)",
    desc: "Quyền lợi bảo hiểm bao quát thiệt hại động cơ do thủy kích ngập nước, giúp bạn an tâm vận hành trong những mùa mưa bão lớn."
  },
  {
    icon: HardHat,
    title: "Cứu hộ giao thông khẩn cấp 24/7",
    desc: "Miễn phí cước cứu hộ giao thông 24/7 cẩu kéo xe gặp sự cố về đại lý sửa chữa gần nhất trong bán kính quy định."
  }
];

export default function FordEnsureLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner 
        title={service?.title || "Chương Trình Bảo Hiểm & Bảo Hành Mở Rộng Ford Ensure"} 
        backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.customerCare} 
      />

      {/* Intro Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">An Tâm Tuyệt Đối</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
                FORD ENSURE - AN TÂM TRÊN MỌI HÀNH TRÌNH CÙNG FORD
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Chương trình bảo hiểm liên kết chính hãng Ford Ensure được thiết kế riêng biệt nhằm bảo vệ tối đa cho chiếc xe của bạn. Mang đến giải pháp bảo hiểm và bảo hành mở rộng toàn diện, giúp hạn chế rủi ro tài chính và giữ vững giá trị xe theo thời gian.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Gói bảo hành mở rộng lên tới 5 năm hoặc 150.000 km",
                  "Thủ tục bồi thường nhanh chóng, ký duyệt trực tuyến tại đại lý",
                  "Hỗ trợ chi phí đi lại tạm thời trong thời gian sửa chữa bảo hiểm",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative aspect-square w-[380px] max-w-full mx-auto flex items-center justify-center">
              <Image 
                src={siteAssets.qualityCareBadge} 
                alt="Ford Quality Care Shield"
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-contain"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="w-full bg-[#f0f4f8]/40 border-y border-gray-200/50 py-16 font-antenna">
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Quyền Lợi Độc Quyền</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              TẠI SAO BẠN NÊN LỰA CHỌN FORD ENSURE?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white border border-gray-200 p-6 rounded-none shadow-xs hover:border-[#066fef] transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-gray-900 mb-2 uppercase group-hover:text-[#066fef] transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Call to Action */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Tư vấn miễn phí</span>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-900">
              ĐĂNG KÝ MUA HOẶC GIA HẠN GÓI FORD ENSURE
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Để lại thông tin để chuyên viên bảo hiểm tại Long Khánh Ford liên hệ tư vấn gói tối ưu nhất cho dòng xe của bạn.
            </p>
          </div>
          <Link
            href="/lien-he?reason=Tư vấn bảo hiểm Ford Ensure"
            className="bg-[#066fef] hover:bg-[#002F6C] text-white text-xs font-bold uppercase px-8 py-4 rounded-none transition-colors tracking-wider inline-flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Nhận Báo Giá Ngay</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
