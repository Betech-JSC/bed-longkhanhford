"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  Car, 
  Send, 
  CheckCircle, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  MessageSquare
} from "lucide-react";
import { contactsAPI } from "@/lib/api";

const VEHICLES = [
  { id: "everest", name: "Ford Everest" },
  { id: "ranger", name: "Ford Ranger" },
  { id: "territory", name: "Ford Territory" },
  { id: "explorer", name: "Ford Explorer" },
  { id: "transit", name: "Ford Transit" },
  { id: "other", name: "Dòng xe khác" }
];

const INTENTS = [
  "Mua ngay trong tháng này",
  "Cân nhắc thêm trong 3 tháng tới",
  "Chưa có kế hoạch mua cụ thể"
];

interface RatingFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

function RatingField({ label, value, onChange }: RatingFieldProps) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/80 transition-all hover:bg-white hover:shadow-xs gap-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = hoverVal !== null ? star <= hoverVal : star <= value;
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(null)}
              onClick={() => onChange(star)}
              className="p-1 cursor-pointer transition-transform hover:scale-115 active:scale-95 bg-transparent border-0"
              aria-label={`Đánh giá ${star} sao`}
            >
              <Star
                className={`w-6 h-6 transition-colors duration-200 ${
                  isActive 
                    ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]" 
                    : "text-gray-300 fill-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TestDriveSurveyPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    vehicle: "",
    engine: 5,
    drive: 5,
    design: 5,
    comfort: 5,
    consultant: 5,
    intent: "",
    feedback: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicle) {
      setErrorMessage("Vui lòng chọn dòng xe bạn đã lái thử!");
      return;
    }
    if (!formData.intent) {
      setErrorMessage("Vui lòng chọn ý định mua xe của bạn!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await contactsAPI.submit({
        contact: {
          type: "TEST_DRIVE_SURVEY",
          data: {
            "Họ và tên": formData.fullName,
            "Số điện thoại": formData.phone,
            "Dòng xe lái thử": formData.vehicle,
            "Động cơ": `${formData.engine} / 5 Sao`,
            "Cảm giác lái": `${formData.drive} / 5 Sao`,
            "Ngoại hình & Thiết kế": `${formData.design} / 5 Sao`,
            "Tiện nghi & Công nghệ": `${formData.comfort} / 5 Sao`,
            "Nhân viên tư vấn": `${formData.consultant} / 5 Sao`,
            "Ý định mua xe": formData.intent,
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
      console.error("Test drive survey submit error:", error);
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

  const handleRatingChange = (field: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <span>Khảo sát ý kiến lái thử</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Khảo sát Ý kiến Khách hàng
          </h1>
          <p className="text-sm md:text-base text-blue-100 max-w-xl mt-3 font-medium">
            Cảm ơn bạn đã tham gia chương trình lái thử xe tại Long Khánh Ford. Ý kiến phản hồi của bạn sẽ giúp chúng tôi hoàn thiện sản phẩm và chất lượng phục vụ tốt hơn.
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
                <h2 className="text-2xl font-bold text-gray-900">Gửi Khảo Sát Thành Công!</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Chân thành cảm ơn những đóng góp quý báu của bạn. Long Khánh Ford kính chúc bạn luôn có những hành trình an toàn và trọn vẹn.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/xe-da-qua-su-dung"
                  className="bg-[#0562D2] hover:bg-[#044EA7] text-white text-xs py-3 px-6 font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Duyệt xe cũ
                </Link>
                <Link
                  href="/"
                  className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs py-3 px-6 font-bold uppercase tracking-wider rounded-xl transition-all"
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

              {/* SECTION 1: Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <User className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Thông tin cá nhân</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên của bạn *</label>
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

                  <div className="space-y-1.5">
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
                </div>
              </div>

              {/* SECTION 2: Vehicle Select */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Car className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Dòng xe lái thử</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {VEHICLES.map((vehicle) => {
                    const isSelected = formData.vehicle === vehicle.name;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, vehicle: vehicle.name }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-24 cursor-pointer bg-white
                          ${isSelected 
                            ? "border-[#0562D2] bg-blue-50/20 scale-[0.98] shadow-xs" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                          }`}
                      >
                        <Car className={`w-5 h-5 ${isSelected ? "text-[#0562D2]" : "text-gray-400"}`} />
                        <span className="text-xs font-bold text-gray-800">{vehicle.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Star Ratings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Star className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Đánh giá cảm nhận về xe & phục vụ</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <RatingField 
                    label="Động cơ & Khả năng tăng tốc" 
                    value={formData.engine} 
                    onChange={(v) => handleRatingChange("engine", v)} 
                  />
                  <RatingField 
                    label="Cảm giác lái & Hệ thống treo" 
                    value={formData.drive} 
                    onChange={(v) => handleRatingChange("drive", v)} 
                  />
                  <RatingField 
                    label="Ngoại hình & Thiết kế thân vỏ" 
                    value={formData.design} 
                    onChange={(v) => handleRatingChange("design", v)} 
                  />
                  <RatingField 
                    label="Tiện nghi & Công nghệ hỗ trợ lái" 
                    value={formData.comfort} 
                    onChange={(v) => handleRatingChange("comfort", v)} 
                  />
                  <RatingField 
                    label="Thái độ phục vụ của nhân viên tư vấn" 
                    value={formData.consultant} 
                    onChange={(v) => handleRatingChange("consultant", v)} 
                  />
                </div>
              </div>

              {/* SECTION 4: Purchase Intent */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Ý định mua xe của bạn</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {INTENTS.map((intent) => {
                    const isSelected = formData.intent === intent;
                    return (
                      <button
                        key={intent}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, intent }))}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer bg-white
                          ${isSelected 
                            ? "border-[#0562D2] text-[#0562D2] bg-blue-50/20" 
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        <span>{intent}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#0562D2]" : "border-gray-300"}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0562D2]"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: Open Feedback */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MessageSquare className="w-5 h-5 text-[#0562D2]" />
                  <h3 className="text-base font-bold text-gray-900">Ý kiến đóng góp khác</h3>
                </div>
                <div className="space-y-1.5">
                  <textarea
                    rows={4}
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Hãy chia sẻ thêm trải nghiệm hoặc yêu cầu hỗ trợ khác của bạn nếu có..."
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
