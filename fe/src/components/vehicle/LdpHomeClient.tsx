"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  ShieldCheck,
  Users,
  CheckCircle,
  Phone,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Minus,
  MapPin,
  Mail,
  Car,
  Clock,
  Sparkles,
  Send,
  MessageCircle
} from "lucide-react";
import { handleCtaFormClick } from "@/lib/scroll-helper";
import { getPopularVehicleImage, siteAssets, handleImageError, resolveImageUrl } from "@/lib/site-assets";
import { bannersAPI, postsAPI, vehiclesAPI, servicesAPI, customerHandoversAPI, contactsAPI } from "@/lib/api";
import SafeImage from "@/components/shared/SafeImage";
import LdpUsedVehiclesBlock from "@/components/blocks/LdpUsedVehiclesBlock";
import VehicleLayoutClient, { useVehicle } from "./VehicleLayoutClient";
import { formatPersonName } from "@/lib/formatters";

// Custom SVG Icons
const WheelIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32.0001 32.0001" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15.9999 0C7.16338 0 0 7.16338 0 15.9999C0 24.8364 7.16338 32.0001 15.9999 32.0001C24.8364 32.0001 32.0001 24.8364 32.0001 15.9999C31.9901 7.16748 24.8326 0.0099609 15.9999 0ZM15.9999 3.2001C21.2716 3.18223 26.0083 6.41719 27.9103 11.3335C24.1676 9.64893 20.1041 8.79609 15.9999 8.8333C11.896 8.79609 7.83252 9.64893 4.08984 11.3335C5.9918 6.41719 10.7285 3.18223 15.9999 3.2001ZM13.3649 28.5258C7.79473 27.3363 3.67471 22.6181 3.24697 16.9383C8.025 16.9383 13.3649 23.3001 13.3649 28.5258ZM15.9999 18.3999C14.6745 18.3999 13.5999 17.3256 13.5999 15.9999C13.5999 14.6745 14.6745 13.5999 15.9999 13.5999C17.3256 13.5999 18.3999 14.6745 18.3999 15.9999C18.3999 17.3256 17.3256 18.3999 15.9999 18.3999ZM18.6352 28.5258C18.6352 23.3001 23.9751 16.9383 28.7534 16.9383C28.3254 22.6181 24.2054 27.3363 18.6352 28.5258Z" fill="currentColor" />
  </svg>
);

const CostIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 26.8182 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M26.8116 7.60629C26.7332 5.67204 25.4263 3.75087 22.8647 2.27405C17.6109 -0.758015 9.11588 -0.758015 3.89473 2.27405C1.28088 3.79008 -0.0129712 5.7766 9.80176e-05 7.76965V11.8669V11.9387V15.9706V16.0425V20.0743V20.1462V24.2369C0.0131672 26.2234 1.33316 28.2099 3.96007 29.726C6.58699 31.242 10.0242 32 13.4549 32C16.8855 32 20.3162 31.242 22.9235 29.726C25.5308 28.2099 26.8312 26.2234 26.8181 24.2369V20.1397V19.911V16.0359V15.8072V11.9322V11.7035V7.76965V7.76312V7.60629H26.8116ZM6.36481 8.0245C6.75035 7.89381 7.1555 7.76312 7.56065 7.63896C7.8547 7.54748 8.0246 7.52787 8.14876 7.59976C8.22064 7.63896 8.27945 7.71084 8.33826 7.8154C8.60618 8.31203 9.03747 8.74985 9.58638 9.15499C9.68439 9.22687 9.78241 9.29222 9.88697 9.35103C10.181 9.52093 10.5208 9.65816 10.9129 9.74311C11.9192 9.96529 12.8341 9.56667 12.723 8.94588C12.6838 8.73678 12.5792 8.52767 12.4485 8.33163C12.0957 7.82193 11.6644 7.33184 11.4291 6.796C11.0501 5.92689 11.2266 5.14274 12.4224 4.52195C13.7947 3.82275 15.3172 3.77701 16.9378 4.21483C17.5978 4.39126 17.5978 4.39779 18.101 4.10374C18.2774 3.99918 18.4473 3.90116 18.6237 3.80968C19.0093 3.59404 19.14 3.59404 19.5386 3.80315C19.5778 3.82275 19.617 3.84889 19.6562 3.86849C19.7346 3.91423 19.813 3.95998 19.8915 4.00572C19.9568 4.04493 20.0156 4.0776 20.0679 4.11027C20.7148 4.48274 20.656 4.51542 19.898 4.95324C19.3295 5.29304 19.3295 5.29304 19.813 5.67204C20.1855 5.9661 20.4796 6.2863 20.7083 6.6261C20.8324 6.8156 20.7606 6.95283 20.4534 7.05085C20.0025 7.19461 19.5582 7.3449 19.0942 7.48213C18.8132 7.56708 18.6499 7.58015 18.5257 7.50827C18.4538 7.46906 18.4016 7.40372 18.3428 7.3057C18.0552 6.8156 17.5913 6.39739 16.9705 6.04452C16.8921 5.99877 16.8137 5.95957 16.7352 5.91382C16.5392 5.81581 16.3366 5.72432 16.0883 5.66551C15.2127 5.46947 14.4481 5.7962 14.5527 6.33857C14.605 6.60649 14.7553 6.87441 14.9382 7.12926C15.2584 7.56708 15.5851 8.0049 15.8139 8.46232C16.5523 9.92608 14.9578 11.3637 12.4159 11.5075C11.501 11.5597 10.6319 11.4421 9.82162 11.1807C9.47529 11.0631 9.20737 11.0762 8.93945 11.2461C8.67153 11.416 8.38401 11.5728 8.09648 11.7296C7.84817 11.8734 7.59332 11.8799 7.33847 11.7427C7.18164 11.6577 7.03134 11.5728 6.88105 11.4813C6.73075 11.3964 6.58045 11.3049 6.43016 11.2134C6.17531 11.0566 6.20145 10.8997 6.44976 10.7494C6.65233 10.6318 6.84837 10.5077 7.05748 10.39C7.4953 10.1287 7.50837 10.109 7.1359 9.81499C6.6654 9.44252 6.24719 9.05044 5.9858 8.61262C5.77016 8.27935 5.82244 8.20094 6.36481 8.0245ZM24.9754 24.2499C24.9819 25.6157 23.8972 27.0272 22.0021 28.1315C19.7542 29.4384 16.7222 30.1572 13.4614 30.1572C10.2006 30.1572 7.1555 29.4384 4.89452 28.1315C2.97335 27.0206 1.869 25.6026 1.86246 24.2434V24.0474C2.43751 24.6159 3.13018 25.1517 3.96661 25.6353C6.59352 27.1513 10.0307 27.9093 13.4614 27.9093C16.8921 27.9093 20.3227 27.1513 22.9301 25.6353C23.7469 25.1648 24.4134 24.642 24.9754 24.0866V24.2499ZM24.9754 20.1462C24.9819 21.5119 23.8972 22.9234 22.0021 24.0278C19.7542 25.3347 16.7222 26.0535 13.4614 26.0535C10.2006 26.0535 7.1555 25.3347 4.89452 24.0278C2.97335 22.9169 1.869 21.4989 1.86246 20.1397V19.9436C2.43751 20.5122 3.13018 21.048 3.96661 21.5315C6.59352 23.0476 10.0307 23.8056 13.4614 23.8056C16.8921 23.8056 20.3227 23.0476 22.9301 21.5315C23.7469 21.0611 24.4134 20.5383 24.9754 19.9828V20.1462ZM24.9754 16.049C24.9819 17.4147 23.8972 18.8262 22.0021 19.9306C19.7542 21.2375 16.7222 21.9563 13.4614 21.9563C10.2006 21.9563 7.1555 21.2375 4.89452 19.9306C2.97335 18.8197 1.869 17.4017 1.86246 16.0425V15.8464C2.43751 16.4149 3.13018 16.9508 3.96661 17.4343C6.59352 18.9504 10.0307 19.7084 13.4614 19.7084C16.8921 19.7084 20.3227 18.9504 22.9301 17.4343C23.7469 16.9639 24.4134 16.4411 24.9754 15.8856V16.049ZM24.9754 11.9453C24.9819 13.311 23.8972 14.7225 22.0021 15.8268C19.7542 17.1338 16.7222 17.8526 13.4614 17.8526C10.2006 17.8526 7.1555 17.1338 4.89452 15.8268C2.97335 14.7159 1.869 13.2979 1.86246 11.9387V11.6708C2.43751 12.2393 3.13018 12.7752 3.96661 13.2587C9.22044 16.2908 17.7089 16.2908 22.9366 13.2587C23.7534 12.7882 24.4199 12.2655 24.9819 11.71V11.9453H24.9754Z" fill="currentColor" />
  </svg>
);

const OfferIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 22.5641" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g id="Vector">
      <path d="M13.1685 4.70667 C12.7079 4.70667 12.2044 4.87214 11.8568 5.26427 C11.4016 5.77778 11.2589 7.31234 11.2758 8.08677 C12.0444 8.10537 13.5138 8.08499 14.1091 7.49306 C14.7315 6.87405 14.9018 5.79241 14.2399 5.13415 C13.9519 4.84766 13.5672 4.70667 13.1685 4.70667 Z" fill="currentColor" />
      <path d="M7.30222 4.70667 C7.76287 4.70667 8.26639 4.87214 8.61395 5.26427 C9.06913 5.77778 9.21183 7.31234 9.19494 8.08677 C8.42639 8.10537 6.95692 8.08499 6.36171 7.49306 C5.73928 6.87405 5.56896 5.79241 6.23084 5.13415 C6.51891 4.84766 6.90352 4.70667 7.30222 4.70667 Z" fill="currentColor" />
      <path d="M15.6903 3.68096 C16.8591 4.84308 17.0148 6.67473 16.214 8.08677 H32 V2.93039 C32 1.312 30.6856 0 29.0643 0 H11.2615 V3.16397 C12.7002 2.35214 14.5182 2.51549 15.6903 3.68096 C16.3562 4.34304 14.5182 2.51549 15.6903 3.68096 Z" fill="currentColor" />
      <path d="M6.95515 13.8543 L5.49867 12.4072 L7.76144 10.1381 H0 V19.6336 C0 21.2521 1.31439 22.5641 2.93573 22.5641 H9.20643 V11.5967 L6.95515 13.8543 Z" fill="currentColor" />
      <path d="M12.6974 10.1381 L14.9301 12.3885 L13.4698 13.8318 L11.2615 11.6058 V22.5641 H29.0643 C30.6856 22.5641 32 21.2521 32 19.6337 V10.1381 H12.6974 Z" fill="currentColor" />
      <path d="M4.25388 8.08677 C3.45299 6.67453 3.60896 4.84301 4.77757 3.68096 C5.94961 2.51549 7.76759 2.35221 9.20643 V0 H2.93573 C1.31439 0 0 1.312 0 2.93039 V8.08677 H4.25388 Z" fill="currentColor" />
    </g>
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 31.9621 32.0002" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g id="Vector">
      <path d="M20.8561 7.11584C19.5963 2.5074 24.4395 -1.51681 28.7399 0.56213L25.6422 3.65979L26.3073 5.6549L28.3014 6.31994L31.4 3.22229C33.4781 7.5198 29.4576 12.3662 24.8463 11.1061L11.1051 24.8844C12.3648 29.493 7.52185 33.5169 3.22132 31.4381L6.31996 28.3405L5.65492 26.3453L3.6598 25.6803L0.562143 28.778C-1.51592 24.4804 2.50349 19.6349 7.11488 20.8951L20.8561 7.11584Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.8825 20.8942C25.3486 20.7695 25.839 20.7028 26.3444 20.7028C33.8195 20.9785 33.8208 31.7124 26.3444 31.9889C22.6889 32.0445 19.9065 28.3895 20.8932 24.8844L17.3219 21.3141L21.3073 17.318C21.9443 17.9551 24.5098 20.5215 24.8825 20.8942ZM24.8571 24.859L24.3131 26.8903L25.7994 28.3776L27.8317 27.8326L28.3756 25.8014L26.8883 24.3141L24.8571 24.859Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.65394 0.0123251C9.30939 -0.0432956 12.0917 3.61177 11.1051 7.11682L14.6569 10.6686L10.6725 14.6637L7.11488 11.1071C6.64884 11.2316 6.1592 11.2985 5.65394 11.2985C-1.82143 11.0228 -1.82262 0.288636 5.65394 0.0123251ZM4.16664 4.16858L3.62269 6.19983L5.10999 7.68713L7.14124 7.14221L7.68519 5.11096L6.19789 3.62365L4.16664 4.16858Z" fill="currentColor" />
    </g>
  </svg>
);

const ZaloIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="white" />
    <text x="50" y="63" fontStyle="normal" fontWeight="900" fontSize="32" fill="#0068FF" textAnchor="middle">Zalo</text>
  </svg>
);

const resolveZaloUrl = (zaloUrl?: string, phone?: string): string => {
  const target = (zaloUrl || phone || "").trim();
  if (!target) return "";
  if (target.startsWith("http://") || target.startsWith("https://")) return target;
  if (target.startsWith("zalo.me/")) return `https://${target}`;
  const cleanPhone = target.replace(/[^0-9]/g, "");
  if (cleanPhone) return `https://zalo.me/${cleanPhone}`;
  return target;
};

// FAQ Data
const faqs = [
  {
    q: "Điều gì tạo nên sự nổi bật thương hiệu Long Khánh Ford?",
    a: "Long Khánh Ford tự hào là đại lý ủy quyền chính thức của Ford Việt Nam với cơ sở vật chất 5S hiện đại bậc nhất, đội ngũ nhân sự chuyên nghiệp và quy trình dịch vụ đạt tiêu chuẩn toàn cầu, mang đến trải nghiệm hài lòng tối đa cho khách hàng."
  },
  {
    q: "Sự sáng tạo trong thiết kế sản phẩm",
    a: "Các dòng xe Ford thế hệ mới sở hữu ngôn ngữ thiết kế thông minh, mạnh mẽ và khí động học cao. Thiết kế khoang nội thất tối ưu không gian đi kèm hệ thống giải trí SYNC 4 hiện đại giúp nâng tầm trải nghiệm lái xe."
  },
  {
    q: "Chất lượng dịch vụ khách hàng xuất sắc",
    a: "Chúng tôi cam kết đồng hành cùng khách hàng trong suốt vòng đời sử dụng xe với các dịch vụ chăm sóc tận tâm: cứu hộ 24/7, hotline hỗ trợ kỹ thuật miễn phí, dịch vụ nhận và giao xe tận nhà, cùng phòng chờ VIP đầy đủ tiện nghi."
  },
  {
    q: "Cam kết bảo vệ môi trường",
    a: "Long Khánh Ford ứng dụng các công nghệ sơn và sửa chữa thân vỏ thân thiện với môi trường, sử dụng hệ thống xử lý chất thải đạt chuẩn và tích cực thúc đẩy các dòng xe tiết kiệm nhiên liệu thế hệ mới từ Ford."
  },
  {
    q: "Chương trình ưu đãi và khuyến mãi mua xe",
    a: "Long Khánh Ford luôn mang đến các chương trình ưu đãi giá, quà tặng phụ kiện chính hãng minh bạch, ngày hội lái thử xe trải nghiệm thực tế, và chính sách hỗ trợ trả góp lãi suất tốt nhất cho khách hàng."
  },
  {
    q: "Đội ngũ nhân viên chuyên nghiệp và tận tâm",
    a: "Tất cả kỹ thuật viên và tư vấn bán hàng của chúng tôi đều trải qua các khóa đào tạo khắt khe và đạt chứng chỉ từ Ford Việt Nam, sẵn sàng lắng nghe và giải đáp mọi yêu cầu của quý khách hàng."
  }
];

