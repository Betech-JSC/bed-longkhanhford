"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useVehicle } from "@/components/vehicle/VehicleLayoutClient";
import { regionsAPI, contactsAPI, registrationFeesAPI } from "@/lib/api";
import { calculateRollingCost } from "@/lib/rolling-cost";
import { Check, Info, FileText } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

export default function VehiclePriceCalculatorClient() {
  const {
    vehicle
  } = useVehicle();

  // Selected state
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Đồng Nai");
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [registrationFees, setRegistrationFees] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set default selected version
  useEffect(() => {
    if (vehicle && vehicle.versions && vehicle.versions.length > 0) {
      setSelectedVersionId(vehicle.versions[0].id);
    }
  }, [vehicle]);

  // Load provinces & registration fees
  useEffect(() => {
    regionsAPI.getProvinces()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setProvinces(res.data);
          const hasDongNai = res.data.some(p => p.name.includes("Đồng Nai"));
          if (hasDongNai) {
            setSelectedProvince("Đồng Nai");
          } else if (res.data.length > 0) {
            setSelectedProvince(res.data[0].name);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading provinces:", err);
      });

    registrationFeesAPI.getAll()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setRegistrationFees(res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading registration fees:", err);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedVersion = () => {
    if (!vehicle || !vehicle.versions) return null;
    return vehicle.versions.find((v: any) => v.id === selectedVersionId) || vehicle.versions[0] || null;
  };

  const selectedVersion = getSelectedVersion();

  const rollingCost = vehicle && selectedVersion
    ? calculateRollingCost(vehicle, selectedVersion, selectedProvince, registrationFees)
    : {
        basePrice: 0,
        registrationTax: 0,
        plateFee: 0,
        registryFee: 0,
        roadFee: 0,
        insuranceFee: 0,
        serviceFee: 0,
        total: 0,
      };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const productTitle = `${vehicle.name} - ${selectedVersion?.name || ""}`;
      const note = formData.note || `Yêu cầu báo giá lăn bánh xe ${productTitle} tại ${selectedProvince}. Tổng dự toán: ${formatPrice(rollingCost.total)}`;

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: formData.fullName,
            Phone: formData.phone,
            Email: formData.email || undefined,
            Province: selectedProvince,
            Product: {
              id: String(vehicle.id),
              slug: vehicle.slug || String(vehicle.id),
              title: productTitle,
              type: "vehicle",
            },
            "Nội dung cần hỗ trợ": note
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ fullName: "", phone: "", email: "", note: "" });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Calculator advise submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số)!";
          } else if (backendMessage.Name) {
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

  if (!vehicle) return null;

  return (
    <div className="flex-1 bg-[#F8F8F8] py-12 flex flex-col items-center w-full">
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-8">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium font-antenna">
          <Link href="/" className="hover:text-[#066fef] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-[#066fef] transition-colors">
            Sản phẩm
          </Link>
          <span>/</span>
          <Link href={`/${vehicle.id}`} className="hover:text-[#066fef] transition-colors">
            {vehicle.name}
          </Link>
          <span>/</span>
          <span className="text-[#333] font-semibold">Dự toán chi phí lăn bánh</span>
        </div>

        {/* Dynamic header title */}
        <div className="flex flex-col gap-3 items-start w-full border-b border-gray-200 pb-6 font-antenna">
          <h1 className="font-display font-bold text-[#066fef] text-[32px] md:text-[36px] leading-[1.2] uppercase tracking-wide">
            Dự toán chi phí lăn bánh xe Ford {vehicle.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Nhập thông tin phiên bản xe và khu vực đăng ký để ước tính tổng chi phí lăn bánh dự kiến.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column: Calculator inputs & sheet */}
          <div className="lg:col-span-8 bg-white border border-[#e5e5e5] rounded-none p-6 md:p-8 flex flex-col gap-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-antenna">
              
              {/* Select version */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Phiên bản xe *</label>
                <select
                  value={selectedVersionId}
                  onChange={(e) => setSelectedVersionId(e.target.value)}
                  className="w-full bg-white border border-gray-350 px-3 py-2.5 rounded-[4px] text-sm text-black focus:outline-none focus:border-[#066fef]"
                >
                  {vehicle.versions?.map((ver: any) => (
                    <option key={ver.id} value={ver.id}>
                      {ver.name} ({formatPrice(ver.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select province */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Tỉnh / Thành phố đăng ký *</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-white border border-gray-350 px-3 py-2.5 rounded-[4px] text-sm text-black focus:outline-none focus:border-[#066fef]"
                >
                  {provinces.length > 0 ? (
                    provinces.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                      <option value="Khác">Khu vực khác</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="border border-[#e5e5e5] rounded-none overflow-hidden shadow-xs bg-[#fafafa]">
              <div className="bg-[#00095b] text-white px-6 py-4 flex items-center gap-2 font-antenna">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Chi tiết bảng tính chi phí lăn bánh:</h3>
              </div>
              <div className="p-6 space-y-4 text-sm text-gray-700 font-antenna">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span>Giá xe niêm yết:</span>
                  <span className="font-bold text-gray-900 text-base">
                    <AnimatedNumber value={rollingCost.basePrice} formatFn={formatPrice} />
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="flex items-center gap-1.5">
                    Thuế trước bạ:
                    <span title="Tính theo quy định của nhà nước tại khu vực đăng ký">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    +<AnimatedNumber value={rollingCost.registrationTax} formatFn={formatPrice} />
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span>Lệ phí cấp biển số:</span>
                  <span className="font-semibold text-gray-900">
                    +<AnimatedNumber value={rollingCost.plateFee} formatFn={formatPrice} />
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span>Lệ phí đăng kiểm:</span>
                  <span className="font-semibold text-gray-900">
                    +<AnimatedNumber value={rollingCost.registryFee} formatFn={formatPrice} />
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span>Phí bảo trì đường bộ (12 tháng):</span>
                  <span className="font-semibold text-gray-900">
                    +<AnimatedNumber value={rollingCost.roadFee} formatFn={formatPrice} />
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span>Bảo hiểm trách nhiệm dân sự bắt buộc:</span>
                  <span className="font-semibold text-gray-900">
                    +<AnimatedNumber value={rollingCost.insuranceFee} formatFn={formatPrice} />
                  </span>
                </div>
                {rollingCost.serviceFee && rollingCost.serviceFee > 0 ? (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span>Phí dịch vụ đăng ký:</span>
                    <span className="font-semibold text-gray-900">
                      +<AnimatedNumber value={rollingCost.serviceFee} formatFn={formatPrice} />
                    </span>
                  </div>
                ) : null}
                <div className="pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Tổng dự toán chi phí lăn bánh:</span>
                  <span className="font-extrabold text-[#066fef] text-xl md:text-2xl">
                    <AnimatedNumber value={rollingCost.total} formatFn={formatPrice} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-4 bg-white border border-[#e5e5e5] rounded-none p-6 md:p-8 flex flex-col gap-6 shadow-xs sticky top-[140px]">
            <h3 className="font-display font-bold text-lg text-[#066fef] border-b border-gray-150 pb-4 uppercase tracking-wide">
              Nhận báo giá lăn bánh chính xác
            </h3>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 font-antenna">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-[4px] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-950">Gửi thông tin thành công!</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Yêu cầu báo giá của bạn đã được tiếp nhận. Đội ngũ Long Khánh Ford sẽ liên hệ tư vấn trong ít phút.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-antenna">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[4px] text-xs text-center font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="0918xxxxxx"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Địa chỉ Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Lời nhắn / Yêu cầu thêm</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="vd: Cần thông tin khuyến mãi mới nhất, hỗ trợ vay ngân hàng thế nào..."
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white resize-none text-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#066fef] hover:bg-[#01095c] text-white py-3 rounded-[4px] font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border-0 mt-2 shadow-xs font-antenna"
                >
                  {isSubmitting ? "Đang xử lý..." : "Yêu cầu báo giá lăn bánh"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
