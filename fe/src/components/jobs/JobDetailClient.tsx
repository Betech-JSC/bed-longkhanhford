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
  Briefcase
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
    <div className="bg-[#fafafa] min-h-screen font-sans text-gray-900 w-full">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#0562d2] transition-colors">
              Trang chủ
            </Link>
            <div className="w-[3px] h-[3px] rounded-full bg-gray-400 mx-1" />
            <Link href="/tuyen-dung" className="hover:text-[#0562d2] transition-colors">
              Tuyển dụng
            </Link>
            <div className="w-[3px] h-[3px] rounded-full bg-gray-400 mx-1" />
            <span className="text-gray-900 font-semibold line-clamp-1">
              {job.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          
          {/* Back Button */}
          <Link
            href="/tuyen-dung"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0562d2] transition-colors mb-6 cursor-pointer border-0 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left: Job Details Content (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
                
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00095B] leading-tight mb-6 font-display">
                  {job.title}
                </h1>

                {/* Job Metadata Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Nơi làm việc</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0562d2] flex-shrink-0" />
                      {job.work_address || job.location || "Đồng Nai"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Mức lương</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#0562d2] flex-shrink-0" />
                      {job.salary || "Thỏa thuận"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Thời gian làm việc</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0562d2] flex-shrink-0" />
                      {job.working_time || "Toàn thời gian"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Số lượng cần tuyển</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#0562d2] flex-shrink-0" />
                      {job.quantity ? `${job.quantity} vị trí` : "Liên hệ"}
                    </span>
                  </div>
                </div>

                {/* Description summary block */}
                {job.description && (
                  <div className="border-l-4 border-[#0562d2] pl-4 py-1.5 mb-8">
                    <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* HTML content parsed safely */}
                {job.content && (
                  <div
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                      prose-headings:text-[#00095B] prose-headings:font-bold prose-headings:font-display prose-headings:mt-6 prose-headings:mb-3
                      prose-h2:text-xl prose-h3:text-lg
                      prose-p:mb-4
                      prose-a:text-[#0562d2] prose-a:underline hover:prose-a:text-[#044ea7]
                      prose-strong:text-gray-900 prose-strong:font-bold
                      prose-li:marker:text-[#0562d2] prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4"
                    dangerouslySetInnerHTML={{ __html: job.content }}
                  />
                )}
              </div>
            </div>

            {/* Right: Apply Form Card (1 Col) */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm sticky top-[140px]">
                
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">
                      Gửi hồ sơ thành công!
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                      Cảm ơn bạn đã ứng tuyển vào vị trí <strong>{job.title}</strong> tại Đồng Nai Ford. Chúng tôi sẽ đánh giá hồ sơ và liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-[#00095B] border-b border-gray-100 pb-4 mb-5 font-display flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#0562d2]" />
                      Ứng tuyển ngay
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] transition-colors text-black"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="0918xxxxxx"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] transition-colors text-black"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Email liên hệ *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="example@mail.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] transition-colors text-black"
                        />
                      </div>

                      {/* File Uploader */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Tệp tin CV (PDF, DOCX, DOC)
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
                          className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-300 hover:border-[#0562d2] rounded-xl px-4 py-3.5 text-xs text-gray-500 hover:text-[#0562d2] transition-all cursor-pointer shadow-xs hover:bg-blue-50/20"
                        >
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">
                            {cvFile ? cvFile.name : "Tải lên CV (tối đa 5MB)"}
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
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Hủy bỏ tệp tin này</span>
                          </button>
                        )}
                      </div>

                      {/* Note / Message */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                          Lời nhắn ứng tuyển
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Nhập ghi chú hoặc giới thiệu ngắn về bản thân..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] transition-colors resize-none text-black"
                        />
                      </div>

                      {/* Error Messages */}
                      {submitError && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs font-semibold text-center flex items-center gap-1.5 justify-center">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-300 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border-0 shadow-sm hover:shadow-md mt-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Nộp đơn ứng tuyển"
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