const techSlides = [
  {
    title: "Ứng dụng Ford",
    description: "Ứng dụng Ford mang đến cho bạn trải nghiệm sở hữu trọn vẹn và dễ dàng trong tầm tay. Khi truy cập vào ứng dụng này, bạn có đầy đủ thông tin các tính năng của xe và kiểm tra về tình trạng xe.",
    image: "/assets/tech_fordpass.jpg",
    category: "Lái xe",
    link: "/dang-ky-lai-thu"
  },
  {
    title: "Ford Co-Pilot360",
    description: "Dù trong thành phố hay ra xa lộ, hệ thống Ford Co-Pilot360™ - Công nghệ An toàn Hỗ trợ Người lái được thiết kế để giúp bạn cảm thấy tự tin hơn khi lái xe.",
    image: "/assets/tech_copilot360.jpg",
    category: "Lái xe",
    link: "/dang-ky-lai-thu"
  },
  {
    title: "Hệ thống âm thanh cao cấp",
    description: "Hệ thống loa B&O cho trải nghiệm âm thanh tuyệt vời với chất âm trung thực và rõ ràng đến từng chi tiết.",
    image: "/assets/tech_audio.webp",
    category: "Giải trí",
    link: "/dang-ky-lai-thu"
  }
];

const formatBannersList = (items: any[]) => {
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item: any) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: resolveImageUrl(item.image_url || item.image) || siteAssets.heroSlides[0],
      imageMobile: resolveImageUrl(item.image_mobile_url || item.image_url || item.image) || siteAssets.heroSlides[0],
      buttonText: item.button_text || "Đăng ký lái thử",
      buttonLink: item.button_link || "#showroom"
    }));
  }
  return [
    {
      title: "KHÁM PHÁ CÁC DÒNG XE FORD THẾ HỆ MỚI",
      subtitle: "Đại lý ủy quyền 5S chính thức của Ford Việt Nam tại Long Khánh",
      image: siteAssets.heroSlides[0] || "/showroom_bg.webp",
      imageMobile: siteAssets.heroSlides[0] || "/showroom_bg.webp",
      buttonText: "Đăng ký lái thử",
      buttonLink: "#showroom"
    }
  ];
};

const formatArticlesList = (items: any[]) => {
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item: any) => ({
      id: item.slug || item.id || String(Math.random()),
      title: item.title || "",
      image: resolveImageUrl(item.image?.url || item.image_url || item.image) || "/assets/tech_copilot360.jpg",
      imageAlt: item.image?.alt || item.title || "",
      published_at: item.published_at || "",
      category: item.category ? { title: item.category.title } : undefined,
      description: item.description || "",
    }));
  }
  return [];
};

export type LdpHomeClientProps = {
  salesConsultant: any;
  allVehicles?: any[];
  leadVehicle?: any;
  landingPageId?: number | string;
  salesEmail?: string;
  promotions?: any;
  initialBanners?: any[];
  initialCategories?: any[];
  initialServices?: any[];
  initialHandovers?: any[];
  initialArticles?: any[];
};

