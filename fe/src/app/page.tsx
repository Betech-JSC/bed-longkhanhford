"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X,
  Users,
  Plus,
  Minus,
  MapPin,
  Mail,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { vehicles, Vehicle } from "@/data/vehicles";
import { getPopularVehicleImage, siteAssets, handleImageError } from "@/lib/site-assets";
import { bannersAPI, postsAPI, vehiclesAPI, servicesAPI, customerHandoversAPI } from "@/lib/api";
import { motion } from "motion/react";
import SafeImage from "@/components/shared/SafeImage";
import Button from "@/components/shared/Button";

// Custom SVG Icons matching Figma and Ford China design
const WheelIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 0C7.16 0 0 7.16 0 16c0 8.84 7.16 16 16 16s16-7.16 16-16C32 7.16 24.84 0 16 0zm0 3.2c5.27-.02 10.01 3.22 11.91 8.13-3.74-1.68-7.81-2.54-11.91-2.5-4.1-.04-8.17.82-11.91 2.5C5.99 6.42 10.73 3.18 16 3.2zm-2.64 28.52c-5.57-1.19-9.69-5.91-10.12-11.59 4.78 0 10.12 6.36 10.12 11.59zm2.64-10.13c-1.33 0-2.4-1.07-2.4-2.4 0-1.33 1.07-2.4 2.4-2.4s2.4 1.07 2.4 2.4c0 1.33-1.07 2.4-2.4 2.4zm2.64 10.13c0-5.23 5.34-11.59 10.12-11.59-.43 5.68-4.55 10.4-10.12 11.59z" fill="currentColor" />
  </svg>
);

const CostIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M26.81 7.61c-.08-1.93-1.39-3.85-3.95-5.33C17.61-.76 9.12-.76 3.9 2.28 1.28 3.8 0 5.78 0 7.77v4.1v4.1v4.1v4.23c.01 1.99 1.33 3.98 3.96 5.5 2.63 1.51 6.07 2.27 9.5 2.27 3.43 0 6.86-.76 9.47-2.27 2.6-1.51 3.9-3.5 3.88-5.5v-4.1V16.04v-4.1V7.77V7.61zm-20.45.41c.39-.13.79-.26 1.2-.39.29-.09.46-.11.58-.04.07.04.13.11.19.22.27.5.7 1.04 1.25 1.45.1.07.2.14.3.2.3.17.64.3 1.03.39 1 .22 1.92-.18 1.81-.8-.04-.21-.14-.42-.27-.61-.35-.51-.78-.81-1.02-1.35-.38-.87-.2-1.65.99-2.27 1.37-.7 2.9-.75 4.52-.31.66.18.66.19 1.16-.1.18-.11.35-.2.53-.3.38-.21.51-.21.91 0 .04.02.08.05.12.07.08.04.16.09.24.13.06.04.12.08.17.11.65.37.59.4-.17.84-.57.34-.57.34-.08.72.37.29.66.61.89.95.12.19.05.33-.26.43-.45.14-.89.29-1.35.43-.28.08-.44.1-.57.02-.07-.04-.12-.1-.18-.2-.29-.49-.75-.85-1.37-1.2-.08-.05-.16-.09-.24-.14-.2-.1-.4-.19-.65-.25-.87-.2-1.64.13-1.53.67.05.27.2.54.38.79.32.44.65.88.88 1.34.74 1.46-.86 2.9-3.4 3.04-.92.05-1.79-.07-2.6-.33-.35-.12-.62-.11-.89.06-.27.17-.56.33-.85.48-.25.14-.5.15-.75.01-.16-.08-.31-.17-.46-.26-.15-.09-.3-.18-.45-.27-.26-.16-.23-.32.02-.47.2-.12.4-.24.61-.36.44-.26.45-.28.08-.57-.47-.37-.89-.76-1.15-1.2-.22-.33-.17-.41.37-.59zm18.61 16.22c.01 1.37-1.07 2.78-2.97 3.88-2.25 1.31-5.28 2.03-8.54 2.03S4.3 29.44 2.04 28.13C.12 27.02-.98 25.6-1 24.24v-.2c.57.57 1.26 1.11 2.1 1.59 2.63 1.52 6.07 2.27 9.5 2.27s6.86-.75 9.47-2.27c.82-.47 1.48-.99 2.04-1.55v.16zm0-4.1c.01 1.37-1.07 2.78-2.97 3.88-2.25 1.31-5.28 2.03-8.54 2.03s-6.3-.72-8.56-2.03C.12 22.92-.98 21.5-1 20.14v-.2c.57.57 1.26 1.11 2.1 1.59 2.63 1.52 6.07 2.27 9.5 2.27s6.86-.75 9.47-2.27c.82-.47 1.48-.99 2.04-1.55v.16zm0-4.1c.01 1.37-1.07 2.78-2.97 3.88-2.25 1.31-5.28 2.03-8.54 2.03s-6.3-.72-8.56-2.03C.12 18.82-.98 17.4-1 16.04v-.2c.57.57 1.26 1.11 2.1 1.59 2.63 1.52 6.07 2.27 9.5 2.27s6.86-.75 9.47-2.27c.82-.47 1.48-.99 2.04-1.55v.16zm0-4.1c.01 1.37-1.07 2.78-2.97 3.88-2.25 1.31-5.28 2.03-8.54 2.03s-6.3-.72-8.56-2.03C.12 14.72-.98 13.3-1 11.94v-.27c.57.57 1.26 1.11 2.1 1.59 5.25 3.03 13.74 3.03 18.97 0 .82-.47 1.48-.99 2.04-1.55v.24h-.01z" fill="currentColor" />
  </svg>
);

const OfferIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.17 4.71c-.46 0-.96.16-1.31.55-.46.51-.6 2.05-.58 2.83.77.02 2.24 0 2.83-.59.62-.62.79-1.7.13-2.36-.29-.29-.67-.43-1.07-.43zM7.3 4.71c.46 0 .96.16 1.31.55.46.51.6 2.05.58 2.83-.77.02-2.24 0-2.83-.59-.62-.62-.79-1.7-.13-2.36C6.52 5 6.9 4.71 7.3 4.71zM15.69 3.68c1.17 1.16 1.32 3 0.52 4.41H32V2.93C32 1.31 30.69 0 29.06 0H11.26v3.16c1.44-.81 3.26-.65 4.43.52zM6.96 13.85L5.5 12.41 7.76 10.14H0v9.5c0 1.61 1.31 2.92 2.94 2.92h6.27V11.6l-2.25 2.25zm5.74-3.71l2.23 2.25-1.46 1.44-2.21-2.23v10.96h17.8c1.62 0 2.94-1.31 2.94-2.93v-9.5H12.7zm-8.45-2.06c-.8 1.41-.64 3.24.53 4.4 1.17 1.17 2.99 1.33 4.43.52V0H2.94C1.31 0 0 1.31 0 2.93v5.16h4.25z" fill="currentColor" />
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.86 7.12C19.6 2.51 24.44-1.52 28.74.56l-3.1 3.1 0.67 1.99 1.99 0.67 3.1-3.1c2.08 4.3-1.94 9.15-6.55 7.89l-13.74 13.78c1.26 4.61-3.58 8.63-7.88 6.55L6.32 28.34l-.67-1.99-1.99-.67L0.56 28.78c-2.08-4.3 1.94-9.15 6.55-7.89l13.75-13.77zm4.02 13.77c.47-.12.96-.19 1.46-.19 7.48.27 7.48 11.01 0 11.28-3.66.06-6.44-3.59-5.45-7.1l-3.57-3.57 3.98-4 0.64 0.64c.64.63 2.3 2.3 2.94 2.94zm-.02 3.97l-.54 2.03 1.49 1.49 2.03-.55 0.54-2.03-1.49-1.49-2.03.55zm-19.2-24.85c3.66-.06 6.44 3.59 5.45 7.1l3.55 3.55-3.98 4-3.56-3.56c-.47.12-.96.19-1.46.19-7.48-.28-7.48-11.02 0-11.28zm-1.49 4.16l-.54 2.03 1.49 1.49 2.03-.55 0.54-2.03-1.49-1.49-2.03.55z" fill="currentColor" />
  </svg>
);

