"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X, Calendar, User, FileText, ChevronRight } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { contactsAPI, vehiclesAPI } from "@/lib/api";
import Link from "next/link";

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
          "Đăng ký thành công! Long Khánh Ford đã nhận được yêu cầu đặt hẹn dịch vụ của bạn. Cố vấn dịch vụ sẽ liên hệ xác nhận lịch hẹn trong ít phút."
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
    <div className="w-full flex flex-col items-center bg-[#F8F9FA]">
      {/* Toast Notification (Centered Modal style) */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-gray-150 text-[#1a1a1a] p-6 max-w-md w-full rounded-2xl shadow-2xl flex gap-4 items-start relative">
            <div className="w-10 h-10 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-xl flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#066fef]" />
            </div>
            <div className="flex-1 space-y-2 pr-6">
              <h4 className="font-bold text-sm text-[#002F6C] font-display">Thông báo hệ thống</h4>
              <p className="text-xs text-[#555] leading-relaxed font-antenna">{toastMessage}</p>
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

      {/* Top Showroom Hero Banner */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-slate-900 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src="/images-dynamic/ford_ranger_banner.png"
            alt="Showroom Ford Long Khánh"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#066fef]">
              THÔNG TIN ĐẠI LÝ
            </span>
            <h2 className="font-display font-bold leading-tight text-[#00095B] text-[36px] tracking-tight">
              Đại lý Long Khánh Ford
            </h2>
            <p className="font-antenna leading-relaxed text-gray-500 text-sm font-medium">
              Cho dù bạn cần tư vấn dòng xe mới, đặt lịch bảo dưỡng hay phản hồi ý kiến dịch vụ, hãy kết nối với đội ngũ chuyên viên của chúng tôi thông qua các kênh thuận tiện dưới đây.
            </p>
          </div>

          {/* Details Column Merged Card (No Borders) */}
          <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col gap-8 w-full border border-gray-100/50">
            {/* Showroom Address Item */}
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-xl flex-shrink-0">
                <MapPin className="w-5.5 h-5.5" />
              </div>
              <div className="flex-grow flex flex-col gap-1.5">
                <span className="font-antenna font-extrabold text-[10px] uppercase tracking-wider text-[#066fef]">
                  Địa chỉ Showroom
                </span>
                <p className="font-antenna text-xs lg:text-sm text-gray-800 leading-relaxed font-semibold">
                  Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn, Thành phố Đồng Nai, Việt Nam
                </p>
              </div>
            </div>

            {/* Hotlines Item */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-11 h-11 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-xl flex-shrink-0">
                <Phone className="w-5.5 h-5.5" />
              </div>
              <div className="flex-grow flex flex-col gap-1.5">
                <span className="font-antenna font-extrabold text-[10px] uppercase tracking-wider text-[#066fef]">
                  Đường dây nóng Hỗ trợ
                </span>
                <div className="font-antenna text-xs lg:text-sm text-gray-800 leading-relaxed space-y-1.5">
                  <p className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-400 font-medium">Bộ phận Dịch vụ:</span>
                    <span className="font-bold text-[#002F6C]">1900 888 992 – 02513 646 998</span>
                  </p>
                  <p className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-400 font-medium">Phòng Kinh doanh:</span>
                    <span className="font-bold text-[#002F6C]">0812 86 86 22</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Điện thoại bàn:</span>
                    <span className="font-semibold text-gray-700">(0251) 3857 130</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Email Item */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-11 h-11 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-xl flex-shrink-0">
                <Mail className="w-5.5 h-5.5" />
              </div>
              <div className="flex-grow flex flex-col gap-1.5">
                <span className="font-antenna font-extrabold text-[10px] uppercase tracking-wider text-[#066fef]">
                  Hòm thư điện tử
                </span>
                <p className="font-antenna text-xs lg:text-sm text-gray-800 font-bold">
                  Marketing@longkhanhford.com.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Appointment Booking Form Card (7 cols) */}
        <div className="lg:col-span-7 relative bg-white border border-gray-200/80 p-8 rounded-[24px] shadow-lg text-gray-900 overflow-hidden">
          {/* Header colorful highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002F6C] via-[#066fef] to-[#00aaff]" />

          <div className="flex flex-col gap-1.5 mb-6 text-center lg:text-left">
            <h3 className="font-display font-bold text-2xl text-[#00095B] tracking-tight">
              Đặt hẹn dịch vụ trực tuyến
            </h3>
            <p className="text-xs text-gray-400 font-medium font-antenna">
              Vui lòng điền thông tin dưới đây để được hỗ trợ nhanh chóng nhất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                Họ và tên <span className="text-[#f97066]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-antenna transition-all outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Số điện thoại & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                  Số điện thoại <span className="text-[#f97066]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Nhập số điện thoại liên hệ"
                    className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-antenna transition-all outline-none"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-antenna transition-all outline-none"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Biển số xe & Thời gian hẹn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                  Biển số xe <span className="text-[#f97066]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formLicensePlate}
                    onChange={(e) => setFormLicensePlate(e.target.value)}
                    placeholder="Ví dụ: 60C-525.45"
                    className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-antenna transition-all outline-none"
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                  Thời gian hẹn <span className="text-[#f97066]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formAppointmentTime}
                    onChange={(e) => setFormAppointmentTime(e.target.value)}
                    className="w-full bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-antenna transition-all outline-none text-gray-700"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tại (Địa điểm thực hiện dịch vụ) */}
            <div className="flex flex-col gap-1.5">
              <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                Địa điểm làm dịch vụ <span className="text-[#f97066]">*</span>
              </label>
              <div className="flex gap-4">
                {["Tại đại lý", "Tại nhà"].map((loc) => {
                  const isSel = formLocation === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormLocation(loc)}
                      className={`py-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer text-center flex-1
                        ${isSel 
                          ? "bg-[#002F6C] border-[#002F6C] text-white shadow-md shadow-blue-900/10" 
                          : "bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-150 hover:text-gray-700"}`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nội dung yêu cầu dịch vụ */}
            <div className="flex flex-col gap-1.5">
              <label className="font-antenna font-extrabold text-[10px] text-gray-450 uppercase tracking-wider ml-1">
                Nội dung yêu cầu dịch vụ <span className="text-[#f97066]">*</span>
              </label>
              <textarea
                required
                value={formServiceContent}
                onChange={(e) => setFormServiceContent(e.target.value)}
                placeholder="Vui lòng cung cấp chi tiết yêu cầu dịch vụ của bạn..."
                className="w-full h-[120px] bg-gray-50/30 hover:bg-gray-100/30 focus:bg-white border border-gray-200 focus:border-[#066fef] focus:ring-4 focus:ring-[#066fef]/10 rounded-xl px-3.5 py-3 text-xs font-semibold font-antenna transition-all outline-none resize-none"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-[240px] py-3.5 bg-gradient-to-r from-[#002F6C] to-[#0562D2] hover:from-[#001D4A] hover:to-[#004ea7] disabled:from-gray-300 disabled:to-gray-400 text-white font-extrabold text-xs tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 text-center font-antenna"
              >
                {isSubmitting ? "Đang gửi..." : "Đăng ký đặt lịch"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Full Width at Bottom */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full mb-20">
        <div className="w-full h-[450px] rounded-[24px] overflow-hidden border border-gray-200 shadow-sm relative">
          <iframe
            src={siteAssets.googleMapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Địa chỉ Long Khánh Ford trên Google Map"
            className="absolute inset-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-[#F8F9FA] flex-1 min-h-screen">
      <Suspense fallback={
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] py-24 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-[#066fef] border-t-transparent rounded-full" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
