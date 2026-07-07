"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X, Car } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { contactsAPI, vehiclesAPI } from "@/lib/api";

function TestDriveFormContent() {
  const searchParams = useSearchParams();

  const vehicleParam = searchParams.get("vehicle");
  const noteParam = searchParams.get("note");

  interface VehicleOption {
    id: string;
    name: string;
  }

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formProvince, setFormProvince] = useState("Đồng Nai");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [formNote, setFormNote] = useState("");
  const [allVehicles, setAllVehicles] = useState<VehicleOption[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehiclesAPI.getAll().catch(() => null);
        const items = res?.data || res;
        let vehicleList: VehicleOption[] = [];
        if (Array.isArray(items) && items.length > 0) {
          vehicleList = items.map((v: { slug?: string; id?: string | number; title?: string; name?: string }) => ({
            id: String(v.slug || v.id || ""),
            name: String(v.title || v.name || "")
          }));
          setAllVehicles(vehicleList);
        }

        // Prefill vehicle from query parameters
        if (vehicleParam) {
          const found = vehicleList.find(
            (v) => v.id === vehicleParam || v.id.toLowerCase() === vehicleParam.toLowerCase()
          );
          if (found) {
            setSelectedVehicle(found.id);
          } else {
            // Check if matches partial string
            const partial = vehicleList.find(
              (v) => v.id.toLowerCase().includes(vehicleParam.toLowerCase())
            );
            if (partial) {
              setSelectedVehicle(partial.id);
            }
          }
        }
      } catch (e) {
        console.error("Error loading vehicles in TestDrivePage:", e);
      }
    };
    fetchVehicles();
  }, [vehicleParam]);

  useEffect(() => {
    if (noteParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormNote(noteParam);
    }
  }, [noteParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setToastMessage("Vui lòng điền Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }
    if (!selectedVehicle) {
      setToastMessage("Vui lòng chọn dòng xe bạn muốn lái thử!");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedVehicleObj = allVehicles.find((v) => v.id === selectedVehicle);
      const vehicleTitle = selectedVehicleObj ? selectedVehicleObj.name : selectedVehicle;

      const fullNote = `Đăng ký lái thử xe: ${vehicleTitle}.${
        formNote ? ` Ghi chú: ${formNote}` : ""
      }`;

      const payload = {
        contact: {
          type: "ADVISE_FORM" as const,
          data: {
            Name: formName,
            Phone: formPhone,
            Email: formEmail || undefined,
            Province: formProvince,
            Product: {
              id: selectedVehicle,
              slug: selectedVehicle,
              title: vehicleTitle,
              type: "vehicle" as const
            },
            "Nội dung cần hỗ trợ": fullNote
          }
        }
      };

      const response = await contactsAPI.submit(payload);

      if (response && response.success === false) {
        setToastMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
        setShowToast(true);
      } else {
        setToastMessage(
          "Đăng ký lái thử thành công! Đồng Nai Ford đã nhận được thông tin của bạn. Đại diện bán hàng sẽ liên hệ xác nhận lịch lái thử sớm nhất."
        );
        setShowToast(true);

        // Clear inputs
        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormProvince("Đồng Nai");
        setSelectedVehicle("");
        setFormNote("");
      }
    } catch (error: unknown) {
      console.error("Test drive submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
      const errObj = error as { data?: { message?: unknown } };
      if (errObj && errObj.data && errObj.data.message) {
        const backendMessage = errObj.data.message;
        if (typeof backendMessage === "object" && backendMessage !== null) {
          const msgObj = backendMessage as Record<string, string[] | string>;
          if (msgObj.Phone || msgObj["Số điện thoại"]) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số và bắt đầu bằng số 0)!";
          } else if (msgObj.Name || msgObj["Họ và tên"]) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else if (typeof backendMessage === "string") {
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
      {/* Toast Notification */}
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
        <Image
          alt="Đăng ký lái thử xe Ford"
          className="absolute inset-0 object-cover w-full h-full"
          src={siteAssets.showroomBg}
          fill
          priority
          sizes="(max-w-1440px) 100vw, 1152px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-12">
        {/* Left Column: Contact details */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold leading-[1.32] text-[#101828] text-[36px] tracking-tight">
              Đăng ký lái thử xe cùng Đồng Nai Ford
            </h2>
            <p className="font-['Ford_Antenna',sans-serif] leading-[1.5] text-[#1d2939] text-[16px]">
              Hãy đăng ký ngay hôm nay để nhận cơ hội trải nghiệm thực tế cảm giác lái đỉnh cao, công nghệ hỗ trợ lái thông minh cùng các tính năng an toàn vượt trội trên các dòng xe Ford mới nhất.
            </p>
          </div>

          <div className="bg-white border border-[#d6d6d6] flex flex-col gap-6 p-6 rounded-[12px] shadow-sm">
            {/* Showroom Location */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Địa điểm lái thử
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed">
                  Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Biên Hòa, Đồng Nai
                </p>
              </div>
            </div>

            {/* Telephone Contact */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Liên hệ Hotline đăng ký nhanh
                </h4>
                <div className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed space-y-1">
                  <p>Phòng kinh doanh xe mới: <span className="font-semibold text-dark">0918 90 90 60</span></p>
                </div>
              </div>
            </div>

            {/* Email Contact */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Email hỗ trợ thông tin
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a]">
                  marketing@dongnaiford.com.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form Card */}
        <div className="bg-[#003478] flex flex-col gap-6 p-8 rounded-[16px] shadow-lg text-white">
          <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] text-center text-white flex items-center justify-center gap-2">
            <Car className="w-7 h-7" />
            Đăng ký lái thử
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

            {/* Dòng xe muốn lái thử & Tỉnh thành */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Chọn dòng xe lái thử <span className="text-[#f97066]">*</span>
                </label>
                <select
                  required
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans text-black"
                >
                  <option value="">-- Chọn xe --</option>
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Khu vực đăng ký <span className="text-[#f97066]">*</span>
                </label>
                <select
                  required
                  value={formProvince}
                  onChange={(e) => setFormProvince(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans text-black"
                >
                  {["Đồng Nai", "TP. Hồ Chí Minh", "Bình Dương", "Bà Rịa - Vũng Tàu", "Long An", "Tây Ninh", "Dòng khác"].map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ghi chú thêm */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Ghi chú thêm
              </label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="Nhập thời gian rảnh mong muốn hoặc lời nhắn cho chúng tôi..."
                className="w-full h-[100px] bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm resize-none font-sans"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[240px] py-[10px] bg-[#0562d2] border border-[#0562d2] hover:bg-[#00095b] hover:border-[#00095b] disabled:bg-gray-400 disabled:border-gray-400 text-white font-semibold text-[16px] tracking-wide rounded-[800px] shadow-md transition cursor-pointer text-center"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
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

export default function TestDriveRegistrationPage() {
  return (
    <div className="bg-[#fafafa] flex-1 min-h-screen">
      <Suspense fallback={
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-24 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-[#0562d2] border-t-transparent rounded-full" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      }>
        <TestDriveFormContent />
      </Suspense>
    </div>
  );
}
