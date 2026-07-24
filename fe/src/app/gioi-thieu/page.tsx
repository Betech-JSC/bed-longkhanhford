"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X, Briefcase, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { aboutAssets, handleImageError } from "@/lib/site-assets";
import { jobsAPI, settingsAPI } from "@/lib/api";
interface TeamCard {
  id: string;
  name: string;
  image: string;
  link: string;
}

const row1Cards: TeamCard[] = [
  { id: "r1-1", name: "Lễ Bàn Giao Xe Mới Cho Khách Hàng", image: "/images/team/team_1.png", link: "/lien-he" },
  { id: "r1-2", name: "Đội Ngũ Tư Vấn Bán Hàng Chuyên Nghiệp", image: "/images/team/team_3.png", link: "/lien-he" },
  { id: "r1-3", name: "Sự Kiện Trưng Bày & Trải Nghiệm Lái Thử Xe", image: "/images/team/team_2.png", link: "/dang-ky-lai-thu" },
  { id: "r1-4", name: "Lễ Bàn Giao Xe Cho Khách Hàng", image: "/images/team/team_1.png", link: "/lien-he" },
];

const row2Cards: TeamCard[] = [
  { id: "r2-1", name: "Hệ Thống Showroom Hiện Đại", image: "/images/about/image-introduce.jpg", link: "/lien-he" },
  { id: "r2-2", name: "Xưởng Dịch Vụ Đạt Chuẩn Brand@Retail", image: "/images/about/showroom-entrance.jpg", link: "/lien-he" },
  { id: "r2-3", name: "Trang Thiết Bị Sửa Chữa Chuyên Dụng", image: "/images/about/image-about-2.jpg", link: "/lien-he" },
  { id: "r2-4", name: "Không Gian Trưng Bày Xe Cao Cấp", image: "/images/about/image-vision-1.jpg", link: "/lien-he" },
];

