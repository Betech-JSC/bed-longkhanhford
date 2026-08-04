"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Calculator, PiggyBank, Wrench, Phone, MessageCircle, ArrowUp } from "lucide-react";

const SteeringWheelIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="2.5" />
    <line x1="12" y1="2" x2="12" y2="9.5" />
    <line x1="12" y1="12" x2="5.5" y2="18.5" />
    <line x1="12" y1="12" x2="18.5" y2="18.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.145 2 11.242c0 2.91 1.45 5.498 3.71 7.073V22l3.528-1.937A11.758 11.758 0 0012 20.484c5.523 0 10-4.146 10-9.242S17.523 2 12 2zm1.192 11.938l-2.435-2.6-4.75 2.6 5.22-5.542 2.435 2.6 4.75-2.6-5.22 5.542z" />
  </svg>
);

const ZaloIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5C25.1 5 5 25.1 5 50C5 60.1 8.4 69.5 14.1 77L8 95L26.7 89.2C33.8 94.1 42.4 97 50 97C74.9 97 95 76.9 95 50C95 25.1 74.9 5 50 5Z" fill="#FFFFFF"/>
    <text x="50" y="60" fontStyle="normal" fontWeight="900" fontSize="30" fill="#0068FF" textAnchor="middle">Zalo</text>
  </svg>
);