// FAQs Data
const faqs = [
  {
    q: "Điều gì tạo nên sự nổi bật thương hiệu Long Khánh Ford?",
    a: "Long Khánh Ford tự hào là đại lý ủy quyền chính thức mới nhất của Ford Việt Nam tại Đồng Nai với cơ sở vật chất đạt tiêu chuẩn toàn cầu Signature mới nhất, cùng đội ngũ nhân sự chuyên môn nghiệp vụ cao và quy trình phục vụ tận tâm."
  },
  {
    q: "Sự đột phá trong thiết kế xe Ford thế hệ mới",
    a: "Các dòng xe Ford thế hệ mới sở hữu ngôn ngữ thiết kế mạnh mẽ, cơ bắp đặc trưng kết hợp với công nghệ thông minh hàng đầu. Khoang nội thất được tối ưu hóa tối đa diện tích sử dụng cùng hệ thống giải trí SYNC 4 hiện đại."
  },
  {
    q: "Chất lượng dịch vụ hậu mãi xuất sắc",
    a: "Chúng tôi cam kết hỗ trợ khách hàng suốt vòng đời xe: cứu hộ khẩn cấp 24/7, hotline hỗ trợ kỹ thuật trực tiếp, dịch vụ bảo dưỡng nhanh 60 phút, nhận giao xe bảo dưỡng tận nhà, và phòng chờ VIP tiêu chuẩn khách sạn."
  },
  {
    q: "Cam kết bảo vệ môi trường",
    a: "Long Khánh Ford ứng dụng các công nghệ sơn và sửa chữa thân vỏ thân thiện với môi trường, sử dụng hệ thống xử lý chất thải đạt chuẩn và tích cực thúc đẩy các dòng xe tiết kiệm nhiên liệu thế hệ mới từ Ford."
  },
  {
    q: "Các chương trình ưu đãi và khuyến mãi tại Long Khánh Ford",
    a: "Chúng tôi luôn mang đến các chương trình ưu đãi giá bán hấp dẫn, tặng gói phụ kiện chính hãng cao cấp, hỗ trợ trả góp lãi suất thấp thủ tục nhanh chóng, cùng nhiều phần quà giá trị cho khách hàng đặt mua xe sớm."
  },
  {
    q: "Đội ngũ kỹ thuật viên lành nghề và chuyên nghiệp",
    a: "100% kỹ thuật viên và tư vấn bán hàng của chúng tôi đều trải qua các khóa đào tạo khắt khe và đạt chứng chỉ từ Ford Việt Nam, sẵn sàng lắng nghe và giải đáp mọi yêu cầu của quý khách hàng."
  }
];

const quickActions = [
  {
    title: "Đăng ký lái thử",
    reason: "Đăng ký lái thử",
    note: "Tôi muốn đặt lịch đăng ký lái thử xe Ford tại Long Khánh.",
    icon: WheelIcon,
  },
  {
    title: "Dự toán chi phí",
    reason: "Dự toán chi phí",
    note: "Tôi muốn dự toán chi phí lăn bánh cho các dòng xe Ford.",
    icon: CostIcon,
  },
  {
    title: "Ưu đãi đặc biệt",
    reason: "Nhận chương trình ưu đãi",
    note: "Tôi muốn đăng ký nhận danh sách ưu đãi và quà tặng hiện có tại đại lý.",
    icon: OfferIcon,
  },
  {
    title: "Đặt hẹn bảo dưỡng",
    reason: "Đặt lịch hẹn bảo dưỡng",
    note: "Tôi muốn đặt lịch hẹn bảo dưỡng xe Ford chính hãng.",
    icon: WrenchIcon,
  },
];

const techItems = [
  {
    title: "Kết nối thông minh FordPass™",
    description: "Kết nối điện thoại của bạn với xe Ford thế hệ mới để khởi động từ xa, định vị xe, kiểm tra áp suất lốp và mức nhiên liệu trực quan ngay trên ứng dụng di động.",
    image: "/assets/tech_fordpass.png",
    buttonText: "Khám phá ứng dụng",
    link: "/lien-he"
  },
  {
    title: "An toàn chủ động Co-Pilot360™",
    description: "Hệ thống hỗ trợ người lái tiên tiến trên các dòng xe Ford mới giúp bạn tự tin di chuyển nhờ cảnh báo va chạm, giữ làn đường và hỗ trợ đỗ xe chủ động.",
    image: "/assets/tech_copilot360.png",
    buttonText: "Đăng ký lái thử",
    link: "/dang-ky-lai-thu"
  },
  {
    title: "Khoang lái hiện đại SYNC® 4",
    description: "Màn hình cảm ứng cỡ lớn tích hợp bản đồ dẫn đường thông minh, kết nối không dây Apple CarPlay / Android Auto cùng tính năng ra lệnh giọng nói tiện lợi.",
    image: "/assets/territory-tech-split.png",
    buttonText: "Nhận báo giá xe",
    link: "/lien-he"
  }
];

const INITIAL_BRAND_ITEMS = [
  {
    title: "Ford Everest",
    category: "Ford Everest Mới",
    slogan: "Dấn Bước. Dẫn Đầu.",
    description: "Dòng SUV 7 chỗ sang trọng và mạnh mẽ hàng đầu, trang bị động cơ Bi-Turbo tối tân cùng hệ dẫn động 2 cầu chủ động giúp bạn tự tin chinh phục mọi cung đường hiểm trở.",
    image: "/assets/everest_platinum.png",
    link: "/lien-he"
  },
  {
    title: "Ford Ranger",
    category: "Ford Ranger Mới",
    slogan: "Bản Lĩnh. Thách Thức.",
    description: "Vua bán tải - Thiết kế cơ bắp, thông minh và vô cùng bền bỉ. Đáp ứng hoàn hảo từ nhu cầu chuyên chở công việc cho đến những hành trình khám phá mạo hiểm.",
    image: "/assets/ranger_wildtrak.png",
    link: "/lien-he"
  },
  {
    title: "Ford Territory",
    category: "Ford Territory Mới",
    slogan: "Thông Minh. Tiện Nghi.",
    description: "SUV 5 chỗ thông minh mang đậm hơi thở đô thị. Thiết kế sang trọng, không gian cabin kỹ thuật số hiện đại cùng gói công nghệ an toàn chủ động Co-Pilot360™.",
    image: "/assets/territory-hero.png",
    link: "/lien-he"
  },
  {
    title: "Ford Transit",
    category: "Ford Transit Mới",
    slogan: "Giải Pháp Vận Chuyển Chuyên Nghiệp.",
    description: "Giải pháp vận chuyển hành khách chuyên nghiệp thế hệ mới. Tiết kiệm nhiên liệu vượt trội, khoang lái rộng rãi tích hợp các trang bị tiện nghi cao cấp đạt chuẩn 5 sao.",
    image: "/assets/transit-hero.png",
    link: "/lien-he"
  }
];



