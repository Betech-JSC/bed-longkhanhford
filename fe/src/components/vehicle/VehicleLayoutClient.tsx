"use client";

import { useParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, createContext, useContext } from "react";
import Link from "next/link";
import { contactsAPI, regionsAPI, registrationFeesAPI } from "@/lib/api";
import { calculateRollingCost } from "@/lib/rolling-cost";
import {
  X,
  Check,
  ChevronDown,
  GitCompare
} from "lucide-react";

interface VehicleContextType {
  vehicle: any;
  allVehicles: any[];
  loading: boolean;
  activeVersionIndex: number;
  setActiveVersionIndex: (idx: number) => void;
  openQuoteDrawer: (vehicleId?: string, versionId?: string) => void;
  openDriveDrawer: (versionIndex?: number) => void;
  compareIds: string[];
  toggleCompare: (vehicleId: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
}

const getVersionSlug = (verName: string) => {
  return verName.toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function VehicleLayoutClient({
  children,
  initialVehicle,
  allVehicles
}: {
  children: React.ReactNode;
  initialVehicle: any;
  allVehicles: any[];
}) {
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Modals visibility
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);

  // Calculator states
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle.id);
  const [selectedVersionId, setSelectedVersionId] = useState(
    initialVehicle.versions && initialVehicle.versions.length > 0 
      ? initialVehicle.versions[0].id 
      : ""
  );
  const [selectedProvince, setSelectedProvince] = useState("Đồng Nai");
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [registrationFees, setRegistrationFees] = useState<any[]>([]);
  const [drawerStep, setDrawerStep] = useState<"calculate" | "contact">("calculate");

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "Đồng Nai",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load Compare State
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          setCompareIds(JSON.parse(stored));
        } catch (e) { }
      }

      const handleUpdate = () => {
        const updated = localStorage.getItem("compare-vehicles");
        if (updated) {
          try {
            setCompareIds(JSON.parse(updated));
          } catch (e) { }
        }
      };
      window.addEventListener("compare-updated", handleUpdate);
      return () => window.removeEventListener("compare-updated", handleUpdate);
    }
  }, []);

  // Fetch Provinces & Registration Fees
  useEffect(() => {
    regionsAPI.getProvinces()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setProvinces(res.data);
          const hasDongNai = res.data.some(p => p.name.includes("Đồng Nai"));
          if (hasDongNai) {
            setSelectedProvince("Đồng Nai");
            setFormData(prev => ({ ...prev, province: "Đồng Nai" }));
          } else if (res.data.length > 0) {
            setSelectedProvince(res.data[0].name);
            setFormData(prev => ({ ...prev, province: res.data[0].name }));
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

  // Keep selected version in sync when selectedVehicleId changes
  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const list = allVehicles.length > 0 ? allVehicles : [initialVehicle];
    const veh = list.find((v) => v.id === vehicleId);
    if (veh && veh.versions.length > 0) {
      setSelectedVersionId(veh.versions[0].id);
    }
  };

  // Drawer trigger functions
  const openQuoteDrawer = (vehicleId?: string, versionId?: string) => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
      const list = allVehicles.length > 0 ? allVehicles : [initialVehicle];
      const veh = list.find(v => v.id === vehicleId);
      if (veh) {
        if (versionId && veh.versions.some((v: any) => String(v.id) === String(versionId))) {
          setSelectedVersionId(versionId);
        } else if (veh.versions.length > 0) {
          setSelectedVersionId(veh.versions[0].id);
        }
      }
    } else {
      setSelectedVehicleId(initialVehicle.id);
      const activeVer = initialVehicle.versions[activeVersionIndex] || initialVehicle.versions[0];
      if (activeVer) {
        setSelectedVersionId(activeVer.id);
      }
    }
    setDrawerStep("calculate");
    setShowQuoteModal(true);
  };

  const openDriveDrawer = (versionIndex?: number) => {
    if (typeof versionIndex === "number") {
      setActiveVersionIndex(versionIndex);
    }
    setShowDriveModal(true);
  };

  // Compare Toggle helper
  const toggleCompare = (vehicleId: string) => {
    let updated: string[];
    if (compareIds.includes(vehicleId)) {
      updated = compareIds.filter((id) => id !== vehicleId);
    } else {
      if (compareIds.length >= 3) {
        alert("Bạn chỉ có thể so sánh tối đa 3 xe cùng lúc!");
        return;
      }
      updated = [...compareIds, vehicleId];
    }
    localStorage.setItem("compare-vehicles", JSON.stringify(updated));
    setCompareIds(updated);
    window.dispatchEvent(new Event("compare-updated"));
  };

  // Form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate rolling costs
  const getRollingCostDetails = () => {
    const list = allVehicles.length > 0 ? allVehicles : [initialVehicle];
    const selVeh = list.find((v) => v.id === selectedVehicleId) || initialVehicle;
    if (!selVeh) {
      return {
        basePrice: 0,
        registrationTax: 0,
        plateFee: 0,
        registryFee: 0,
        roadFee: 0,
        insuranceFee: 0,
        serviceFee: 0,
        total: 0,
      };
    }

    const selVer = selVeh.versions?.find((ver: any) => ver.id === selectedVersionId) || selVeh.versions?.[0];
    if (!selVer) {
      return {
        basePrice: 0,
        registrationTax: 0,
        plateFee: 0,
        registryFee: 0,
        roadFee: 0,
        insuranceFee: 0,
        serviceFee: 0,
        total: 0,
      };
    }

    return calculateRollingCost(selVeh, selVer, selectedProvince, registrationFees);
  };

  const rollingCost = getRollingCostDetails();

  // Form submits (Advise/Quote Lead or Drive Test Lead)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let productId = String(initialVehicle?.id || "");
      let productSlug = initialVehicle?.slug || String(initialVehicle?.id || "");
      let productTitle = initialVehicle?.name || "";
      let note = formData.note;

      if (showQuoteModal) {
        const list = allVehicles.length > 0 ? allVehicles : [initialVehicle];
        const selVeh = list.find((v: any) => v.id === selectedVehicleId) || initialVehicle;
        const selVer = selVeh?.versions.find((v: any) => String(v.id) === String(selectedVersionId)) || selVeh?.versions[0];
        productId = String(selVeh.id);
        productSlug = selVeh.slug || String(selVeh.id);
        productTitle = `${selVeh.name} - ${selVer?.name}`;
        note = formData.note || `Yêu cầu báo giá lăn bánh xe ${selVeh.name} - ${selVer?.name} tại ${selectedProvince}. Tổng dự toán: ${formatPrice(rollingCost.total)}`;
      } else {
        const activeVer = initialVehicle?.versions?.[activeVersionIndex];
        if (activeVer) {
          productTitle = `${initialVehicle.name} - ${activeVer.name}`;
        }
        note = formData.note || `Yêu cầu đăng ký lái thử xe ${productTitle} tại ${formData.province}`;
      }

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: formData.fullName,
            Phone: formData.phone,
            Email: formData.email || undefined,
            Province: formData.province,
            Product: {
              id: productId,
              slug: productSlug,
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
          setShowQuoteModal(false);
          setShowDriveModal(false);
          setFormData({ fullName: "", phone: "", email: "", province: "Đồng Nai", note: "" });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Vehicle advise submit error:", error);
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
          errMsg = String(backendMessage);
        }
      }
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const activeVersion = initialVehicle?.versions?.[activeVersionIndex] || initialVehicle?.versions?.[0];

  const providerValue: VehicleContextType = {
    vehicle: initialVehicle,
    allVehicles,
    loading: false,
    activeVersionIndex,
    setActiveVersionIndex,
    openQuoteDrawer,
    openDriveDrawer,
    compareIds,
    toggleCompare
  };

  return (
    <VehicleContext.Provider value={providerValue}>
      <div className="bg-light text-dark flex-1 flex flex-col w-full">
        {/* Content Viewport */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Drive test modal */}
        {showDriveModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
              <div className="bg-[#00095b] text-white p-6 relative">
                <h3 className="text-lg font-bold uppercase tracking-wide font-display">
                  Đăng Ký Lái Thử Xe
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Dòng xe: <span className="text-white font-bold">{initialVehicle.name}{activeVersion ? ` - ${activeVersion.name}` : ""}</span>
                </p>
                <button
                  onClick={() => setShowDriveModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-lg cursor-pointer bg-transparent border-0"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                    <p className="text-xs text-gray-500">Đội ngũ tư vấn bán hàng sẽ liên hệ lại với bạn trong vòng 15 phút.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center font-semibold">
                        {errorMessage}
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Họ và tên của bạn *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="0918xxxxxx"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Địa chỉ Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Khu vực sinh sống</label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0562d2] cursor-pointer text-black"
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

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Ghi chú yêu cầu thêm</label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Nhập yêu cầu chi tiết (ví dụ: cần lái thử lúc 9h sáng, cần tư vấn trả góp,...)"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white resize-none text-black"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#066fef] hover:bg-[#01095c] disabled:bg-gray-400 text-white py-3 rounded-[4px] font-bold uppercase text-xs tracking-wider shadow-xs transition-colors cursor-pointer border-0 mt-2 font-antenna"
                    >
                      {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu ngay"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quote sliding drawer */}
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              onClick={() => setShowQuoteModal(false)}
              className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            />

            <div className="relative bg-white w-full max-w-[637px] h-full flex flex-col p-8 overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-right duration-300">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100/80 rounded-full transition-colors bg-transparent border-0 cursor-pointer z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col gap-3 items-start w-full mb-8">
                <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[32px] leading-[1.2]">
                  Dự toán chi phí lăn bánh
                </h2>
                <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#424242] text-[16px] leading-[1.5]">
                  Nhập thông tin để tính chi phí lăn bánh dự kiến
                </p>
              </div>

              {isSubmitted ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                  <p className="text-sm text-gray-500 max-w-sm">Đội ngũ tư vấn bán hàng của Long Khánh Ford sẽ liên hệ lại với bạn trong vòng 15 phút để báo giá chính xác.</p>
                </div>
              ) : drawerStep === "calculate" ? (
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-6 w-full">
                    {/* Select Mẫu xe */}
                    <div className="flex flex-col gap-[6px] items-start w-full relative">
                      <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                        Mẫu xe
                      </label>
                      <div className="relative w-full">
                        <select
                          value={selectedVehicleId}
                          onChange={(e) => handleVehicleChange(e.target.value)}
                          className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
                        >
                          {(allVehicles.length > 0 ? allVehicles : [initialVehicle]).map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Select Phiên bản */}
                    <div className="flex flex-col gap-[6px] items-start w-full relative">
                      <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                        Phiên bản
                      </label>
                      <div className="relative w-full">
                        <select
                          value={selectedVersionId}
                          onChange={(e) => setSelectedVersionId(e.target.value)}
                          className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
                        >
                          {(() => {
                            const list = allVehicles.length > 0 ? allVehicles : [initialVehicle];
                            const matched = list.find((v) => v.id === selectedVehicleId) || initialVehicle;
                            return matched?.versions?.map((ver: any) => (
                              <option key={ver.id} value={ver.id}>
                                {ver.name} ({formatPrice(typeof ver.price === 'string' ? parseFloat(ver.price) : ver.price)})
                              </option>
                            )) || null;
                          })()}
                        </select>
                        <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Select Khu vực */}
                    <div className="flex flex-col gap-[6px] items-start w-full relative">
                      <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                        Khu vực đăng ký (tính lệ phí trước bạ &amp; biển số)
                      </label>
                      <div className="relative w-full">
                        <select
                          value={selectedProvince}
                          onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setFormData(prev => ({ ...prev, province: e.target.value }));
                          }}
                          className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
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
                        <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Sheet */}
                  <div className="border border-[#e5e5e5] rounded-lg p-5 bg-[#fafafa] space-y-4 text-sm mt-2">
                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider text-xs">Chi tiết bảng tính dự toán:</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giá xe niêm yết:</span>
                      <span className="font-bold text-gray-900">{formatPrice(rollingCost.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thuế trước bạ:</span>
                      <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.registrationTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phí cấp biển số:</span>
                      <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.plateFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phí đăng kiểm:</span>
                      <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.registryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phí bảo trì đường bộ (12 tháng):</span>
                      <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.roadFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bảo hiểm trách nhiệm dân sự:</span>
                      <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.insuranceFee)}</span>
                    </div>
                    {rollingCost.serviceFee && rollingCost.serviceFee > 0 ? (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí dịch vụ đăng ký:</span>
                        <span className="font-semibold text-gray-800">+{formatPrice(rollingCost.serviceFee)}</span>
                      </div>
                    ) : null}
                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-base">Tổng chi phí lăn bánh dự kiến:</span>
                      <span className="font-extrabold text-[#066fef] text-xl">{formatPrice(rollingCost.total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDrawerStep("contact")}
                    className="w-full bg-[#066fef] hover:bg-[#01095c] text-white py-3.5 rounded-[4px] font-bold uppercase text-xs tracking-wider shadow-xs transition-colors cursor-pointer border-0 mt-4 font-antenna"
                  >
                    Nhận báo giá chính xác kèm khuyến mãi
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <button
                    onClick={() => setDrawerStep("calculate")}
                    className="text-xs font-semibold text-[#066fef] hover:underline bg-transparent border-0 cursor-pointer self-start"
                  >
                    ← Quay lại bảng tính
                  </button>

                  <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center font-semibold">
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Họ và tên của bạn *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="0918xxxxxx"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Địa chỉ Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Ghi chú yêu cầu tư vấn</label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Ví dụ: tôi muốn mua trả góp, cần tư vấn thủ tục đăng ký xe..."
                        className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white resize-none text-black"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#066fef] hover:bg-[#01095c] disabled:bg-gray-400 text-white py-3.5 rounded-[4px] font-bold uppercase text-xs tracking-wider shadow-xs transition-colors cursor-pointer border-0 mt-2 font-antenna"
                    >
                      {isSubmitting ? "Đang gửi thông tin..." : "Gửi yêu cầu & Nhận báo giá chính xác"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </VehicleContext.Provider>
  );
}

