"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  ChevronLeft, 
  ChevronRight, 
  PhoneCall,
  X,
  CheckCircle2,
  Loader2,
  Send,
  Phone,
  MessageCircle
} from "lucide-react";
import { usedVehiclesAPI, contactsAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/site-assets";
import { formatPersonName } from "@/lib/formatters";
import { fireLdpFormConversion } from "@/components/vehicle/LdpTrackingManager";

interface UsedVehicleItem {
  id: number | string;
  title?: string;
  slug?: string;
  tagline?: string;
  price?: number | string;
  year?: number | string;
  odo?: number | string;
  image_url?: string;
  images_urls?: string[];
  sort_order?: number;
  status?: string;
}

interface SalesConsultantInfo {
  id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  zalo_url?: string;
  [key: string]: unknown;
}

interface LdpUsedVehiclesBlockProps {
  data?: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
  salesConsultant?: SalesConsultantInfo;
  landingPageId?: number | string;
  salesEmail?: string;
  openQuoteDrawer?: (vehicleId?: string, versionId?: string) => void;
  anchorId?: string;
  isEditMode?: boolean;
}

export default function LdpUsedVehiclesBlock({
  data,
  salesConsultant,
  landingPageId,
  salesEmail,
  anchorId = "used-vehicles-slider",
  isEditMode = false,
}: LdpUsedVehiclesBlockProps) {
  const [vehicles, setVehicles] = useState<UsedVehicleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [brokenImages, setBrokenImages] = useState<Record<string | number, boolean>>({});

  // States dành riêng cho Modal Tư Vấn Xe Cũ gửi về CMS và Email Cố Vấn
  const [showConsultModal, setShowConsultModal] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<UsedVehicleItem | null>(null);
  const [consultName, setConsultName] = useState<string>("");
  const [consultPhone, setConsultPhone] = useState<string>("");
  const [consultNote, setConsultNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Drag / swipe states
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Fetch danh sách xe cũ từ module CMS Xe đã qua sử dụng
  useEffect(() => {
    let isMounted = true;
    usedVehiclesAPI
      .getAll()
      .then((res: unknown) => {
        if (!isMounted) return;
        const resObj = res as { data?: UsedVehicleItem[] } | UsedVehicleItem[];
        const list = Array.isArray(resObj) ? resObj : (resObj?.data || []);
        if (Array.isArray(list)) {
          const limit = data?.limit ? Number(data.limit) : 10;
          setVehicles(list.slice(0, limit > 0 ? limit : 10));
        }
      })
      .catch((err) => {
        console.warn("[LdpUsedVehiclesBlock] Failed to load used vehicles:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [data?.limit]);

  // Số lượng card hiển thị tùy theo viewport
  // Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards
  const totalItems = vehicles.length;
  const maxDesktopIndex = Math.max(0, totalItems - 3);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  }, [maxDesktopIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  }, [maxDesktopIndex]);

  // Auto-play slider mỗi 4.5 giây, tạm dừng khi hover
  useEffect(() => {
    if (isHovered || totalItems <= 3 || showConsultModal) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, totalItems, handleNext, showConsultModal]);

  // Xử lý vuốt trên thiết bị di động
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const formatPrice = (price?: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (!num || isNaN(num) || num === 0) return "Liên hệ";
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2).replace(/\.00$/, "") + " Tỷ";
    }
    return (num / 1000000).toFixed(0) + " Triệu";
  };

  // Mở modal tư vấn cho dòng xe cũ cụ thể
  const handleOpenConsultModal = (car: UsedVehicleItem) => {
    setSelectedCar(car);
    setConsultNote(
      `Tôi quan tâm và cần tư vấn chi tiết về xe: ${car.title || "Ford cũ"} (Đời ${car.year || "mới"}, Giá: ${formatPrice(car.price || 0)}). Vui lòng gửi báo giá ưu đãi và hỗ trợ thủ tục.`
    );
    setSubmitError("");
    setIsSubmitted(false);
    setShowConsultModal(true);
  };

  // Gửi lead tư vấn trực tiếp về email setup trong CMS và Module Yêu cầu liên hệ (contacts)
  const handleSubmitConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) {
      setSubmitError("Vui lòng điền họ tên và số điện thoại.");
      return;
    }

    const cleanPhone = consultPhone.trim();
    if (!/^(0)[0-9]{8,11}$/.test(cleanPhone)) {
      setSubmitError("Số điện thoại không hợp lệ (phải bắt đầu bằng số 0, từ 9 đến 11 số).");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const car = selectedCar;
      const targetSalesEmail = salesEmail || salesConsultant?.email;
      const targetSalesId = salesConsultant?.id ? Number(salesConsultant.id) : undefined;
      const targetLdpId = landingPageId ? Number(landingPageId) : undefined;
      const carTitle = car?.title || "Xe Ford đã qua sử dụng";

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          sales_consultant_id: targetSalesId,
          data: {
            landing_page_id: targetLdpId,
            sales_email: targetSalesEmail,
            Name: consultName.trim(),
            Phone: cleanPhone,
            "Họ và tên": consultName.trim(),
            "Số điện thoại": cleanPhone,
            "Tỉnh / Thành phố": "Đồng Nai",
            Product: {
              id: String(car?.id || "used-vehicle"),
              slug: car?.slug || String(car?.id || "used-vehicle"),
              title: carTitle,
              type: "used_vehicle",
            },
            "Dòng xe quan tâm": `${carTitle} (Đời ${car?.year || ""}, ODO: ${car?.odo || ""} km, Giá: ${formatPrice(car?.price || 0)})`,
            "Loại yêu cầu": "Tư vấn xe đã qua sử dụng (Chính hãng Ford Assured)",
            "Nội dung cần hỗ trợ": consultNote.trim() || `Yêu cầu tư vấn xe đã qua sử dụng: ${carTitle}`,
            source: "🚘 LDP - Khối Xe Cũ Đã Qua Sử Dụng (Slider)",
          }
        }
      });

      if (response && response.success === false) {
        setSubmitError(typeof response.message === "string" ? response.message : "Gửi yêu cầu không thành công. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        if (salesConsultant) {
          fireLdpFormConversion({
            salesConsultant,
            formType: "ADVISE_FORM",
            targetVehicleName: carTitle,
            customerPhone: cleanPhone,
          });
        }
        setTimeout(() => {
          setIsSubmitted(false);
          setShowConsultModal(false);
          setConsultName("");
          setConsultPhone("");
          setConsultNote("");
        }, 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      setSubmitError(errorObj?.data?.message || errorObj?.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu không tải được xe nào và không phải trong chế độ Edit CMS, ẩn block
  if (!loading && totalItems === 0 && !isEditMode) {
    return null;
  }

  return (
    <section 
      id={anchorId} 
      className="w-full bg-[#f8fafc] py-16 md:py-20 overflow-hidden select-none border-t border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0562D2] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Chính Hãng Ford Assured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {data?.title || "Xe Đã Qua Sử Dụng Chất Lượng Cao"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              {data?.subtitle || "Tuyển chọn các dòng xe Ford lướt được kiểm tra 167 điểm kỹ thuật, bảo hành chính hãng, nguồn gốc minh bạch tại showroom Long Khánh Ford."}
            </p>
          </div>

          {/* Slider Navigation Buttons */}
          {totalItems > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-[#0562D2] hover:border-[#0562D2] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-[#0562D2] hover:border-[#0562D2] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse h-[380px]">
                <div className="bg-gray-200 h-[210px]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-4/5" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Slider Track */
          <div 
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out -mx-3"
              style={{
                transform: `translateX(-${currentIndex * (100 / (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)`
              }}
            >
              {vehicles.map((car) => {
                const year = car.year || "Đang cập nhật";
                const odo = car.odo ? `${new Intl.NumberFormat("vi-VN").format(Number(car.odo))} km` : "Đang cập nhật";
                const isBroken = brokenImages[car.id];
                const rawImg = car.image_url || (Array.isArray(car.images_urls) && car.images_urls[0]) || "";
                const img = (!isBroken && rawImg) ? resolveImageUrl(rawImg) : "/assets/territory-hero.jpg";

                return (
                  <div 
                    key={car.id} 
                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3"
                  >
                    {/* Display-only Card (KHÔNG link sang trang chi tiết theo yêu cầu) */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group">
                      {/* Image Frame */}
                      <div className="relative h-[210px] bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-100">
                        <Image
                          src={img}
                          alt={car.title || "Xe Ford đã qua sử dụng"}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                          onError={() => {
                            setBrokenImages((prev) => ({ ...prev, [car.id]: true }));
                          }}
                        />
                        {/* Ford Assured Badge */}
                        <div className="absolute top-3 left-3 bg-[#0562D2] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md shadow-xs flex items-center gap-1 z-10">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Ford Assured</span>
                        </div>
                      </div>

                      {/* Info Area */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Specs: Year & ODO */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-2.5">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                              <Calendar className="w-3.5 h-3.5 text-[#0562D2]" />
                              Đời {year}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                              <Gauge className="w-3.5 h-3.5 text-[#0562D2]" />
                              {odo}
                            </span>
                          </div>

                          {/* Car Title */}
                          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-1.5">
                            {car.title}
                          </h3>

                          {/* Tagline / Subtitle */}
                          {car.tagline && (
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                              {car.tagline}
                            </p>
                          )}
                        </div>

                        {/* Price & Consultation Action */}
                        <div className="border-t border-gray-100 pt-3.5 mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Giá bán ưu đãi
                            </span>
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(car.price)}
                            </span>
                          </div>

                          {/* Nút tư vấn xe cũ: Mở modal tư vấn gửi thông báo về Email & CMS của Cố vấn */}
                          <button
                            type="button"
                            onClick={() => handleOpenConsultModal(car)}
                            className="inline-flex items-center gap-1.5 bg-[#0562D2] hover:bg-[#044ea7] text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Tư vấn</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dots Pagination Indicator */}
        {totalItems > 3 && (
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? "w-7 bg-[#0562D2]" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL TƯ VẤN DÒNG XE CŨ CỤ THỂ - GỬI VỀ EMAIL VÀ CMS CỦA CỐ VẤN */}
      {showConsultModal && selectedCar && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setShowConsultModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="bg-[#0b192e] text-white p-5 sm:p-6 relative">
              <button
                type="button"
                onClick={() => !isSubmitting && setShowConsultModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0562D2]" />
                <span>Tư vấn xe chính hãng Ford Assured</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Đăng Ký Tư Vấn Xe Đã Qua Sử Dụng
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                {salesConsultant?.name ? `chuyên viên kinh doanh ${formatPersonName(salesConsultant.name)}` : "đội ngũ chuyên viên kinh doanh"} sẽ liên hệ gửi báo giá ưu đãi và hỗ trợ Quý khách trong thời gian sớm nhất.
              </p>
            </div>

            {/* Body Modal */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
              {/* Selected Vehicle Summary Card */}
              <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-200/80 rounded-xl p-3 mb-5">
                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                  <Image
                    src={
                      !brokenImages[selectedCar.id] && selectedCar.image_url
                        ? resolveImageUrl(selectedCar.image_url)
                        : "/assets/territory-hero.jpg"
                    }
                    alt={selectedCar.title || "Xe Ford cũ"}
                    fill
                    unoptimized={true}
                    className="object-cover"
                    onError={() => setBrokenImages((prev) => ({ ...prev, [selectedCar.id]: true }))}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {selectedCar.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>Đời {selectedCar.year || "mới"}</span>
                    <span>•</span>
                    <span>ODO: {selectedCar.odo ? `${new Intl.NumberFormat("vi-VN").format(Number(selectedCar.odo))} km` : "Chuẩn hãng"}</span>
                  </div>
                  <div className="text-sm font-extrabold text-red-600 mt-0.5">
                    {formatPrice(selectedCar.price || 0)}
                  </div>
                </div>
              </div>

              {/* State: Submitted Success */}
              {isSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Gửi Yêu Cầu Tư Vấn Thành Công!
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Cảm ơn Quý khách <strong>{consultName}</strong>. Yêu cầu đã được chuyển trực tiếp tới {salesConsultant?.name ? `chuyên viên kinh doanh ${formatPersonName(salesConsultant.name)}` : "chuyên viên kinh doanh"}. Chúng tôi sẽ liên hệ lại qua số <strong>{consultPhone}</strong> trong ít phút!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitConsult} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0562D2] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="Ví dụ: 0909 123 456"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0562D2] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nhu cầu cần hỗ trợ
                    </label>
                    <textarea
                      rows={4}
                      value={consultNote}
                      onChange={(e) => setConsultNote(e.target.value)}
                      placeholder="Nhu cầu tư vấn xem xe, lái thử, thủ tục trả góp..."
                      className="w-full min-h-[115px] px-3.5 py-3 bg-white border border-gray-300 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0562D2] focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#0562D2] hover:bg-[#044ea7] disabled:bg-gray-400 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi thông tin...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
                      </>
                    )}
                  </button>

                  {/* Quick Contact Links with the Sales Consultant */}
                  {(salesConsultant?.phone || salesConsultant?.zalo_url) && (
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-xs">
                      {salesConsultant?.phone && (
                        <a
                          href={`tel:${salesConsultant.phone}`}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Gọi Hotline: {salesConsultant.phone}</span>
                        </a>
                      )}
                      {salesConsultant?.zalo_url && (
                        <a
                          href={salesConsultant.zalo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat Zalo</span>
                        </a>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
