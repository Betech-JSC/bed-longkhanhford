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
  { id: "r2-2", name: "Xưởng Dịch Vụ Đạt Chuẩn Brand@Retail", image: "/images/about/image-about-1.jpg", link: "/lien-he" },
  { id: "r2-3", name: "Trang Thiết Bị Sửa Chữa Chuyên Dụng", image: "/images/about/image-about-2.jpg", link: "/lien-he" },
  { id: "r2-4", name: "Không Gian Trưng Bày Xe Cao Cấp", image: "/images/about/image-vision-1.jpg", link: "/lien-he" },
];

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
      {/* SECTION 1: HERO BANNER (Full-width image only) */}
      <section className="relative w-full h-[400px] md:h-[600px] lg:h-[680px] bg-gray-100 overflow-hidden border-b border-[#e5e5e5]">
        <img
          src="/images/about/banner.jpg"
          alt="Long Khánh Ford Showroom"
          className="w-full h-full object-cover object-center"
        />
        {/* Clean bottom border strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#066fef]" />
      </section>

      {/* SECTION 2: LỊCH SỬ HÌNH THÀNH (Asymmetric Narrative) */}
      <section id="our-story" className="py-20 border-b border-[#e5e5e5] bg-[#f8f8f8] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left label */}
            <div className="lg:col-span-3">
              <h2 className="text-sm md:text-base font-bold text-[#01095c] uppercase tracking-[0.2em] sticky top-28 font-antenna">
                Lịch sử hình thành
              </h2>
            </div>

            {/* Right content flow */}
            <div className="lg:col-span-9 flex flex-col gap-16">
              {/* Massive Intro Paragraph */}
              <p className="text-[28px] md:text-[34px] font-light leading-[1.5] text-[#1a1a1a] font-antenna max-w-[900px]">
                Được thành lập với mục tiêu mang lại những giá trị di chuyển đích thực, Long Khánh Ford tự hào là đại lý ủy quyền chính thức đạt tiêu chuẩn 3S toàn cầu của Ford Việt Nam. Chúng tôi không ngừng nỗ lực để cung cấp các dòng xe chất lượng cao và dịch vụ hậu mãi hoàn hảo nhất cho khách hàng.
              </p>

              {/* Showroom Image */}
              <div className="relative w-full aspect-[16/9] rounded-none overflow-hidden border border-[#e5e5e5]">
                <img
                  src="/images/about/image-introduce.jpg"
                  alt="Showroom Long Khánh Ford"
                  className="w-full h-full object-cover object-center"
                />
              </div>
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
              <div className="flex flex-col gap-6">
                <h3 className="text-[36px] font-bold leading-tight text-[#01095c] font-antenna uppercase max-w-[500px]">
                  LONG KHÁNH FORD
                  <span className="block text-xs font-semibold text-gray-400 tracking-wider mt-1 normal-case font-antenna">
                    Đại lý uỷ quyền của Ford Việt Nam
                  </span>
                </h3>
                <p className="text-sm text-gray-600 leading-[1.8] font-antenna text-justify max-w-[640px]">
                  Công ty TNHH Dịch vụ – Thương mại ô tô Tấn Phát có tên giao dịch là LONG KHÁNH FORD, thuộc địa phận Xuân Tân, Long Khánh, Đồng Nai. Khuôn viên của Long Khánh Ford có tổng diện tích trên 3200m² bao gồm hệ thống phòng trưng bày và xưởng dịch vụ hiện đại đạt tiêu chuẩn Brand@Retail của Ford toàn cầu.
                </p>
              </div>
              
              {/* Highlight statistics block */}
              <div className="border-t border-[#e5e5e5] pt-8 mt-12 grid grid-cols-2 gap-6 max-w-[500px]">
                <div>
                  <div className="text-3xl font-bold text-[#01095c] font-antenna">3200m²</div>
                  <div className="text-xs text-gray-400 font-antenna mt-1">Tổng diện tích mặt sàn</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#01095c] font-antenna">Global 3S</div>
                  <div className="text-xs text-gray-400 font-antenna mt-1">Tiêu chuẩn Ford toàn cầu</div>
                </div>
              </div>
            </div>

            {/* Right Block: Image */}
            <div className="lg:col-span-5 aspect-[4/5] relative rounded-none overflow-hidden border border-[#e5e5e5]">
              <img
                src="/images/about/image-about-1.jpg"
                alt="Showroom Long Khánh Ford"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LỊCH SỬ CHI TIẾT - DÒNG 2 (Timeline Segment 2) */}
      <section id="facilities" className="py-24 border-b border-[#e5e5e5] scroll-mt-20 bg-[#f8f8f8]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            {/* Left Block: Image */}
            <div className="lg:col-span-5 aspect-[4/5] relative rounded-none overflow-hidden border border-[#e5e5e5]">
              <img
                src="/images/about/image-about-2.jpg"
                alt="Xưởng dịch vụ Long Khánh Ford"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Block: Title & Facilities details */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
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

              {/* Sub-features or visual bullet cards */}
              <div className="border-t border-[#e5e5e5] pt-8 mt-12 grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#01095c] tracking-widest font-antenna uppercase">01. BẢO DƯỠNG</span>
                  <span className="text-[11px] text-gray-400 font-antenna">Dịch vụ sửa chữa chung</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#01095c] tracking-widest font-antenna uppercase">02. SƠN SỬA</span>
                  <span className="text-[11px] text-gray-400 font-antenna">Đồng sơn sấy hồng ngoại</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#01095c] tracking-widest font-antenna uppercase">03. PHỤ TÙNG</span>
                  <span className="text-[11px] text-gray-400 font-antenna">Nhập khẩu chính hãng Ford</span>
                </div>
              </div>
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
              <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna">
                Tầm nhìn & Sứ mệnh
              </div>
              <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-[#01095c] font-antenna uppercase">
                TẦM NHÌN DẪN ĐẦU DỊCH VỤ TẠI FORD
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-antenna text-justify">
                Mỗi quyết định, cải tiến và hành động của chúng tôi đều hướng đến một mục tiêu duy nhất: kiến tạo trải nghiệm di chuyển an toàn, tiện nghi và trọn vẹn nhất cho mọi gia đình trên mỗi hành trình.
              </p>
            </div>

            {/* Asymmetric Overlapping Photo Stack */}
            <div className="lg:col-span-8 flex flex-col md:flex-row gap-6 items-stretch">
              {/* Primary tall card */}
              <div className="w-full md:w-[45%] aspect-[3/4] relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100">
                <img
                  src="/images/about/image-vision-1.jpg"
                  alt="Vision Gallery Left"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Stacked sub-grid (staggered depth) */}
              <div className="flex-1 flex flex-col justify-between gap-6">
                {/* Horizontal image */}
                <div className="w-full aspect-[2/1] relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100">
                  <img
                    src="/images/about/image-vision-2.jpg"
                    alt="Vision Gallery Top Right"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Staggered double column */}
                <div className="grid grid-cols-2 gap-6 flex-1">
                  <div className="relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 h-full min-h-[140px]">
                    <img
                      src="/images/about/image-vision-3.jpg"
                      alt="Vision Gallery Bottom Left"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="relative rounded-none overflow-hidden border border-[#e5e5e5] bg-gray-100 h-full min-h-[140px]">
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
        </div>
      </section>

      {/* SECTION 6: TUYỂN DỤNG NHÂN SỰ (Clean Table Layout) */}
      <section id="recruitment" className="bg-[#f8f8f8] py-20 border-b border-[#e5e5e5] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
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

          {/* Grid of flat cards: 3 cols layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            {(() => {
              const displayJobs = jobs.length > 0 ? jobs : jobPositions;
              return displayJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-none p-6 md:p-8 flex flex-col justify-between border border-[#e5e5e5] hover:border-[#066fef] hover:shadow-md transition-all duration-300 group cursor-pointer h-full"
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
                        {job.department ? job.department.replace("Phòng ", "").replace("Xưởng ", "") : "Tuyển dụng"}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col gap-2 mt-2">
                      <h3 className="text-base font-bold leading-snug text-[#01095c] font-antenna group-hover:text-[#066fef] transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-sm font-normal leading-[1.6] text-gray-500 font-antenna line-clamp-3">
                        {job.description || job.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Footer Row: Location & CTA Toggle button */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                    <span className="text-xs text-gray-400 font-antenna truncate max-w-[170px]" title={job.location}>
                      {job.location ? job.location.split(",")[0] : "Biên Hòa"}
                    </span>
                    
                    {/* Interactive square toggle button */}
                    <div className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-gray-200 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#066fef] group-hover:border-[#066fef] text-[#066fef] group-hover:text-white">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
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
          {/* Header Row */}
          <div className="text-center max-w-[800px] mx-auto">
            <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna mb-3">
              Đồng hành phát triển
            </div>
            <h2 className="text-[36px] md:text-[44px] font-bold text-[#01095c] leading-tight font-antenna uppercase">
              ĐỘI NGŨ LONG KHÁNH FORD
            </h2>
          </div>
        </div>

        {/* Carousel rows container */}
        <div className="flex flex-col gap-6 w-full relative">
          
          {/* Row 1: Sliding Left */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-l gap-6">
              {[...row1Cards, ...row1Cards].map((card, idx) => (
                <Link
                  key={`r1-${card.id}-${idx}`}
                  href={card.link}
                  className="w-[320px] md:w-[420px] h-[220px] md:h-[280px] relative flex-shrink-0 rounded-none overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-[#066fef] tracking-widest uppercase">
                        SỰ KIỆN & ĐỘI NGŨ
                      </span>
                      <span className="text-sm font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Right */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-r gap-6">
              {[...row2Cards, ...row2Cards].map((card, idx) => (
                <Link
                  key={`r2-${card.id}-${idx}`}
                  href={card.link}
                  className="w-[320px] md:w-[420px] h-[220px] md:h-[280px] relative flex-shrink-0 rounded-none overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-[#066fef] tracking-widest uppercase">
                        CƠ SỞ VẬT CHẤT
                      </span>
                      <span className="text-sm font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </Link>
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
    </div>
  );
}
