"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  ChevronRight, 
  Search, 
  DollarSign, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Award, 
  HeartHandshake,
  RotateCcw,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { jobsAPI } from "@/lib/api";
import BookingBanner from "@/components/services/BookingBanner";

interface Job {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  working_position?: string;
  work_address?: string;
  working_time?: string;
  expected_time?: string;
  quantity?: number;
  location?: string;
  salary?: string;
  deadline?: string;
  created_at?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 20;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = (await jobsAPI.getAll()) as any;
        const items = res?.jobs || res?.data || res;
        if (Array.isArray(items)) {
          setJobs(items);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedType]);

  // Format date helper (dd/mm/yyyy)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Liên hệ";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Extract unique locations and job types/positions for filters
  const locations = ["all", ...Array.from(new Set(jobs.map(j => j.work_address || j.location || "Đồng Nai").filter(Boolean)))];
  const positions = ["all", ...Array.from(new Set(jobs.map(j => j.working_position || "Khác").filter(Boolean)))];

  // Perform client-side filtering
  const filteredJobs = jobs.filter(job => {
    const title = job.title?.toLowerCase() || "";
    const desc = job.description?.toLowerCase() || "";
    const pos = (job.working_position || "").toLowerCase();
    const addr = (job.work_address || job.location || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = title.includes(query) || desc.includes(query) || pos.includes(query) || addr.includes(query);
    const matchesLocation = selectedLocation === "all" || (job.work_address || job.location || "Đồng Nai") === selectedLocation;
    const matchesPosition = selectedType === "all" || (job.working_position || "Khác") === selectedType;

    return matchesSearch && matchesLocation && matchesPosition;
  });

  // Calculate paginated subset and total pages
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedType("all");
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen font-sans text-gray-900 w-full flex flex-col items-center">
      {/* Hero Banner */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 to-[#01095c] text-white pt-28 pb-14 md:pb-18 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/60 font-medium flex items-center gap-1.5 mb-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Tuyển dụng</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-[1.2] mb-3 font-antenna">
              Đồng hành cùng Long Khánh Ford
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-antenna">
              Gia nhập đại gia đình Ford — nơi chắp cánh cho khát vọng, nâng tầm năng lực và cùng bạn xây dựng hành trình sự nghiệp chuyên nghiệp trong ngành ô tô.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Job Listings */}
      <section className="py-12 md:py-16 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start max-w-5xl mx-auto">
            {/* Left Column: Filter Sidebar */}
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-none p-6 shadow-xs space-y-4 lg:sticky lg:top-[120px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold font-display text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#066fef]" />
                  Bộ lọc
                </h2>
                {(searchTerm || selectedLocation !== "all" || selectedType !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-[#D20000] hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Xóa
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider font-antenna">Từ khóa</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nhập tên vị trí..."
                      className="w-full text-sm bg-gray-50 border border-gray-250 rounded-[8px] py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#066fef] focus:ring-1 focus:ring-[#066fef] transition-all text-black font-antenna"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider font-antenna">Địa điểm</label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full text-sm bg-gray-55 border border-gray-200 rounded-[8px] py-2.5 pl-3 pr-8 focus:outline-none focus:border-[#066fef] focus:ring-1 focus:ring-[#066fef] transition-all text-black appearance-none cursor-pointer font-antenna"
                    >
                      <option value="all">Tất cả địa điểm</option>
                      {locations.slice(1).map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <div className="absolute top-1/2 right-3.5 transform -translate-y-1/2 pointer-events-none text-gray-550">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider font-antenna">Phòng ban</label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full text-sm bg-gray-55 border border-gray-200 rounded-[8px] py-2.5 pl-3 pr-8 focus:outline-none focus:border-[#066fef] focus:ring-1 focus:ring-[#066fef] transition-all text-black appearance-none cursor-pointer font-antenna"
                    >
                      <option value="all">Tất cả phòng ban</option>
                      {positions.slice(1).map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                    <div className="absolute top-1/2 right-3.5 transform -translate-y-1/2 pointer-events-none text-gray-550">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Jobs list grid */}
            <div className="lg:col-span-3 w-full">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#066fef]" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-none shadow-xs">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-600 mb-2 font-display">
                    Chưa có vị trí tuyển dụng phù hợp
                  </h2>
                  <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 font-antenna">
                    Chúng tôi không tìm thấy kết quả phù hợp với bộ lọc của bạn. Thử thay đổi từ khóa hoặc liên hệ gửi CV trực tiếp.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#066fef] hover:bg-[#01095c] text-white text-xs font-semibold px-6 py-2.5 rounded-[4px] transition-colors cursor-pointer border-0 uppercase tracking-wider"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {paginatedJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/tuyen-dung/${job.slug}`}
                        className="w-full bg-white rounded-none shadow-xs p-6 flex items-center gap-4 border border-gray-200 hover:shadow-sm transition-all duration-300 group cursor-pointer"
                      >
                        {/* Logo Ford Oval */}
                        <div className="w-[85.3px] h-8 relative flex-shrink-0 flex items-center">
                          <img
                            src="/ford_logo.svg"
                            alt="Ford Logo"
                            className="w-[85.3px] h-8 object-contain block"
                          />
                        </div>

                        {/* Job Title and Short Description */}
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <h3 className="text-base font-semibold leading-6 text-[#1a1a1a] font-display group-hover:text-[#066fef] transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm font-normal leading-[19.6px] text-gray-500 font-antenna truncate">
                            {job.description}
                          </p>
                        </div>

                        {/* Interactive circular toggle button */}
                        <div className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-gray-200 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#066fef] group-hover:border-[#066fef] text-[#066fef] group-hover:text-white">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination component block */}
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                      <div className="bg-white border border-gray-200 flex gap-2 items-center px-4 py-2 rounded-none shadow-xs">
                        {/* Prev button */}
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition cursor-pointer border-0 bg-transparent ${
                            currentPage === 1
                              ? "text-gray-300 pointer-events-none"
                              : "text-[#424242] hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-[4px] transition cursor-pointer border-0 ${
                              currentPage === page
                                ? "bg-[#066fef] text-white"
                                : "bg-transparent text-[#424242] hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next button */}
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition cursor-pointer border-0 bg-transparent ${
                            currentPage === totalPages
                              ? "text-gray-300 pointer-events-none"
                              : "text-[#424242] hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="bg-white border-y border-gray-200 py-16 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#066fef] uppercase tracking-widest block mb-2 font-antenna">Giá trị cốt lõi</span>
            <h2 className="text-2xl md:text-4xl font-bold font-display text-[#00095B] uppercase tracking-tight">
              Tại sao bạn nên chọn Long Khánh Ford?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-[#066fef]" />,
                title: "Phát triển và Thăng tiến",
                desc: "Chúng tôi đầu tư lộ trình đào tạo chuyên sâu chuẩn toàn cầu của Ford Việt Nam, mở ra cơ hội thăng tiến không giới hạn.",
              },
              {
                icon: <Award className="w-8 h-8 text-[#066fef]" />,
                title: "Thu nhập & Đãi ngộ xứng đáng",
                desc: "Lương cứng cạnh tranh cộng hoa hồng hấp dẫn. Chế độ bảo hiểm, du lịch nghỉ dưỡng hàng năm và thưởng Tết hậu hĩnh.",
              },
              {
                icon: <HeartHandshake className="w-8 h-8 text-[#066fef]" />,
                title: "Môi trường năng động",
                desc: "Cơ sở hạ tầng showroom và xưởng hiện đại, văn hóa làm việc tôn trọng, chia sẻ và đồng nghiệp thân thiện hỗ trợ nhau.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-none p-6 md:p-8 hover:shadow-xs transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-[#F8F8F8] rounded-[4px] flex items-center justify-center border border-gray-200 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-display">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-antenna">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