function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(32px)";
        case "down":
          return "translateY(-32px)";
        case "left":
          return "translateX(32px)";
        case "right":
          return "translateX(-32px)";
        default:
          return "none";
      }
    }
    return "none";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  // Modal State for recruitment details
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // API Jobs State
  const [jobs, setJobs] = useState<any[]>([]);

  // Team Cards State (Dynamic from CMS)
  const [teamRow1, setTeamRow1] = useState<TeamCard[]>(row1Cards);
  const [teamRow2, setTeamRow2] = useState<TeamCard[]>(row2Cards);

  // Lightbox State for Image Zoom & Slide
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    currentIndex: number;
    images: Array<{ src: string; title: string }>;
  }>({
    isOpen: false,
    currentIndex: 0,
    images: [],
  });

  const openLightbox = (images: Array<{ src: string; title: string }>, index: number) => {
    setLightbox({
      isOpen: true,
      currentIndex: index,
      images,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  }, []);

  const prevImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  }, []);

  // Keyboard controls for Lightbox
  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox.isOpen, nextImage, prevImage]);

  const getPageGalleryImages = useCallback(() => {
    const staticList = [
      { src: "/images/about/image-introduce.jpg", title: "Tập thể đội ngũ & Ban lãnh đạo Long Khánh Ford" },
      { src: "/images/about/showroom-entrance.jpg", title: "Showroom trưng bày xe Long Khánh Ford" },
      { src: "/images/about/image-about-2.jpg", title: "Khoang xưởng dịch vụ sửa chữa Brand@Retail" },
      { src: "/images/about/image-vision-1.jpg", title: "Đội ngũ nhân sự Long Khánh Ford" },
      { src: "/images/about/image-vision-2.jpg", title: "Lễ tân & Đón tiếp khách hàng" },
      { src: "/images/about/image-vision-3.jpg", title: "Tư vấn sản phẩm chuyên nghiệp" },
      { src: "/images/about/image-vision-4.jpg", title: "Sự kiện tri ân khách hàng" },
    ];

    const teamList = [...teamRow1, ...teamRow2].map((card) => ({
      src: card.image,
      title: card.name,
    }));

    const combined = [...staticList, ...teamList];
    return combined.filter((item, pos, self) => self.findIndex((i) => i.src === item.src) === pos);
  }, [teamRow1, teamRow2]);

  const handleImageClick = (imageSrc: string) => {
    const images = getPageGalleryImages();
    const idx = images.findIndex((img) => img.src === imageSrc);
    openLightbox(images, idx !== -1 ? idx : 0);
  };

  // Fetch CMS General Settings for Team Images & Jobs
  useEffect(() => {
    let active = true;

    const fetchCMSData = async () => {
      try {
        const [jobsRes, settingsRes] = await Promise.allSettled([
          jobsAPI.getAll(),
          settingsAPI.getGeneral(),
        ]);

        if (!active) return;

        // Process Jobs
        if (jobsRes.status === "fulfilled" && jobsRes.value) {
          const res: any = jobsRes.value;
          const items = res?.jobs || res?.data || res;
          if (Array.isArray(items) && items.length > 0) {
            setJobs(items);
          }
        }

        // Process Team Images from CMS Settings
        if (settingsRes.status === "fulfilled" && settingsRes.value) {
          const res = settingsRes.value;
          let rawImages = res?.data?.about_team_images;
          if (typeof rawImages === "string") {
            try {
              rawImages = JSON.parse(rawImages);
            } catch (e) {}
          }

          if (Array.isArray(rawImages) && rawImages.length > 0) {
            const apiBase = process.env.NEXT_PUBLIC_API_URL
              ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
              : typeof window !== "undefined"
              ? window.location.origin
              : "";

            const formatted: TeamCard[] = rawImages
              .map((imgItem: any, idx: number) => {
                let imgUrl = "";
                let title = `Đội Ngũ Long Khánh Ford`;

                if (typeof imgItem === "string") {
                  imgUrl = imgItem;
                } else if (imgItem && typeof imgItem === "object") {
                  imgUrl =
                    imgItem.static_url ||
                    imgItem.url ||
                    imgItem.path ||
                    imgItem.file ||
                    imgItem.image ||
                    "";
                  if (imgItem.title || imgItem.alt || imgItem.name) {
                    title = imgItem.title || imgItem.alt || imgItem.name;
                  }
                }

                if (imgUrl) {
                  if (imgUrl.includes("localhost") || imgUrl.includes("127.0.0.1")) {
                    imgUrl = imgUrl.replace(/^https?:\/\/[^\/]+/, "");
                  }

                  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
                    // Full URL already
                  } else {
                    let cleaned = imgUrl.replace(/^\/+/, "");
                    if (cleaned.startsWith("uploads/")) {
                      cleaned = cleaned.substring(8);
                    }
                    if (!cleaned.startsWith("storage/") && !cleaned.startsWith("static/")) {
                      cleaned = "storage/" + cleaned;
                    }
                    imgUrl = apiBase ? `${apiBase}/${cleaned}` : `/${cleaned}`;
                  }
                }

                return {
                  id: `cms-team-${idx}`,
                  name: title,
                  image: imgUrl,
                  link: "/lien-he",
                };
              })
              .filter((card) => Boolean(card.image));

            if (formatted.length > 0) {
              let pool = [...formatted];
              while (pool.length < 8) {
                pool = [...pool, ...formatted];
              }

              const half = Math.ceil(pool.length / 2);
              setTeamRow1(pool.slice(0, half));
              setTeamRow2(pool.slice(half));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching CMS data in AboutPage:", error);
      }
    };

    fetchCMSData();
    return () => {
      active = false;
    };
  }, []);

  const handleJobClick = async (job: any) => {
    // If it's a fallback static job, it already has requirements/benefits
    if (job.requirements) {
      setSelectedJob(job);
      return;
    }

    // Otherwise, fetch full details for API job
    setSelectedJob({ ...job, loading: true });
    try {
      const res = await jobsAPI.getBySlug(job.slug) as any;
      const jobDetails = res?.job || res?.data || res;
      if (jobDetails) {
        setSelectedJob(jobDetails);
      } else {
        setSelectedJob(job);
      }
    } catch (err) {
      console.error("Error fetching job detail in AboutPage:", err);
      setSelectedJob(job);
    }
  };

  // Lock body scroll when Modal is active
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

  return (
    <div className="bg-white flex-1 min-h-screen text-[#1a1a1a]">
      {/* SECTION 1: HERO BANNER (Full-width image only with slow zoom & badge overlay) */}
      <section className="relative w-full h-[400px] md:h-[600px] lg:h-[680px] bg-gray-100 overflow-hidden border-b border-[#e5e5e5] group">
        <img
          src="/images/about/banner.jpg"
          alt="Long Khánh Ford Showroom"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
        />
        {/* Floating Glassmorphic Brand Badge */}
        <div className="absolute bottom-8 left-4 xl:left-[80px] z-10 bg-black/60 backdrop-blur-md border border-white/20 px-5 py-3 text-white flex items-center gap-3 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#066fef] animate-pulse flex-shrink-0" />
          <span className="text-xs font-bold font-antenna tracking-[0.2em] uppercase">
            LONG KHÁNH FORD &bull; ĐẠI LÝ 3S CHÍNH THỨC
          </span>
        </div>
        {/* Clean bottom border strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#066fef]" />
      </section>

      {/* SECTION 2: LỊCH SỬ HÌNH THÀNH (Asymmetric Narrative) */}
      <section id="our-story" className="py-20 border-b border-[#e5e5e5] bg-[#f8f8f8] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left label */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                <h2 className="text-sm md:text-base font-bold text-[#01095c] uppercase tracking-[0.2em] sticky top-28 font-antenna">
                  Lịch sử hình thành
                </h2>
              </ScrollReveal>
            </div>

            {/* Right content flow */}
            <div className="lg:col-span-9 flex flex-col gap-16">
              {/* Massive Intro Paragraph */}
              <ScrollReveal delay={100}>
                <p className="text-[28px] md:text-[34px] font-light leading-[1.5] text-[#1a1a1a] font-antenna max-w-[900px]">
                  Được thành lập với mục tiêu mang lại những giá trị di chuyển đích thực, Long Khánh Ford tự hào là đại lý ủy quyền chính thức đạt tiêu chuẩn 3S toàn cầu của Ford Việt Nam. Chúng tôi không ngừng nỗ lực để cung cấp các dòng xe chất lượng cao và dịch vụ hậu mãi hoàn hảo nhất cho khách hàng.
                </p>
              </ScrollReveal>

              {/* Showroom Image */}
              <ScrollReveal delay={200}>
                <div
                  onClick={() => handleImageClick("/images/about/image-introduce.jpg")}
                  className="relative w-full aspect-[16/9] rounded-none overflow-hidden border border-[#e5e5e5] group cursor-pointer"
                >
                  <img
                    src="/images/about/image-introduce.jpg"
                    alt="Showroom Long Khánh Ford"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                    <span className="text-xs font-bold text-white tracking-widest uppercase font-antenna">
                      TẬP THỂ ĐỘI NGŨ & BAN LÃNH ĐẠO LONG KHÁNH FORD
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LỊCH SỬ CHI TIẾT - DÒNG 1 (Timeline Segment 1) */}
      <section className="py-24 border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            {/* Left Block: Title & Story */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <ScrollReveal direction="up">
                <div className="flex flex-col gap-6">
                  <h3 className="text-[36px] font-bold leading-tight text-[#01095c] font-antenna uppercase max-w-[500px]">
                    LONG KHÁNH FORD
                    <span className="block text-xs font-semibold text-gray-400 tracking-wider mt-1 normal-case font-antenna">
                      Đại lý uỷ quyền của Ford Việt Nam
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 leading-[1.8] font-antenna text-justify max-w-[640px]">
                    Công ty TNHH Dịch vụ – Thương mại ô tô Tấn Phát có tên giao dịch là LONG KHÁNH FORD, thuộc địa phận Hàng Gòn, Long Khánh, Đồng Nai. Khuôn viên của Long Khánh Ford có tổng diện tích trên 3200m² bao gồm hệ thống phòng trưng bày và xưởng dịch vụ hiện đại đạt tiêu chuẩn Brand@Retail của Ford toàn cầu.
                  </p>
                </div>
              </ScrollReveal>
              
              {/* Highlight statistics block with interactive cards */}
              <ScrollReveal delay={150}>
                <div className="border-t border-[#e5e5e5] pt-8 mt-12 grid grid-cols-2 gap-6 max-w-[500px]">
                  <div className="p-4 bg-gray-50 border border-gray-100 hover:border-[#066fef] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/stat">
                    <div className="text-3xl font-bold text-[#01095c] font-antenna group-hover/stat:text-[#066fef] transition-colors">3200m²</div>
                    <div className="text-xs text-gray-500 font-antenna mt-1">Tổng diện tích mặt sàn</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 hover:border-[#066fef] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/stat">
                    <div className="text-3xl font-bold text-[#01095c] font-antenna group-hover/stat:text-[#066fef] transition-colors">Global 3S</div>
                    <div className="text-xs text-gray-500 font-antenna mt-1">Tiêu chuẩn Ford toàn cầu</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Block: Image */}
            <div className="lg:col-span-5 flex">
              <ScrollReveal direction="left" delay={200} className="w-full">
                <div
                  onClick={() => handleImageClick("/images/about/showroom-entrance.jpg")}
                  className="w-full aspect-[4/5] relative rounded-none overflow-hidden border border-[#e5e5e5] group cursor-pointer"
                >
                  <img
                    src="/images/about/showroom-entrance.jpg"
                    alt="Showroom Long Khánh Ford"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                    <span className="text-xs font-bold text-white tracking-widest uppercase font-antenna">
                      KHÔNG GIAN TRƯNG BÀY XE SANG TRỌNG
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LỊCH SỬ CHI TIẾT - DÒNG 2 (Timeline Segment 2) */}
      <section id="facilities" className="py-24 border-b border-[#e5e5e5] scroll-mt-20 bg-[#f8f8f8]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            {/* Left Block: Image */}
            <div className="lg:col-span-5 flex">
              <ScrollReveal direction="right" delay={100} className="w-full">
                <div
                  onClick={() => handleImageClick("/images/about/image-about-2.jpg")}
                  className="w-full aspect-[4/5] relative rounded-none overflow-hidden border border-[#e5e5e5] group cursor-pointer"
                >
                  <img
                    src="/images/about/image-about-2.jpg"
                    alt="Xưởng dịch vụ Long Khánh Ford"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                    <span className="text-xs font-bold text-white tracking-widest uppercase font-antenna">
                      XƯỞNG DỊCH VỤ BRAND@RETAIL ĐẠT CHUẨN
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Block: Title & Facilities details */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <ScrollReveal direction="up" delay={150}>
                <div className="flex flex-col gap-6">
                  <h3 className="text-[36px] font-bold leading-tight text-[#01095c] font-antenna uppercase max-w-[500px]">
                    TRANG THIẾT BỊ HIỆN ĐẠI
                    <span className="block text-xs font-semibold text-gray-400 tracking-wider mt-1 normal-case font-antenna">
                      Quy trình sửa chữa tiêu chuẩn toàn cầu
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 leading-[1.8] font-antenna space-y-6 text-justify max-w-[640px]">
                    <p>
                      Long Khánh Ford được trang bị các dụng cụ, thiết bị hiện đại và hoàn hảo nhất, chúng tôi tự hào là nơi cung cấp các dòng xe Ford chất lượng cao, các dịch vụ sửa chữa, bảo dưỡng tin cậy, phụ tùng phụ kiện chính hãng cũng như các chương trình ưu đãi hấp dẫn cho khách hàng.
                    </p>
                    <p>
                      Với phương châm <strong className="text-[#01095c] font-semibold">“Vui lòng khách đến, hài lòng khách đi”</strong>, Long Khánh Ford luôn trân trọng và lắng nghe tất cả các ý kiến đóng góp của Quý Khách Hàng, mong mang lại cho Khách Hàng sự hài lòng cao nhất.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Sub-features interactive cards */}
              <ScrollReveal delay={250}>
                <div className="border-t border-[#e5e5e5] pt-8 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-gray-100 hover:border-[#066fef] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-1 group/feat">
                    <span className="text-xs font-bold text-[#01095c] group-hover/feat:text-[#066fef] transition-colors tracking-widest font-antenna uppercase">01. BẢO DƯỠNG</span>
                    <span className="text-[11px] text-gray-500 font-antenna">Dịch vụ sửa chữa chung</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 hover:border-[#066fef] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-1 group/feat">
                    <span className="text-xs font-bold text-[#01095c] group-hover/feat:text-[#066fef] transition-colors tracking-widest font-antenna uppercase">02. SƠN SỬA</span>
                    <span className="text-[11px] text-gray-500 font-antenna">Đồng sơn sấy hồng ngoại</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 hover:border-[#066fef] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-1 group/feat">
                    <span className="text-xs font-bold text-[#01095c] group-hover/feat:text-[#066fef] transition-colors tracking-widest font-antenna uppercase">03. PHỤ TÙNG</span>
                    <span className="text-[11px] text-gray-500 font-antenna">Nhập khẩu chính hãng Ford</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TẦM NHÌN & ĐỘI NGŨ NHÂN SỰ (Editorial Split Vision) */}
      <section className="py-20 border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Vision Title & Subtitle */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ScrollReveal direction="up">
                <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna">
                  Tầm nhìn & Sứ mệnh
                </div>
                <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-[#01095c] font-antenna uppercase mt-2">
                  TẦM NHÌN DẪN ĐẦU DỊCH VỤ TẠI FORD
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed font-antenna text-justify mt-4">
                  Mỗi quyết định, cải tiến và hành động của chúng tôi đều hướng đến một mục tiêu duy nhất: kiến tạo trải nghiệm di chuyển an toàn, tiện nghi và trọn vẹn nhất cho mọi gia đình trên mỗi hành trình.
                </p>
              </ScrollReveal>
            </div>

            {/* Asymmetric Overlapping Photo Stack */}
            <div className="lg:col-span-8 flex flex-col md:flex-row gap-3 items-stretch">
              {/* Primary tall card */}
              <ScrollReveal delay={100} className="w-full md:w-[45%]">
                <div
                  onClick={() => handleImageClick("/images/about/image-vision-1.jpg")}
                  className="w-full aspect-[3/4] relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 group cursor-pointer h-full"
                >
                  <img
                    src="/images/about/image-vision-1.jpg"
                    alt="Vision Gallery Left"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase font-antenna">
                      ĐỘI NGŨ NHÂN SỰ & SHOWROOM
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Stacked sub-grid (staggered depth) */}
              <div className="flex-1 flex flex-col justify-between gap-3">
                {/* Horizontal image */}
                <ScrollReveal delay={200}>
                  <div
                    onClick={() => handleImageClick("/images/about/image-vision-2.jpg")}
                    className="w-full aspect-[2/1] relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 group cursor-pointer"
                  >
                    <img
                      src="/images/about/image-vision-2.jpg"
                      alt="Vision Gallery Top Right"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <span className="text-[11px] font-bold text-white tracking-wider uppercase font-antenna">
                        LỄ TÂN & ĐÓN TIẾP KHÁCH HÀNG
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Staggered double column */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <ScrollReveal delay={300} className="h-full">
                    <div
                      onClick={() => handleImageClick("/images/about/image-vision-3.jpg")}
                      className="relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 h-full min-h-[140px] group cursor-pointer"
                    >
                      <img
                        src="/images/about/image-vision-3.jpg"
                        alt="Vision Gallery Bottom Left"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                        <span className="text-[10px] font-bold text-white tracking-wider uppercase font-antenna line-clamp-1">
                          TƯ VẤN SẢN PHẨM
                        </span>
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                          <ZoomIn className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={400} className="h-full">
                    <div
                      onClick={() => handleImageClick("/images/about/image-vision-4.jpg")}
                      className="relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 h-full min-h-[140px] group cursor-pointer"
                    >
                      <img
                        src="/images/about/image-vision-4.jpg"
                        alt="Vision Gallery Bottom Right"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                        <span className="text-[10px] font-bold text-white tracking-wider uppercase font-antenna line-clamp-1">
                          SỰ KIỆN TRI ÂN
                        </span>
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                          <ZoomIn className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TUYỂN DỤNG NHÂN SỰ (Clean Table Layout) */}
      <section id="recruitment" className="bg-[#f8f8f8] py-20 border-b border-[#e5e5e5] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center gap-4 mb-12 max-w-[800px] mx-auto">
              <div>
                <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna mb-3">
                  Cơ hội nghề nghiệp
                </div>
                <h2 className="text-[36px] font-bold leading-tight text-[#01095c] font-antenna uppercase">
                  TUYỂN DỤNG NHÂN SỰ
                </h2>
              </div>
              <p className="text-sm text-gray-500 max-w-[600px] leading-relaxed font-antenna">
                Gia nhập đội ngũ Long Khánh Ford để cùng phát triển sự nghiệp trong môi trường chuyên nghiệp, năng động toàn cầu.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid of flat cards: 3 cols layout */}
          {jobs.length === 0 ? (
            <ScrollReveal delay={150}>
              <div className="text-center py-16 bg-white border border-[#e5e5e5] max-w-xl mx-auto w-full p-8 mt-8 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-gray-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#01095c] font-antenna uppercase tracking-tight">
                  Không có vị trí tuyển dụng
                </h3>
                <p className="text-xs text-gray-400 font-antenna leading-relaxed max-w-sm">
                  Hiện tại chúng tôi chưa có tin tuyển dụng mới. Vui lòng quay lại sau hoặc liên hệ trực tiếp để biết thêm chi tiết.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
              {jobs.map((job, idx) => (
                <ScrollReveal key={idx} delay={idx * 100} className="h-full">
                  <div
                    onClick={() => handleJobClick(job)}
                    className="bg-white rounded-none p-6 md:p-8 flex flex-col justify-between border border-[#e5e5e5] hover:border-[#066fef] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer h-full"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Top Row: Logo & Department Badge */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Logo Ford Oval */}
                        <div className="w-[85.3px] h-8 relative flex-shrink-0 flex items-center">
                          <img
                            src="/ford_logo.svg"
                            alt="Ford Logo"
                            width={85}
                            height={32}
                            className="w-[85.3px] h-8 object-contain block"
                          />
                        </div>
                        
                        {/* Small department tag */}
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-antenna bg-gray-50 border border-gray-100 px-2.5 py-1">
                          {job.working_position ? job.working_position.replace("Phòng ", "").replace("Xưởng ", "") : "Tuyển dụng"}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col gap-2 mt-2">
                        <h3 className="text-base font-bold leading-snug text-[#01095c] font-antenna group-hover:text-[#066fef] transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-sm font-normal leading-[1.6] text-gray-500 font-antenna line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row: Location & CTA Toggle button */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                      <span className="text-xs text-gray-400 font-antenna truncate max-w-[170px]" title={job.work_address || job.location}>
                        {job.work_address ? job.work_address.split(",")[0] : job.location ? job.location.split(",")[0] : "Biên Hòa"}
                      </span>
                      
                      {/* Interactive square toggle button */}
                      <div className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-gray-200 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#066fef] group-hover:border-[#066fef] text-[#066fef] group-hover:text-white shadow-sm">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7: SLIDER ĐỘI NGŨ (Filmstrip Infinite Stream) */}
      <section id="board-of-directors" className="bg-white py-24 overflow-hidden scroll-mt-20 w-full border-t border-[#e5e5e5]">
        <style>{`
          @keyframes marquee-left {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes marquee-right {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .animate-marquee-l {
            display: flex;
            width: max-content;
            animation: marquee-left 35s linear infinite;
          }
          .animate-marquee-r {
            display: flex;
            width: max-content;
            animation: marquee-right 35s linear infinite;
          }
          .animate-marquee-l:hover,
          .animate-marquee-r:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full mb-12">
          <ScrollReveal direction="up">
            {/* Header Row */}
            <div className="text-center max-w-[800px] mx-auto">
              <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna mb-3">
                Đồng hành phát triển
              </div>
              <h2 className="text-[36px] md:text-[44px] font-bold text-[#01095c] leading-tight font-antenna uppercase">
                ĐỘI NGŨ LONG KHÁNH FORD
              </h2>
            </div>
          </ScrollReveal>
        </div>

        {/* Carousel rows container */}
        <div className="flex flex-col gap-6 w-full relative">
          
          {/* Row 1: Sliding Left */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-l gap-6">
              {[...teamRow1, ...teamRow1].map((card, idx) => (
                <div
                  key={`r1-${card.id}-${idx}`}
                  onClick={() => handleImageClick(card.image)}
                  className="w-[320px] md:w-[420px] h-[220px] md:h-[280px] relative flex-shrink-0 rounded-none overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-[#066fef] tracking-widest uppercase">
                        SỰ KIỆN & ĐỘI NGŨ
                      </span>
                      <span className="text-sm font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Right */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-r gap-6">
              {[...teamRow2, ...teamRow2].map((card, idx) => (
                <div
                  key={`r2-${card.id}-${idx}`}
                  onClick={() => handleImageClick(card.image)}
                  className="w-[320px] md:w-[420px] h-[220px] md:h-[280px] relative flex-shrink-0 rounded-none overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-[#066fef] tracking-widest uppercase">
                        CƠ SỞ VẬT CHẤT & ĐỘI NGŨ
                      </span>
                      <span className="text-sm font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* RECRUITMENT MODAL (Option A) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#e5e5e5] p-8 flex flex-col gap-6 scrollbar-thin">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-2">
              <div className="w-[85.3px] h-8 relative flex items-center">
                <img
                  src="/ford_logo.svg"
                  alt="Ford Logo"
                  width={85}
                  height={32}
                  className="w-[85.3px] h-8 object-contain block"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#01095c] font-antenna mt-2 uppercase tracking-tight">
                {selectedJob.title}
              </h2>
              <p className="text-xs font-bold text-[#066fef] uppercase tracking-wider font-antenna">
                {selectedJob.department || selectedJob.working_position || "Phòng nhân sự"} &bull; {selectedJob.location || selectedJob.work_address || "Biên Hòa, Đồng Nai"}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed font-antenna">
              {selectedJob.loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#066fef]" />
                </div>
              ) : (
                <>
                  {selectedJob.content ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-700
                        prose-headings:text-[#00095B] prose-headings:font-bold
                        prose-a:text-[#066fef] prose-strong:text-[#1a1a1a]
                        prose-li:marker:text-[#066fef]"
                      dangerouslySetInnerHTML={{ __html: selectedJob.content }}
                    />
                  ) : (
                    <>
                      <p className="italic text-gray-600 bg-gray-50 p-4 rounded-none border-l-4 border-[#066fef]">
                        {selectedJob.description}
                      </p>

                      {/* Job Requirements */}
                      {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                            YÊU CẦU CÔNG VIỆC
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            {selectedJob.requirements.map((req: string, rIdx: number) => (
                              <li key={rIdx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Job Benefits */}
                      {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                            QUYỀN LỢI ĐƯỢC HƯỞNG
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            {selectedJob.benefits.map((ben: string, bIdx: number) => (
                              <li key={bIdx}>{ben}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Apply Button CTA */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Link
                href={selectedJob.slug ? `/tuyen-dung/${selectedJob.slug}` : "/lien-he"}
                onClick={() => setSelectedJob(null)}
                className="w-full md:w-auto text-center px-6 py-3 bg-[#066fef] hover:bg-[#01095c] text-white font-semibold text-xs tracking-widest uppercase rounded-[4px] transition-colors duration-200 shadow-sm"
              >
                Nộp đơn ứng tuyển
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {lightbox.isOpen && lightbox.images.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 md:p-8 backdrop-blur-md select-none animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#066fef] tracking-widest uppercase font-antenna bg-white/10 px-3 py-1 border border-white/10">
                LONG KHÁNH FORD GALLERY
              </span>
              <span className="text-xs text-gray-300 font-antenna">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Viewport with Nav Arrows */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#066fef] border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-110 focus:outline-none shadow-2xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={lightbox.images[lightbox.currentIndex]?.src}
                alt={lightbox.images[lightbox.currentIndex]?.title || "Gallery photo"}
                className="max-w-[90vw] max-h-[75vh] object-contain shadow-2xl border border-white/10 transition-all duration-300"
              />
            </div>

            <button
              onClick={nextImage}
              className="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#066fef] border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-110 focus:outline-none shadow-2xl"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Footer Info & Thumbnails */}
          <div className="flex flex-col items-center gap-3 text-center z-10 max-w-3xl mx-auto w-full">
            <div className="text-sm md:text-base font-bold text-white font-antenna tracking-wide uppercase truncate max-w-full">
              {lightbox.images[lightbox.currentIndex]?.title}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-1.5 scrollbar-none">
              {lightbox.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightbox((prev) => ({ ...prev, currentIndex: idx }))}
                  className={`w-12 h-8 relative flex-shrink-0 border transition-all ${
                    idx === lightbox.currentIndex
                      ? "border-[#066fef] opacity-100 scale-110 shadow-lg"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