export default function Home() {
  const router = useRouter();

  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [homeArticles, setHomeArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [brandItems, setBrandItems] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [customerHandovers, setCustomerHandovers] = useState<any[]>([]);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState(0);

  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => setIsFading(false), 200);
    return () => clearTimeout(timer);
  }, [activeCarIndex, selectedCategory]);

  // Helper to extract vehicle specifications
  const getVehicleSpecsForShowcase = (vehicle: any) => {
    let engine = "Đang cập nhật";
    let seats = "5-7 Chỗ";
    let transmission = "Tự động";

    const nameLower = (vehicle.title || vehicle.name || "").toLowerCase();
    const idLower = (vehicle.slug || vehicle.id || "").toLowerCase();
    
    if (nameLower.includes("everest") || idLower.includes("everest")) {
      seats = "7 Chỗ";
    } else if (nameLower.includes("explorer") || idLower.includes("explorer")) {
      seats = "7 Chỗ";
    } else if (nameLower.includes("territory") || idLower.includes("territory")) {
      seats = "5 Chỗ";
    } else if (nameLower.includes("transit") || idLower.includes("transit")) {
      seats = "16 Chỗ";
    } else if (nameLower.includes("ranger") || idLower.includes("ranger") || nameLower.includes("raptor") || idLower.includes("raptor")) {
      seats = "5 Chỗ";
    }

    if (vehicle.versions && Array.isArray(vehicle.versions) && vehicle.versions.length > 0) {
      const baseVersion = vehicle.versions[0];
      if (baseVersion.specs) {
        if (baseVersion.specs.engine) {
          engine = baseVersion.specs.engine;
        }
        if (baseVersion.specs.transmission) {
          transmission = baseVersion.specs.transmission;
        }
      }
    } else if (vehicle.specs) {
      if (vehicle.specs.engine) engine = vehicle.specs.engine;
      if (vehicle.specs.transmission) transmission = vehicle.specs.transmission;
    }

    return { engine, seats, transmission };
  };


  // Hero Banner Active Slide
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const brandCarouselRef = useRef<HTMLDivElement>(null);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // Dragging states for both Mouse and Touch
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const updateTranslate = () => {
      if (brandCarouselRef.current) {
        const container = brandCarouselRef.current;
        const card = container.firstElementChild as HTMLElement;
        if (card) {
          const cardWidth = card.clientWidth;
          const gap = 24; // gap-6 (24px)
          setTranslateX(activeBrandIndex * (cardWidth + gap));
        }
      }
    };
    
    updateTranslate();
    window.addEventListener("resize", updateTranslate);
    return () => window.removeEventListener("resize", updateTranslate);
  }, [activeBrandIndex]);

  const scrollBrandCarousel = (direction: "left" | "right") => {
    setActiveBrandIndex((prevIndex) => {
      return direction === "left" 
        ? Math.max(0, prevIndex - 1)
        : Math.min(brandItems.length - 1, prevIndex + 1);
    });
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    setHasMoved(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = dragStartX - clientX;
    if (Math.abs(diff) > 5) {
      setHasMoved(true);
    }
    // Add resistance when pulling past boundaries
    if (activeBrandIndex === 0 && diff < 0) {
      setDragOffset(diff * 0.35);
    } else if (activeBrandIndex === brandItems.length - 1 && diff > 0) {
      setDragOffset(diff * 0.35);
    } else {
      setDragOffset(diff);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 120; // threshold to trigger slide change
    if (dragOffset > threshold && activeBrandIndex < brandItems.length - 1) {
      setActiveBrandIndex((prev) => prev + 1);
    } else if (dragOffset < -threshold && activeBrandIndex > 0) {
      setActiveBrandIndex((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  // Mouse event adapters
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    handleDragStart(e.clientX);
    e.preventDefault(); // prevent default image drag and selection behavior
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    handleDragEnd();
  };

  // Touch event adapters
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };







  // FAQ Accordion Open States (Single active index, null if all closed)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroDragStartX = useRef(0);
  const isHeroDragging = useRef(false);

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersData, categoriesData, vehiclesData, servicesData, handoversData] = await Promise.all([
          bannersAPI.getAll().catch(() => null),
          vehiclesAPI.getCategories().catch(() => null),
          vehiclesAPI.getAll().catch(() => null),
          servicesAPI.getAll().catch(() => null),
          customerHandoversAPI.getAll().catch(() => null)
        ]);

        const bannersItems = (bannersData as any)?.data || bannersData;
        if (Array.isArray(bannersItems) && bannersItems.length > 0) {
          setHeroSlides(bannersItems.map((item: any, idx: number) => {
            const defaultSlogans = [
              { title: "Ford Everest Thế Hệ Mới", subtitle: "Định hình phong cách sống thượng lưu, nâng tầm vị thế" },
              { title: "Ford Ranger Thế Hệ Mới", subtitle: "Bản lĩnh chinh phục mọi thử thách, thống trị mọi địa hình" },
              { title: "Ford Territory Thế Hệ Mới", subtitle: "Không gian thông minh, công nghệ tương lai cho gia đình bạn" }
            ];
            const defaultSlogan = defaultSlogans[idx % defaultSlogans.length];
            return {
              title: item.title || defaultSlogan.title,
              subtitle: item.subtitle || defaultSlogan.subtitle,
              image: item.image_url || siteAssets.heroSlides[0],
              imageMobile: item.image_mobile_url || item.image_url || siteAssets.heroSlides[0],
              linkVehicleId: item.button_link || ""
            };
          }));
        } else {
          setHeroSlides([
            {
              title: "Ford Everest Thế Hệ Mới",
              subtitle: "Định hình phong cách sống thượng lưu, nâng tầm vị thế",
              image: siteAssets.heroSlides?.[0] || "/assets/hero_everest.jpg",
              imageMobile: siteAssets.heroSlides?.[0] || "/assets/hero_everest_mobile.jpg",
              linkVehicleId: ""
            },
            {
              title: "Ford Ranger Thế Hệ Mới",
              subtitle: "Bản lĩnh chinh phục mọi thử thách, thống trị mọi địa hình",
              image: siteAssets.heroSlides?.[1] || "/assets/hero_ranger.jpg",
              imageMobile: siteAssets.heroSlides?.[1] || "/assets/hero_ranger_mobile.jpg",
              linkVehicleId: ""
            },
            {
              title: "Ford Territory Thế Hệ Mới",
              subtitle: "Không gian thông minh, công nghệ tương lai cho gia đình bạn",
              image: siteAssets.heroSlides?.[2] || "/assets/hero_territory.jpg",
              imageMobile: siteAssets.heroSlides?.[2] || "/assets/hero_territory_mobile.jpg",
              linkVehicleId: ""
            }
          ]);
        }

        const categoriesItems = (categoriesData as any)?.data || categoriesData;
        if (Array.isArray(categoriesItems) && categoriesItems.length > 0) {
          setCategories(categoriesItems);
        }

        const vehiclesItems = (vehiclesData as any)?.data || vehiclesData;
        if (Array.isArray(vehiclesItems) && vehiclesItems.length > 0) {
          setVehiclesList(vehiclesItems);
          
          // Map dynamic vehicles from CMS directly to brandItems
          const dynamicBrandItems = vehiclesItems.map((v: any) => ({
            title: v.title,
            category: v.title.toUpperCase().includes("FORD") ? v.title : `FORD ${v.title.toUpperCase()} MỚI`,
            slogan: v.tagline || "Mạnh mẽ. Thông minh.",
            description: v.description || "",
            image: v.image_featured_url || "",
            link: `/dong-xe/${v.slug}`
          }));
          setBrandItems(dynamicBrandItems);
        }

        const servicesItems = (servicesData as any)?.services || (servicesData as any)?.data || servicesData;
        if (Array.isArray(servicesItems) && servicesItems.length > 0) {
          setServicesList(servicesItems);
        } else {
          // API trả rỗng, không hiển thị section dịch vụ
        }

        const handoversItems = (handoversData as any)?.data || handoversData;
        if (Array.isArray(handoversItems) && handoversItems.length > 0) {
          setCustomerHandovers(handoversItems);
        } else {
          // API trả rỗng, không hiển thị section bàn giao
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHeroSlides([
          {
            title: "Ford Everest Thế Hệ Mới",
            subtitle: "Định hình phong cách sống thượng lưu, nâng tầm vị thế",
            image: siteAssets.heroSlides?.[0] || "/assets/hero_everest.jpg",
            imageMobile: siteAssets.heroSlides?.[0] || "/assets/hero_everest_mobile.jpg",
            linkVehicleId: ""
          },
          {
            title: "Ford Ranger Thế Hệ Mới",
            subtitle: "Bản lĩnh chinh phục mọi thử thách, thống trị mọi địa hình",
            image: siteAssets.heroSlides?.[1] || "/assets/hero_ranger.jpg",
            imageMobile: siteAssets.heroSlides?.[1] || "/assets/hero_ranger_mobile.jpg",
            linkVehicleId: ""
          },
          {
            title: "Ford Territory Thế Hệ Mới",
            subtitle: "Không gian thông minh, công nghệ tương lai cho gia đình bạn",
            image: siteAssets.heroSlides?.[2] || "/assets/hero_territory.jpg",
            imageMobile: siteAssets.heroSlides?.[2] || "/assets/hero_territory_mobile.jpg",
            linkVehicleId: ""
          }
        ]);
        // API lỗi, các section sẽ hiển thị trống
      } finally {
        setIsVehiclesLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Load posts dynamically on mount
  useEffect(() => {
    const fetchTabPosts = async () => {
      try {
        const postsData = await postsAPI.getAll();
        // Ưu tiên top_posts (bài nổi bật từ CMS), sau đó mới fallback sang posts.data
        const topPosts = (postsData as any)?.top_posts;
        const postsItems = (postsData as any)?.posts?.data || (postsData as any)?.data || postsData;
        const sourceItems = (Array.isArray(topPosts) && topPosts.length > 0) ? topPosts : postsItems;
        if (Array.isArray(sourceItems) && sourceItems.length > 0) {
          const formatted = sourceItems.slice(0, 5).map((item: any) => ({
            id: item.slug || item.id || String(Math.random()),
            title: item.title || "",
            image: item.image?.url || "/assets/mach-e-hero.png",
            published_at: item.published_at || "",
            category: item.category ? { title: item.category.title } : { title: "Tin tức" },
            description: item.description || "",
          }));
          setHomeArticles(formatted);
        } else {
          // API trả rỗng, không hiển thị section tin tức
        }
      } catch (error) {
        console.error("Error fetching tab posts, using fallbacks:", error);
        // API lỗi, không hiển thị section tin tức
      }
    };
    fetchTabPosts();
  }, []);

  // Drag handlers for Hero Banner
  const handleHeroStart = (clientX: number) => {
    heroDragStartX.current = clientX;
    isHeroDragging.current = true;
  };

  const handleHeroEnd = (clientX: number) => {
    if (!isHeroDragging.current) return;
    isHeroDragging.current = false;
    const diff = clientX - heroDragStartX.current;
    if (diff > 50) {
      setActiveHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    } else if (diff < -50) {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }
  };

  // Filter vehicles based on active showroom category
  const getFilteredVehicles = () => {
    if (vehiclesList.length === 0) {
      if (isVehiclesLoading) {
        return [];
      }
      switch (selectedCategory) {
        case "suv":
          return vehicles.filter(v => v.type === "suv");
        case "pickup":
          return vehicles.filter(v => v.type === "pickup");
        case "commercial":
          return vehicles.filter(v => v.type === "commercial");
        default:
          return vehicles;
      }
    }

    if (selectedCategory === "all") {
      return vehiclesList;
    }
    const cat = categories.find(c => c.slug === selectedCategory);
    if (!cat) return [];
    return vehiclesList.filter(v => (v.category_ids && Array.isArray(v.category_ids) ? v.category_ids.includes(cat.id) : v.category_id === cat.id));
  };

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const triggerQuickAction = (reason: string, noteText: string) => {
    router.push("/lien-he");
  };

  const triggerGetQuote = (vehicleId: string, vehicleName: string) => {
    router.push("/lien-he");
  };

  // Close toast helper
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price) + "đ";
  };

  // Auto-play hero slides every 2.5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);



  // Body scroll locking when Lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

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

  return (
    <div className="relative min-h-screen bg-[#f8f8f8] overflow-x-hidden font-sans">
      <h1 className="sr-only">Long Khánh Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai & Long Khánh</h1>

      {/* Embed local keyframe styles for slider bar progress */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-progress-bar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-hero-progress {
          animation: hero-progress-bar 2.5s linear forwards;
          transform-origin: left;
        }
        .text-btn-hover-effect {
          position: relative;
          overflow: hidden;
        }
        .text-btn-hover-effect::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #066FEF;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease-out;
        }
        .text-btn-hover-effect:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}} />

      {/* 1. HERO SLIDER BANNER */}
      {heroSlides.length > 0 && (
        <section
          className="relative h-[100dvh] min-h-[500px] md:h-screen md:min-h-[680px] flex flex-col justify-end bg-black text-white overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleHeroStart(e.clientX)}
          onMouseUp={(e) => handleHeroEnd(e.clientX)}
          onMouseLeave={() => { isHeroDragging.current = false; }}
          onTouchStart={(e) => handleHeroStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleHeroEnd(e.changedTouches[0].clientX)}
        >
          {/* Absolute Background Slides (with fade transitions) */}
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
                activeHeroIndex === idx ? "opacity-90 scale-100" : "opacity-0 scale-105"
              }`}
            >
              {/* Desktop Image */}
              <img
                src={slide.image}
                alt={slide.title}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images-dynamic/image-hero-1.jpg";
                }}
                className="hidden md:block object-cover w-full h-full object-top transform transition-transform duration-10000"
              />
              {/* Mobile Image */}
              <img
                src={slide.imageMobile || slide.image}
                alt={slide.title}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images-dynamic/image-hero-1.jpg";
                }}
                className="block md:hidden object-cover w-full h-full object-center transform transition-transform duration-10000"
              />
            </div>
          ))}

          {/* Main Content Area */}
          <div className="max-w-[1440px] mx-auto w-full relative z-10 mt-auto pt-20 pb-[100px] md:pb-[60px]">
            <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0 flex flex-col items-start justify-end text-left">
              {/* Slide Text Block */}
              <motion.div
                key={activeHeroIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl flex flex-col items-start text-left w-full"
              >
                <h2 className="text-3xl sm:text-5xl lg:text-[48px] font-bold tracking-tight leading-[1.15] text-white uppercase font-sans">
                  {heroSlides[activeHeroIndex]?.title || ""}
                </h2>

                {/* CTAs - Dark Background Hover styles */}
                <div className="flex flex-col sm:flex-row justify-start gap-4 pt-6 md:pt-8 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    onClick={() => triggerQuickAction("Đăng ký lái thử", "Tôi đặt lịch hẹn đăng ký lái thử xe Ford.")}
                    className="w-full sm:w-auto"
                  >
                    Đăng ký lái thử
                  </Button>
                  <Button
                    variant="white-outline"
                    onClick={() => router.push("/lien-he")}
                    className="w-full sm:w-auto"
                  >
                    Khám phá ngay
                  </Button>
                </div>
              </motion.div>
          </div>
        </div>

          {/* Linear Progress Indicator Line - Desktop */}
          <div className="absolute bottom-[40px] right-[10.88542%] hidden md:flex items-center gap-2.5 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroIndex(idx)}
                className="relative h-[2px] w-10 cursor-pointer bg-white/40 border-0 p-0"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {activeHeroIndex === idx && (
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#066FEF] animate-hero-progress" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Dot Progress Indicator */}
          <div className="w-full flex md:hidden justify-center items-center relative z-10 px-6 pb-6">
            <div className="flex flex-row gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 border-0 ${
                    activeHeroIndex === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. VEHICLES SHOWROOM CATALOG (WITH FILTER TABS) */}
      <section id="showroom" className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0">
            {/* Header title block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-10 text-center max-w-3xl mx-auto font-sans"
            >
              <h2 className="text-3xl md:text-[32px] font-bold text-[#00095B] tracking-tight uppercase leading-snug">
                Dòng xe Ford Long Khánh
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 font-medium leading-relaxed mt-3">
                Đa dạng lựa chọn từ SUV, bán tải đến xe thương mại — tất cả đều có sẵn tại showroom Long Khánh.
              </p>
            </motion.div>

            {/* Tab Navigation centered */}
            <div className="flex justify-center border-b border-neutral-200 pb-4 mb-10">
              <div className="flex gap-8 overflow-x-auto scrollbar-none justify-center">
                {(categories.length > 0
                  ? [{ slug: "all", title: "Tất cả" }, ...categories]
                  : [
                      { slug: "all", title: "Tất cả" },
                      { slug: "suv", title: "SUV" },
                      { slug: "pickup", title: "Bán tải" },
                      { slug: "commercial", title: "Thương mại" }
                    ]
                ).map((cat) => {
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setActiveCarIndex(0);
                      }}
                      className={`pb-4 text-xs sm:text-sm font-bold transition-all duration-300 relative cursor-pointer whitespace-nowrap border-0 bg-transparent ${
                        isActive
                          ? "text-[#066FEF] border-b-2 border-[#066FEF] -mb-[18px]"
                          : "text-neutral-450 hover:text-black border-b-2 border-transparent -mb-[18px]"
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

          {/* Split layout showcase container */}
          <div className="min-h-[420px] relative w-full">
            {isVehiclesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col space-y-4">
                    <div className="aspect-[16/10] w-full bg-neutral-100 rounded-xl" />
                    <div className="h-6 bg-neutral-200 w-2/3 rounded" />
                    <div className="h-4 bg-neutral-100 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const filteredVehicles = getFilteredVehicles();
                if (filteredVehicles.length === 0) {
                  return (
                    <div className="text-center py-20 bg-neutral-50 border border-neutral-200">
                      <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Không tìm thấy dòng xe phù hợp.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {filteredVehicles.map((vehicle: any, idx: number) => {
                      const vehicleId = vehicle.slug || vehicle.id;
                      const vehicleName = vehicle.title || vehicle.name;
                      const vehicleCardImage = vehicle.image_thumbnail_url || vehicle.image_url || vehicle.images?.[0] || getPopularVehicleImage(vehicleId);
                      const vehiclePrice = vehicle.base_price || vehicle.basePrice || 0;

                      return (
                        <motion.div
                          key={vehicleId}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                          className="w-full flex"
                        >
                          <Link
                            href={`/${vehicleId}`}
                            className="w-full bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-md transition-all duration-300 group text-left"
                          >
                            {/* Image */}
                            <div className="relative aspect-[16/10] w-full bg-white overflow-hidden mb-6 flex items-center justify-center">
                              <SafeImage
                                src={vehicleCardImage}
                                alt={vehicleName}
                                fill
                                sizes="(max-width: 768px) 100vw, 350px"
                                className="object-contain object-center scale-[1.05] group-hover:scale-[1.08] transition-transform duration-500 pointer-events-none"
                                unoptimized={true}
                              />
                            </div>

                            {/* Info */}
                            <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase text-black mb-1 group-hover:text-[#066FEF] transition-colors font-sans">
                              {vehicleName}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-500 font-medium font-sans">
                              Giá khởi điểm:{" "}
                              <span className="text-[#066FEF] font-bold">
                                {formatPrice(vehiclePrice)}
                              </span>
                            </p>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>
        </div>
        </div>
      </section>

      {/* 4. TECHNOLOGY SHOWCASE */}
      <section id="technology" className="w-full bg-[#F8F8F8] py-16 md:py-24 text-black overflow-hidden relative select-none">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0">
            {/* Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-4 text-left mb-10 md:mb-12 max-w-[900px]"
            >
              <h2 className="text-4xl md:text-[48px] font-extrabold text-black tracking-tight font-antenna leading-none">
                <span className="text-[#066FEF]">Công nghệ</span> trên xe Ford
              </h2>
              <p className="text-base md:text-lg text-neutral-600 font-medium leading-relaxed font-antenna">
                Khám phá các trang bị công nghệ hiện đại hàng đầu phân khúc trên các dòng xe Ford thế hệ mới giúp hành trình của bạn an toàn, kết nối liền mạch và tràn đầy cảm hứng.
              </p>
            </motion.div>

            {/* Grid layout - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full mt-12">
              {techItems.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                  className="flex flex-col gap-5 text-left group"
                >
                  {/* Card Image container with rounded corners */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-neutral-200/60 w-full bg-neutral-50 shadow-xs">
                    <SafeImage
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>

                  {/* Card content */}
                  <div className="flex flex-col flex-1 gap-2.5">
                    <h3 className="text-xl md:text-[22px] font-bold text-[#00095B] tracking-tight leading-snug font-antenna">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal font-antenna flex-1">
                      {card.description}
                    </p>
                    
                    {/* Outline pill button */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        href={card.link}
                        size="sm"
                        className="w-fit"
                      >
                        {card.buttonText}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRAND SHOWCASE SECTION */}
      {brandItems.length > 0 && (
        <section id="brand-showcase" className="bg-white py-16 md:py-24 border-t border-[#e5e5e5] w-full relative overflow-x-clip">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0">
            {/* Title Block */}
            <div className="mb-10 text-left">
              <span className="text-xs font-semibold text-neutral-500 block mb-2 font-sans">
                Toàn Bộ Xe
              </span>
              <h2 className="text-3xl lg:text-[40px] font-bold text-black tracking-tight leading-tight font-sans">
                Khám Phá Các Dòng Xe Ford
              </h2>
            </div>

            <div className="w-full relative group/carousel">
              {/* Overflow wrapper to prevent horizontal scrollbars on page */}
              <div className="overflow-hidden -mx-6 xl:-mx-[calc((100vw-1152px)/2)]">
                <div 
                  ref={brandCarouselRef}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onClickCapture={(e) => {
                    if (hasMoved) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className={`flex gap-6 pb-8 px-6 xl:px-[calc((100vw-1152px)/2)] will-change-transform select-none ${isDragging ? "transition-none" : "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"}`}
                  style={{ 
                    transform: `translateX(-${translateX + dragOffset}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {brandItems.map((item: any, idx) => (
                    <div 
                      key={idx}
                      className={`flex-shrink-0 w-[85vw] md:w-[75vw] lg:w-[70vw] xl:w-[1120px] aspect-[16/8] h-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform backface-hidden ${idx === activeBrandIndex ? "opacity-100 scale-100" : "opacity-50 scale-[0.98]"}`}
                    >
                      <div 
                         className="relative w-full h-full overflow-hidden border border-neutral-200/80 group block bg-neutral-100 rounded-[8px] aspect-[16/8] select-none"
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 1120px"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:[--img-scale:1.12] backface-hidden"
                          style={{
                            transform: `scale(var(--img-scale, 1.08)) translateX(${(idx - activeBrandIndex) * 3.5}%)`
                          }}
                        />
                        
                        {/* Subtle bottom gradient overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                        
                        {/* Main clickable area for the card body */}
                        <Link
                          href="/san-pham"
                          onClick={(e) => {
                            if (hasMoved) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className="absolute inset-0 z-20"
                          aria-label={item.title}
                        />

                        {/* Content aligned at the bottom-left */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 flex flex-col justify-end text-left select-none gap-3 pointer-events-none">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-white/90 block uppercase tracking-wider">
                              {item.category}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                              {item.slogan}
                            </h3>
                          </div>
                          
                          {/* Pill Buttons */}
                          <div className="flex gap-3 items-center mt-2 pointer-events-auto">
                            <Button
                              variant="white"
                              size="sm"
                              href="/san-pham"
                              onClick={(e) => {
                                if (hasMoved) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                            >
                              Xem Thêm
                            </Button>
                            <Button
                              variant="white-outline"
                              size="sm"
                              href={`/lien-he?reason=Báo giá&vehicle=${encodeURIComponent(item.title)}`}
                              onClick={(e) => {
                                if (hasMoved) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                            >
                              Báo Giá
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows (relative to the 1152px parent container) */}
              <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-30 hidden xl:block">
                {/* Left arrow */}
                <button
                  onClick={() => scrollBrandCarousel("left")}
                  className={`absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-all border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95 pointer-events-auto duration-300 ${activeBrandIndex === 0 ? "opacity-0 scale-90 pointer-events-none" : "opacity-0 scale-100 group-hover/carousel:opacity-100"}`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={() => scrollBrandCarousel("right")}
                  className={`absolute left-[1096px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-all border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95 pointer-events-auto duration-300 ${activeBrandIndex === brandItems.length - 1 ? "opacity-0 scale-90 pointer-events-none" : "opacity-0 scale-100 group-hover/carousel:opacity-100"}`}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. FORD NEWS SECTION (SPLIT GRID CARDS LAYOUT) */}
      <section id="news" className="w-full bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0">
            {/* Header Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6 text-left"
            >
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#066FEF] uppercase tracking-[0.2em] block">
                  Tin tức & Chương Trình
                </span>
                <h2 className="text-2xl md:text-[32px] font-bold leading-tight tracking-tight uppercase font-sans text-black">
                  Tin tức & Sự kiện
                </h2>
              </div>

              {/* Right side button */}
              <Button
                variant="outline-gray"
                onClick={() => router.push("/tin-tuc")}
                className="shrink-0"
                size="sm"
              >
                Xem thêm tin tức
              </Button>
            </motion.div>

            {homeArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left: Large featured article (66% width) */}
                {homeArticles[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-8 flex"
                  >
                    <Link
                      href={`/tin-tuc/${homeArticles[0].id}`}
                      className="w-full relative aspect-[16/10] overflow-hidden rounded-[8px] border border-neutral-200/80 group block animate-fade-in"
                    >
                      <img
                        src={homeArticles[0].image}
                        alt={homeArticles[0].title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-8 left-8 right-8 text-left text-white">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide font-sans line-clamp-2 drop-shadow-md">
                          {homeArticles[0].title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Right: Stacked smaller articles (33% width) */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                  {homeArticles.slice(1, 3).map((art, idx) => (
                    <motion.div
                      key={art.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (idx + 1) * 0.1, ease: "easeOut" }}
                      className="flex-1 flex animate-fade-in"
                    >
                      <Link
                        href={`/tin-tuc/${art.id}`}
                        className="w-full relative flex-1 min-h-[190px] overflow-hidden rounded-[8px] border border-neutral-200/80 group block"
                      >
                        <img
                          src={art.image}
                          alt={art.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 text-left text-white space-y-2">
                          <h3 className="text-sm font-bold uppercase tracking-wide font-sans line-clamp-2 leading-snug drop-shadow-md">
                            {art.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
                <div className="lg:col-span-8 aspect-[16/10] bg-neutral-100 rounded-none border border-neutral-200/80" />
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="flex-1 min-h-[190px] bg-neutral-100 rounded-none border border-neutral-200/80" />
                  <div className="flex-1 min-h-[190px] bg-neutral-100 rounded-none border border-neutral-200/80" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. FULL-WIDTH BRAND BANNER */}
      <section className="relative w-full h-[550px] md:h-[750px] overflow-hidden select-none">
        <Image
          src="/assets/ford-ranger-raptor-desktop.webp"
          alt="Ford Brand Banner"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center p-6"
        >
          <h2 className="text-2xl md:text-4xl lg:text-[42px] font-extrabold text-white uppercase tracking-wider font-sans mb-6 max-w-4xl leading-tight drop-shadow-md">
            Khám Phá Hành Trình Mới Cùng Ford
          </h2>
          <Button
            variant="primary"
            href="/dang-ky-lai-thu"
            size="lg"
            className="shadow-lg"
          >
            Đăng ký lái thử ngay
          </Button>
        </motion.div>
      </section>


      {/* 9. CUSTOMER HANDOVER & CONSULTATION SECTION */}
      {customerHandovers.length > 0 && (
        <section id="customer-handovers" className="w-full bg-white py-16 md:py-24 overflow-x-clip relative select-none">
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
            {/* Header row */}
            <div className="max-w-[1440px] mx-auto w-full mb-10 md:mb-12">
              <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0 flex flex-col items-center text-center">
                <h2 className="text-3xl md:text-[40px] font-extrabold text-black tracking-tight leading-tight uppercase font-sans">
                  Tri ân khách hàng
                </h2>
              </div>
            </div>

            {/* Slider track container — continuous infinite marquee */}
            <div className="relative w-full overflow-hidden py-4 select-none">
              <div className="animate-marquee-continuous gap-[var(--card-gap-handover,24px)]">
                {[...customerHandovers, ...customerHandovers].map((item, idx) => {
                  const originalIdx = idx % customerHandovers.length;
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => setLightboxIndex(originalIdx)}
                      className="relative overflow-hidden rounded-[8px] aspect-[4/3] group cursor-pointer bg-neutral-100 flex-shrink-0 transition-all duration-300 block border border-neutral-200"
                      style={{
                        width: "var(--card-width-handover, 360px)",
                      }}
                    >
                      <Image
                        src={item.image_url}
                        alt={item.title || "Tri ân khách hàng"}
                        fill
                        sizes="(max-width: 768px) 280px, 360px"
                        className="object-cover transition-transform duration-500 rounded-[8px]"
                        onError={handleImageError}
                      />

                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left rounded-[8px]">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9.5 READY TO BUY / OWNERSHIP EXPERIENCE */}
      <section className="w-full bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0 space-y-12">
            {/* Title Area */}
            <div className="text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#066FEF] block font-sans">Mua xe Ford</span>
              <h2 className="text-3xl lg:text-[40px] font-bold text-black tracking-tight uppercase font-sans">
                Sẵn sàng cho trải nghiệm sở hữu tuyệt vời
              </h2>
            </div>

            {/* Banner block */}
            <div className="relative w-full rounded-[12px] bg-gradient-to-r from-[#0060df] via-[#004bb4] to-[#002f6c] p-8 md:p-12 text-white overflow-hidden flex flex-col items-start justify-center min-h-[220px] shadow-sm group">
              {/* Animated/Interactive background overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90 pointer-events-none" />
              {/* Subtle background abstract curves */}
              <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />
              
              <div className="relative z-10 space-y-4 max-w-lg text-left">
                <span className="text-[#9fc9ff] text-xs font-semibold uppercase tracking-wider block font-sans">
                  Cá nhân hóa chiếc xe mà bạn mong muốn.
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold font-sans uppercase tracking-tight leading-tight">
                  Bắt đầu mua xe
                </h3>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center bg-white text-black font-sans text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-[4px] hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
                >
                  Bắt đầu
                </Link>
              </div>
            </div>

            {/* Three cards below banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Tìm Đại lý */}
              <a
                href={siteAssets.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-50 hover:bg-white border border-gray-200/80 hover:border-[#066FEF]/40 p-8 rounded-[12px] flex flex-col justify-between items-start text-left min-h-[220px] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 bg-white text-[#066FEF] group-hover:bg-[#066FEF] group-hover:text-white rounded-[8px] border border-gray-200/60 flex items-center justify-center transition-all duration-300 shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-extrabold text-lg text-black uppercase tracking-tight">
                      Tìm Đại lý
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      Tìm đại lý Ford chính hãng gần nhất.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-end mt-4">
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#066FEF] group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
              </a>

              {/* Card 2: Báo giá */}
              <Link
                href="/lien-he"
                className="group bg-gray-50 hover:bg-white border border-gray-200/80 hover:border-[#066FEF]/40 p-8 rounded-[12px] flex flex-col justify-between items-start text-left min-h-[220px] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 bg-white text-[#066FEF] group-hover:bg-[#066FEF] group-hover:text-white rounded-[8px] border border-gray-200/60 flex items-center justify-center transition-all duration-300 shadow-xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-extrabold text-lg text-black uppercase tracking-tight">
                      Báo giá
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      Nhận thêm thông tin về giá và các chương trình khuyến mãi mới nhất.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-end mt-4">
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#066FEF] group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
              </Link>

              {/* Card 3: Đăng ký lái thử */}
              <Link
                href="/dang-ky-lai-thu"
                className="group bg-gray-50 hover:bg-white border border-gray-200/80 hover:border-[#066FEF]/40 p-8 rounded-[12px] flex flex-col justify-between items-start text-left min-h-[220px] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 bg-white text-[#066FEF] group-hover:bg-[#066FEF] group-hover:text-white rounded-[8px] border border-gray-200/60 flex items-center justify-center transition-all duration-300 shadow-xs">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-extrabold text-lg text-black uppercase tracking-tight">
                      Đăng ký lái thử
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      Khám phá ngay sự mạnh mẽ và tiện nghi vượt trội trên từng dòng xe.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-end mt-4">
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#066FEF] group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9.6 CUSTOMER SERVICE & CARE TABBED SECTION */}
      <section className="w-full bg-[#F8F8F8] py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0 space-y-12">
            {/* Title */}
            <div className="text-left">
              <h2 className="text-3xl lg:text-[40px] font-bold text-black tracking-tight uppercase font-sans">
                Dịch vụ và Chăm sóc khách hàng
              </h2>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Interactive Tabs Selector */}
              <div className="lg:col-span-5 flex flex-col justify-start gap-4">
                {[
                  {
                    title: "Dịch vụ & Bảo dưỡng",
                    desc: "Đảm bảo chiếc xe của bạn luôn hoàn hảo, giúp bạn tiết kiệm chi phí sử dụng và gia tăng giá trị bán lại của xe.",
                    href: "/dich-vu"
                  },
                  {
                    title: "Đặt lịch Dịch vụ Trực tuyến",
                    desc: "Đặt lịch hẹn bảo dưỡng trực tuyến nhanh chóng, thuận tiện và chủ động thời gian của bạn.",
                    href: "/dich-vu"
                  },
                  {
                    title: "Trò Chuyện Cùng Chuyên Gia",
                    desc: "Tư vấn trực tiếp 24/7 với các chuyên gia kỹ thuật và chăm sóc khách hàng của Ford Long Khánh.",
                    href: "/lien-he"
                  }
                ].map((tab, idx) => {
                  const isActive = activeServiceTab === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveServiceTab(idx)}
                      className={`text-left p-6 border-l-[3px] transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-[#066FEF] bg-white shadow-xs"
                          : "border-transparent hover:border-gray-300 hover:bg-white/50"
                      }`}
                    >
                      <h3
                        className={`text-lg font-bold font-sans transition-colors duration-300 ${
                          isActive ? "text-[#066FEF]" : "text-neutral-700 hover:text-black"
                        }`}
                      >
                        {tab.title}
                      </h3>
                      
                      {/* Animated expandable description */}
                      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isActive ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                      }`}>
                        <div className="overflow-hidden space-y-3">
                          <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                            {tab.desc}
                          </p>
                          <Link
                            href={tab.href}
                            className="inline-flex items-center text-xs font-bold text-[#066FEF] hover:text-[#00095b] transition-colors gap-1 uppercase tracking-wider font-sans"
                          >
                            Xem thêm <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Tab Image */}
              <div className="lg:col-span-7 relative h-[320px] sm:h-[400px] lg:h-auto min-h-[350px] w-full rounded-[12px] overflow-hidden border border-neutral-200/80 shadow-sm bg-gray-100">
                {[
                  { src: "/service-fixed-car.webp", pos: "object-center" },
                  { src: "/service-delivery.webp", pos: "object-center" },
                  { src: "/service-support-customer.webp", pos: "object-center" }
                ].map((img, idx) => {
                  const isActive = activeServiceTab === idx;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    >
                      {(isActive || idx === 0) && (
                        <Image
                          src={img.src}
                          alt="Dịch vụ và chăm sóc khách hàng Long Khánh Ford"
                          fill
                          priority={idx === 0}
                          sizes="(max-width: 1024px) 100vw, 700px"
                          className={`object-cover ${img.pos}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ & QUICK ACTIONS SECTION (MERGED & MINIMALIST) */}
      <section className="w-full bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0">
            {/* Title Area - Centered, no subtext */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl lg:text-[40px] font-bold text-black tracking-tight uppercase font-sans">
                Hỏi đáp dịch vụ
              </h2>
            </div>

            {/* Accordions list - Flow vertically with max-w-[800px] */}
            <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden border transition-all duration-300 rounded-[8px] p-6 ${
                      isOpen ? "border-[#066FEF] bg-[#f0f7ff]/20 shadow-xs" : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    {/* Title Toggle trigger */}
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left transition-colors cursor-pointer bg-transparent border-0 p-0 gap-4"
                    >
                      <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${isOpen ? "text-[#066FEF]" : "text-black"}`}>
                        {faq.q}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen ? "bg-[#066FEF] text-white" : "bg-[#f0f7ff] text-[#066FEF] hover:bg-[#e0efff]"
                      }`}>
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Body Content with Smooth Height Transition */}
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                      <div className="overflow-hidden">
                        <p className="pt-4 text-sm text-neutral-500 leading-relaxed font-normal text-left">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>
        </div>
      </section>

      <section id="consultation" className="relative py-16 md:py-24 px-0 w-full overflow-hidden bg-gradient-to-br from-white via-[#f0f7ff] to-[#d6e8ff] text-black">
        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="max-w-[1152px] mx-auto w-full px-6 xl:px-0 flex flex-col lg:flex-row gap-16 items-center justify-center">
            {/* Left Column: Title & Info */}
            <div className="w-full lg:w-[480px] flex flex-col gap-8 items-start justify-center text-black relative z-10 text-left">
              <div className="flex flex-col gap-3 items-start text-black w-full">
                <h2 className="text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-tight uppercase font-sans text-black">
                  <span className="text-[#066FEF]">Liên hệ</span> Long Khánh Ford
                </h2>
                <p className="text-sm md:text-base text-neutral-500 leading-[1.6] font-normal">
                  Đại lý ủy quyền chính thức tiêu chuẩn Signature mới nhất của Ford Việt Nam.
                </p>
              </div>
              <div className="flex flex-col gap-6 items-start w-full">
                {/* Showroom Address */}
                <div className="flex gap-4 items-start w-full text-left">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7ff] border border-[#d6e8ff] flex items-center justify-center text-[#066FEF] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-normal pt-1.5">
                    <strong className="text-black font-bold mr-1">Địa chỉ:</strong>
                    <a
                      href={siteAssets.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#066FEF] transition-colors"
                    >
                      Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn, Thành phố Long Khánh, Tỉnh Đồng Nai, Việt Nam
                    </a>
                  </p>
                </div>

                {/* Hotline */}
                <div className="flex gap-4 items-start w-full text-left">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7ff] border border-[#d6e8ff] flex items-center justify-center text-[#066FEF] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-normal pt-1.5">
                    <strong className="text-black font-bold mr-1">Hotline:</strong>
                    Dịch vụ: 1900 888 992 – 02513 646 998 - Kinh doanh: 0812 86 86 22
                  </p>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start w-full text-left">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7ff] border border-[#d6e8ff] flex items-center justify-center text-[#066FEF] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-normal pt-1.5">
                    <strong className="text-black font-bold mr-1">Email:</strong>
                    marketing@longkhanhford.com.vn
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start w-full sm:w-auto">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/lien-he")}
                  className="w-full sm:w-auto"
                >
                  Đăng ký báo giá
                </Button>
                <Button
                  variant="primary"
                  href="tel:0812868622"
                  className="w-full sm:w-auto"
                >
                  Gọi Hotline
                </Button>
              </div>
            </div>

            {/* Right Column: Google Maps Embed */}
            <div className="w-full lg:flex-1 h-[350px] lg:h-[427px] relative rounded-[8px] overflow-hidden border border-neutral-200 shadow-sm z-10">
              <iframe
                title="Bản đồ Long Khánh Ford"
                src={siteAssets.googleMapsEmbed}
                className="absolute inset-0 w-full h-full border-0 rounded-[8px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>



      {/* CLIENT SIDE TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#101010]/95 backdrop-blur-md border-l-4 border-white text-white p-4 max-w-sm rounded-[4px] shadow-xl flex gap-3 items-start animate-reveal-on-scroll">
          <div className="w-5 h-5 bg-white text-black flex items-center justify-center rounded-none mt-0.5 flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5 fill-current text-black" />
          </div>
          <div className="flex-1 space-y-1 text-left">
            <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-white">Thông báo hệ thống</h4>
            <p className="text-xs text-neutral-300 leading-normal">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GLASSMORPHIC LIGHTBOX OVERLAY */}
      {lightboxIndex !== null && customerHandovers.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-all duration-300 select-none"
          style={{ zIndex: 9999 }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-[4px] text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs border-0"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + customerHandovers.length) % customerHandovers.length : null))}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-[4px] text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs border-0"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % customerHandovers.length : null))}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-[4px] text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs border-0"
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
                className="max-w-full max-h-full object-contain rounded-[4px] shadow-2xl border border-neutral-800"
              />
            </div>

            {/* Title / Description */}
            <div className="mt-6 text-center max-w-2xl px-4">
              <h3 className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow-md uppercase">
                {customerHandovers[lightboxIndex].title}
              </h3>
              <p className="text-[#066FEF] text-xs mt-1.5 uppercase tracking-[0.2em] font-semibold">
                LONG KHÁNH FORD
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