export function VehicleTabBar() {
  const { id } = useParams() as { id: string };
  const pathname = usePathname();
  const { vehicle, compareIds, toggleCompare } = useVehicle();

  const firstVersionSlug = useMemo(() => {
    const firstVer = vehicle?.versions?.[0];
    return firstVer ? getVersionSlug(firstVer.name) : "phien-ban";
  }, [vehicle]);

  const subTabs = useMemo(() => [
    { label: "Tổng quan", path: `/${id}` },
    { label: "Phiên bản", path: `/${id}/${firstVersionSlug}` },
    { label: "Tính năng", path: `/${id}/tinh-nang` },
    { label: "So sánh", path: `/[id]/so-sanh`, actualPath: `/${id}/so-sanh` },
    { label: "Phụ kiện", path: `/[id]/phu-kien`, actualPath: `/${id}/phu-kien` },
    { label: "Dự toán chi phí lăn bánh", path: `/[id]/du-toan-lan-banh`, actualPath: `/${id}/du-toan-lan-banh` },
    { label: "Ước tính trả góp", path: `/[id]/uoc-tinh-tra-gop`, actualPath: `/${id}/uoc-tinh-tra-gop` }
  ], [id, firstVersionSlug]);

  return (
    <div className="sticky-tabs bg-white border-b border-[#e5e5e5] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-[32px] overflow-hidden">
          <Link 
            href={`/${id}`}
            className="font-['Ford_Antenna',sans-serif] font-bold text-[#1a1a1a] text-[13px] uppercase tracking-wider whitespace-nowrap hidden sm:block hover:text-[#066fef] no-underline"
          >
            {vehicle.name}
          </Link>
          <div className="h-[20px] w-[1px] bg-[#e5e5e5] hidden sm:block" />

          <div className="flex items-center overflow-x-auto scrollbar-none gap-[16px] sm:gap-[24px] py-1">
            {subTabs.map((tab) => {
              const targetPath = tab.actualPath || tab.path;
              
              const isOverviewActive = pathname === `/san-pham/${id}` || pathname === `/${id}`;
              const isFeaturesActive = pathname === `/san-pham/${id}/tinh-nang` || pathname === `/${id}/tinh-nang`;
              const isCompareActive = pathname === `/san-pham/${id}/so-sanh` || pathname === `/${id}/so-sanh`;
              const isAccessoriesActive = pathname.startsWith(`/san-pham/${id}/phu-kien`) || pathname.startsWith(`/${id}/phu-kien`);
              const isCalculatorActive = pathname.startsWith(`/san-pham/${id}/du-toan-lan-banh`) || pathname.startsWith(`/${id}/du-toan-lan-banh`);
              const isInstallmentActive = pathname.startsWith(`/san-pham/${id}/uoc-tinh-tra-gop`) || pathname.startsWith(`/${id}/uoc-tinh-tra-gop`);

              let isActive = false;
              if (tab.label === "Tổng quan") {
                isActive = isOverviewActive;
              } else if (tab.label === "Phiên bản") {
                isActive = !isOverviewActive && !isFeaturesActive && !isCompareActive && !isAccessoriesActive && !isCalculatorActive && !isInstallmentActive;
              } else {
                isActive = pathname === targetPath;
              }
              
              return (
                <Link
                  key={tab.label}
                  href={targetPath}
                  className={`py-[16px] px-[8px] text-[16px] font-medium leading-[1.5] cursor-pointer text-center relative whitespace-nowrap bg-transparent border-0 flex-shrink-0 transition-colors no-underline font-antenna
                    ${isActive ? "text-[#066fef]" : "text-[#424242] hover:text-[#066fef]"}`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#066fef]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => toggleCompare(vehicle.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-xs font-bold transition-all border cursor-pointer select-none shrink-0 uppercase tracking-wider ${compareIds.includes(vehicle.id)
            ? "bg-[#066fef] text-white border-[#066fef] shadow-xs"
            : "bg-white text-gray-700 hover:text-[#066fef] border-gray-250 hover:bg-gray-50"
            }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {compareIds.includes(vehicle.id) ? "Đã thêm so sánh" : "So sánh xe"}
          </span>
        </button>
      </div>
    </div>
  );
}
