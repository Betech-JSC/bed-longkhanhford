"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Search, ChevronDown, ChevronRight } from "lucide-react";
import { vehiclesAPI, accessoriesAPI, servicesAPI, usedVehiclesAPI } from "@/lib/api";

type DropdownItem = {
  name: string;
  href: string;
};

type NavLink = {
  name: string;
  href: string;
  dropdownItems?: DropdownItem[];
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isTransparentPage = pathname === "/" || [
    "/gioi-thieu",
    "/lien-he",
    "/bang-gia",
    "/dich-vu",
    "/dong-xe",
    "/xe-da-qua-su-dung",
    "/tuyen-dung",
    "/san-pham"
  ].some(path => pathname === path || pathname.startsWith(path + "/"));
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");

  const [isProductHovered, setIsProductHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("suv");
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<string | null>(null);

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [accessoriesList, setAccessoriesList] = useState<any[]>([]);
  const [usedVehiclesList, setUsedVehiclesList] = useState<any[]>([]);
  const [servicesMenuList, setServicesMenuList] = useState<DropdownItem[]>([
    { name: "Chăm sóc khách hàng", href: "/dich-vu/cham-soc-khach-hang" },
    { name: "Bảo dưỡng nhanh 60 phút", href: "/dich-vu/bao-duong-nhanh" },
    { name: "Bảo dưỡng định kỳ", href: "/dich-vu/bao-duong-dinh-ky" },
    { name: "Nhận & Giao xe tận nơi", href: "/dich-vu/giao-nhan-xe-tan-noi" },
  ]);
  const [loading, setLoading] = useState(true);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsProductHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsProductHovered(false);
    }, 150);
  };

  const handleMouseLeaveImmediate = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsProductHovered(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Fetch Category, Vehicle, Accessories & Services data from API
  useEffect(() => {
    let active = true;
    const fetchMenuData = async () => {
      try {
        const [catsData, vehsData, accsData, servicesData, usedVehsData] = await Promise.all([
          vehiclesAPI.getCategories().catch(() => null),
          vehiclesAPI.getAll().catch(() => null),
          accessoriesAPI.getAll({ limit: 6 }).catch(() => null),
          servicesAPI.getAll().catch(() => null),
          usedVehiclesAPI.getAll({ limit: 3 }).catch(() => null),
        ]);
        
        if (!active) return;
        
        const cats = (catsData as any)?.data || catsData;
        const vehs = (vehsData as any)?.data || vehsData;
        const accs = (accsData as any)?.data || accsData;
        const services = (servicesData as any)?.services || (servicesData as any)?.data || servicesData;
        const usedVehs = (usedVehsData as any)?.data || usedVehsData;

        if (Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }
        if (Array.isArray(vehs) && vehs.length > 0) {
          setVehiclesList(vehs);
        }
        if (Array.isArray(accs) && accs.length > 0) {
          setAccessoriesList(accs);
        }
        if (Array.isArray(usedVehs) && usedVehs.length > 0) {
          setUsedVehiclesList(usedVehs);
        }
        if (Array.isArray(services) && services.length > 0) {
          setServicesMenuList(services.map((srv: any) => {
            const href = (srv.custom_link && srv.custom_link.startsWith('/dich-vu/'))
              ? srv.custom_link
              : `/dich-vu/${srv.slug}`;
            return {
              name: srv.title || srv.name || "",
              href: href,
            };
          }));
        }
      } catch (err) {
        console.error("Error fetching menu categories/vehicles/accessories/services:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMenuData();
    return () => {
      active = false;
    };
  }, []);

  // Set active tab to first dynamic category once loaded
  useEffect(() => {
    if (categoriesList.length > 0) {
      const timer = setTimeout(() => {
        setActiveTab(categoriesList[0].slug);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [categoriesList]);

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numericPrice || numericPrice <= 0) return "Liên hệ";
    return new Intl.NumberFormat("en-US").format(numericPrice) + "đ";
  };

  // Helper to resolve banner styling & content for any category slug/title
  const getBannerConfig = (slug: string, title: string) => {
    const cleanSlug = slug.toLowerCase();
    if (cleanSlug.includes("suv")) {
      return {
        bannerTitle: "Khám phá các dòng xe SUV của Ford",
        bannerDesc: "Mạnh mẽ, thông minh, sẵn sàng cho mọi hành trình gia đình",
        bannerBg: "bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#066fef]"
      };
    }
    if (cleanSlug.includes("ban-tai") || cleanSlug.includes("raptor") || cleanSlug.includes("pick")) {
      return {
        bannerTitle: "Khám phá các dòng xe bán tải của Ford",
        bannerDesc: "Vua bán tải địa hình mạnh mẽ, sẵn sàng chinh phục mọi thử thách",
        bannerBg: "bg-gradient-to-r from-[#ea580c] via-[#b8380a] to-[#7c2d12]"
      };
    }
    if (cleanSlug.includes("commercial") || cleanSlug.includes("thuong-mai") || cleanSlug.includes("transit")) {
      return {
        bannerTitle: "Khám phá các dòng xe thương mại của Ford",
        bannerDesc: "Bền bỉ, hiệu quả, tối ưu hóa lợi ích kinh doanh của doanh nghiệp",
        bannerBg: "bg-gradient-to-r from-[#1A1A1A] via-[#2D2D2D] to-[#404040]"
      };
    }
    // General fallback
    return {
      bannerTitle: `Khám phá các dòng xe ${title} của Ford`,
      bannerDesc: "Sự kết hợp hoàn hảo giữa công nghệ hiện đại và khả năng vận hành mạnh mẽ",
      bannerBg: "bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#066fef]"
    };
  };

  const staticCategories = [
    {
      id: "suv",
      name: "Xe SUV",
      bannerTitle: "Khám phá các dòng xe SUV của Ford",
      bannerDesc: "Mạnh mẽ, thông minh, sẵn sàng cho mọi hành trình gia đình",
      bannerBg: "bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#066fef]",
      cars: [
        { id: "ford-territory", displayName: "TERRITORY" },
        { id: "ford-everest", displayName: "FORD EVEREST" },
        { id: "mustang-fastback", displayName: "FORD MUSTANG" },
      ],
    },
    {
      id: "thuong-mai",
      name: "Xe thương mại",
      bannerTitle: "Khám phá các dòng xe thương mại của Ford",
      bannerDesc: "Bền bỉ, hiệu quả, tối ưu hóa lợi ích kinh doanh",
      bannerBg: "bg-gradient-to-r from-[#1A1A1A] via-[#2D2D2D] to-[#404040]",
      cars: [
        { id: "ford-ranger", displayName: "FORD RANGER" },
        { id: "ford-transit-2024", displayName: "FORD TRANSIT" },
      ],
    },
  ];

  const dynamicCategories = categoriesList.map((cat) => {
    const banner = getBannerConfig(cat.slug, cat.title);
    
    // Filter vehicles belonging to this category
    const catVehicles = vehiclesList
      .filter((v) => (v.category_ids && Array.isArray(v.category_ids) ? v.category_ids.includes(cat.id) : v.category_id === cat.id))
      .map((v) => ({
        id: v.slug || v.id,
        displayName: v.title || v.name,
        price: formatPrice(typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || v.basePrice || 0)),
        image: v.image_thumbnail_url || v.image_url || v.images?.[0] || "",
      }));

    return {
      id: cat.slug,
      name: cat.title.startsWith("Xe") ? cat.title : `Xe ${cat.title}`,
      bannerTitle: banner.bannerTitle,
      bannerDesc: banner.bannerDesc,
      bannerBg: banner.bannerBg,
      cars: catVehicles,
    };
  });

  const finalCategories = dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

  const getCarDisplayData = (car: { id: string; displayName: string; price?: string; image?: string }) => {
    if (car.price && car.image) {
      return {
        price: car.price,
        image: car.image,
      };
    }
    // Fallback search in vehiclesList (loaded dynamically from CMS API)
    const vehicle = vehiclesList.find((v) => (v.slug || String(v.id)) === car.id);
    if (!vehicle) {
      return {
        price: "Đang cập nhật",
        image: "",
      };
    }
    const price = typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : (vehicle.base_price || vehicle.basePrice || 0);
    const image = vehicle.image_thumbnail_url || vehicle.image_url || vehicle.images?.[0] || "";
    return {
      price: price > 0 ? formatPrice(price) : "Liên hệ",
      image: image,
    };
  };

  const navLinks: NavLink[] = [
    {
      name: "Giới thiệu",
      href: "/gioi-thieu",
      dropdownItems: [
        { name: "Câu chuyện Ford Long Khánh", href: "/gioi-thieu#our-story" },
        { name: "Ban giám đốc & Nhân sự", href: "/gioi-thieu#board-of-directors" },
        { name: "Cơ sở vật chất & Showroom", href: "/gioi-thieu#facilities" },
      ],
    },
    {
      name: "Sản phẩm",
      href: "/san-pham",
      dropdownItems: [
        { name: "Tất cả dòng xe", href: "/san-pham" },
        { name: "Ford Ranger", href: "/ford-ranger" },
        { name: "Ford Everest", href: "/ford-everest" },
        { name: "Ford Territory", href: "/ford-territory" },
        { name: "Ford Transit", href: "/ford-transit" },
        { name: "Ford Mustang", href: "/ford-mustang-mach-e" },
        { name: "Xe đã qua sử dụng", href: "/xe-da-qua-su-dung" },
      ],
    },
    {
      name: "Khuyến mãi",
      href: "/khuyen-mai",
    },
    {
      name: "Dịch vụ",
      href: "/dich-vu",
      dropdownItems: servicesMenuList,
    },
    {
      name: "Bài viết",
      href: "/tin-tuc",
      dropdownItems: [
        { name: "Tin tức & Ưu đãi", href: "/tin-tuc" },
        { name: "Thư viện Media", href: "/thu-vien-media" },
      ],
    },
    {
      name: "Công cụ",
      href: "/bang-gia",
      dropdownItems: [
        { name: "Bảng giá xe Ford", href: "/bang-gia" },
        { name: "Ước tính lăn bánh", href: "/cong-cu/uoc-tinh-lan-banh" },
        { name: "Ước tính trả góp", href: "/cong-cu/uoc-tinh-tra-gop" },
        { name: "So sánh xe", href: "/cong-cu/so-sanh-xe" },
      ],
    },
    { name: "Tuyển dụng", href: "/tuyen-dung" },
    { name: "Liên hệ", href: "/lien-he" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (pathname === "/" && window.scrollY < 100) {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["our-story", "showroom", "services", "news", "media", "consultation"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pathname]);

  const leftLinks = navLinks.slice(0, 4);
  const rightLinks = navLinks.slice(4);

  const renderNavLink = (link: NavLink, keySuffix: string = "") => {
    const sectionId = link.href.includes("#") ? link.href.split("#")[1] : "";
    const isCurrentPath = pathname === link.href || 
      (link.href !== "/" && pathname.startsWith(link.href)) ||
      (link.dropdownItems?.some(item => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) ?? false);
    const isActive = isCurrentPath || (pathname === "/" && sectionId && activeSection === sectionId);
    
    const hasDropdown = !!link.dropdownItems;
    const isTransparent = isTransparentPage && !isScrolled && !isOpen;

    // Active color class based on transparent state
    const linkActiveColorClass = "text-[#066fef]";
    const linkInactiveColorClass = isTransparent ? "text-white hover:text-[#066fef]" : "text-[#333333] hover:text-[#066fef]";
    
    if (link.name === "Sản phẩm") {
      return (
        <div
          key={`${link.name}${keySuffix}`}
          className="relative flex items-stretch h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={link.href}
            onClick={handleMouseLeaveImmediate}
            className={`relative px-1 h-full flex items-center text-[15px] xl:text-[16px] whitespace-nowrap font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 cursor-pointer
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#066fef] after:transition-all after:duration-300
              ${isProductHovered || isActive ? `${linkActiveColorClass} after:w-full` : `${linkInactiveColorClass} after:w-0 hover:after:w-full`}`}
          >
            {link.name}
            <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isProductHovered ? "rotate-180 text-[#066fef] opacity-100" : ""}`} />
          </Link>
        </div>
      );
    }

    if (hasDropdown) {
      return (
        <div 
          key={`${link.name}${keySuffix}`} 
          className="relative group flex items-stretch h-full" 
          onMouseEnter={handleMouseLeaveImmediate}
        >
          <Link
            href={link.href}
            className={`relative px-1 h-full flex items-center text-[15px] xl:text-[16px] whitespace-nowrap font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 cursor-pointer
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#066fef] after:transition-all after:duration-300
              ${isActive ? `${linkActiveColorClass} after:w-full` : `${linkInactiveColorClass} after:w-0 group-hover:after:w-full`}`}
          >
            {link.name}
            <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#066fef] group-hover:rotate-180 transition-transform duration-300" />
          </Link>

          {/* Hover Dropdown Menu */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-[0px_4px_4px_rgba(16,24,40,0.1),0px_2px_2px_rgba(16,24,40,0.06)] py-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] rounded-b-[12px] rounded-t-none">
            {link.dropdownItems?.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                className="block px-5 py-3 text-sm font-['Ford_Antenna',sans-serif] font-medium text-[#333333] hover:bg-[#f0f0f0] hover:text-gray-900 transition-colors first:rounded-t-none last:rounded-b-[12px]"
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={`${link.name}${keySuffix}`}
        href={link.href}
        onMouseEnter={handleMouseLeaveImmediate}
        className={`relative px-1 h-full flex items-center text-[15px] xl:text-[16px] whitespace-nowrap font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 cursor-pointer
          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#066fef] after:transition-all after:duration-300
          ${isActive ? `${linkActiveColorClass} after:w-full` : `${linkInactiveColorClass} after:w-0 hover:after:w-full`}`}
      >
        {link.name}
      </Link>
    );
  };

  const isTransparent = isTransparentPage && !isScrolled && !isOpen;

  const headerClass = isTransparentPage
    ? `fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isTransparent ? "bg-transparent border-transparent" : "bg-white border-gray-200 shadow-md"
      }`
    : "w-full z-50 bg-white border-b border-gray-200 sticky top-0 transition-all duration-300";

  return (
    <header className={headerClass}>
      {/* Top Header Utility Bar */}
      <div className={`hidden lg:block text-xs py-2 transition-all duration-300 ${
        isTransparent ? "bg-black/20 text-white border-b border-white/10" : "bg-[#00095b] text-white"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] flex justify-between items-center font-medium">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { window.location.href = "tel:1800556858"; }}
              className="flex items-center gap-1.5 text-white hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
              <span>Tổng đài &amp; CSKH: 1800 55 68 58</span>
            </button>
            <span className="text-white/30">|</span>
            <button 
              onClick={() => { window.location.href = "tel:0938229994"; }}
              className="flex items-center gap-1.5 text-white hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0 animate-pulse" />
              <span>Cứu hộ 24/7: 0938 229 994</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { window.location.href = "tel:0918909060"; }}
              className="flex items-center gap-1.5 text-white hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
              <span>Hotline kinh doanh: 0918 90 90 60</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-[1440px] mx-auto px-4 xl:px-[80px] h-[72px] flex items-center">
        {/* Desktop Split Layout */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center w-full h-full">
          {/* Left Menu Links */}
          <div className="flex justify-start items-stretch gap-3 xl:gap-5 h-full">
            {leftLinks.map((link) => renderNavLink(link, "-left"))}
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center px-4 shrink-0 h-full">
            <Link href="/" className="flex flex-col items-center justify-center gap-[3px] group py-1 text-center">
              <div className="h-[30px] w-[80px] relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/ford_logo.svg" 
                  alt="Ford Oval Logo" 
                  className="block size-full object-contain"
                />
              </div>
              <span className={`font-['Ford_Antenna',sans-serif] font-bold text-[11px] tracking-wider leading-none uppercase transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-[#00095b]"
              }`}>
                LONG KHANH FORD
              </span>
            </Link>
          </div>

          {/* Right Menu Links & Search */}
          <div className="flex justify-end items-stretch gap-6 xl:gap-8 h-full w-full">
            <div className="flex items-stretch gap-3 xl:gap-5 h-full">
              {rightLinks.map((link) => renderNavLink(link, "-right"))}
            </div>
            {/* Search Icon */}
            <div className="flex items-center">
              <Link 
                href="/tim-kiem" 
                className={`p-2 transition-colors duration-300 cursor-pointer ${
                  isTransparent ? "text-white hover:text-[#066fef]" : "text-[#333333] hover:text-[#066fef]"
                }`} 
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden flex justify-between items-center w-full h-full">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center justify-center gap-[3px] group py-1 text-center">
            <div className="h-[30px] w-[80px] relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/ford_logo.svg" 
                alt="Ford Oval Logo" 
                className="block size-full object-contain"
              />
            </div>
            <span className={`font-['Ford_Antenna',sans-serif] font-bold text-[11px] tracking-wider leading-none uppercase transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[#00095b]"
            }`}>
              LONG KHANH FORD
            </span>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Link 
              href="/tim-kiem" 
              className={`p-2 transition-colors duration-300 cursor-pointer ${
                isTransparent ? "text-white hover:text-[#066fef]" : "text-[#333333] hover:text-[#066fef]"
              }`} 
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/dang-ky-lai-thu"
              className="btn-ford-primary text-xs py-1.5 px-3 uppercase tracking-wider font-bold whitespace-nowrap flex-shrink-0"
            >
              Lái Thử
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-300 cursor-pointer relative w-10 h-10 flex items-center justify-center ${
                isTransparent ? "text-white" : "text-[#333333]"
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-[18px]">
                <span 
                  className={`absolute block h-[2px] w-6 bg-current transform transition-all duration-300 ease-in-out
                    ${isOpen ? "rotate-45 top-[8px]" : "top-0"}`} 
                />
                <span 
                  className={`absolute block h-[2px] w-6 bg-current transition-all duration-300 ease-in-out
                    ${isOpen ? "opacity-0 w-0 top-[8px]" : "opacity-100 top-[8px]"}`} 
                />
                <span 
                  className={`absolute block h-[2px] w-6 bg-current transform transition-all duration-300 ease-in-out
                    ${isOpen ? "-rotate-45 top-[8px]" : "top-[16px]"}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div 
        className={`absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-xl transition-all duration-500 ease-in-out z-50 overflow-hidden
          ${isProductHovered 
            ? "max-h-[600px] opacity-100 visible translate-y-0" 
            : "max-h-0 opacity-0 invisible -translate-y-2 pointer-events-none"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] py-8 grid grid-cols-4 gap-8">
          {/* Left Category Sidebar */}
          <div className="col-span-1 border-r border-neutral-100 pr-6 flex flex-col gap-2.5 text-left h-full min-h-[380px]">
            {finalCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    router.push(`/dong-xe/${cat.id}`);
                    setIsProductHovered(false);
                  }}
                  onMouseEnter={() => setActiveTab(cat.id)}
                  className={`flex items-center justify-between px-4 py-2 font-['Ford_Antenna',sans-serif] font-bold text-[13px] tracking-wider uppercase transition-all duration-200 text-left cursor-pointer border-l-2
                    ${isActive 
                      ? "text-[#066fef] border-[#066fef] pl-3" 
                      : "text-neutral-600 hover:text-[#066fef] hover:pl-3 border-transparent"}`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
            
            {/* Xe đã qua sử dụng tab button */}
            {(() => {
              const isActive = activeTab === "xe-da-qua-su-dung";
              return (
                <button
                  onClick={() => {
                    router.push("/xe-da-qua-su-dung");
                    setIsProductHovered(false);
                  }}
                  onMouseEnter={() => setActiveTab("xe-da-qua-su-dung")}
                  className={`flex items-center justify-between px-4 py-2 font-['Ford_Antenna',sans-serif] font-bold text-[13px] tracking-wider uppercase transition-all duration-200 text-left cursor-pointer border-l-2
                    ${isActive 
                      ? "text-[#066fef] border-[#066fef] pl-3" 
                      : "text-neutral-600 hover:text-[#066fef] hover:pl-3 border-transparent"}`}
                >
                  <span>Xe đã qua sử dụng</span>
                </button>
              );
            })()}

            {/* Custom CTA links stacked at the bottom */}
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-neutral-100">
              <Link
                href="/san-pham"
                onClick={handleMouseLeaveImmediate}
                className="w-full flex items-center justify-center text-[12px] py-2 px-3 border border-neutral-300 rounded-[4px] hover:border-[#066fef] hover:text-[#066fef] text-neutral-800 bg-white transition-all font-semibold uppercase tracking-wider text-center"
              >
                Xem tất cả dòng xe
              </Link>
              <Link
                href="/thu-vien-media"
                onClick={handleMouseLeaveImmediate}
                className="w-full flex items-center justify-center text-[12px] py-2 px-3 border border-neutral-300 rounded-[4px] hover:border-[#066fef] hover:text-[#066fef] text-neutral-800 bg-white transition-all font-semibold uppercase tracking-wider text-center"
              >
                Tải Catalogue
              </Link>
              <Link
                href="/cong-cu/so-sanh-xe"
                onClick={handleMouseLeaveImmediate}
                className="w-full flex items-center justify-center text-[12px] py-2 px-3 border border-neutral-300 rounded-[4px] hover:border-[#066fef] hover:text-[#066fef] text-neutral-800 bg-white transition-all font-semibold uppercase tracking-wider text-center"
              >
                So sánh xe
              </Link>
            </div>
          </div>

          {/* Right Product Showcase Panel */}
          {(() => {
            if (activeTab === "xe-da-qua-su-dung") {
              const displayUsedVehicles = usedVehiclesList.length > 0 
                ? usedVehiclesList.slice(0, 6) 
                : [
                    { id: "ford-ranger-wildtrak-2-0l-4x4-at-2021", name: "Ranger Wildtrak 2.0L 2021", price: 680000000, year: 2021, odo: 45000, slug: "ford-ranger-wildtrak-2-0l-4x4-at-2021" },
                    { id: "ford-everest-titanium-2-0l-at-2023", name: "Everest Titanium 2.0L 2023", price: 1050000000, year: 2023, odo: 15000, slug: "ford-everest-titanium-2-0l-at-2023" },
                    { id: "ford-territory-trend-1-5l-at-2023", name: "Territory Trend 1.5L 2023", price: 720000000, year: 2023, odo: 20000, slug: "ford-territory-trend-1-5l-at-2023" }
                  ];
                
              return (
                <div className="col-span-3">
                  {/* Used Vehicles Grid */}
                  <div className="grid grid-cols-3 gap-y-10 gap-x-8 text-left">
                    {displayUsedVehicles.map((car: any) => {
                      const id = car.slug || car.id;
                      const name = car.title || car.name;
                      const price = car.price || 0;
                      const image = car.image_url || car.image?.[0]?.url || car.image?.[0] || "";
                      
                      return (
                        <Link
                          key={id}
                          href={`/xe-da-qua-su-dung/${id}`}
                          onClick={handleMouseLeaveImmediate}
                          className="group flex flex-col items-center text-center cursor-pointer transition-all"
                        >
                          <div className="w-full h-32 relative mb-3 overflow-hidden flex items-center justify-center">
                            {image ? (
                              <Image
                                src={image}
                                alt={name}
                                fill
                                sizes="(max-width: 1024px) 30vw, 20vw"
                                className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg text-xs text-gray-400">
                                Hình ảnh đang cập nhật
                              </div>
                            )}
                          </div>
                          {/* Title */}
                          <h5 className="font-['Ford_Antenna',sans-serif] font-bold text-xs text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 line-clamp-1 w-full uppercase tracking-wider">
                            {name}
                          </h5>
                          {/* Price */}
                          <p className="text-[11px] text-gray-500 font-medium">
                            Giá bán đề nghị từ: <span className="text-[#066fef] font-bold">{price > 0 ? formatPrice(price) : "Liên hệ"}</span>
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (activeTab === "phu-kien") {
              const displayAccessories = accessoriesList.length > 0
                ? accessoriesList.slice(0, 6)
                : [
                    { id: "nap-thung-ranger", name: "Nắp thùng cuộn điện Ranger", price: 21500000, image_url: "/assets/quality-care-circle.png" },
                    { id: "phim-cach-nhiet-everest", name: "Phim cách nhiệt cao cấp Everest", price: 9500000, image_url: "/assets/territory-interior.png" },
                    { id: "tham-lot-san-territory", name: "Thảm lót sàn 3D cao cấp Territory", price: 2200000, image_url: "/assets/territory-promo.png" }
                  ];

              return (
                <div className="col-span-3">
                  {/* Accessories Grid */}
                  <div className="grid grid-cols-3 gap-y-10 gap-x-8">
                    {displayAccessories.map((acc: any) => {
                      const id = acc.slug || acc.id;
                      const name = acc.title || acc.name;
                      const price = acc.price || 0;
                      const image = acc.image?.url || acc.images?.[0]?.url || acc.image_url || "";
                      
                      return (
                        <Link
                          key={id}
                          href={`/phu-kien/${id}`}
                          onClick={handleMouseLeaveImmediate}
                          className="group flex flex-col items-center text-center cursor-pointer transition-all"
                        >
                          {/* Image Container */}
                          <div className="w-full h-32 relative mb-3 overflow-hidden flex items-center justify-center">
                            {image ? (
                              <Image
                                src={image}
                                alt={name}
                                fill
                                sizes="(max-width: 1024px) 30vw, 20vw"
                                className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg text-xs text-gray-400">
                                Hình ảnh đang cập nhật
                              </div>
                            )}
                          </div>
                          {/* Title */}
                          <h5 className="font-['Ford_Antenna',sans-serif] font-bold text-xs text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 line-clamp-1 w-full uppercase tracking-wider">
                            {name}
                          </h5>
                          {/* Price */}
                          <p className="text-[11px] text-gray-550 font-medium">
                            Giá bán đề nghị từ: <span className="text-[#066fef] font-bold">{formatPrice(price)}</span>
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const activeCategory = finalCategories.find(cat => cat.id === activeTab) || finalCategories[0];
            if (!activeCategory) return null;
            
            return (
              <div className="col-span-3">
                {/* Vehicle Grid */}
                <div className="grid grid-cols-3 gap-y-10 gap-x-8 text-left">
                  {activeCategory.cars.map((car) => {
                    const carData = getCarDisplayData(car);
                    return (
                      <Link
                        key={car.id}
                        href={`/${car.id}`}
                        onClick={handleMouseLeaveImmediate}
                        className="group flex flex-col items-center text-center cursor-pointer transition-all"
                      >
                        {/* Vehicle Image Container */}
                        <div className="w-full h-32 relative mb-3 overflow-hidden flex items-center justify-center">
                          {carData.image ? (
                            <Image
                              src={carData.image}
                              alt={car.displayName}
                              fill
                              sizes="(max-width: 1024px) 30vw, 20vw"
                              className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg text-xs text-gray-400">
                              Hình ảnh đang cập nhật
                            </div>
                          )}
                        </div>
                        {/* Vehicle Title */}
                        <h5 className="font-['Ford_Antenna',sans-serif] font-bold text-xs text-gray-900 group-hover:text-[#066fef] transition-colors mb-1 uppercase tracking-wider">
                          {car.displayName}
                        </h5>
                        {/* Vehicle Starting Price */}
                        <p className="text-[11px] text-gray-550 font-medium">
                          Giá bán đề nghị từ: <span className="text-[#066fef] font-bold">{carData.price}</span>
                        </p>
                      </Link>
                    );
                  })}
                  {activeCategory.cars.length === 0 && (
                    <div className="col-span-3 py-12 text-center text-gray-400 text-sm">
                      Hiện chưa có xe nào trong danh mục này.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`lg:hidden bg-white shadow-inner transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen 
            ? "max-h-[calc(100vh-72px)] opacity-100 visible px-4 py-4 space-y-3 border-t border-gray-100" 
            : "max-h-0 opacity-0 invisible px-4 py-0 space-y-0 border-t-0"}`}
      >
          {navLinks.map((link) => {
            if (link.name === "Sản phẩm") {
              return (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => setIsMobileProductOpen(!isMobileProductOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-base font-bold text-[#333333] hover:bg-gray-50 rounded-sm text-left"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isMobileProductOpen ? "rotate-180 text-[#066fef]" : ""}`} />
                  </button>
                  
                  <div 
                    className={`pl-4 border-l border-gray-100 flex flex-col gap-2 transition-all duration-300 ease-in-out overflow-hidden
                      ${isMobileProductOpen 
                        ? "max-h-[1000px] opacity-100 py-1" 
                        : "max-h-0 opacity-0 py-0"}`}
                  >
                      {finalCategories.map((cat) => {
                        const isSubOpen = mobileActiveTab === cat.id;
                        return (
                          <div key={cat.id} className="space-y-1">
                            <button
                              onClick={() => setMobileActiveTab(isSubOpen ? null : cat.id)}
                              className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#066fef] hover:bg-gray-50 rounded text-left cursor-pointer"
                            >
                              <span>{cat.name}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isSubOpen ? "rotate-180 text-[#066fef]" : ""}`} />
                            </button>
                            <div 
                              className={`pl-4 flex flex-col gap-1 transition-all duration-300 ease-in-out overflow-hidden
                                ${isSubOpen 
                                  ? "max-h-[400px] opacity-100 py-1" 
                                  : "max-h-0 opacity-0 py-0"}`}
                            >
                                {cat.cars.map((car) => (
                                  <Link
                                    key={car.id}
                                    href={`/${car.id}`}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setIsMobileProductOpen(false);
                                    }}
                                    className="block px-2 py-1.5 text-xs font-medium text-gray-550 hover:text-[#066fef] hover:bg-gray-50 rounded"
                                  >
                                    {car.displayName}
                                  </Link>
                                ))}
                                {cat.cars.length === 0 && (
                                  <div className="px-2 py-1.5 text-xs text-gray-400 italic">
                                    Chưa có xe
                                  </div>
                                )}
                              </div>
                          </div>
                        );
                      })}

                      <div className="h-px bg-gray-100 my-1" />

                      <Link
                        href="/xe-da-qua-su-dung"
                        onClick={() => {
                          setIsOpen(false);
                          setIsMobileProductOpen(false);
                        }}
                        className="w-full block px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#066fef] hover:bg-gray-50 rounded text-left cursor-pointer"
                      >
                        Xe đã qua sử dụng
                      </Link>
                      
                      <div className="h-px bg-gray-100 my-1" />
                      
                      {/* Accessories Collapsible Menu on Mobile Drawer hidden */}
                  </div>
                </div>
              );
            }

            return (
              <div key={link.name} className="space-y-1">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-bold text-[#333333] hover:bg-gray-50 rounded-sm"
                >
                  {link.name}
                </Link>
                {link.dropdownItems && (
                  <div className="pl-6 border-l border-gray-100 flex flex-col gap-1.5 py-1">
                    {link.dropdownItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-gray-550 hover:text-[#066fef] py-1 block"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
            <div className="text-xs text-gray-550 px-3 space-y-2 font-medium">
              <p className="text-[#424242]">
                📞 Tổng đài &amp; CSKH:{" "}
                <button
                  onClick={() => { window.location.href = "tel:1800556858"; }}
                  className="font-bold text-[#066fef] bg-transparent border-0 p-0 cursor-pointer text-xs"
                >
                  1800 55 68 58
                </button>
              </p>
              <p className="text-[#424242]">
                📞 Hotline kinh doanh:{" "}
                <button
                  onClick={() => { window.location.href = "tel:0918909060"; }}
                  className="font-bold text-[#066fef] bg-transparent border-0 p-0 cursor-pointer text-xs"
                >
                  0918 90 90 60
                </button>
              </p>
              <p className="text-[#424242]">
                🚨 Cứu hộ 24/7:{" "}
                <button
                  onClick={() => { window.location.href = "tel:0938229994"; }}
                  className="font-bold text-red-500 bg-transparent border-0 p-0 cursor-pointer text-xs"
                >
                  0938 229 994
                </button>
              </p>
            </div>
          </div>
        </div>
    </header>
  );
}
