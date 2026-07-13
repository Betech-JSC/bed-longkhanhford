"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { aboutAssets, handleImageError } from "@/lib/site-assets";
import { jobsAPI } from "@/lib/api";

// Recruitment position data
interface JobPosition {
  title: string;
  department: string;
  location: string;
  shortDesc: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobPositions: JobPosition[] = [
  {
    title: "Chuyên viên Tư bán Bán hàng (Sales)",
    department: "Phòng Kinh doanh",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Đam mê ngành ô tô, giao tiếp tốt, có kỹ năng tư vấn và chăm sóc khách hàng.",
    description: "Chúng tôi tìm kiếm những cộng sự đam mê ngành ô tô, năng động và mong muốn bứt phá thu nhập, đại diện cho hình ảnh chuyên nghiệp của Long Khánh Ford.",
    requirements: [
      "Tốt nghiệp Cao đẳng trở lên các ngành Quản trị kinh doanh, Marketing, Kỹ thuật ô tô...",
      "Yêu thích kinh doanh, giao tiếp tốt, tác phong lịch sự, chuyên nghiệp.",
      "Có kỹ năng tư vấn, thuyết phục và chăm sóc khách hàng.",
      "Ưu tiên ứng viên có kinh nghiệm bán hàng ô tô hoặc có bằng lái xe hạng B2."
    ],
    benefits: [
      "Thu nhập hấp dẫn: Lương cơ bản + Hoa hồng doanh số vượt trội (không giới hạn).",
      "Được đào tạo bài bản quy trình bán hàng tiêu chuẩn toàn cầu của Ford.",
      "Chế độ bảo hiểm xã hội, bảo hiểm y tế đầy đủ theo quy định.",
      "Cơ hội thăng tiến lên Trưởng nhóm, Trưởng phòng kinh doanh."
    ]
  },
  {
    title: "Kỹ thuật viên Sửa chữa Chung (Máy - Gầm - Điện)",
    department: "Xưởng Dịch vụ",
    location: "Xưởng dịch vụ Long Khánh Ford, Biên Hòa",
    shortDesc: "Đảm nhận công việc chẩn đoán, sửa chữa và bảo dưỡng các dòng xe Ford theo tiêu chuẩn.",
    description: "Đảm nhận công việc chẩn đoán, sửa chữa và bảo dưỡng các dòng xe Ford theo tiêu chuẩn kỹ thuật nghiêm ngặt nhằm mang đến sự an toàn tuyệt đối cho khách hàng.",
    requirements: [
      "Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành Công nghệ kỹ thuật Ô tô hoặc tương đương.",
      "Có ít nhất 1 năm kinh nghiệm sửa chữa máy gầm điện ô tô.",
      "Sử dụng thành thạo các thiết bị chẩn đoán, đo đạc chuyên dụng.",
      "Chăm chỉ, trung thực, có tinh thần trách nhiệm cao."
    ],
    benefits: [
      "Thu nhập cạnh tranh theo năng suất và tay nghề.",
      "Môi trường làm việc chuyên nghiệp, trang bị công nghệ chẩn đoán hiện đại bậc nhất.",
      "Được đào tạo và thi chứng chỉ kỹ thuật viên cấp độ của Ford Việt Nam.",
      "Hỗ trợ cơm trưa, đồng phục và bảo hộ lao động đầy đủ."
    ]
  },
  {
    title: "Nhân viên Cố vấn Dịch vụ",
    department: "Phòng Dịch vụ",
    location: "Xưởng dịch vụ Long Khánh Ford, Biên Hòa",
    shortDesc: "Đại diện tiếp đón khách hàng, tiếp nhận yêu cầu, tư vấn dịch vụ và bàn giao xe.",
    description: "Đại diện đại lý tiếp đón khách hàng, tiếp nhận yêu cầu sửa chữa, tư vấn dịch vụ kỹ thuật tối ưu và bàn giao xe chu đáo.",
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học chuyên ngành Công nghệ Ô tô hoặc Cơ khí động lực.",
      "Giao tiếp tự tin, khéo léo, khả năng giải quyết tình huống tốt.",
      "Am hiểu về kỹ thuật ô tô và quy trình dịch vụ sau bán hàng.",
      "Có bằng lái xe B2 là một lợi thế lớn."
    ],
    benefits: [
      "Lương cứng + Thưởng hiệu quả công việc phòng Dịch vụ.",
      "Tham gia các khóa đào tạo nâng cao nghiệp vụ Cố vấn dịch vụ do Ford Việt Nam tổ chức.",
      "Lộ trình thăng tiến rõ ràng trong hệ thống đại lý.",
      "Chế độ nghỉ mát, khám sức khỏe định kỳ hàng năm."
    ]
  },
  {
    title: "Chuyên viên Marketing & Chăm sóc Khách hàng",
    department: "Phòng Hành chính - CS",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Lên kế hoạch, thực hiện chiến dịch truyền thông quảng cáo và quản trị trải nghiệm khách hàng.",
    description: "Lên kế hoạch, thực hiện các chiến dịch truyền thông quảng cáo trực tuyến, chăm sóc thương hiệu và nâng cao trải nghiệm khách hàng.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Marketing, Quan hệ công chúng hoặc Quản trị kinh doanh.",
      "Có tối thiểu 1 năm kinh nghiệm làm Digital Marketing hoặc chăm sóc khách hàng chăm sóc thương hiệu.",
      "Kỹ năng viết content tốt, sử dụng cơ bản các công cụ thiết kế/video.",
      "Nhiệt tình, chu đáo, có kỹ năng lắng nghe và giải quyết khiếu nại."
    ],
    benefits: [
      "Lương thỏa thuận theo năng lực + Thưởng KPI chiến dịch.",
      "Môi trường trẻ trung, sáng tạo, thỏa sức thực hiện các ý tưởng mới.",
      "Hưởng đầy đủ phúc lợi BHXH, BHYT và thưởng các dịp Lễ, Tết.",
      "Được tham gia các sự kiện ra mắt xe hoành tráng của Ford."
    ]
  },
  {
    title: "Nhân viên Kế toán Tổng hợp",
    department: "Phòng Tài chính - Kế toán",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Kiểm tra chứng từ, hạch toán doanh thu, lập báo cáo thuế và báo cáo tài chính nội bộ.",
    description: "Kiểm tra chứng từ, hạch toán doanh thu chi phí, lập báo cáo thuế và báo cáo tài chính nội bộ định kỳ đảm bảo tính chính xác và minh bạch tài chính.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Kế toán, Kiểm toán hoặc Tài chính doanh nghiệp.",
      "Có ít nhất 2 năm kinh nghiệm làm kế toán tổng hợp, ưu tiên lĩnh vực thương mại dịch vụ ô tô.",
      "Sử dụng thành thạo phần mềm kế toán (Misa, Fast...) và Excel nâng cao.",
      "Cẩn thận, tỉ mỉ, trung thực và có trách nhiệm cao trong công việc."
    ],
    benefits: [
      "Thu nhập ổn định và xứng đáng với năng lực.",
      "Chế độ tăng lương định kỳ hàng năm theo đánh giá công việc.",
      "Làm việc giờ hành chính từ thứ Hai đến thứ Bảy (nghỉ Chủ Nhật).",
      "Được đóng bảo hiểm đầy đủ ngay sau khi kết thúc thử việc."
    ]
  }
];

