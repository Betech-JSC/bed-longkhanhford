"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Car, Repeat, Banknote, ChevronRight, FileCheck } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import CountUpNumber from "@/components/common/CountUpNumber";
import { siteAssets } from "@/lib/site-assets";

const assuredPledges = [
  {
    icon: FileCheck,
    title: "167 Điểm Kiểm Tra Kỹ Thuật",
    desc: "Mọi xe Ford lướt bán ra đều trải qua quy trình kiểm tra nghiêm ngặt 167 điểm bởi chuyên gia Ford toàn cầu."
  },
  {
    icon: ShieldCheck,
    title: "Bảo Hành Chính Hãng 1 Năm",
    desc: "Tặng gói bảo hành chính hãng Ford thêm 12 tháng hoặc 20.000 KM với lịch sử bảo dưỡng rõ ràng."
  },
  {
    icon: Repeat,
    title: "Thu Xe Cũ Đổi Xe Mới (Trade-In)",
    desc: "Định giá xe cũ nhanh trong 30 phút với giá cao nhất thị trường, hỗ trợ thủ tục sang tên đổi chủ trọn gói."
  },
  {
    icon: Banknote,
    title: "Hỗ Trợ Vay Ngân Hàng 70%",
    desc: "Hợp tác ngân hàng hỗ trợ gói vay xe cũ đến 70% giá trị xe với lãi suất ưu đãi & giải ngân cực nhanh."
  }
];

export default function UsedCarsLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Mua Bán Xe Ford Đã Qua Sử Dụng Chính Hãng (Ford Assured)"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.usedCars} />

      {/* Commitments Banner */}
      <section className="w-full bg-[#002F6C] text-white py-8 border-b border-[#066fef]/30 font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#38bdf8] mb-1">
                <CountUpNumber target={167} suffix=" Điểm" />
              </div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Kiểm Tra Chất Lượng</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#38bdf8] mb-1">
                <CountUpNumber target={100} suffix="%" />
              </div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Không Đâm Đụng &amp; Thủy Kích</div>
            </div>
            <div className="border-r border-white/10 last:border-0 p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#38bdf8] mb-1">
                <CountUpNumber target={12} suffix=" Tháng" />
              </div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Bảo Hành Mở Rộng Hãng</div>
            </div>
            <div className="p-2">
              <div className="text-3xl md:text-4xl font-bold text-[#38bdf8] mb-1">
                <CountUpNumber target={30} suffix=" Phút" />
              </div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Định Giá Nhanh Chóng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pledges Grid */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Cam Kết An Tâm</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            4 LÝ DO CHỌN MUA VÀ ĐỔI XE TẠI LONG KHÁNH FORD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assuredPledges.map((pledge, idx) => {
            const Icon = pledge.icon;
            return (
              <div key={idx} className="bg-white border border-gray-200 p-6 rounded-none shadow-xs hover:border-[#066fef] transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-[4px] mb-5 group-hover:bg-[#066fef] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2 uppercase group-hover:text-[#066fef] transition-colors">
                    {pledge.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {pledge.desc}
                  </p>
                </div>
                <Link
                  href="/lien-he?reason=Tư vấn mua xe Ford cũ"
                  className="text-[#066fef] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:gap-2 transition-all border-t border-gray-100 pt-4"
                >
                  <span>Tìm hiểu thêm</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trade-In Banner */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="bg-[#00095B] text-white p-8 lg:p-12 border border-neutral-800 rounded-none shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Chương Trình Đổi Xe Cũ Lấy Mới</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-3">
              BẠN MUỐN BÁN HOẶC ĐỔI XE FORD ĐANG ĐI?
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Chúng tôi nhận thu mua lại tất cả các dòng xe ô tô đã qua sử dụng với mức giá hợp lý nhất và hỗ trợ nâng cấp sang xe Ford mới 100%.
            </p>
          </div>

          <Link
            href="/lien-he?reason=Thu cũ đổi mới xe Ford"
            className="bg-[#066fef] hover:bg-white hover:text-[#00095B] text-white font-bold text-center px-8 py-4 rounded-[4px] text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shrink-0 shadow-lg"
          >
            <span>Gửi Thông Tin Xe Của Bạn</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
