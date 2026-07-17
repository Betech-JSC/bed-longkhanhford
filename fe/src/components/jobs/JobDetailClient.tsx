"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Upload,
  Check,
  X,
  Loader2,
  DollarSign,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Calendar,
  Sparkles,
  User,
  Mail,
  FileText
} from "lucide-react";
import { contactsAPI } from "@/lib/api";
import BookingBanner from "@/components/services/BookingBanner";

interface JobDetail {
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
}

export default function JobDetailClient({ job }: { job: JobDetail }) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Chỉ chấp nhận file PDF hoặc Word (.doc, .docx)");
        return;
      }
      if (file.size > maxSize) {
        setSubmitError("File CV không được vượt quá 5MB");
        return;
      }

      setSubmitError("");
      setCvFile(file);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.email) {
      setSubmitError("Vui lòng điền đầy đủ Họ tên, SĐT và Email.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Convert CV file to base64 for JSON submission
      let cvData: string[] = [];
      if (cvFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(cvFile);
        });
        cvData = [base64];
      }

      await contactsAPI.submit({
        contact: {
          type: "APPLY_FORM",
          data: {
            "Họ và tên": formData.name,
            Phone: formData.phone,
            Email: formData.email,
            "Lời nhắn": formData.message || "Không có",
            Job: {
              title: job.title,
              slug: job.slug,
            },
            "File CV": cvData,
          },
        },
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        "Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại hoặc liên hệ trực tiếp."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-gray-900 w-full flex flex-col items-center">
      
      {/* Premium Breadcrumb bar */}
      <div className="bg-white border-b border-gray-150 py-4.5 w-full flex justify-center font-antenna">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          <div className="text-xs text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#066fef] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 opacity-60" />
            <Link href="/tuyen-dung" className="hover:text-[#066fef] transition-colors">
              Tuyển dụng
            </Link>
            <ChevronRight className="w-3 h-3 opacity-60" />
            <span className="text-gray-800 line-clamp-1 font-semibold">
              {job.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main content view */}
      <section className="py-12 md:py-16 w-full flex justify-center">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
          
          {/* Back Button navigation */}
          <Link
            href="/tuyen-dung"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-400 hover:text-[#066fef] transition-colors mb-8 cursor-pointer border-0 bg-transparent font-antenna"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách tuyển dụng</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left: Job Details Panel (8 Cols) */}
            <div className="lg:col-span-8 space-y-6 w-full">
              
              <div className="bg-white rounded-[24px] border border-gray-200/80 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
                
                {/* Visual Label */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#066fef] bg-[#066fef]/10 px-3 py-1 rounded-full mb-4 font-antenna">
                  Chi tiết tuyển dụng
                </div>

                {/* Job Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00095B] leading-tight mb-6 font-display uppercase tracking-tight">
                  {job.title}
                </h1>

                {/* Job Metadata Grid Box */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#002F6C]/[0.02] border border-[#002F6C]/10 rounded-2xl mb-8 font-antenna">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">Nơi làm việc</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#066fef] flex-shrink-0" />
                      {job.work_address || job.location || "Đồng Nai"}
                    </span>
                  </div>

                  <div className="space-y-1 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">Mức lương</span>
                    <span className="text-xs font-bold text-[#002F6C] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#066fef] flex-shrink-0" />
                      {job.salary || "Thỏa thuận"}
                    </span>
                  </div>

                  <div className="space-y-1 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">Thời gian</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#066fef] flex-shrink-0" />
                      {job.working_time || "Toàn thời gian"}
                    </span>
                  </div>

                  <div className="space-y-1 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">Hạn nộp hồ sơ</span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      {job.deadline ? formatDate(job.deadline) : "Đang tuyển"}
                    </span>
                  </div>
                </div>

                {/* Description summary quote */}
                {job.description && (
                  <div className="border-l-4 border-[#066fef] pl-4 py-1.5 mb-8 font-antenna">
                    <p className="text-xs lg:text-sm font-semibold text-gray-500 italic leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* Detailed Job Requirements & description */}
                {job.content && (
                  <div
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-antenna
                      prose-headings:text-[#00095B] prose-headings:font-bold prose-headings:font-display prose-headings:mt-8 prose-headings:mb-3 prose-headings:uppercase prose-headings:tracking-wider
                      prose-h2:text-lg prose-h3:text-sm
                      prose-p:mb-4 prose-p:text-xs prose-p:lg:text-sm
                      prose-a:text-[#066fef] prose-a:underline hover:prose-a:text-[#002f6c]
                      prose-strong:text-[#00095B] prose-strong:font-bold
                      prose-li:marker:text-[#066fef] prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:text-xs prose-li:lg:text-sm"
                    dangerouslySetInnerHTML={{ __html: job.content }}
                  />
                )}
              </div>
            </div>

            {/* Right: Apply Card Sidebar (4 Cols) */}
            <div className="lg:col-span-4 w-full">
              <div className="relative bg-white border border-gray-200/80 p-8 rounded-[24px] shadow-lg text-gray-900 overflow-hidden lg:sticky lg:top-[120px]">
                {/* Gradient Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002F6C] via-[#066fef] to-[#00aaff]" />

                {submitted ? (
                  <div className="text-center py-10 space-y-4 font-antenna">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-[#00095B] font-display uppercase tracking-wider">
                      Hồ sơ đã gửi thành công!
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto font-medium">
                      Cảm ơn bạn đã ứng tuyển vị trí <strong>{job.title}</strong> tại Long Khánh Ford. Chúng tôi sẽ đánh giá hồ sơ và liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5 mb-6 text-center lg:text-left">
                      <h2 className="font-display font-bold text-xl text-[#00095B] tracking-tight flex items-center justify-center lg:justify-start gap-2">
                        <Briefcase className="w-5 h-5 text-[#066fef]" />
                        Ứng tuyển vị trí này
                      </h2>
                      <p className="text-xs text-gray-400 font-medium font-antenna">
                        Nộp hồ sơ ứng tuyển trực tuyến trong vài phút.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left font-antenna">
                      {/* Họ và tên */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                          Họ và tên <span className="text-[#f97066]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập họ và tên"
                            className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold transition-all outline-none"
                          />
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Số điện thoại */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                          Số điện thoại <span className="text-[#f97066]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập số điện thoại"
                            className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold transition-all outline-none"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                          Email liên hệ <span className="text-[#f97066]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="example@mail.com"
                            className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold transition-all outline-none"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* File Uploader */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                          Tải lên CV (PDF, DOCX, DOC)
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-300 hover:border-[#066fef] rounded-xl px-4 py-3 text-xs text-gray-500 hover:text-[#066fef] transition-all cursor-pointer shadow-xs hover:bg-[#066fef]/10 font-bold"
                        >
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[180px]">
                            {cvFile ? cvFile.name : "Tải lên CV cá nhân"}
                          </span>
                        </button>
                        {cvFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setCvFile(null);
                              if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                              }
                            }}
                            className="text-[10px] font-extrabold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Xóa CV đã chọn</span>
                          </button>
                        )}
                      </div>

                      {/* Note / Message */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                          Lời nhắn ứng tuyển
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Nhập giới thiệu ngắn hoặc ghi chú ứng tuyển..."
                          className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all outline-none resize-none font-sans"
                        />
                      </div>

                      {/* Error Messages */}
                      {submitError && (
                        <div className="bg-red-50 border border-red-100 text-red-650 p-3 rounded-xl text-xs font-bold text-center flex items-center gap-1.5 justify-center">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-[#002F6C] to-[#0562D2] hover:from-[#001D4A] hover:to-[#004ea7] disabled:from-gray-300 disabled:to-gray-400 text-white font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang gửi hồ sơ...
                          </>
                        ) : (
                          "Gửi CV ứng tuyển"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
