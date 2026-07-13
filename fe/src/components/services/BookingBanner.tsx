"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Bookmark } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";

export default function BookingBanner() {
  return (
    <div className="w-full bg-[#00095b] py-[32px] px-4 md:px-[80px] flex justify-center overflow-visible">
      <div className="max-w-[1152px] w-full relative flex items-center overflow-visible">
        {/* Inner Rounded Banner */}
        <div className="w-full lg:w-[913px] bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#0562D2] rounded-[12px] p-8 lg:p-[32px] h-auto lg:h-[320px] flex items-center relative overflow-hidden lg:overflow-visible shadow-xl">
          {/* Content */}
          <div className="flex flex-col gap-6 max-w-full lg:max-w-[505px] relative z-10 text-white">
            <h3 className="text-3xl lg:text-[36px] font-bold font-display leading-[1.32]">
              Kết nối ngay với chuyên viên Long Khánh Ford
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:1800556858"
                className="flex items-center justify-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-colors text-white font-bold px-6 py-3 rounded-full text-base"
              >
                <Phone className="w-5 h-5" />
                <span>1800 55 68 58</span>
              </a>
              <Link
                href="/lien-he"
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border border-white transition-colors text-white font-bold px-6 py-3 rounded-full text-base"
              >
                <Bookmark className="w-5 h-5" />
                <span>Đặt lịch hẹn</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overlapping Car Image */}
        <div className="hidden lg:block absolute h-[420px] left-[576px] top-[-50px] w-[587px] pointer-events-none z-20">
          <Image
            src={siteAssets.bookingCar}
            alt="Ford Booking Vehicle"
            fill
            sizes="587px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
