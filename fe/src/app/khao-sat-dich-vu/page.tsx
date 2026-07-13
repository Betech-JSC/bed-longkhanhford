"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  MessageSquare,
  Wrench,
  Gauge,
  Smile,
  Frown,
  Meh,
  SmilePlus,
  Send
} from "lucide-react";
import { contactsAPI } from "@/lib/api";

const SERVICE_TYPES = [
  "Bảo dưỡng định kỳ",
  "Sửa chữa chung (Máy gầm, điện...)",
  "Đồng sơn (Phục hồi thân vỏ)",
  "Lắp đặt phụ kiện",
  "Dịch vụ khác"
];

const EMOJI_OPTIONS = [
  { value: "Rất không hài lòng", label: "Tệ", icon: Frown, color: "text-red-500 bg-red-50 hover:bg-red-100/70 border-red-200" },
  { value: "Không hài lòng", label: "Không tốt", icon: Frown, color: "text-orange-500 bg-orange-50 hover:bg-orange-100/70 border-orange-200" },
  { value: "Bình thường", label: "Bình thường", icon: Meh, color: "text-amber-500 bg-amber-50 hover:bg-amber-100/70 border-amber-200" },
  { value: "Hài lòng", label: "Tốt", icon: Smile, color: "text-blue-500 bg-blue-50 hover:bg-blue-100/70 border-blue-200" },
  { value: "Rất hài lòng", label: "Rất tốt", icon: SmilePlus, color: "text-emerald-500 bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200" }
];

