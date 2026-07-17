"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  MapPin, 
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
  ArrowRight,
  Sparkles,
  Users
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
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-gray-900 w-full flex flex-col items-center">
      
      {/* Top Careers Hero Banner */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-slate-900 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src="/images-dynamic/image-hero-3.jpg"
            alt="Tuyển dụng Ford Long Khánh"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Main Content List Section */}
      <section className="py-16 w-full flex justify-center">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col items-center">
          
          <div className="max-w-4xl w-full flex flex-col gap-8">
            
            {/* List Results Column */}
            <div className="w-full">
              {loading ? (
                <div className="flex items-center justify-center py-28">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#066fef] border-t-transparent" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.02)] w-full">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-750 mb-2 font-display">
                    Chưa có vị trí tuyển dụng phù hợp
                  </h3>
                  <p className="text-xs text-gray-455 max-w-sm mx-auto mb-6 font-antenna leading-relaxed">
                    Rất tiếc, hệ thống chưa có tin tuyển dụng nào hoạt động vào thời điểm này. Vui lòng quay lại sau hoặc liên hệ trực tiếp.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 w-full">
                  {/* Total counter banner */}
                  <div className="flex items-center justify-between text-xs text-gray-450 font-bold uppercase tracking-wider px-2">
                    <span>Vị trí đang tuyển: {filteredJobs.length}</span>
                    {currentPage > 1 && <span>Trang {currentPage} / {totalPages}</span>}
                  </div>

                  <div className="grid grid-cols-1 gap-5 w-full">
                    {paginatedJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/tuyen-dung/${job.slug}`}
                        className="w-full bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex items-center justify-between gap-5 border border-gray-200/80 hover:border-blue-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                      >
                        {/* Job Details Content */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0 pr-2">
                          <h3 className="text-base md:text-lg font-bold leading-snug text-[#00095B] font-display group-hover:text-[#066fef] transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 font-medium font-antenna leading-relaxed line-clamp-2">
                            {job.description}
                          </p>

                          {/* Refined Rich Metadata badging row */}
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1.5 text-[10px] font-bold font-antenna uppercase tracking-wider">
                            {job.salary && (
                              <span className="flex items-center gap-1.5 text-green-600 bg-green-50/70 px-2.5 py-1 rounded-md">
                                <DollarSign className="w-3.5 h-3.5" />
                                {job.salary}
                              </span>
                            )}
                            {job.deadline && (
                              <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50/70 px-2.5 py-1 rounded-md">
                                <Calendar className="w-3.5 h-3.5" />
                                Hạn: {formatDate(job.deadline)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive toggle button */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#002F6C] group-hover:border-[#002F6C] text-[#066fef] group-hover:text-white shadow-xs self-center">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Refined Pagination Component */}
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                      <div className="bg-white border border-gray-200/80 flex gap-1.5 items-center px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        {/* Prev page button */}
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer border-0 bg-transparent ${
                            currentPage === 1
                              ? "text-gray-300 pointer-events-none"
                              : "text-[#424242] hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="w-4.5 h-4.5" />
                        </button>

                        {/* Numbers */}
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 flex items-center justify-center text-xs font-extrabold rounded-full transition cursor-pointer border-0 ${
                              currentPage === page
                                ? "bg-[#002F6C] text-white shadow-md shadow-blue-900/10"
                                : "bg-transparent text-[#424242] hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next page button */}
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer border-0 bg-transparent ${
                            currentPage === totalPages
                              ? "text-gray-300 pointer-events-none"
                              : "text-[#424242] hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="w-4.5 h-4.5" />
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
      <section className="bg-white border-y border-gray-100 py-20 w-full">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-extrabold text-[#066fef] uppercase tracking-widest block mb-2.5 font-antenna">MÔI TRƯỜNG LÀM VIỆC</span>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display text-[#00095B] uppercase tracking-tight leading-none">
              Tại sao chọn Long Khánh Ford?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-[#066fef]" />,
                title: "Phát triển và Thăng tiến",
                desc: "Chúng tôi đầu tư lộ trình đào tạo chuyên sâu chuẩn toàn cầu của Ford Việt Nam, mở ra cơ hội thăng tiến rộng lớn, minh bạch.",
              },
              {
                icon: <Award className="w-6 h-6 text-[#066fef]" />,
                title: "Thu nhập xứng đáng",
                desc: "Lương cơ bản cạnh tranh cộng thưởng doanh thu. Đầy đủ bảo hiểm, du lịch nghỉ dưỡng hàng năm và lương tháng 13 hậu hĩnh.",
              },
              {
                icon: <HeartHandshake className="w-6 h-6 text-[#066fef]" />,
                title: "Văn hóa Đại gia đình",
                desc: "Showroom và xưởng dịch vụ hiện đại đạt chuẩn Ford Signature, không khí làm việc cởi mở, đồng nghiệp thân thiện hỗ trợ nhau.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-150 hover:border-blue-500/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 text-[#066fef] flex items-center justify-center rounded-2xl mb-6 shadow-xs border border-blue-100/50">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#00095B] mb-2.5 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-antenna font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
