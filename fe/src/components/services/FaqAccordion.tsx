"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const defaultFaqs: FaqItem[] = [
  {
    question: "Điều gì tạo nên sự nổi bật thương hiệu Long Khánh Ford?",
    answer: "Showroom được đầu tư khá quy mô về trang thiết bị hiện đại, cơ sở hạ tầng khang trang, rộng rãi, đội ngũ kỹ thuật viên đông đảo, tay nghề cao, nhiệt tình, nhiều năm kinh nghiệm, được đào tạo chuyên nghiệp."
  },
  {
    question: "Sự sáng tạo trong thiết kế sản phẩm",
    answer: "Sản phẩm Ford luôn mang tính đột phá, thiết kế hiện đại, thông minh, tích hợp các công nghệ an toàn tiên tiến nhất."
  },
  {
    question: "Chất lượng dịch vụ khách hàng xuất sắc",
    answer: "Đội ngũ chăm sóc khách hàng của chúng tôi hoạt động 24/7, luôn lắng nghe và giải quyết kịp thời mọi thắc mắc của quý khách."
  },
  {
    question: "Cam kết bảo vệ môi trường",
    answer: "Ford cam kết phát triển các dòng xe thân thiện với môi trường, sử dụng các vật liệu tái chế và công nghệ động cơ tiết kiệm nhiên liệu."
  },
  {
    question: "Chiến lược marketing hiệu quả",
    answer: "Chúng tôi tập trung vào việc đem lại giá trị thực tế cho khách hàng, minh bạch về thông tin và chính sách giá trị dịch vụ."
  },
  {
    question: "Đội ngũ nhân viên chuyên nghiệp và tận tâm",
    answer: "Kỹ thuật viên được đào tạo và cấp chứng chỉ từ Ford Việt Nam, sẵn sàng đáp ứng mọi yêu cầu bảo dưỡng kỹ thuật cao với sự tận tụy lớn nhất."
  }
];

export default function FaqAccordion({ faqs = defaultFaqs }: { faqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-[1152px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side Title */}
        <div className="lg:col-span-1">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 tracking-tight leading-tight">
            Các câu hỏi thường gặp
          </h2>
        </div>

        {/* Right Side Accordion Grid */}
        <div className="lg:col-span-2 space-y-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  isOpen 
                    ? "bg-white border-b-2 border-[#0562d2]" 
                    : "bg-white border-b border-gray-100 hover:bg-gray-50/50"
                }`}
              >
                {/* Header/Question Trigger */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-semibold text-base transition-colors duration-200"
                >
                  <span className={`${isOpen ? "text-[#0562d2]" : "text-gray-800"}`}>
                    {faq.question}
                  </span>
                  <div className="shrink-0 text-gray-400">
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-[#0562d2]" />
                    ) : (
                      <Plus className="w-5 h-5 hover:text-[#0562d2] transition-colors" />
                    )}
                  </div>
                </button>

                {/* Content Panel with CSS transition */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed font-normal">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