// Featured team/vehicles list for bottom slider
interface TeamVehicle {
  id: string;
  name: string;
  image: string;
  link: string;
  quoteLink: string;
}

const teamVehicles: TeamVehicle[] = [
  {
    id: "team-le-ban-giao",
    name: "Lễ Bàn Giao Xe Mới Cho Khách Hàng",
    image: "/images/team/team_1.png",
    link: "/lien-he",
    quoteLink: "/lien-he"
  },
  {
    id: "team-tu-van-sales",
    name: "Đội Ngũ Tư Vấn Bán Hàng Chuyên Nghiệp",
    image: "/images/team/team_3.png",
    link: "/lien-he",
    quoteLink: "/lien-he"
  },
  {
    id: "team-su-kien-lai-thu",
    name: "Sự Kiện Trưng Bày & Trải Nghiệm Lái Thử Xe",
    image: "/images/team/team_2.png",
    link: "/dang-ky-lai-thu",
    quoteLink: "/dang-ky-lai-thu"
  }
];

// Create a base array that has at least 6 elements to support smooth infinite loop on all screen widths
const getBaseCards = () => {
  let base = [...teamVehicles];
  if (base.length > 0) {
    while (base.length < 6) {
      base = [...base, ...teamVehicles];
    }
  }
  return base;
};