interface EmojiRatingFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function EmojiRatingField({ label, value, onChange }: EmojiRatingFieldProps) {
  return (
    <div className="flex flex-col p-4 bg-gray-50/50 rounded-2xl border border-gray-100/80 transition-all hover:bg-white hover:shadow-xs gap-3">
      <span className="text-sm font-semibold text-gray-700">{label} *</span>
      <div className="grid grid-cols-5 gap-2">
        {EMOJI_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`p-2 md:p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer bg-white
                ${isSelected 
                  ? `${opt.color} border-current scale-[0.98] ring-2 ring-offset-2 ring-current font-bold` 
                  : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              <span className="text-[10px] text-center line-clamp-1 font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ServiceSurveyPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    licensePlate: "",
    serviceType: "",
    serviceRating: "",
    staffRating: "",
    facilityRating: "",
    npsScore: -1,
    feedback: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceType) {
      setErrorMessage("Vui lòng chọn loại dịch vụ đã sử dụng!");
      return;
    }
    if (!formData.serviceRating) {
      setErrorMessage("Vui lòng đánh giá chất lượng dịch vụ!");
      return;
    }
    if (!formData.staffRating) {
      setErrorMessage("Vui lòng đánh giá thái độ phục vụ của nhân viên!");
      return;
    }
    if (!formData.facilityRating) {
      setErrorMessage("Vui lòng đánh giá cơ sở vật chất!");
      return;
    }
    if (formData.npsScore === -1) {
      setErrorMessage("Vui lòng chọn điểm giới thiệu NPS!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await contactsAPI.submit({
        contact: {
          type: "SERVICE_SURVEY",
          data: {
            "Họ và tên": formData.fullName,
            "Số điện thoại": formData.phone,
            "Biển số xe": formData.licensePlate,
            "Loại dịch vụ đã dùng": formData.serviceType,
            "Chất lượng dịch vụ": formData.serviceRating,
            "Thái độ phục vụ của nhân viên": formData.staffRating,
            "Cơ sở vật chất & Phòng chờ": formData.facilityRating,
            "Điểm giới thiệu (NPS)": `${formData.npsScore} / 10 Điểm`,
            "Ý kiến đóng góp khác": formData.feedback
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi khảo sát thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
      }
    } catch (error: any) {
      console.error("Service survey submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage["Số điện thoại"]) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số và bắt đầu bằng số 0)!";
          } else if (backendMessage["Họ và tên"]) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else {
          errMsg = backendMessage;
        }
      }
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNpsClick = (score: number) => {
    setFormData((prev) => ({ ...prev, npsScore: score }));
  };

  // NPS Styling color helper
  const getNpsClass = (score: number, active: boolean) => {
    if (score <= 6) {
      return active 
        ? "bg-red-500 border-red-500 text-white font-bold ring-2 ring-red-300" 
        : "border-red-100 bg-red-50/30 text-red-600 hover:bg-red-100 hover:border-red-300";
    } else if (score <= 8) {
      return active 
        ? "bg-amber-500 border-amber-500 text-white font-bold ring-2 ring-amber-300" 
        : "border-amber-100 bg-amber-50/30 text-amber-600 hover:bg-amber-100 hover:border-amber-300";
    } else {
      return active 
        ? "bg-emerald-500 border-emerald-500 text-white font-bold ring-2 ring-emerald-300" 
        : "border-emerald-100 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300";
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-24">
      {/* Banner Header */}
      <div className="relative bg-gradient-to-r from-[#0b192c] via-[#0e223b] to-[#0562D2] text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Khảo sát ý kiến dịch vụ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-300 shrink-0" />
            <span>Khảo sát Chất lượng Dịch vụ</span>
          </h1>
          <p className="text-sm md:text-base text-blue-100 max-w-xl mt-3 font-medium">
            Hãy chia sẻ trải nghiệm bảo dưỡng, sửa chữa của bạn tại Xưởng dịch vụ Long Khánh Ford. Phản hồi thực tế từ bạn là chìa khóa để chúng tôi nâng cao chất lượng phục vụ mỗi ngày.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] mt-10">
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-2xl text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Gửi Ý Kiến Thành Công!</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Long Khánh Ford chân thành ghi nhận ý kiến phản hồi của bạn. Đóng góp này sẽ được chuyển trực tiếp tới Ban quản lý xưởng dịch vụ để tối ưu hóa chất lượng phục vụ. Kính chúc bạn vạn dặm bình an!
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-[#0562D2] hover:bg-[#044EA7] text-white text-xs py-3 px-6 font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-8">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs text-center font-bold">
                  {errorMessage}
                </div>
              )}

              {/* SECTION 1: Personal & Vehicle info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <User className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Thông tin Khách hàng & Phương tiện</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Số điện thoại *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0918xxxxxx"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Biển số xe *</label>
                    <div className="relative">
                      <Gauge className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={formData.licensePlate}
                        onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                        placeholder="60A-XXXXX"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Service Type Select */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Wrench className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Loại dịch vụ đã sử dụng</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_TYPES.map((type) => {
                    const isSelected = formData.serviceType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: type }))}
                        className={`p-4 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer bg-white
                          ${isSelected 
                            ? "border-[#0562D2] text-[#0562D2] bg-blue-50/20 shadow-xs" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/30 text-gray-700"
                          }`}
                      >
                        <span>{type}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${isSelected ? "border-[#0562D2]" : "border-gray-300"}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0562D2]"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Smiley Ratings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Smile className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Đánh giá chất lượng các hạng mục</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <EmojiRatingField 
                    label="Chất lượng sửa chữa / bảo dưỡng xe"
                    value={formData.serviceRating}
                    onChange={(val) => setFormData(prev => ({ ...prev, serviceRating: val }))}
                  />
                  <EmojiRatingField 
                    label="Thái độ phục vụ, đón tiếp của cố vấn & nhân viên"
                    value={formData.staffRating}
                    onChange={(val) => setFormData(prev => ({ ...prev, staffRating: val }))}
                  />
                  <EmojiRatingField 
                    label="Cơ sở vật chất xưởng & Phòng chờ khách hàng"
                    value={formData.facilityRating}
                    onChange={(val) => setFormData(prev => ({ ...prev, facilityRating: val }))}
                  />
                </div>
              </div>

              {/* SECTION 4: NPS Score 0-10 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Khả năng giới thiệu dịch vụ (NPS)</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    Trên thang điểm từ 0 (Hoàn toàn không muốn) đến 10 (Chắc chắn giới thiệu), bạn đánh giá khả năng giới thiệu dịch vụ của Long Khánh Ford cho người thân hoặc bạn bè như thế nào? *
                  </p>
                  
                  {/* NPS Rating Grid Row */}
                  <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                      const isActive = formData.npsScore === score;
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleNpsClick(score)}
                          className={`w-full aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer bg-white
                            ${getNpsClass(score, isActive)}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* NPS LegendLabels */}
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1 uppercase tracking-wider pt-1">
                    <span className="text-red-500">0 - Rất không sẵn lòng</span>
                    <span className="text-amber-500">7 - Trung lập</span>
                    <span className="text-emerald-500">10 - Rất sẵn lòng</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Open Feedback */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MessageSquare className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Ý kiến đóng góp để hoàn thiện chất lượng</h3>
                </div>
                <div className="space-y-1.5">
                  <textarea
                    rows={4}
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Hãy đóng góp thêm ý kiến hoặc phản hồi cụ thể về các điểm chưa hài lòng để đại lý nâng cấp dịch vụ..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white resize-none text-black"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#0562D2] to-[#0b192c] hover:from-[#044EA7] hover:to-[#0562D2] text-white py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-0 flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi thông tin khảo sát"}</span>
                </button>
                
                <Link
                  href="/"
                  className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-4 px-6 font-bold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
