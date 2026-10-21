"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { formatPersonName } from "@/lib/formatters";

interface LdpFaqBlockProps {
  data?: any;
  salesConsultant?: any;
  anchorId?: string;
  isEditMode?: boolean;
}

interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "Điều gì tạo nên sự nổi bật thương hiệu Long Khánh Ford?",
    a: "Long Khánh Ford tự hào là đại lý ủy quyền chính thức lớn nhất của Ford Việt Nam tại khu vực miền Nam, sở hữu cơ sở vật chất 3S hiện đại, đội ngũ kỹ thuật viên đạt chuẩn quốc tế và kho xe luôn sẵn sàng giao ngay."
  },
  {
    q: "Chuyên viên kinh doanh có thể hỗ trợ tôi những gì trong quá trình mua xe?",
    a: "Chuyên viên kinh doanh sẽ đồng hành 1:1 cùng bạn từ việc tư vấn chọn phiên bản xe phù hợp nhu cầu, mang xe đến tận nhà lái thử miễn phí, tính toán phương án trả góp tối ưu, hỗ trợ đăng ký biển số và bàn giao xe tận nơi chu đáo."
  },
  {
    q: "Chính sách hỗ trợ mua xe Ford trả góp như thế nào?",
    a: "Long Khánh Ford liên kết với các ngân hàng lớn uy tín (Vietcombank, BIDV, Shinhan Bank, VPBank...) hỗ trợ vay đến 80-85% giá trị xe với lãi suất ưu đãi đặc quyền, thời gian vay linh hoạt lên tới 8 năm, xét duyệt hồ sơ nhanh trong ngày."
  },
  {
    q: "Chất lượng dịch vụ hậu mãi và bảo hành tại đại lý ra sao?",
    a: "Tất cả xe mua tại Long Khánh Ford đều được áp dụng chế độ bảo hành 3 năm hoặc 100.000 km chính hãng, cùng các dịch vụ chuyên nghiệp: cứu hộ 24/7, bảo dưỡng nhanh 60 phút, nhận và giao xe bảo dưỡng tận nơi, phòng chờ VIP tiện nghi."
  },
  {
    q: "Tôi có được đăng ký lái thử xe Ford tận nhà không?",
    a: "Hoàn toàn miễn phí! Bạn chỉ cần nhấn nút 'Đăng ký lái thử' hoặc liên hệ trực tiếp Hotline/Zalo của Chuyên viên kinh doanh, chúng tôi sẽ chuẩn bị dòng xe bạn mong muốn và mang đến tận nhà hoặc cơ quan để bạn trải nghiệm thực tế."
  },
  {
    q: "Chương trình ưu đãi và khuyến mãi trong tháng này gồm những gì?",
    a: "Mỗi dòng xe đều có gói ưu đãi đặc biệt: giảm tiền mặt trực tiếp, tặng gói phụ kiện chính hãng cao cấp (dán phim, lót sàn, camera hành trình), tặng bảo hiểm vật chất và hỗ trợ 50-100% lệ phí trước bạ tùy thời điểm."
  }
];

export default function LdpFaqBlock({
  data,
  salesConsultant,
  anchorId = "faq",
  isEditMode = false,
}: LdpFaqBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0)
    ? data.faqs
    : DEFAULT_FAQS;

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id={anchorId} className="w-full bg-[#F8F9FA] border-y border-gray-200 py-16 md:py-[72px]">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

        {/* Left Column: Title */}
        <div className="lg:col-span-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0562D2] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Giải đáp thắc mắc</span>
          </div>
          <h2 className="text-3xl lg:text-[44px] font-semibold text-[#1a1a1a] leading-tight tracking-tight">
            Các câu hỏi <span className="text-[#0562D2]">thường gặp</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {data?.subtitle || `Những thông tin hữu ích giúp bạn an tâm lựa chọn chiếc xe Ford ưng ý nhất cùng ${salesConsultant?.name ? `chuyên viên kinh doanh ${formatPersonName(salesConsultant.name)}` : "chuyên viên kinh doanh"}.`}
          </p>
        </div>

        {/* Right Column: Accordions list */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`relative overflow-hidden border transition-all duration-300 bg-white rounded-xl group ${
                  isOpen
                    ? "border-[#00095B] shadow-md -translate-y-0.5"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {/* Title Toggle trigger */}
                <button
                  onClick={() => toggle(idx)}
                  className={`w-full flex items-center justify-between text-left transition-all duration-300 cursor-pointer select-none px-6 py-4 sm:py-5 gap-4 border-0 ${
                    isOpen
                      ? "bg-[#00095B] text-white"
                      : "bg-white text-[#1A1A1A] hover:bg-gray-50/50"
                  }`}
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight leading-snug pr-4">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-white flex-shrink-0 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#00095B] flex-shrink-0 transition-transform duration-300" />
                  )}
                </button>

                {/* Body Content */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden bg-white">
                    <p className="px-6 py-4 sm:py-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-100">
                      {faq.a}
                    </p>
                  </div>
                </div>

                {/* Bottom Blue Indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#0562D2] transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
