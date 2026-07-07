"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { contactsAPI, vehiclesAPI } from "@/lib/api";

function ContactFormContent() {
  const searchParams = useSearchParams();

  const vehicleParam = searchParams.get("vehicle");
  const reasonParam = searchParams.get("reason");
  const noteParam = searchParams.get("note");

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [allVehicles, setAllVehicles] = useState<any[]>([]);

  // Service Booking Form States
  const [formLicensePlate, setFormLicensePlate] = useState("");
  const [formAppointmentTime, setFormAppointmentTime] = useState("");
  const [formLocation, setFormLocation] = useState("Tại đại lý");
  const [formServiceContent, setFormServiceContent] = useState("");

  const getVehicleName = (vId: string, vehicleList: any[]) => {
    const found = vehicleList.find((v) => v.id === vId);
    if (found) return found.name;
    return vId.split("-").map(w => w.toUpperCase()).join(" ");
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehiclesAPI.getAll().catch(() => null);
        const items = res?.data || res;
        let vehicleList: any[] = [];
        if (Array.isArray(items) && items.length > 0) {
          vehicleList = items.map((v: any) => ({
            id: v.slug || v.id,
            name: v.title || v.name
          }));
          setAllVehicles(vehicleList);
        }

        // Prefill logic
        if (noteParam) {
          setFormServiceContent(noteParam);
        } else if (reasonParam) {
          if (vehicleParam) {
            const vName = getVehicleName(vehicleParam, vehicleList);
            setFormServiceContent(`${reasonParam}: ${vName}`);
          } else {
            setFormServiceContent(reasonParam);
          }
        }
      } catch (e) {
        console.error("Error loading vehicles in ContactPage:", e);
      }
    };
    fetchVehicles();
  }, [noteParam, reasonParam, vehicleParam]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setToastMessage("Vui lòng điền Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }
    if (!formLicensePlate) {
      setToastMessage("Vui lòng điền Biển số xe!");
      setShowToast(true);
      return;
    }
    if (!formAppointmentTime) {
      setToastMessage("Vui lòng chọn Thời gian hẹn!");
      setShowToast(true);
      return;
    }
    if (!formServiceContent) {
      setToastMessage("Vui lòng điền Nội dung yêu cầu dịch vụ!");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        contact: {
          type: "SERVICE_BOOKING" as const,
          data: {
            "Họ và tên": formName,
            "Số điện thoại": formPhone,
            "E-mail": formEmail || undefined,
            "Biển số xe": formLicensePlate,
            "Thời gian hẹn": formAppointmentTime,
            "Nội dung yêu cầu dịch vụ": formServiceContent,
            "Tại": formLocation
          }
        }
      };

      const response = await contactsAPI.submit(payload);

      if (response && response.success === false) {
        setToastMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
        setShowToast(true);
      } else {
        setToastMessage(
          "Đăng ký thành công! Đồng Nai Ford đã nhận được yêu cầu đặt hẹn dịch vụ của bạn. Cố vấn dịch vụ sẽ liên hệ xác nhận lịch hẹn trong ít phút."
        );
        setShowToast(true);

        // Clear inputs
        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormLicensePlate("");
        setFormAppointmentTime("");
        setFormServiceContent("");
        setFormLocation("Tại đại lý");
      }
    } catch (error: any) {
      console.error("Contact submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone || backendMessage["Số điện thoại"]) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số và bắt đầu bằng số 0)!";
          } else if (backendMessage.Name || backendMessage["Họ và tên"]) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else {
          errMsg = backendMessage;
        }
      }
      setToastMessage(errMsg);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-12 w-full">
      {/* Toast Notification (Centered Modal style) */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#d6d6d6] text-[#1a1a1a] p-6 max-w-md w-full rounded-2xl shadow-2xl flex gap-4 items-start relative">
            <div className="w-10 h-10 bg-blue-50 text-[#0562d2] flex items-center justify-center rounded-full flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#0562d2]" />
            </div>
            <div className="flex-1 space-y-2 pr-6">
              <h4 className="font-bold text-sm text-[#0562d2]">Thông báo hệ thống</h4>
              <p className="text-sm text-[#424242] leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Showroom Banner */}
      <div className="h-[384px] relative rounded-[24px] overflow-hidden w-full mb-12 shadow-sm border border-[#e5e5e5]">
        <img
          alt="Showroom Ford Đồng Nai"
          className="absolute inset-0 object-cover w-full h-full"
          src={siteAssets.showroomBg}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-12">
        
        {/* Left Side: Contact Information Cards */}
        <div className="flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold leading-[1.32] text-[#101828] text-[36px] tracking-tight">
              Liên hệ trực tiếp với đại lý Đồng Nai Ford
            </h2>
            <p className="font-['Ford_Antenna',sans-serif] leading-[1.5] text-[#1d2939] text-[16px]">
              Đồng Nai Ford luôn sẵn sàng lắng nghe và hỗ trợ mọi nhu cầu của bạn. Cho dù bạn cần tư vấn dòng xe mới, đặt lịch bảo dưỡng hay phản hồi về dịch vụ, hãy kết nối với chúng tôi qua các kênh liên hệ thuận tiện nhất dưới đây.
            </p>
          </div>

          {/* Details Wrapper Card */}
          <div className="bg-white border border-[#d6d6d6] flex flex-col gap-6 p-6 rounded-[12px] shadow-sm">
            {/* Showroom Address */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Showroom
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed">
                  Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
                </p>
              </div>
            </div>

            {/* Hotlines */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Hotline
                </h4>
                <div className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed space-y-1">
                  <p>Dịch vụ: <span className="font-semibold text-dark">1800 55 68 58</span></p>
                  <p>Kinh doanh: <span className="font-semibold text-dark">0918 90 90 60</span></p>
                  <p>Điện thoại bàn: <span className="text-[#424242]">(0251) 3857 130 – (0251) 3857 131</span></p>
                </div>
              </div>
            </div>

            {/* Email & Website */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Email
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a]">
                  marketing@dongnaiford.com.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Appointment Booking Form */}
        <div className="bg-[#003478] flex flex-col gap-6 p-8 rounded-[16px] shadow-lg text-white">
          <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] text-center text-white">
            Đặt hẹn dịch vụ
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Họ và tên <span className="text-[#f97066]">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
              />
            </div>

            {/* Số điện thoại & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Số điện thoại <span className="text-[#f97066]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0909888888"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
                />
              </div>
            </div>

            {/* Biển số xe & Thời gian hẹn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Biển số xe <span className="text-[#f97066]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formLicensePlate}
                  onChange={(e) => setFormLicensePlate(e.target.value)}
                  placeholder="60C-525.45"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Thời gian hẹn <span className="text-[#f97066]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formAppointmentTime}
                  onChange={(e) => setFormAppointmentTime(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans text-black"
                />
              </div>
            </div>

            {/* Tại (Địa điểm thực hiện dịch vụ) */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Địa điểm làm dịch vụ <span className="text-[#f97066]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["Tại đại lý", "Tại nhà"].map((loc) => {
                  const isSel = formLocation === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormLocation(loc)}
                      className={`py-2.5 rounded-lg border font-semibold text-xs transition cursor-pointer text-center
                        ${isSel 
                          ? "bg-[#0562d2] border-[#0562d2] text-white" 
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}
                    >
                      {loc === "Tại đại lý" ? "Tại đại lý" : "Tại nhà"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nội dung yêu cầu dịch vụ */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Nội dung yêu cầu dịch vụ <span className="text-[#f97066]">*</span>
              </label>
              <textarea
                required
                value={formServiceContent}
                onChange={(e) => setFormServiceContent(e.target.value)}
                placeholder="Nhập nội dung yêu cầu dịch vụ..."
                className="w-full h-[120px] bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm resize-none font-sans"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[240px] py-[10px] bg-[#0562d2] border border-[#0562d2] hover:bg-[#00095b] hover:border-[#00095b] disabled:bg-gray-400 disabled:border-gray-400 text-white font-semibold text-[16px] tracking-wide rounded-[800px] shadow-md transition cursor-pointer text-center"
              >
                {isSubmitting ? "Đang gửi..." : "Đặt lịch"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Full Width at Bottom */}
      <div className="w-full h-[427px] rounded-[24px] overflow-hidden border border-[#d6d6d6] shadow-sm relative mb-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9639.97148545994!2d106.86767807583985!3d10.948647055991795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfa7287e67b7%3A0xe69044f2892be499!2zxJDhu5NuZyBOYWkgRm9yZA!5e1!3m2!1svi!2s!4v1782375726740!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Địa chỉ Đồng Nai Ford trên Google Map"
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-[#fafafa] flex-1 min-h-screen">
      <Suspense fallback={
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-24 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-[#0562d2] border-t-transparent rounded-full" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
