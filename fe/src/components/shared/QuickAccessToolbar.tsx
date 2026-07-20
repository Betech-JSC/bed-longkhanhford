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

const ZaloIcon = () => (
  <svg viewBox="0 0 32 32" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.97875 27.8971C6.46541 28.0614 8.3241 27.6375 9.64384 26.9968C15.3746 30.1644 24.3328 30.0131 29.7553 26.5428C29.9656 26.2274 30.1621 25.8993 30.3444 25.5592C31.4282 23.5379 32.0005 21.2608 32.0005 17.3642V14.5392C32.0005 10.6426 31.4282 8.3655 30.3444 6.34415C29.2728 4.32279 27.6777 2.7398 25.6563 1.65605C23.6349 0.572313 21.3579 0 17.4613 0H14.6241C11.3054 0 9.15104 0.417763 7.34093 1.21532C7.24199 1.30392 7.1449 1.39404 7.04986 1.48566C1.73929 6.60499 1.33561 17.702 5.83878 23.73C5.8438 23.7389 5.84937 23.7479 5.85548 23.757C6.54957 24.7798 5.87984 26.5699 4.83263 27.617C4.66215 27.7754 4.72304 27.8728 4.97875 27.8971Z" fill="currentColor" />
    <path d="M13.1605 10.88H6.93646V12.2146H11.2556L6.99707 17.4923C6.86363 17.6864 6.7666 17.8684 6.7666 18.2809V18.6206H12.6387C12.9299 18.6206 13.1726 18.378 13.1726 18.0868V17.3709H8.63502L12.6387 12.348C12.6994 12.2753 12.8086 12.1418 12.8572 12.0812L12.8814 12.0447C13.1119 11.705 13.1605 11.4138 13.1605 11.062V10.88ZM21.0826 18.6206H21.9683V10.88H20.6337V18.1717C20.6337 18.4144 20.8279 18.6206 21.0826 18.6206ZM16.521 12.6031C14.8467 12.6031 13.4878 13.962 13.4878 15.6363C13.4878 17.3106 14.8467 18.6694 16.521 18.6694C18.1953 18.6694 19.5541 17.3106 19.5541 15.6363C19.5663 13.962 18.2074 12.6031 16.521 12.6031ZM16.521 17.4198C15.5382 17.4198 14.7375 16.619 14.7375 15.6363C14.7375 14.6536 15.5382 13.8528 16.521 13.8528C17.5037 13.8528 18.3045 14.6536 18.3045 15.6363C18.3045 16.619 17.5158 17.4198 16.521 17.4198ZM25.9115 12.5544C24.225 12.5544 22.8541 13.9254 22.8541 15.6118C22.8541 17.2982 24.225 18.6693 25.9115 18.6693C27.5979 18.6693 28.9689 17.2982 28.9689 15.6118C28.9689 13.9254 27.5979 12.5544 25.9115 12.5544ZM25.9115 17.4196C24.9166 17.4196 24.1158 16.6188 24.1158 15.6239C24.1158 14.6291 24.9166 13.8283 25.9115 13.8283C26.9064 13.8283 27.7071 14.6291 27.7071 15.6239C27.7071 16.6188 26.9064 17.4196 25.9115 17.4196ZM18.8522 18.6204H19.568V12.7725H18.3184V18.0987C18.3184 18.3778 18.561 18.6204 18.8522 18.6204Z" fill="white" />
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
      href: "https://zalo.me/4149231651356573695",
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
      href: "https://zalo.me/4149231651356573695",
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
      <div className="hidden md:flex fixed right-0 top-[65%] -translate-y-1/2 z-50 flex-col items-end gap-1.5 select-none">
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

      {/* Mobile Version */}
      <div className={`flex md:hidden fixed right-4 z-50 flex-col items-center gap-2.5 select-none transition-all duration-300 ${
        hasCompareItems ? "bottom-28" : "bottom-20"
      }`}>
        {mobileMenuItems.map((item, idx) => {
          const isExternal = item.target === "_blank";
          return (
            <Link
              key={idx}
              href={item.href}
              target={item.target}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-90 ${item.rippleClass}`}
              style={{ animationDelay: item.delay }}
            >
              <div className={`relative z-10 transition-transform duration-300 ${item.colorClass}`}>
                {item.icon}
              </div>
            </Link>
          );
        })}

        {/* Mobile Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-gray-650 transition-all duration-300 active:scale-90"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 relative z-10" />
          </button>
        )}
      </div>
    </>
  );
}