export default function QuickAccessToolbar() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasCompareItems, setHasCompareItems] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkCompare = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("compare-vehicles");
        if (stored) {
          try {
            const ids = JSON.parse(stored);
            setHasCompareItems(Array.isArray(ids) && ids.length > 0);
            return;
          } catch {}
        }
      }
      setHasCompareItems(false);
    };

    checkCompare();
    window.addEventListener("compare-updated", checkCompare);
    return () => window.removeEventListener("compare-updated", checkCompare);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const desktopMenuItems = [
    {
      label: "Đăng ký lái thử",
      icon: <SteeringWheelIcon />,
      href: "/dang-ky-lai-thu",
    },
    {
      label: "So sánh xe",
      icon: <ArrowLeftRight className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "/cong-cu/so-sanh-xe",
    },
    {
      label: "Dự toán chi phí",
      icon: <Calculator className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "/cong-cu/uoc-tinh-lan-banh",
    },
    {
      label: "Tính phí trả góp",
      icon: <PiggyBank className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "/cong-cu/uoc-tinh-tra-gop",
    },
    {
      label: "Đặt hẹn dịch vụ",
      icon: <Wrench className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "/lien-he",
    },
    {
      label: "Hotline hỗ trợ",
      icon: <Phone className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "tel:0812868622",
    },
    {
      label: "Kết nối Zalo",
      icon: <MessageCircle className="w-[18px] h-[18px] stroke-[1.5]" />,
      href: "https://zalo.me/0812868622",
      target: "_blank",
    },
  ];

  const mobileMenuItems = [
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      href: "https://www.facebook.com/longkhanhfordofficial/",
      target: "_blank",
      colorClass: "text-[#1877f2]",
      rippleClass: "animate-quick-ripple-facebook",
      delay: "0s",
    },
    {
      label: "Messenger",
      icon: <MessengerIcon />,
      href: "https://m.me/longkhanhfordofficial",
      target: "_blank",
      colorClass: "text-[#a200ff]",
      rippleClass: "animate-quick-ripple-messenger",
      delay: "0.3s",
    },
    {
      label: "Zalo",
      icon: <ZaloIcon />,
      href: "https://zalo.me/0812868622",
      target: "_blank",
      colorClass: "text-[#0068ff]",
      rippleClass: "animate-quick-ripple-zalo",
      delay: "0.6s",
    },
    {
      label: "Hotline",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:0812868622",
      colorClass: "text-[#e11d48]",
      rippleClass: "animate-quick-ripple-phone",
      delay: "0.9s",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes quick-ripple-phone-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
        @keyframes quick-ripple-zalo-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(0, 104, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0); }
        }
        @keyframes quick-ripple-messenger-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(162, 0, 255, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(162, 0, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(162, 0, 255, 0); }
        }
        @keyframes quick-ripple-facebook-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(24, 119, 242, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(24, 119, 242, 0); }
          100% { box-shadow: 0 0 0 0 rgba(24, 119, 242, 0); }
        }
        .animate-quick-ripple-phone {
          animation: quick-ripple-phone-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-zalo {
          animation: quick-ripple-zalo-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-messenger {
          animation: quick-ripple-messenger-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-facebook {
          animation: quick-ripple-facebook-keyframes 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Desktop Version */}
      <div className="hidden md:flex fixed right-0 top-[60%] -translate-y-1/2 z-50 flex-col items-end gap-1.5 select-none">
        {/* Action stack container */}
        <div className="flex flex-col bg-white border-l border-y border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-l-xl overflow-visible w-12">
          {desktopMenuItems.map((item, idx) => {
            const isExternal = item.target === "_blank";
            return (
              <div 
                key={idx} 
                className="relative w-12 h-12 border-b last:border-b-0 border-gray-100"
              >
                <Link
                  href={item.href}
                  target={item.target}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className={`absolute right-0 top-0 h-full w-12 hover:w-44 flex items-center justify-start group text-gray-700 hover:text-white bg-white hover:bg-[#002f6c] transition-all duration-300 ease-out ${
                    idx === 0 ? "rounded-tl-xl" : ""
                  } ${
                    idx === desktopMenuItems.length - 1 ? "rounded-bl-xl" : ""
                  } hover:rounded-l-xl hover:shadow-[0_8px_20px_rgba(0,47,108,0.25)] overflow-hidden z-10 hover:z-20`}
                >
                  {/* Icon wrapper - stays centered in its fixed 48px area */}
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-gray-550 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  
                  {/* Text Label - revealed with slide-in animation on hover */}
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 ease-out pr-4 text-gray-700 group-hover:text-white font-sans">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Buttons (Mobile - Left) */}
      <div className="flex flex-col gap-2.5 md:hidden fixed left-4 bottom-20 z-50 select-none">
        {/* Zalo */}
        <Link
          href="https://zalo.me/0812868622"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg shadow-blue-500/30 active:scale-90 transition-transform overflow-hidden"
          aria-label="Chat Zalo"
        >
          <ZaloIcon className="w-7 h-7" />
        </Link>

        {/* Hotline Call */}
        <Link
          href="tel:0812868622"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#006fef] text-white shadow-lg shadow-blue-500/30 active:scale-90 transition-transform animate-pulse"
          aria-label="Gọi điện hotline"
        >
          <Phone className="w-5 h-5 fill-current stroke-0" />
        </Link>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="grid grid-cols-5 md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f0f2f5] border-t-2 border-[#002f6c] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none w-full pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))] [-webkit-tap-highlight-color:transparent]">
        {/* Lái thử */}
        <Link
          href="/dang-ky-lai-thu"
          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border-r border-gray-300/70 text-[#101828] hover:text-[#002f6c] active:bg-gray-200/80 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-[#101828]">
            <SteeringWheelIcon />
          </div>
          <span className="text-[11px] font-semibold text-[#101828] leading-none whitespace-nowrap">Lái thử</span>
        </Link>

        {/* So sánh */}
        <Link
          href="/cong-cu/so-sanh-xe"
          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border-r border-gray-300/70 text-[#101828] hover:text-[#002f6c] active:bg-gray-200/80 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-[#101828]">
            <ArrowLeftRight className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[11px] font-semibold text-[#101828] leading-none whitespace-nowrap">So sánh</span>
        </Link>

        {/* P.Lăn bánh */}
        <Link
          href="/cong-cu/uoc-tinh-lan-banh"
          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border-r border-gray-300/70 text-[#101828] hover:text-[#002f6c] active:bg-gray-200/80 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-[#101828]">
            <Calculator className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[11px] font-semibold text-[#101828] leading-none whitespace-nowrap">P.Lăn bánh</span>
        </Link>

        {/* P.Trả góp */}
        <Link
          href="/cong-cu/uoc-tinh-tra-gop"
          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border-r border-gray-300/70 text-[#101828] hover:text-[#002f6c] active:bg-gray-200/80 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-[#101828]">
            <PiggyBank className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[11px] font-semibold text-[#101828] leading-none whitespace-nowrap">P.Trả góp</span>
        </Link>

        {/* Đặt hẹn */}
        <Link
          href="/lien-he"
          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 text-[#101828] hover:text-[#002f6c] active:bg-gray-200/80 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-[#101828]">
            <Wrench className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[11px] font-semibold text-[#101828] leading-none whitespace-nowrap">Đặt hẹn</span>
        </Link>
      </div>

      {/* Mobile Scroll to Top Floating Button (positioned above bottom nav bar) */}
      {showScrollTop && (
        <div className="block md:hidden fixed right-4 bottom-20 z-40 select-none">
          <button
            onClick={scrollToTop}
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-gray-700 active:scale-90 transition-transform"
            aria-label="Về đầu trang"
          >
            <ArrowUp className="w-4.5 h-4.5" />
          </button>
        </div>
      )}

      {/* Desktop Scroll to Top Button */}
      {showScrollTop && (
        <div className="hidden md:block fixed right-6 bottom-8 z-50 select-none">
          <button
            onClick={scrollToTop}
            type="button"
            className="group relative flex items-center justify-start h-12 w-12 hover:w-36 bg-white/95 hover:bg-[#002f6c] backdrop-blur-md border border-gray-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.12)] rounded-full text-gray-700 hover:text-white transition-all duration-300 ease-out overflow-hidden cursor-pointer"
            aria-label="Về đầu trang"
            title="Về đầu trang"
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 text-gray-700 group-hover:text-white">
              <ArrowUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out pr-4 text-white font-sans">
              Về đầu trang
            </span>
          </button>
        </div>
      )}
    </>
  );
}

