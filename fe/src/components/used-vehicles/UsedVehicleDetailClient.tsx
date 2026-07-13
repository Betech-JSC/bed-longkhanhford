"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Check, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Gauge,
  Car,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { contactsAPI } from "@/lib/api";

export default function UsedVehicleDetailClient({ vehicle }: { vehicle: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking Form States
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Swipe / Drag detection states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);
  
  // Thumbnail dragging states
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasDraggedRef = useRef(false);

  const displayThumbnails = vehicle && Array.isArray(vehicle.images_urls) 
    ? vehicle.images_urls.filter(Boolean) 
    : [];

  const activeImage = displayThumbnails[activeIndex] || (vehicle ? vehicle.image_url : "") || "/assets/images/placeholder_car.png";

  useEffect(() => {
    if (!showLightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowLightbox(false);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, displayThumbnails.length]);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: bookingForm.fullName,
            Phone: bookingForm.phone,
            Product: {
              id: vehicle.id,
              slug: vehicle.slug,
              title: vehicle.title,
              type: "used_vehicle",
            },
            "Nội dung cần hỗ trợ": bookingForm.note || `Đăng ký tư vấn xe đã qua sử dụng: ${vehicle.title}`,
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi yêu cầu tư vấn thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setShowBookingModal(false);
          setBookingForm({
            fullName: "",
            phone: "",
            note: ""
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Booking submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số và bắt đầu bằng số 0)!";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevImage = () => {
    if (displayThumbnails.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? displayThumbnails.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (displayThumbnails.length === 0) return;
    setActiveIndex((prev) => (prev === displayThumbnails.length - 1 ? 0 : prev + 1));
  };

  // Swipe / Touch handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    hasDraggedRef.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart !== null && Math.abs(touchStart - e.targetTouches[0].clientX) > 10) {
      hasDraggedRef.current = true;
    }
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseDownX(e.clientX);
    hasDraggedRef.current = false;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return;
    const distance = mouseDownX - e.clientX;
    if (Math.abs(distance) > 10) {
      hasDraggedRef.current = true;
    }
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
    setMouseDownX(null);
  };

  // Thumbnails scroll drag handlers
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    if (!thumbnailContainerRef.current) return;
    setIsDraggingThumb(true);
    setStartX(e.pageX - thumbnailContainerRef.current.offsetLeft);
    setScrollLeft(thumbnailContainerRef.current.scrollLeft);
  };
  const handleThumbMouseLeave = () => {
    setIsDraggingThumb(false);
  };
  const handleThumbMouseUp = () => {
    setIsDraggingThumb(false);
  };
  const handleThumbMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingThumb || !thumbnailContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    thumbnailContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const year = vehicle.year || "Đang cập nhật";
  const odo = vehicle.odo ? `${new Intl.NumberFormat("vi-VN").format(vehicle.odo)} km` : "Đang cập nhật";

  return (
    <div className="bg-[#F8F8F8] min-h-screen text-[#1a1a1a] font-sans pb-20 w-full">
      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full pt-8 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium font-antenna">
          <Link href="/" className="hover:text-[#066fef] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/xe-da-qua-su-dung" className="hover:text-[#066fef] transition-colors">
            Xe đã qua sử dụng
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#333] font-semibold line-clamp-1 flex-1">
            {vehicle.title}
          </span>
        </div>
      </div>

      {/* Main Core Showcase Columns */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-none overflow-hidden p-6 md:p-8 border border-gray-200 shadow-xs">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Big Image Preview */}
            <div 
              className="relative aspect-[16/10] w-full overflow-hidden rounded-none border border-gray-150 bg-white shadow-inner group cursor-zoom-in select-none"
              onClick={() => { if (!hasDraggedRef.current) setShowLightbox(true); }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            >
              <Image
                src={activeImage}
                alt={vehicle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none"
              />

              {/* Navigation Arrows overlay on hover */}
              {displayThumbnails.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#066fef] text-white p-3 rounded-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 border-0 cursor-pointer flex items-center justify-center z-10 hover:scale-105"
                    aria-label="Previous image"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#066fef] text-white p-3 rounded-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 border-0 cursor-pointer flex items-center justify-center z-10 hover:scale-105"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {displayThumbnails.length > 1 && (
              <div 
                ref={thumbnailContainerRef}
                onMouseDown={handleThumbMouseDown}
                onMouseLeave={handleThumbMouseLeave}
                onMouseUp={handleThumbMouseUp}
                onMouseMove={handleThumbMouseMove}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none cursor-grab active:cursor-grabbing"
              >
                {displayThumbnails.map((thumb: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`relative w-24 aspect-[16/10] rounded-[4px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white
                      ${activeIndex === idx ? "border-[#066fef] scale-95 shadow-xs" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover pointer-events-none select-none"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs Info panel */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-4 font-antenna">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#066fef]/10 text-[#066fef] text-[10px] font-bold border border-[#066fef]/20 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Ford Assured Đã Kiểm Định</span>
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
                {vehicle.title}
              </h1>
              <p className="text-gray-550 text-sm leading-relaxed">
                {vehicle.tagline}
              </p>
            </div>

            {/* Odo & Year highlights */}
            <div className="grid grid-cols-2 gap-4 bg-[#F8F8F8] p-4 rounded-none border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-[#066fef]/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#066fef]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-antenna">Năm sản xuất</span>
                  <span className="text-sm font-bold text-gray-800 font-antenna">{year}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-[#066fef]/10 flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5 text-[#066fef]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-antenna">Số Km đã đi</span>
                  <span className="text-sm font-bold text-gray-800 font-antenna">{odo}</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#00095B] text-white p-5 rounded-none border border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider block font-antenna">Giá bán ưu đãi</span>
              <div className="text-2xl md:text-3xl font-bold text-white font-antenna">
                {formatPrice(vehicle.price)}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 bg-[#066fef] text-white rounded-[4px] flex gap-2 items-center justify-center py-4 font-bold text-xs uppercase tracking-wider hover:bg-[#01095c] transition-all shadow-xs cursor-pointer border-0"
              >
                <Car className="w-5 h-5" />
                <span>Đăng ký lái thử / Tư vấn</span>
              </button>

              <a
                href="tel:0918909060"
                className="flex items-center justify-center border border-gray-200 hover:border-[#066fef] text-[#066fef] bg-white rounded-[4px] px-5 transition-all cursor-pointer"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>

            {/* Assured highlights */}
            <div className="border border-gray-200 p-4 rounded-none space-y-3.5 bg-white font-antenna">
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Cam kết chính hãng</strong>: Đã trải qua quy trình kiểm tra 167 điểm nghiêm ngặt từ các kỹ thuật viên Ford.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Pháp lý rõ ràng</strong>: Rút hồ sơ, công chứng mua bán và sang tên nhanh chóng, minh bạch.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Hỗ trợ tài chính</strong>: Hỗ trợ vay mua xe cũ trả góp lên đến 70% giá trị xe tại các ngân hàng đối tác liên kết.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed description panel */}
        {vehicle.description && (
          <div className="mt-8 bg-white border border-gray-200 rounded-none p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 font-antenna">
              <FileText className="w-5 h-5 text-[#066fef]" />
              <h2 className="text-lg font-bold text-gray-900">Chi tiết xe & Mô tả từ đại lý</h2>
            </div>
            <div 
              className="prose max-w-none text-sm text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: vehicle.description }}
            />
          </div>
        )}

      </div>

      {/* Booking Form Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-200">
            
            {/* Modal Header */}
            <div className="bg-[#00095B] text-white p-6 relative font-antenna">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                Đăng ký Tư vấn / Lái thử
              </h3>
              <p className="text-xs text-white/70 mt-1.5">
                Xe yêu cầu: <span className="text-white font-bold">{vehicle.title}</span>
              </p>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-lg cursor-pointer bg-transparent border-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Long Khánh Ford đã nhận được thông tin. Đội ngũ tư vấn xe cũ sẽ chủ động liên hệ hỗ trợ bạn trong ít phút.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs text-center font-semibold">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-1 font-antenna">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên của bạn *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-[8px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1 font-antenna">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Số điện thoại liên hệ *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0918xxxxxx"
                      className="w-full px-4 py-3 rounded-[8px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1 font-antenna">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Lời nhắn / Yêu cầu thêm</label>
                    <textarea 
                      name="note"
                      value={bookingForm.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="vd: Hẹn xem xe trực tiếp tại showroom, hỗ trợ vay ngân hàng thế nào..."
                      className="w-full px-4 py-3 rounded-[8px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white resize-none text-black"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#066fef] hover:bg-[#01095c] disabled:bg-gray-400 text-white py-3.5 rounded-[4px] font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border-0 mt-4 shadow-xs font-antenna"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi thông tin đăng ký"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
          onClick={() => setShowLightbox(false)}
        >
          {/* Top Panel */}
          <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 z-10 text-white bg-gradient-to-b from-black/60 to-transparent">
            {/* Index Counter */}
            <div className="bg-white/10 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-[4px] font-bold">
              {activeIndex + 1} / {displayThumbnails.length}
            </div>
            {/* Close Button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="bg-white/10 hover:bg-[#066fef] text-white p-2.5 rounded-[4px] transition-all duration-300 border-0 cursor-pointer flex items-center justify-center"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Image Showcase */}
          <div 
            className="relative w-full max-w-[90vw] max-h-[80vh] aspect-[16/10] overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            >
              <Image
                src={displayThumbnails[activeIndex] || "/assets/images/placeholder_car.png"}
                alt={vehicle.title}
                fill
                priority
                sizes="90vw"
                className="object-contain pointer-events-none select-none"
              />
            </div>
          </div>

          {/* Bottom Thumbnails Strip for Lightbox */}
          {displayThumbnails.length > 1 && (
            <div 
              className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2 px-4 overflow-x-auto py-2 z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {displayThumbnails.map((thumb: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`relative w-16 md:w-20 aspect-[16/10] rounded-[4px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white
                    ${activeIndex === idx ? "border-[#066fef] scale-95 shadow-xs" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Image
                    src={thumb}
                    alt={`Lightbox Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover pointer-events-none select-none"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Next/Prev Navigation Buttons */}
          {displayThumbnails.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#066fef] text-white p-3 md:p-4 rounded-[4px] transition-all duration-300 border-0 cursor-pointer flex items-center justify-center z-10 hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#066fef] text-white p-3 md:p-4 rounded-[4px] transition-all duration-300 border-0 cursor-pointer flex items-center justify-center z-10 hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}