const baseCards = getBaseCards();
const N = baseCards.length;
const duplicatedCards = [...baseCards, ...baseCards, ...baseCards];

const initialCardOffsets: number[] = (() => {
  const defaultWidths = [427, 660, 333];
  const gap = 24;
  const offsets: number[] = [];
  let current = 0;
  for (let i = 0; i < duplicatedCards.length; i++) {
    offsets.push(current);
    const cardWidth = teamVehicles.length > 0 ? defaultWidths[(i % teamVehicles.length) % defaultWidths.length] : 427;
    current += cardWidth + gap;
  }
  return offsets;
})();

export default function AboutPage() {
  // Modal State for recruitment details
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // API Jobs State
  const [jobs, setJobs] = useState<any[]>([]);

  // Fetch jobs from API
  useEffect(() => {
    let active = true;
    const fetchJobs = async () => {
      try {
        const res = await jobsAPI.getAll() as any;
        const items = res?.jobs || res?.data || res;
        if (active && Array.isArray(items) && items.length > 0) {
          setJobs(items);
        }
      } catch (error) {
        console.error("Error fetching jobs in AboutPage:", error);
      }
    };
    fetchJobs();
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

  // Slider State (Infinite Loop support)
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardOffsets, setCardOffsets] = useState<number[]>(initialCardOffsets);
  const [activeIndex, setActiveIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);

  // Dynamically measure cards left offset relative to translated container on mount & resize
  const measureCards = useCallback(() => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children) as HTMLElement[];
    const offsets = children.map((child) => child.offsetLeft);
    setCardOffsets(offsets);
  }, []);

  useEffect(() => {
    measureCards();
    // Allow a small delay for image assets to load fully and measure dimensions
    const timer = setTimeout(measureCards, 500);
    window.addEventListener("resize", measureCards);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureCards);
    };
  }, [measureCards]);

  // Autoplay handler (pauses on hover or user interaction)
  useEffect(() => {
    if (isHovered || isInteracted) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, isInteracted]);

  // Reset interaction timer to resume autoplay after 5s of inactivity
  useEffect(() => {
    if (isInteracted) {
      const timer = setTimeout(() => {
        setIsInteracted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInteracted]);

  const handleTransitionEnd = () => {
    // Snap back to middle set if active index scrolls beyond bounds
    if (activeIndex >= 2 * N) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex - N);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 0);
    } else if (activeIndex < N) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex + N);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 0);
    }
  };

  const handlePrev = () => {
    setIsInteracted(true);
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsInteracted(true);
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
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

  // Compute translation width
  const currentOffset = cardOffsets[activeIndex] || 0;

  return (
    <div className="bg-[#F8F8F8] flex-1 min-h-screen">
      {/* SECTION 1: HERO BANNER (Frame 1000005577) */}
      <section className="relative w-full h-[480px] bg-slate-900 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/banner.jpg"
            alt="Long Khánh Ford Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Rectangle 2017: Black gradient shadow overlay on bottom (170px height) */}
          <div className="absolute bottom-0 left-0 right-0 h-[170px] bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      </section>

      {/* SECTION 2: LỊCH SỬ HÌNH THÀNH (Frame 1000005584) */}
      <section id="our-story" className="py-[72px] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-20">
          {/* Paragraph intro text */}
          <p className="text-[28px] font-normal leading-[42px] text-[#1a1a1a] max-w-[1152px] font-antenna">
            Được thành lập với mục tiêu mang lại những giá trị di chuyển đích thực, Long Khánh Ford tự hào là đại lý ủy quyền chính thức đạt tiêu chuẩn 3S toàn cầu của Ford Việt Nam. Chúng tôi không ngừng nỗ lực để cung cấp các dòng xe chất lượng cao và dịch vụ hậu mãi hoàn hảo nhất cho khách hàng.
          </p>

          {/* Showroom Image (Rectangle 2024 - 1152x576px, rounded-none) */}
          <div className="relative w-full aspect-[2/1] rounded-none overflow-hidden shadow-xs border border-[#e5e5e5]">
            <img
              src="/images/about/image-introduce.jpg"
              alt="Showroom Long Khánh Ford"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: LỊCH SỬ CHI TIẾT - DÒNG 1 (Frame 1000005587) */}
      <section className="py-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col lg:flex-row gap-20 items-center">
          {/* Left Text Block */}
          <div className="w-full lg:w-[536px] flex flex-col gap-6">
            <h2 className="text-[36px] font-semibold leading-[47.52px] text-[#00095b] font-antenna uppercase">
              LONG KHÁNH FORD
              <br />
              ĐẠI LÝ ỦY QUYỀN FORD VIỆT NAM
            </h2>
            <p className="text-base text-gray-600 leading-6 font-antenna">
              Công ty TNHH Dịch vụ – Thương mại TẤN PHÁT ĐẠT, được thành lập vào tháng 12 năm 2006 với tên giao dịch là LONG KHÁNH FORD, nằm trên quốc lộ 1A nối liền hai miền Nam Bắc ngay ngã tư KCN Amata, khuôn viên của Long Khánh Ford có tổng diện tích trên 3200m2 bao gồm hệ thống phòng trưng bày và xưởng dịch vụ hiện đại đạt tiêu chuẩn Brand@Retail của Ford toàn cầu.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[536px] h-[349.68px] relative rounded-none overflow-hidden border border-[#e5e5e5]">
            <img
              src="/images/about/image-about-1.jpg"
              alt="Xưởng Dịch vụ Long Khánh Ford"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: LỊCH SỬ CHI TIẾT - DÒNG 2 (Frame 1000005588) */}
      <section id="facilities" className="py-[72px] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col lg:flex-row-reverse gap-20 items-center">
          {/* Right Text Block */}
          <div className="w-full lg:w-[536px] flex flex-col gap-6">
            <div className="text-base text-gray-600 leading-6 font-antenna space-y-4">
              <p>
                Long Khánh Ford được trang bị các dụng cụ, thiết bị hiện đại và hoàn hảo nhất và tự hào cung cấp các dòng xe Ford chất lượng cao, các dịch vụ sửa chữa, bảo dưỡng tin cậy, phụ tùng phụ kiện chính hãng cũng như các chương trình ưu đãi hấp dẫn cho khách hàng.
              </p>
              <p>
                Với phương châm “Vui lòng khách đến, hài lòng khách đi”, Long Khánh Ford luôn trân trọng và lắng nghe tất cả các ý kiến đóng góp của quý khách hàng, mong mang lại cho khách hàng sự hài lòng cao nhất.
              </p>
            </div>
          </div>

          {/* Left Image */}
          <div className="w-full lg:w-[536px] h-[349.68px] relative rounded-none overflow-hidden border border-[#e5e5e5]">
            <img
              src="/images/about/image-about-2.jpg"
              alt="Thiết bị sửa chữa Long Khánh Ford"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: TẦM NHÌN & ĐỘI NGŨ NHÂN SỰ (Frame 1000005589) */}
      <section className="bg-[#066fef] py-[72px] text-white w-full scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-10">
          {/* Header Block */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[36px] font-semibold leading-[47.52px] font-antenna uppercase">
              Tầm nhìn dẫn đầu dịch vụ tại Ford
            </h2>
            <p className="text-[20px] font-normal leading-[30px] text-white/90 max-w-[1152px] font-antenna">
              Mỗi quyết định, cải tiến và hành động của chúng tôi đều hướng đến một mục tiêu duy nhất: kiến tạo trải nghiệm di chuyển an toàn, tiện nghi và trọn vẹn nhất cho mọi gia đình trên mỗi hành trình.
            </p>
          </div>

          {/* Asymmetric Gallery (1152x600px container) */}
          <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[600px]">
            {/* Left Column (500x600px image) */}
            <div className="w-full md:w-[500px] h-[350px] md:h-full relative rounded-none overflow-hidden border border-white/10">
              <img
                src="/images/about/image-vision-1.jpg"
                alt="Vision Gallery Left"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Column (636x600px flex stack) */}
            <div className="flex-1 md:w-[636px] flex flex-col gap-4 h-auto md:h-full">
              {/* Top row image (636x292px) */}
              <div className="w-full h-[180px] md:h-[292px] relative rounded-none overflow-hidden border border-white/10">
                <img
                  src="/images/about/image-vision-2.jpg"
                  alt="Vision Gallery Top Right"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Bottom row (two 310x292px images) */}
              <div className="grid grid-cols-2 gap-4 h-[150px] md:h-[292px]">
                <div className="relative rounded-none overflow-hidden border border-white/10 h-full">
                  <img
                    src="/images/about/image-vision-3.jpg"
                    alt="Vision Gallery Bottom Left"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="relative rounded-none overflow-hidden border border-white/10 h-full">
                  <img
                    src="/images/about/image-vision-4.jpg"
                    alt="Vision Gallery Bottom Right"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TUYỂN DỤNG NHÂN SỰ (Frame 1000005586) */}
      <section id="recruitment" className="bg-[#f0f0f0] py-16 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-8">
          <h2 className="text-[36px] font-semibold leading-[47.52px] text-[#1a1a1a] font-antenna uppercase text-center">
            TUYỂN DỤNG NHÂN SỰ
          </h2>

          {/* List of flat cards */}
          <div className="max-w-[800px] w-full mx-auto flex flex-col gap-6">
            {(() => {
              const displayJobs = jobs.length > 0 ? jobs : jobPositions;
              return displayJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => handleJobClick(job)}
                  className="w-full bg-white rounded-none p-6 flex items-center gap-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
                >
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

                  {/* Job Title and Short Description */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h3 className="text-base font-semibold leading-6 text-[#1a1a1a] font-antenna truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm font-normal leading-[19.6px] text-gray-500 font-antenna truncate">
                      {job.description || job.shortDesc}
                    </p>
                  </div>

                  {/* Interactive square toggle button */}
                  <div className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-gray-200 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#066fef] group-hover:border-[#066fef] text-[#066fef] group-hover:text-white">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* SECTION 7: SLIDER CÁC DÒNG XE NỔI BẬT (Board of Directors / Team collection) */}
      <section id="board-of-directors" className="bg-white py-[72px] overflow-hidden scroll-mt-20 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          {/* Header Row */}
          <div className="flex justify-between items-end gap-6 mb-10">
            <div>
              <h2 className="text-[48px] font-semibold text-[#1a1a1a] leading-[57.6px] font-antenna uppercase">
                Đội ngũ Ford Long Khánh
              </h2>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-[4px] bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-[4px] bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                aria-label="Next slide"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider Outer Wrapper - full viewport width */}
        <div
          className="w-full relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Flex row container with dynamic translation width */}
          <div
            ref={containerRef}
            className="flex gap-6 select-none"
            style={{
              transform: `translateX(-${currentOffset}px)`,
              transition: isTransitioning ? "transform 500ms ease-in-out" : "none"
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {duplicatedCards.map((card, idx) => {
              // Determine SSR default widths based on layout cards logic
              const origIdx = idx % teamVehicles.length;
              const defaultWidth = origIdx === 0 ? 427 : origIdx === 1 ? 660 : 333;

              return (
                <Link
                  key={`${card.id}-${idx}`}
                  href={card.link}
                  className="h-[480px] relative flex-shrink-0 rounded-none overflow-hidden group cursor-pointer block border border-gray-200"
                  style={{ width: `${defaultWidth}px` }}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onLoad={measureCards}
                    onError={handleImageError}
                  />
                  {/* Dark overlay showing text on hover */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="text-[18px] font-semibold text-white text-center font-antenna uppercase truncate max-w-full">
                      {card.name}
                    </span>
                  </div>
                </Link>
              );
            })}
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
              <h2 className="text-2xl font-semibold text-[#1a1a1a] font-antenna mt-2">
                {selectedJob.title}
              </h2>
              <p className="text-xs font-bold text-[#0562d2] uppercase tracking-wider font-antenna">
                {selectedJob.department || selectedJob.working_position || "Phòng nhân sự"} &bull; {selectedJob.location || selectedJob.work_address || "Biên Hòa, Đồng Nai"}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed font-antenna">
              {selectedJob.loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0562d2]" />
                </div>
              ) : (
                <>
                  {selectedJob.content ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-700
                        prose-headings:text-[#00095B] prose-headings:font-bold
                        prose-a:text-[#0562d2] prose-strong:text-[#1a1a1a]
                        prose-li:marker:text-[#0562d2]"
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
    </div>
  );
}
