"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Bookmark } from "lucide-react";

export default function BookingBanner() {
  // Use official-style Ford Everest landscape banner image as background
  const bannerBg = "/images-dynamic/image-hero-1.jpg";

  return (
    <div className="w-full relative h-[420px] md:h-[480px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={bannerBg}
        alt="Ford Lifestyle"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlay to darken image slightly for better text contrast on the card's backdrop */}
      <div className="absolute inset-0 bg-black/25 z-0" />

      {/* Main Content Area */}
      <div className="max-w-[1440px] w-full mx-auto px-4 xl:px-[80px] relative z-10 flex items-center h-full">
        {/* Floating White Card */}
        <div className="bg-white p-8 md:p-10 rounded-[20px] shadow-2xl max-w-[480px] w-full flex flex-col gap-5 text-gray-900 border border-gray-100">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#002F6C] bg-[#002F6C]/10 px-3 py-1 rounded-full w-fit font-antenna">
            Tư vấn &amp; Hỗ trợ 24/7
          </span>

          <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight text-[#00095B] tracking-tight">
            Kết nối ngay với chuyên viên <span className="text-[#0562d2]">Long Khánh Ford</span>
          </h3>

          <p className="text-xs md:text-sm text-gray-500 font-medium font-antenna leading-relaxed">
            Hãy để chúng tôi đồng hành cùng bạn. Đội ngũ chuyên viên tư vấn giàu kinh nghiệm luôn sẵn sàng giải đáp thắc mắc, gửi báo giá tốt nhất và đăng ký lịch lái thử xe nhanh chóng.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full">
            <a
              href="tel:0812868622"
              className="flex items-center justify-center gap-2.5 bg-[#002F6C] hover:bg-[#001D4A] text-white font-bold px-6 py-3.5 rounded-full text-xs md:text-sm transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0 font-antenna uppercase tracking-wider flex-1"
            >
              <Phone className="w-4 h-4" />
              <span>0812 86 86 22</span>
            </a>
            <Link
              href="/lien-he"
              className="flex items-center justify-center gap-2.5 bg-transparent hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-black font-bold px-6 py-3.5 rounded-full text-xs md:text-sm transition-all duration-300 active:scale-95 cursor-pointer shrink-0 font-antenna uppercase tracking-wider flex-1"
            >
              <Bookmark className="w-4 h-4" />
              <span>Đặt lịch hẹn</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
