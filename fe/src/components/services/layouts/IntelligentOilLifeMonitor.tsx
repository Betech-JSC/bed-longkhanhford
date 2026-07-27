"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Droplet } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

export default function IntelligentOilLifeMonitorLayout({ service }: { service?: { title?: string; banner_image?: { url: string } } }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner 
        title={service?.title || "Hệ thống Cảnh báo Thay dầu Thông minh (IOLM)"} 
        backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.periodic} 
      />

      {/* Introduction Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Công Nghệ Độc Quyền Ford</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
                CÁ NHÂN HÓA LỊCH BẢO DƯỠNG THEO PHONG CÁCH LÁI XE CỦA BẠN
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Hệ thống Cảnh báo thay dầu thông minh (**IOLM - Intelligent Oil Life Monitor**) không dựa vào số km cố định để nhắc hẹn. Hệ thống thông minh này tự động phân tích dữ liệu hiệu suất động cơ và theo dõi liên tục điều kiện vận hành thực tế để đưa ra cảnh báo chính xác nhất khi nào bạn cần thay thế dầu nhớt và bộ lọc dầu.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Phân tích hành vi lái xe: Tải nặng, chạy không tải, đi địa hình",
                  "Chủ động cảnh báo thông tin qua ứng dụng FordPass™ và màn hình táp-lô",
                  "Tối ưu chi phí bảo dưỡng tối đa, tránh thay dầu sớm lãng phí hoặc thay trễ gây hư hỏng",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-white border border-gray-200 p-8 rounded-none shadow-xs flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 flex items-start justify-end p-4">
                <Droplet className="w-8 h-8 text-[#066fef]" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 uppercase">Hệ Thống IOLM Đo Lường Những Gì?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Khác với các hệ thống nhắc nhở thông thường chỉ đếm số ngày hoặc số Km, thuật toán IOLM của Ford thu thập các tín hiệu trực tiếp từ hộp đen động cơ (ECU) để đánh giá mức độ oxy hóa và nhiệt độ làm việc của nhớt:
              </p>
              <ul className="space-y-3 text-xs text-gray-700 font-semibold">
                <li className="flex gap-2">
                  <span className="text-[#066fef]">•</span>
                  <span><strong>Nhiệt độ dầu động cơ:</strong> Theo dõi chu kỳ nhiệt để xác định độ suy giảm hóa chất bảo vệ.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#066fef]">•</span>
                  <span><strong>Thói quen khởi động lạnh:</strong> Lái xe chặng ngắn liên tục tích tụ hơi ẩm và xăng dư trong cạc-te.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#066fef]">•</span>
                  <span><strong>Thời gian nổ máy dừng xe:</strong> Chạy không tải ở vòng tua thấp làm giảm áp lực bơm bôi trơn.</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Warnings & Timeline Progression */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-20 border-t border-gray-200/60 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Hành trình Cảnh báo</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            CÁC CẤP ĐỘ CẢNH BÁO BẢO DƯỠNG IOLM
          </h2>
          <p className="text-gray-600 text-sm mt-3">
            Những điều bạn sẽ thấy trên màn hình hiển thị của xe khi tuổi thọ dầu nhớt bắt đầu cạn kiệt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col justify-between rounded-none shadow-xs hover:border-[#066fef] transition-all">
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-[4px] mb-6 font-mono font-bold text-sm">
                &gt; 5%
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-wide">Hoạt Động Bình Thường</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tuổi thọ nhớt trên 5%. Động cơ được bôi trơn tối ưu. Không có thông báo hoặc cảnh báo nào xuất hiện trên màn hình hiển thị. Bạn có thể tự tin vận hành xe bình thường.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col justify-between rounded-none shadow-xs border-l-4 border-l-amber-500 hover:border-[#066fef] transition-all relative">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1">
              Bắt đầu báo
            </div>
            <div>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center rounded-[4px] mb-6 font-mono font-bold text-sm">
                5%
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-wide">Thay Dầu Động Cơ Sớm</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thông báo **“Thay dầu động cơ sớm” (Engine Oil Change Soon)** xuất hiện trên màn hình táp-lô ô tô và ứng dụng FordPass™. Bạn nên liên hệ đặt lịch hẹn dịch vụ bảo dưỡng ngay để không gây ảnh hưởng đến tuổi thọ chi tiết máy.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col justify-between rounded-none shadow-xs border-l-4 border-l-red-600 hover:border-[#066fef] transition-all relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1">
              Nguy cấp
            </div>
            <div>
              <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-[4px] mb-6 font-mono font-bold text-sm">
                0%
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-wide">Yêu Cầu Thay Dầu Ngay</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thông báo **“Yêu cầu thay dầu ngay” (Oil Change Required Immediately)** hiển thị đỏ rực rỡ. Dầu động cơ đã mất hoàn toàn hoạt tính bảo vệ chống ma sát. Cần dừng xe và thay dầu ngay lập tức để tránh mài mòn các chi tiết trong máy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Call to Action */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-16 font-antenna">
        <div className="bg-white border border-gray-200 p-8 lg:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Đặt lịch làm ngay</span>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-900">
              KỸ THUẬT VIÊN LONG KHÁNH FORD SẴN SÀNG HỖ TRỢ
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Quy trình thay thế dầu máy & bộ lọc dầu nhớt chuẩn hãng, cùng thiết bị chuyên dụng để thiết lập lại (reset) bộ đo tuổi thọ IOLM.
            </p>
          </div>
          <Link
            href="/lien-he?reason=Đặt hẹn thay dầu IOLM"
            className="bg-[#066fef] hover:bg-[#002F6C] text-white text-xs font-bold uppercase px-8 py-4 rounded-none transition-colors tracking-wider inline-flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Đặt Hẹn Thay Nhớt</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