function LdpHomeInner({
  salesConsultant,
  allVehicles = [],
  leadVehicle,
  landingPageId,
  salesEmail,
  promotions,
  initialBanners = [],
  initialCategories = [],
  initialServices = [],
  initialHandovers = [],
  initialArticles = [],
}: LdpHomeClientProps) {
  const router = useRouter();
  const { openQuoteDrawer, openDriveDrawer } = useVehicle();
  const finalZaloUrl = resolveZaloUrl(salesConsultant?.zalo_url, salesConsultant?.phone);
  const consultantSlug = salesConsultant?.slug || salesConsultant?.name?.toLowerCase().trim().replace(/\s+/g, "-") || "tu-van";

  // Banner State
  const [heroSlides, setHeroSlides] = useState<any[]>(() => formatBannersList(initialBanners));
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  // Showroom & Filter State
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [vehiclesList, setVehiclesList] = useState<any[]>(allVehicles);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Technology State
  const [activeTechTab, setActiveTechTab] = useState<number>(0);
  const [techDragOffset, setTechDragOffset] = useState<number>(0);
  const [isTechTransitioning, setIsTechTransitioning] = useState<boolean>(true);
  const [isTechHovered, setIsTechHovered] = useState<boolean>(false);
  const [isTechInteracted, setIsTechInteracted] = useState<boolean>(false);

  const techDragStartX = useRef<number>(0);
  const isTechDragging = useRef<boolean>(false);
  const techWasDragged = useRef<boolean>(false);

  // Drag handlers for Technology Section
  const handleTechStart = (clientX: number) => {
    techDragStartX.current = clientX;
    isTechDragging.current = true;
    setIsTechInteracted(true);
  };

  const handleTechMove = (clientX: number) => {
    if (!isTechDragging.current) return;
    const diff = clientX - techDragStartX.current;
    setTechDragOffset(diff);
  };

  const handleTechEnd = () => {
    if (!isTechDragging.current) return;
    isTechDragging.current = false;

    const dist = Math.abs(techDragOffset);
    if (dist > 10) {
      techWasDragged.current = true;
      setTimeout(() => {
        techWasDragged.current = false;
      }, 50);
    } else {
      techWasDragged.current = false;
    }

    if (techDragOffset > 50) {
      if (activeTechTab > 0) {
        setIsTechTransitioning(true);
        setActiveTechTab((prev) => prev - 1);
      }
    } else if (techDragOffset < -50) {
      if (activeTechTab < 2) {
        setIsTechTransitioning(true);
        setActiveTechTab((prev) => prev + 1);
      }
    }

    setTechDragOffset(0);
  };

  // Auto-play technology slides every 3.5 seconds, pause on hover/interaction
  useEffect(() => {
    if (isTechHovered || isTechInteracted) return;
    const timer = setInterval(() => {
      setIsTechTransitioning(true);
      setActiveTechTab((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, [isTechHovered, isTechInteracted]);

  // Reset tech interacted flag after 5 seconds of inactivity to resume auto-play
  useEffect(() => {
    if (isTechInteracted) {
      const timer = setTimeout(() => {
        setIsTechInteracted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTechInteracted]);

  // Services State
  const [servicesList, setServicesList] = useState<any[]>(initialServices);
  const [activeServiceIndex, setActiveServiceIndex] = useState<number>(0);
  const [isServiceHovered, setIsServiceHovered] = useState<boolean>(false);

  // News & Handovers State
  const [homeArticles, setHomeArticles] = useState<any[]>(() => formatArticlesList(initialArticles));
  const [activeNewsTab, setActiveNewsTab] = useState<number>(3); // 3: Khuyến Mãi
  const [customerHandovers, setCustomerHandovers] = useState<any[]>(initialHandovers);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isInitialPostsMount = useRef(true);

  // Helper function to format date from API
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  // Load posts dynamically when activeNewsTab changes
  useEffect(() => {
    if (isInitialPostsMount.current) {
      isInitialPostsMount.current = false;
      if (initialArticles.length > 0 && activeNewsTab === 3) {
        return;
      }
    }

    const fetchTabPosts = async () => {
      try {
        const postsData = await postsAPI.getAll({ categories: activeNewsTab });
        const postsItems = (postsData as any)?.posts?.data || (postsData as any)?.data || postsData;
        if (Array.isArray(postsItems)) {
          setHomeArticles(formatArticlesList(postsItems));
        } else {
          setHomeArticles([]);
        }
      } catch (error) {
        console.warn("Notice fetching tab posts:", error);
        setHomeArticles([]);
      }
    };
    fetchTabPosts();
  }, [activeNewsTab]);

  // FAQ & Story State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeStoryCard, setActiveStoryCard] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + customerHandovers.length) % customerHandovers.length : null));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % customerHandovers.length : null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, customerHandovers.length]);

  // Form Consultation State
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadVehicleId, setLeadVehicleId] = useState("");
  const [leadNote, setLeadNote] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitStatus, setLeadSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [leadErrorMessage, setLeadErrorMessage] = useState("");

  // Auto-play Hero Banner
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Client-side fallback fetch if SSR was missing
  useEffect(() => {
    if (heroSlides.length > 0 && vehiclesList.length > 0 && servicesList.length > 0) return;

    Promise.all([
      bannersAPI.getAll().catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
      vehiclesAPI.getAll().catch(() => null),
      servicesAPI.getAll().catch(() => null),
      customerHandoversAPI.getAll().catch(() => null),
      postsAPI.getAll({ categories: 3 }).catch(() => null),
    ]).then(([bannersRes, catRes, vRes, sRes, hRes, pRes]) => {
      const bItems = (bannersRes as any)?.data || bannersRes;
      if (Array.isArray(bItems) && bItems.length > 0) setHeroSlides(formatBannersList(bItems));

      const cItems = (catRes as any)?.data || catRes;
      if (Array.isArray(cItems) && cItems.length > 0) setCategories(cItems);

      const vItems = (vRes as any)?.data || vRes;
      if (Array.isArray(vItems) && vItems.length > 0) {
        setVehiclesList((prev) => {
          if (!prev || prev.length === 0) return vItems;
          return prev.map((v: any) => {
            const matched = vItems.find(
              (hv: any) => (hv.slug && (hv.slug === v.slug || hv.slug === v.id)) || String(hv.id) === String(v.id)
            );
            return matched ? { ...v, ...matched, id: v.slug || matched.slug || v.id } : v;
          });
        });
      }

      const sItems = (sRes as any)?.services || (sRes as any)?.data || sRes;
      if (Array.isArray(sItems) && sItems.length > 0) setServicesList(sItems);

      const hItems = (hRes as any)?.data || hRes;
      if (Array.isArray(hItems) && hItems.length > 0) setCustomerHandovers(hItems);

      const pItems = (pRes as any)?.posts?.data || (pRes as any)?.data || pRes;
      if (Array.isArray(pItems) && pItems.length > 0) setHomeArticles(formatArticlesList(pItems));
    });
  }, [heroSlides.length, vehiclesList.length, servicesList.length]);

  // Auto-play Technology tab
  useEffect(() => {
    if (isTechHovered) return;
    const timer = setInterval(() => {
      setActiveTechTab((prev) => (prev + 1) % techSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isTechHovered]);

  // Filter Vehicles for Showroom (Đồng bộ 100% logic trang chủ Long Khánh Ford)
  const filteredVehicles = vehiclesList.filter((v: any) => {
    if (selectedCategory === "all") return true;
    const cat = categories.find((c: any) => c.slug === selectedCategory);
    if (cat && cat.id) {
      if (Array.isArray(v.category_ids) && v.category_ids.includes(cat.id)) return true;
      if (v.category_id === cat.id) return true;
    }
    const type = (v.type || "").toLowerCase();
    const title = (v.title || v.name || "").toLowerCase();

    if (selectedCategory === "suv") {
      return type === "suv" || title.includes("everest") || title.includes("territory") || title.includes("explorer");
    }
    if (selectedCategory === "pickup" || selectedCategory === "ban-tai") {
      return type === "pickup" || title.includes("ranger");
    }
    if (selectedCategory === "commercial" || selectedCategory === "thuong-mai") {
      return type === "commercial" || title.includes("transit") || title.includes("tourneo");
    }
    if (selectedCategory === "ev" || selectedCategory === "xe-dien") {
      return type === "ev" || title.includes("mach-e") || title.includes("điện");
    }
    return false;
  });

  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (!num || isNaN(num)) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  // Submit Lead Form
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadErrorMessage("Vui lòng điền họ tên và số điện thoại.");
      setLeadSubmitStatus("error");
      return;
    }
    setIsSubmittingLead(true);
    setLeadErrorMessage("");

    try {
      const selectedVehicle = vehiclesList.find((v: any) => String(v.id) === String(leadVehicleId) || v.slug === leadVehicleId) || leadVehicle;
      const pId = selectedVehicle ? String(selectedVehicle.id || selectedVehicle.slug) : "ford-longkhanh";
      const pSlug = selectedVehicle?.slug || "ford-longkhanh";
      const pTitle = selectedVehicle?.title || selectedVehicle?.name || "Tất cả các dòng xe Ford";

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          sales_consultant_id: salesConsultant?.id ? Number(salesConsultant.id) : undefined,
          data: {
            landing_page_id: landingPageId ? Number(landingPageId) : undefined,
            sales_email: salesEmail || salesConsultant?.email,
            Name: leadName.trim(),
            Phone: leadPhone.trim(),
            "Họ và tên": leadName.trim(),
            "Số điện thoại": leadPhone.trim(),
            "Nội dung cần hỗ trợ": leadNote.trim(),
            Product: {
              id: pId,
              slug: pSlug,
              title: pTitle,
              type: "vehicle",
            },
            source: "landing_page_consultation",
          },
        },
      });

      if (response && response.success === false) {
        setLeadSubmitStatus("error");
        const msg = typeof response.message === "object" ? Object.values(response.message).flat().join(", ") : response.message;
        setLeadErrorMessage(msg || "Gửi yêu cầu không thành công. Vui lòng thử lại sau.");
        return;
      }

      setLeadSubmitStatus("success");
      setLeadName("");
      setLeadPhone("");
      setLeadNote("");
    } catch (err: any) {
      setLeadSubmitStatus("error");
      setLeadErrorMessage(err?.data?.message || err?.message || "Gửi yêu cầu không thành công. Vui lòng thử lại sau.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Helper for vehicle card links (retaining consultant context)
  const getVehicleLink = (vehicle: any) => {
    const vehicleSlug = vehicle.slug || vehicle.id;
    return salesConsultant?.custom_domain
      ? `/${vehicleSlug}`
      : `/ldp/${consultantSlug}/${vehicleSlug}`;
  };

  return (
    <div className="w-full min-h-screen bg-white relative pb-16 md:pb-0 font-sans">
      {/* 0. STICKY VEHICLE SWITCHER (MULTI-VEHICLE JUMP BAR) */}
      {allVehicles && allVehicles.length > 1 && (
        <div id="ldp-vehicles-tabs" className="bg-[#0b192e] text-white py-3.5 px-4 border-y border-white/10 sticky top-0 z-[40] shadow-md scroll-mt-2">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 shrink-0">
              <Car className="w-4 h-4 text-[#0562D2]" />
              <span>Dòng xe Chuyên viên kinh doanh {formatPersonName(salesConsultant?.name)} phụ trách ({allVehicles.length}):</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {allVehicles.map((v: any) => (
                <Link
                  key={v.id}
                  href={getVehicleLink(v)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border bg-white/10 text-gray-200 border-white/10 hover:bg-[#0562D2] hover:text-white hover:border-[#0562D2]"
                >
                  {v.title || v.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO BANNER SECTION (SLIDER) */}
      <section className="relative w-full h-[580px] md:h-[680px] overflow-hidden bg-black select-none">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
              activeHeroIndex === idx ? "opacity-95 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover w-full h-full object-top"
              />
            </div>
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={slide.imageMobile || slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover w-full h-full object-top"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          </div>
        ))}

        {/* Hero Content Area */}
        <div className="max-w-[1440px] mx-auto w-full h-full px-6 xl:px-[144px] flex flex-col justify-end text-center relative z-10 pb-16 md:pb-20">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {salesConsultant?.name && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-4 border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Trang giới thiệu chính thức: Chuyên viên kinh doanh {formatPersonName(salesConsultant.name)}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.2] text-white uppercase">
              {heroSlides[activeHeroIndex]?.title || "LONG KHÁNH FORD — ĐẠI LÝ 5S CHÍNH THỨC"}
            </h1>
            <p className="mt-3 text-sm sm:text-lg md:text-xl font-medium text-white/85 leading-snug max-w-[90%]">
              {heroSlides[activeHeroIndex]?.subtitle || "Trải nghiệm sức mạnh, công nghệ và sự an toàn vượt trội cùng Ford Việt Nam."}
            </p>

            {/* CTAs */}
            <div className="flex flex-row justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => openDriveDrawer()}
                className="bg-[#0562d2] hover:bg-[#066FEF] text-white px-6 py-3 rounded-full text-sm md:text-base font-bold shadow-lg transition-all duration-300 cursor-pointer border-0 active:scale-95"
              >
                Đăng ký lái thử
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById("showroom");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("#showroom");
                  }
                }}
                className="bg-transparent hover:bg-white/10 border border-white text-white px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 cursor-pointer"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        {/* Hero Navigation Arrows */}
        <button
          type="button"
          onClick={() => setActiveHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white z-20 cursor-pointer hidden md:flex items-center justify-center border-0 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white z-20 cursor-pointer hidden md:flex items-center justify-center border-0 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Dots Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveHeroIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer border-0 ${
                activeHeroIndex === idx ? "w-8 bg-[#0562D2]" : "w-2 bg-white/50"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. QUICK ACTIONS BAR (ĐỒNG BỘ 100% GIAO DIỆN HOMEPAGE) */}
      <section className="bg-white border-y border-gray-200 py-8 relative z-20 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Action 1: Đăng ký lái thử */}
            <button
              type="button"
              onClick={() => openDriveDrawer()}
              className="flex flex-col gap-[16px] items-center justify-center text-center p-[20px_24px] rounded-[12px] h-[140px] w-full bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#0562d2] hover:text-white hover:shadow-[2px_6px_12px_-1px_rgba(16,24,40,0.12),0px_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-300 group cursor-pointer border border-transparent"
            >
              <WheelIcon className="h-[32px] text-[#0562D2] group-hover:text-white transition-colors duration-300 shrink-0" />
              <h3 className="text-sm font-bold transition-colors duration-300 leading-snug uppercase">
                Đăng ký lái thử
              </h3>
            </button>

            {/* Action 2: Dự toán chi phí */}
            <button
              type="button"
              onClick={() => openQuoteDrawer()}
              className="flex flex-col gap-[16px] items-center justify-center text-center p-[20px_24px] rounded-[12px] h-[140px] w-full bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#0562d2] hover:text-white hover:shadow-[2px_6px_12px_-1px_rgba(16,24,40,0.12),0px_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-300 group cursor-pointer border border-transparent"
            >
              <CostIcon className="h-[32px] text-[#0562D2] group-hover:text-white transition-colors duration-300 shrink-0" />
              <h3 className="text-sm font-bold transition-colors duration-300 leading-snug uppercase">
                Dự toán chi phí
              </h3>
            </button>

            {/* Action 3: Ưu đãi */}
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("promotions") || document.getElementById("news") || document.getElementById("consultation");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col gap-[16px] items-center justify-center text-center p-[20px_24px] rounded-[12px] h-[140px] w-full bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#0562d2] hover:text-white hover:shadow-[2px_6px_12px_-1px_rgba(16,24,40,0.12),0px_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-300 group cursor-pointer border border-transparent"
            >
              <OfferIcon className="h-[32px] text-[#0562D2] group-hover:text-white transition-colors duration-300 shrink-0" />
              <h3 className="text-sm font-bold transition-colors duration-300 leading-snug uppercase">
                Ưu đãi
              </h3>
            </button>

            {/* Action 4: Đặt hẹn bảo dưỡng */}
            <Link
              href="/lien-he?reason=Đặt lịch hẹn bảo dưỡng"
              className="flex flex-col gap-[16px] items-center justify-center text-center p-[20px_24px] rounded-[12px] h-[140px] w-full bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#0562d2] hover:text-white hover:shadow-[2px_6px_12px_-1px_rgba(16,24,40,0.12),0px_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-300 group cursor-pointer border border-transparent"
            >
              <WrenchIcon className="h-[32px] text-[#0562D2] group-hover:text-white transition-colors duration-300 shrink-0" />
              <h3 className="text-sm font-bold transition-colors duration-300 leading-snug uppercase">
                Đặt hẹn bảo dưỡng
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SHOWROOM SECTION (#showroom) */}
      <section id="showroom" className="w-full py-16 md:py-20 bg-gray-50 scroll-mt-12">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          {/* Centered title block */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#00095B] tracking-tight">
              Dòng xe Ford Long Khánh
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Đa dạng lựa chọn từ SUV, bán tải đến xe thương mại — tất cả đều có sẵn tại showroom Long Khánh.
            </p>
          </div>

          {/* Underline tab switcher — centered */}
          <div className="flex justify-center mb-12 border-b border-gray-200 w-full">
            <div className="flex gap-8 md:gap-12">
              {(categories.length > 0
                ? [{ slug: "all", title: "Tất cả" }, ...categories]
                : [
                    { slug: "all", title: "Tất cả" },
                    { slug: "suv", title: "SUV" },
                    { slug: "pickup", title: "Bán tải" },
                    { slug: "commercial", title: "Thương mại" },
                  ]
              ).map((cat: any) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`pb-4 text-sm md:text-base font-semibold transition-all duration-300 relative cursor-pointer ${
                      isActive
                        ? "text-[#0562D2] border-b-2 border-[#0562D2] -mb-[2px]"
                        : "text-gray-500 hover:text-[#0562D2] border-b-2 border-transparent -mb-[2px]"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredVehicles.map((vehicle: any) => {
              const vehicleSlug = vehicle.slug || vehicle.id;
              const vehicleName = vehicle.title || vehicle.name;
              const vehiclePrice = vehicle.base_price || vehicle.basePrice || 0;
              const vehicleCardImage =
                vehicle.image_thumbnail_url ||
                vehicle.image_url ||
                resolveImageUrl(vehicle.image) ||
                getPopularVehicleImage(vehicleSlug, vehicle.images?.[0] || "");
              const detailHref = getVehicleLink(vehicle);

              return (
                <div
                  key={vehicle.id || vehicleSlug}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Vehicle Image */}
                  <Link href={detailHref} className="relative h-48 w-full bg-white overflow-hidden mb-4 flex items-center justify-center block cursor-pointer">
                    <SafeImage
                      src={vehicleCardImage}
                      alt={vehicleName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2"
                      unoptimized={true}
                    />
                  </Link>

                  {/* Vehicle Info */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {vehicle.type_name || (vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại")}
                    </span>
                    <Link href={detailHref} className="block group-hover:text-[#0562D2] transition-colors">
                      <h3 className="text-base md:text-lg font-black uppercase text-gray-900 tracking-tight">
                        {vehicleName}
                      </h3>
                    </Link>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-gray-500 font-medium">Giá khởi điểm:</span>
                      <span className="text-base font-extrabold text-[#0562D2]">
                        {formatPrice(vehiclePrice)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => openQuoteDrawer(vehicleSlug)}
                        className="w-full py-2.5 px-3 bg-[#0562D2] hover:bg-[#0451B0] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 text-center"
                      >
                        Báo giá lăn bánh
                      </button>
                      <Link
                        href={detailHref}
                        className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 text-center block"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TECHNOLOGY SHOWCASE (#technology) */}
      <section id="technology" className="w-full bg-[#00095b] py-20 text-white overflow-hidden relative select-none">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          <div className="max-w-[1152px] mx-auto w-full">

            {/* Title Block */}
            <div className="mb-12">
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
                Công nghệ
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-[-0.96px]">
                Khơi nguồn trải nghiệm lái hoàn hảo
              </h2>
            </div>

            {/* Tab row (Desktop columns side-by-side) */}
            <div className="hidden md:flex gap-8 mb-12">
              {techSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className="flex-1 cursor-pointer group"
                  onClick={() => {
                    setIsTechTransitioning(true);
                    setActiveTechTab(idx);
                    setIsTechInteracted(true);
                  }}
                >
                  <div className="pb-4 relative border-b border-white/10">
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${activeTechTab === idx ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                      {slide.title}
                    </h3>
                    {/* Active Indicator Line */}
                    <div
                      className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0562d2] transition-transform duration-300 origin-left ${activeTechTab === idx ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`}
                    />
                  </div>
                  <p className={`mt-4 text-sm leading-relaxed transition-opacity duration-300 ${activeTechTab === idx ? "text-white/95 font-medium" : "text-white/60 font-light"}`}>
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Tabs: horizontal scroll */}
            <div className="flex md:hidden overflow-x-auto whitespace-nowrap gap-6 pb-3 mb-6 scrollbar-none border-b border-white/10">
              {techSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsTechTransitioning(true);
                    setActiveTechTab(idx);
                    setIsTechInteracted(true);
                  }}
                  className="relative pb-2 flex-shrink-0 cursor-pointer"
                >
                  <span className={`text-base font-semibold transition-colors ${activeTechTab === idx ? "text-white" : "text-white/60"}`}>
                    {slide.title}
                  </span>
                  {activeTechTab === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0562d2]" />
                  )}
                </button>
              ))}
            </div>

            {/* Slider & Images Container */}
            <div
              className="relative w-full overflow-visible [--slide-width:80vw] md:[--slide-width:760px]"
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.matchMedia("(pointer: fine)").matches) {
                  setIsTechHovered(true);
                }
              }}
              onMouseLeave={() => {
                setIsTechHovered(false);
                handleTechEnd();
              }}
              onMouseDown={(e) => handleTechStart(e.clientX)}
              onMouseMove={(e) => handleTechMove(e.clientX)}
              onMouseUp={handleTechEnd}
              onTouchStart={(e) => {
                handleTechStart(e.touches[0].clientX);
              }}
              onTouchMove={(e) => handleTechMove(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                handleTechEnd();
              }}
            >
              <div
                className="flex gap-6 cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(calc(-${activeTechTab} * (var(--slide-width) + 24px) + ${techDragOffset}px))`,
                  transition: isTechDragging.current ? "none" : (isTechTransitioning ? "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)" : "none"),
                }}
              >
                {techSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    onDragStart={(e) => e.preventDefault()}
                    className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-[#121824] flex-shrink-0 w-[var(--slide-width)] transition-all duration-300 select-none border border-white/5 shadow-2xl"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 768px) 80vw, 760px"
                      className="object-cover pointer-events-none group-hover:scale-103 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Slide fraction indicator */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full select-none">
                      {idx + 1}/{techSlides.length}
                    </div>

                    {/* Category tag */}
                    <div className="absolute bottom-4 left-4 bg-[#0562d2] text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase select-none">
                      {slide.category}
                    </div>

                    {/* Chevron navigation buttons */}
                    {activeTechTab === idx && idx < techSlides.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTechTransitioning(true);
                          setActiveTechTab((prev) => prev + 1);
                          setIsTechInteracted(true);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg z-20 group-hover:scale-110 active:scale-95"
                        aria-label="Next tech slide"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    )}

                    {activeTechTab === idx && idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTechTransitioning(true);
                          setActiveTechTab((prev) => prev - 1);
                          setIsTechInteracted(true);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg z-20 group-hover:scale-110 active:scale-95"
                        aria-label="Previous tech slide"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Description */}
            <div className="block md:hidden mt-6 text-white/80 text-sm leading-relaxed min-h-[60px] transition-all duration-300">
              <p key={activeTechTab} className="reveal-on-scroll">
                {techSlides[activeTechTab].description}
              </p>
            </div>

            {/* CTA action button */}
            <div className="mt-8 flex justify-start">
              <button
                type="button"
                onClick={() => openDriveDrawer()}
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white border border-white text-white hover:text-[#00095b] px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-md group cursor-pointer"
              >
                <span>Trải nghiệm ngay</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TEST DRIVE BANNER — Figma: inside Section 4, 1152x320px, bg-[#0562d2] + gradient, rounded-12px */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          <div
            className="relative overflow-hidden rounded-xl h-[320px] p-8 flex items-center"
            style={{ backgroundColor: '#0562d2', backgroundImage: 'linear-gradient(-53.316deg, rgba(0,9,91,0) 31.896%, rgba(0,9,91,0.8) 83.827%)' }}
          >
            {/* Background wheel image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={siteAssets.testDriveBg}
                alt="Đăng ký lái thử xe Ford tại Long Khánh Ford"
                fill
                className="object-cover object-right"
                onError={handleImageError}
              />
              {/* Gradient overlay per Figma */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(-53.316deg, rgba(0,9,91,0) 31.896%, rgba(0,9,91,0.8) 83.827%)' }} />
            </div>
            {/* Content — Figma: max-w-480px, gap-24, z-10 */}
            <div className="relative z-10 flex flex-col gap-6 max-w-[480px]">
              {/* Figma: 36px Semibold white, lh 1.32 */}
              <h2 className="text-3xl font-semibold text-white leading-[1.32]">
                Trực tiếp trải nghiệm các dòng xe FORD
              </h2>
              {/* Figma: white bg, border #d6d6d6, text #424242, px-24 py-10, rounded-full, 18px semibold */}
              <div>
                <button
                  type="button"
                  onClick={() => openDriveDrawer()}
                  className="inline-block px-6 py-[10px] rounded-full bg-white border border-[#d6d6d6] text-[#424242] text-lg font-semibold tracking-[0.18px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-[#0562d2] hover:text-white hover:border-[#0562d2]"
                >
                  Hẹn lái thử
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SERVICES CAROUSEL — Continuous Infinite Scrolling Marquee */}
      <section id="services" className="w-full bg-[#f0f0f0] py-[72px] overflow-x-clip scroll-mt-12">
        <div className="w-full">
          {/* Header row: title left */}
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] mb-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-[-0.96px] leading-[1.2]">
                Các dịch vụ của chúng tôi
              </h2>
              <p className="text-base text-[#424242] leading-relaxed">
                Các giải pháp dịch vụ toàn diện, tận tâm và chính hãng từ Long Khánh Ford.
              </p>
            </div>
          </div>

          {/* Vehicle cards sliding container — continuous infinite marquee */}
          {servicesList.length > 0 ? (
            <div className="relative w-full overflow-hidden py-4 select-none">
              <div className="animate-marquee-continuous gap-[var(--card-gap-service)]">
                {[...servicesList, ...servicesList].map((srv, idx) => {
                  const sTitle = srv.title;
                  const sImg = resolveImageUrl(srv.image?.url || srv.image_url || srv.image) || "/service-support-customer.jpg";
                  const sHref = (srv.custom_link && srv.custom_link.startsWith('/dich-vu/'))
                    ? srv.custom_link
                    : `/dich-vu/${srv.slug}`;
                  return (
                    <div
                      key={`${srv.id}-${idx}`}
                      onClick={() => {
                        router.push(sHref);
                      }}
                      className="relative overflow-hidden rounded-xl h-[480px] group cursor-pointer bg-[#121824] flex-shrink-0 transition-all duration-300 block"
                      style={{
                        width: 'var(--card-width-service)',
                      }}
                    >
                      <Image
                        src={sImg}
                        alt={sTitle}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 500px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-[1.2]">{sTitle}</h3>
                        {srv.description && (
                          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-normal">
                            {srv.description}
                          </p>
                        )}
                        <div className="flex flex-row gap-2 sm:gap-3 mt-2">
                          <span className="bg-[#0562D2] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#044ea7] transition-all duration-200 whitespace-nowrap text-center">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#e5e5e5] rounded-[12px] max-w-[1152px] mx-auto">
              <p className="text-gray-500 text-sm">Đang tải danh sách dịch vụ...</p>
            </div>
          )}
        </div>
      </section>

      {/* 6.5. XE ĐÃ QUA SỬ DỤNG CHÍNH HÃNG (FORD ASSURED SLIDER) */}
      <LdpUsedVehiclesBlock
        salesConsultant={salesConsultant}
        landingPageId={landingPageId}
        salesEmail={salesEmail}
        openQuoteDrawer={openQuoteDrawer}
        anchorId="used-vehicles"
      />

      {/* 7. NEWS & PROMOTION */}
      <section id="news" className="w-full bg-[#00095b] py-20 scroll-mt-12">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          <div className="max-w-[1152px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-[32px] md:text-[36px] text-white font-semibold leading-tight">
                  Điều gì đang diễn ra tại Long Khánh Ford
                </h2>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 justify-start mb-10">
              {[
                { id: 3, label: "Tin tức khuyến mãi" },
                { id: 1, label: "Tin tức Long Khánh Ford" },
                { id: 4, label: "Chia sẻ kiến thức" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveNewsTab(tab.id);
                  }}
                  className={`px-6 py-2.5 rounded-[4px] text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer border ${activeNewsTab === tab.id
                      ? "bg-white text-[#00095b] border-white"
                      : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white border-white/20"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {homeArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full text-[#1a1a1a]">

                {/* Left Column: 1 Featured Large Card */}
                {homeArticles[0] && (
                  <div className="lg:col-span-5 flex animate-fade-in">
                    <Link
                      href={`/${homeArticles[0].id}`}
                      className="bg-white rounded-[12px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col w-full group"
                    >
                      {/* Image container */}
                      <div className="aspect-[16/10] relative overflow-hidden w-full bg-gray-100 flex-shrink-0">
                        <img
                          src={homeArticles[0].image}
                          alt={homeArticles[0].imageAlt || homeArticles[0].title}
                          className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          onError={handleImageError}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-slate-600 font-medium">
                              Ngày đăng: {formatDate(homeArticles[0].published_at)}
                            </span>
                            {homeArticles[0].category?.title && (
                              <span className="bg-[#E03A3A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                {homeArticles[0].category.title}
                              </span>
                            )}
                          </div>

                          <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-lg sm:text-xl text-[#1a1a1a] group-hover:text-[#0562d2] transition-colors duration-200 line-clamp-2 leading-snug">
                            {homeArticles[0].title}
                          </h3>

                          {homeArticles[0].description && (
                            <p className="text-sm text-[#424242]/80 leading-relaxed line-clamp-3 font-normal">
                              {homeArticles[0].description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 flex items-center text-sm font-bold text-[#0562d2] group-hover:underline">
                          Xem chi tiết <span className="ml-1">&rsaquo;</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Right Column: 3 Horizontal Cards */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {homeArticles.slice(1, 4).map((art) => (
                    <Link
                      key={art.id}
                      href={`/${art.id}`}
                      className="bg-white rounded-[12px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row w-full group min-h-[160px] animate-fade-in"
                    >
                      {/* Left: Image (stacked on mobile) */}
                      <div className="w-full sm:w-[280px] aspect-[16/10] sm:aspect-auto sm:h-full relative overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={art.image}
                          alt={art.imageAlt || art.title}
                          className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          onError={handleImageError}
                        />
                      </div>

                      {/* Right: Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-slate-600 font-medium">
                              Ngày đăng: {formatDate(art.published_at)}
                            </span>
                            {art.category?.title && (
                              <span className="bg-[#E03A3A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                {art.category.title}
                              </span>
                            )}
                          </div>

                          <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[15px] sm:text-base text-[#1a1a1a] group-hover:text-[#0562d2] transition-colors duration-200 line-clamp-2 leading-snug">
                            {art.title}
                          </h3>

                          {art.description && (
                            <p className="text-xs text-[#424242]/80 leading-relaxed line-clamp-2 font-normal">
                              {art.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center text-xs font-bold text-[#0562d2] group-hover:underline">
                          Xem chi tiết <span className="ml-1">&rsaquo;</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[12px] w-full">
                <p className="text-white/50 text-sm">Đang tải danh sách tin tức...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER HANDOVER (TRI ÂN KHÁCH HÀNG) — Continuous Infinite Scrolling Marquee */}
      {customerHandovers.length > 0 && (
        <section id="customer-handovers" className="w-full bg-white py-[72px] overflow-x-clip relative select-none border-b border-gray-100">
          <style dangerouslySetInnerHTML={{
            __html: `
            #customer-handovers {
              --card-width-handover: 360px;
              --card-gap-handover: 24px;
            }
            @media (max-width: 640px) {
              #customer-handovers {
                --card-width-handover: 280px;
                --card-gap-handover: 16px;
              }
            }
          ` }} />
          <div className="w-full">
            {/* Header row: title left */}
            <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] mb-8">
              <div className="space-y-2 max-w-4xl">
                <span className="text-xs font-semibold text-[#0562d2] uppercase tracking-wider block mb-2">
                  Tri ân khách hàng
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1a1a1a] tracking-tight leading-tight uppercase">
                  CHÚC MỪNG & CẢM ƠN QUÝ KHÁCH HÀNG ĐÃ LỰA CHỌN LONG KHÁNH FORD
                </h2>
              </div>
            </div>

            {/* Slider track container — continuous infinite marquee */}
            <div className="relative w-full overflow-hidden py-4 select-none">
              <div
                className="animate-marquee-continuous gap-[var(--card-gap-handover,24px)]"
              >
                {[...customerHandovers, ...customerHandovers].map((item, idx) => {
                  const originalIdx = idx % customerHandovers.length;
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => {
                        setLightboxIndex(originalIdx);
                      }}
                      className="relative overflow-hidden rounded-xl aspect-[4/3] group cursor-pointer bg-gray-100 flex-shrink-0 transition-all duration-300 block shadow-sm hover:shadow-md border border-gray-100"
                      style={{
                        width: "var(--card-width-handover, 360px)",
                      }}
                    >
                      <Image
                        src={resolveImageUrl(item.image_url || item.image?.url || item.image) || "/assets/customer_handover_everest.webp"}
                        alt={item.title || "Tri ân khách hàng"}
                        fill
                        sizes="(max-width: 768px) 280px, 360px"
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                        onError={handleImageError}
                      />

                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-white text-base font-semibold leading-snug transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-xs mt-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          Xem phóng to hình ảnh
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 9. FAQ ACCORDION (FIGMA SECTION 8) */}
      <section className="w-full bg-[#F8F9FA] border-y border-gray-200 py-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column: Title */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-3xl lg:text-[48px] font-semibold text-[#1a1a1a] leading-tight tracking-tight max-w-[341px]">
              Các câu hỏi <span className="text-[#0562D2]">thường gặp</span>
            </h2>
          </div>

          {/* Right Column: Accordions list */}
          <div className="lg:col-span-8 flex flex-col gap-4 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden border transition-all duration-300 bg-white rounded-xl group ${isOpen
                    ? "border-[#00095B] shadow-md -translate-y-0.5"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                >
                  {/* Title Toggle trigger */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className={`w-full flex items-center justify-between text-left transition-all duration-300 cursor-pointer select-none px-6 py-5 gap-4 ${isOpen
                      ? "bg-[#00095B] text-white"
                      : "bg-white text-[#1A1A1A] hover:bg-gray-50/50"
                      }`}
                  >
                    <span className="text-base md:text-lg font-bold tracking-tight leading-snug pr-4">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-white flex-shrink-0 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#00095B] flex-shrink-0 transition-transform duration-300" />
                    )}
                  </button>

                  {/* Body Content with Smooth Height Transition */}
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                    <div className="overflow-hidden bg-white">
                      <p className="px-6 py-5 text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-100">
                        {faq.a}
                      </p>
                    </div>
                  </div>

                  {/* Absolute Bottom Blue Underline */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#0562D2] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`} />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. OUR STORY / BRAND SECTION (#our-story) */}
      <section id="our-story" className="bg-[#00095b]">
        {/* Top Banner */}
        <div className="w-full h-[547px] relative">
          <Image
            src={siteAssets.ourStoryBanner}
            alt="Long Khánh Ford Office"
            fill
            className="object-cover"
          />
          {/* Navy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00095b]/35 to-[#00095b]" />
        </div>

        {/* Bottom content section */}
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pb-20 pt-10">
          <div className="max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-20 items-center justify-between">
            {/* Left Column: Bio */}
            <div className="lg:w-[457px] flex flex-col items-start gap-12 text-white">
              <div className="space-y-4">
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">OUR STORY</span>
                <h2 className="text-[36px] font-semibold uppercase leading-tight tracking-tight text-white">
                  GIỚI THIỆU ĐÔI NÉT VỀ <br />
                  <span className="text-white">LONG KHÁNH FORD</span>
                </h2>
                <p className="text-[16px] text-white/80 leading-relaxed font-normal">
                  Công Ty TNHH Dịch Vụ Thương Mại Ô Tô Tấn Phát với tên giao dịch là LONG KHÁNH FORD là đại lý ủy quyền chính thức của Ford Việt Nam tại TP. Long Khánh, Tỉnh Đồng Nai. Showroom được đầu tư xây dựng hiện đại đạt tiêu chuẩn Signature toàn cầu của Ford Motor, mang lại không gian mua sắm và chăm sóc dịch vụ đẳng cấp cho khách hàng.
                </p>
              </div>

              <div>
                <Link
                  href="/gioi-thieu"
                  className="border border-white hover:bg-white hover:text-[#00095b] text-white text-[16px] px-8 py-2.5 rounded-full transition-colors cursor-pointer font-semibold inline-block"
                >
                  Về chúng tôi
                </Link>
              </div>
            </div>

            {/* Right Column: Grid of 4 Cards */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-[615px] h-[520px]">
              {/* Card 1: Bề dày thành tích */}
              <div 
                onMouseEnter={() => setActiveStoryCard(0)}
                className={`px-6 py-8 flex flex-col justify-between h-full rounded-[4px] cursor-pointer transition-all duration-300 ${
                  activeStoryCard === 0
                    ? "bg-white border-t-[6px] border-[#066fef] shadow-xl text-[#424242] -translate-y-1.5"
                    : "bg-white/10 border-t-[6px] border-transparent text-white hover:bg-white/20"
                }`}
              >
                <div className="space-y-2">
                  <h3 className={`text-[18px] font-semibold uppercase tracking-wider leading-tight transition-colors duration-300 ${
                    activeStoryCard === 0 ? "text-[#0562d2]" : "text-white"
                  }`}>
                    Bề dày thành tích
                  </h3>
                  <p className={`text-[14px] leading-relaxed font-normal transition-colors duration-300 ${
                    activeStoryCard === 0 ? "text-[#424242]/90" : "text-white/90"
                  }`}>
                    Là một trong những đại lý tiêu biểu của Công ty ô tô Ford Việt Nam với nhiều giải thưởng xuất sắc về thị phần và dịch vụ.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Award className={`w-8 h-8 transition-colors duration-300 ${
                    activeStoryCard === 0 ? "text-[#0562d2]" : "text-white/70"
                  }`} />
                </div>
              </div>

              {/* Card 2: Quy mô lớn tại VN */}
              <div 
                onMouseEnter={() => setActiveStoryCard(1)}
                className={`px-6 py-8 flex flex-col justify-between h-full rounded-[4px] cursor-pointer transition-all duration-300 ${
                  activeStoryCard === 1
                    ? "bg-white border-t-[6px] border-[#066fef] shadow-xl text-[#424242] -translate-y-1.5"
                    : "bg-white/10 border-t-[6px] border-transparent text-white hover:bg-white/20"
                }`}
              >
                <div className="space-y-2">
                  <h3 className={`text-[18px] font-semibold uppercase tracking-wider leading-tight transition-colors duration-300 ${
                    activeStoryCard === 1 ? "text-[#0562d2]" : "text-white"
                  }`}>
                    Quy mô lớn tại VN
                  </h3>
                  <p className={`text-[14px] leading-relaxed font-normal transition-colors duration-300 ${
                    activeStoryCard === 1 ? "text-[#424242]/90" : "text-white/90"
                  }`}>
                    Sở hữu diện tích sàn lớn nhất vùng Đông Nam Bộ, trang thiết bị đồng bộ đạt tiêu chuẩn xưởng Signature quốc tế.
                  </p>
                </div>
                <div className="flex justify-end">
                  <ShieldCheck className={`w-8 h-8 transition-colors duration-300 ${
                    activeStoryCard === 1 ? "text-[#0562d2]" : "text-white/70"
                  }`} />
                </div>
              </div>

              {/* Card 3: Nhân sự chất lượng */}
              <div 
                onMouseEnter={() => setActiveStoryCard(2)}
                className={`px-6 py-8 flex flex-col justify-between h-full rounded-[4px] cursor-pointer transition-all duration-300 ${
                  activeStoryCard === 2
                    ? "bg-white border-t-[6px] border-[#066fef] shadow-xl text-[#424242] -translate-y-1.5"
                    : "bg-white/10 border-t-[6px] border-transparent text-white hover:bg-white/20"
                }`}
              >
                <div className="space-y-2">
                  <h3 className={`text-[18px] font-semibold uppercase tracking-wider leading-tight transition-colors duration-300 ${
                    activeStoryCard === 2 ? "text-[#0562d2]" : "text-white"
                  }`}>
                    Nhân sự chất lượng
                  </h3>
                  <p className={`text-[14px] leading-relaxed font-normal transition-colors duration-300 ${
                    activeStoryCard === 2 ? "text-[#424242]/90" : "text-white/90"
                  }`}>
                    Đội ngũ kỹ sư, tư vấn viên đào tạo bài bản và được cấp chứng chỉ chuẩn chỉnh từ tập đoàn Ford Việt Nam.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Users className={`w-8 h-8 transition-colors duration-300 ${
                    activeStoryCard === 2 ? "text-[#0562d2]" : "text-white/70"
                  }`} />
                </div>
              </div>

              {/* Card 4: Hài lòng khách hàng */}
              <div 
                onMouseEnter={() => setActiveStoryCard(3)}
                className={`px-6 py-8 flex flex-col justify-between h-full rounded-[4px] cursor-pointer transition-all duration-300 ${
                  activeStoryCard === 3
                    ? "bg-white border-t-[6px] border-[#066fef] shadow-xl text-[#424242] -translate-y-1.5"
                    : "bg-white/10 border-t-[6px] border-transparent text-white hover:bg-white/20"
                }`}
              >
                <div className="space-y-2">
                  <h3 className={`text-[18px] font-semibold uppercase tracking-wider leading-tight transition-colors duration-300 ${
                    activeStoryCard === 3 ? "text-[#0562d2]" : "text-white"
                  }`}>
                    Hài lòng khách hàng
                  </h3>
                  <p className={`text-[14px] leading-relaxed font-normal transition-colors duration-300 ${
                    activeStoryCard === 3 ? "text-[#424242]/90" : "text-white/90"
                  }`}>
                    Luôn cải tiến quy trình phục vụ, tối ưu thủ tục mua xe trả góp và đẩy mạnh dịch vụ giao xe tại nhà.
                  </p>
                </div>
                <div className="flex justify-end">
                  <CheckCircle className={`w-8 h-8 transition-colors duration-300 ${
                    activeStoryCard === 3 ? "text-[#0562d2]" : "text-white/70"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FLOATING SALES CONSULTANT WIDGET */}
      {/* Đã hạ vị trí bottom về mép dưới sau khi bỏ sticky bottom bar */}
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 md:right-6 z-[99] flex flex-col items-end gap-2.5">
        {finalZaloUrl && (
          <a
            href={finalZaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-[#0068ff] hover:bg-[#0057d6] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30"
            title="Chat Zalo"
          >
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center">
              <ZaloIcon className="w-full h-full" />
            </div>
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Liên hệ Zalo</span>
          </a>
        )}

        {salesConsultant?.phone && (
          <a
            href={`tel:${salesConsultant.phone}`}
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Hotline: {salesConsultant.phone}</span>
          </a>
        )}
      </div>

      {/* GLASSMORPHIC LIGHTBOX OVERLAY */}
      {lightboxIndex !== null && customerHandovers.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-all duration-300 select-none"
          style={{ zIndex: 9999 }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + customerHandovers.length) % customerHandovers.length : null))}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % customerHandovers.length : null))}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Content Wrapper */}
          <div className="relative w-full max-w-[1200px] h-full max-h-[80vh] flex flex-col items-center justify-center">
            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={customerHandovers[lightboxIndex].image_url}
                alt={customerHandovers[lightboxIndex].title || "Tri ân khách hàng"}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>

            {/* Title / Description */}
            <div className="mt-6 text-center max-w-2xl px-4">
              <h3 className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow-md">
                {customerHandovers[lightboxIndex].title}
              </h3>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider font-semibold">
                LONG KHÁNH FORD
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LdpHomeClient(props: LdpHomeClientProps) {
  const { salesConsultant, allVehicles = [], leadVehicle, landingPageId, salesEmail } = props;

  return (
    <VehicleLayoutClient
      initialVehicle={leadVehicle || allVehicles[0]}
      allVehicles={allVehicles}
      salesConsultantId={salesConsultant?.id}
      salesEmail={salesEmail || salesConsultant?.email}
      landingPageId={typeof landingPageId === "string" ? parseInt(landingPageId, 10) : landingPageId}
    >
      <LdpHomeInner {...props} />
    </VehicleLayoutClient>
  );
}
