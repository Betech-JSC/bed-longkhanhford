"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check client side persistence
    const consent = localStorage.getItem("ford-cookie-consent");
    const sessionClosed = sessionStorage.getItem("ford-cookie-consent-closed");

    if (!consent && !sessionClosed) {
      const timer = setTimeout(() => {
        setIsMounted(true);
        // Small delay to trigger Tailwind transition
        setTimeout(() => setIsVisible(true), 50);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ford-cookie-consent", "accepted");
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 500);
    window.dispatchEvent(new Event("cookie-consent-dismissed"));
  };

  const handleDecline = () => {
    localStorage.setItem("ford-cookie-consent", "declined");
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 500);
    window.dispatchEvent(new Event("cookie-consent-dismissed"));
  };

  const handleClose = () => {
    // Hide for current session only
    sessionStorage.setItem("ford-cookie-consent-closed", "true");
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 500);
    window.dispatchEvent(new Event("cookie-consent-dismissed"));
  };

  if (!isMounted) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 max-w-[440px] w-[calc(100%-32px)] sm:w-[440px] bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col gap-4 text-left transition-all duration-500 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
        aria-label="Đóng banner cookie"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="pr-6">
        <h4 className="font-['Ford_Antenna',sans-serif] font-bold text-[16px] text-gray-900 leading-tight">
          Trang web này sử dụng cookie
        </h4>
      </div>

      {/* Content */}
      <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed font-normal">
        Chúng tôi sử dụng cookie để ghi nhớ lịch sử trình duyệt web của bạn và cung cấp trải nghiệm phù hợp với sở thích. Bạn có thể tham khảo thông tin chi tiết về cookie mà Ford sử dụng tại Chính sách bảo mật của Ford Việt Nam.{" "}
        <Link href="/chinh-sach-bao-mat" className="text-[#0562d2] hover:underline font-semibold whitespace-nowrap">
          Xem thêm
        </Link>
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-1">
        <button
          onClick={handleAccept}
          className="px-6 py-2.5 bg-[#0562d2] hover:bg-[#044ea7] active:scale-98 text-white rounded-full font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer border-0 shadow-sm"
        >
          ĐỒNG Ý
        </button>
        <button
          onClick={handleDecline}
          className="px-6 py-2.5 border border-[#0562d2] text-[#0562d2] hover:bg-[#0562d2]/5 active:scale-98 rounded-full font-bold text-[11px] tracking-wider bg-transparent transition-all cursor-pointer"
        >
          Từ chối tất cả
        </button>
      </div>
    </div>
  );
}
