"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Clock, FileText, ChevronRight, Calculator, Wrench } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

type VehicleSchedule = {
  name: string;
  image: string;
  links: { label: string; url: string }[];
};

// Mileage checklist items
const mileageData = [
  {
    km: "10.000 KM / 6 tháng",
    level: "Bảo dưỡng Cấp 1",
    items: [
      "Thay dầu động cơ chính hãng Ford Castrol Magnatec",
      "Thay lọc dầu động cơ mới 100%",
      "Vệ sinh lọc gió động cơ & lọc gió điều hòa",
      "Kiểm tra hệ thống phanh, đĩa phanh và má phanh 4 bánh",
      "Kiểm tra mực nước rửa kính, nước làm mát & dầu phanh",
      "Đọc lỗi chẩn đoán vi tính bằng máy chẩn đoán Ford IDS"
    ]
  },
  {
    km: "20.000 KM / 12 tháng",
    level: "Bảo dưỡng Cấp 2",
    items: [
      "Tất cả các hạng mục của Cấp 1",
      "Thay lọc gió điều hòa chống vi khuẩn & bụi mịn PM2.5",
      "Đảo lốp xe & cân bằng động bánh xe",
      "Kiểm tra hệ thống gầm, rô-tuyn, cao su cao cấp",
      "Bảo dưỡng cúp-lê phanh và vệ sinh phanh 4 bánh",
      "Kiểm tra tình trạng ắc quy & hệ thống sạc điện"
    ]
  },
  {
    km: "40.000 KM / 24 tháng",
    level: "Bảo dưỡng Cấp 3 (Lớn)",
    items: [
      "Tất cả các hạng mục của Cấp 1 & Cấp 2",
      "Thay lọc nhiên liệu (Lọc xăng/Lọc dầu diesel)",
      "Thay lọc gió động cơ mới",
      "Thay dầu phanh toàn bộ hệ thống",
      "Thay dầu trợ lực lái & nước làm mát động cơ",
      "Vệ sinh kim phun & họng hút nhiên liệu chuyên sâu"
    ]
  },
  {
    km: "80.000 KM / 48 tháng",
    level: "Bảo dưỡng Cấp 4 (Tổng thể)",
    items: [
      "Tất cả các hạng mục của Cấp 1, 2 & 3",
      "Thay dây curoa cam / dây curoa tổng động cơ",
      "Thay dầu hộp số tự động & dầu cầu trước/sau",
      "Kiểm tra & thay thế bugi đánh lửa (động cơ xăng)",
      "Bảo dưỡng toàn bộ dàn lạnh & nạp gas điều hòa",
      "Cân chỉnh thước lái điện tử 3D chuẩn xác"
    ]
  }
];

// 5-Step Process Timeline
const processSteps = [
  { step: "01", title: "Tiếp Nhận & Đánh Giá", desc: "Cố vấn dịch vụ lắng nghe nhu cầu, kiểm tra tổng quan xe 83 điểm và lập phiếu thu nhận." },
  { step: "02", title: "Chẩn Đoán IDS Độc Quyền", desc: "Quét lỗi hệ thống bằng thiết bị máy tính Ford IDS chính hãng công nghệ cao." },
  { step: "03", title: "Thi Công Chuẩn 3S", desc: "Kỹ thuật viên chứng chỉ Ford toàn cầu tiến hành bảo dưỡng & thay phụ tùng chính hãng." },
  { step: "04", title: "Kiểm Tra Chất Lượng (QC)", desc: "Quản đốc xưởng chạy thử nghiệm thực tế và ký duyệt phiếu xuất xưởng." },
  { step: "05", title: "Rửa Xe & Bàn Giao", desc: "Vệ sinh hút bụi nội ngoại thất miễn phí và hướng dẫn bảo dưỡng mốc tiếp theo." }
];

export default function PeriodicMaintenanceLayout({
  service,
  displaySchedules,
}: {
  service?: any;
  displaySchedules: VehicleSchedule[];
}) {
  const [activeKmIndex, setActiveKmIndex] = useState(0);

  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Dynamic Hero Banner */}
      <ServicePageBanner title={service?.title || "Dịch Vụ Bảo Dưỡng Định Kỳ Tiêu Chuẩn Ford"} backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.periodic} />

      {/* Intro Feature Highlights Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pt-16 pb-12 font-antenna">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs hover:border-[#066fef] transition-all group">
            <div className="w-12 h-12 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-[4px] mb-5 group-hover:bg-[#066fef] group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">100% Phụ Tùng Chính Hãng</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Tất cả các vật tư thay thế đều nhập khẩu trực tiếp từ Ford với tem mác bảo hành toàn quốc 12 tháng hoặc 20.000 KM.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs hover:border-[#066fef] transition-all group">
            <div className="w-12 h-12 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-[4px] mb-5 group-hover:bg-[#066fef] group-hover:text-white transition-colors">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Thiết Bị IDS Hiện Đại</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hệ thống chẩn đoán vi tính độc quyền IDS của Ford giúp phát hiện chính xác mọi nguy cơ hỏng hóc từ sớm.
            </p>
          </div>
          <div className="bg-white p-8 border border-gray-200 rounded-none shadow-xs hover:border-[#066fef] transition-all group">
            <div className="w-12 h-12 bg-[#066fef]/10 text-[#066fef] flex items-center justify-center rounded-[4px] mb-5 group-hover:bg-[#066fef] group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">Kỹ Thuật Viên Chứng Chỉ Ford</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Đội ngũ thợ máy lâu năm được Ford Việt Nam cấp chứng chỉ đào tạo định kỳ khắt khe nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Mileage Checklist Matrix */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-12 font-antenna">
        <div className="bg-white border border-gray-200 rounded-none p-8 lg:p-12 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Tra Cứu Chi Tiết Hạng Mục</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              DANH MỤC KIỂM TRA THEO MỐC KILOMET
            </h2>
            <p className="text-gray-600 text-sm mt-3">
              Lựa chọn số km xe của bạn để xem quy trình kiểm tra & thay thế tiêu chuẩn từ hãng Ford.
            </p>
          </div>

          {/* Km Tabs Header */}
          <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 pb-4 mb-8">
            {mileageData.map((data, idx) => (
              <button
                key={idx}
                onClick={() => setActiveKmIndex(idx)}
                className={`px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
                  activeKmIndex === idx
                    ? "bg-[#066fef] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {data.km}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="bg-[#F8F8F8] border border-gray-200 p-6 md:p-8 rounded-none">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-[#066fef] uppercase tracking-wider">{mileageData[activeKmIndex].level}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1 uppercase">{mileageData[activeKmIndex].km}</h3>
              </div>
              <Link
                href="/lien-he"
                className="bg-[#002F6C] hover:bg-[#066fef] text-white text-xs font-bold uppercase px-5 py-2.5 rounded-[4px] transition-colors inline-flex items-center gap-2"
              >
                <span>Báo Giá Gói Này</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mileageData[activeKmIndex].items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 border border-gray-150 rounded-none">
                  <CheckCircle2 className="w-5 h-5 text-[#066fef] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Maintenance Timeline */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Quy Trình Chuẩn Hóa 3S</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            5 BƯỚC BẢO DƯỠNG XE CHUYÊN NGHIỆP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {processSteps.map((step, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 flex flex-col justify-between group hover:border-[#066fef] transition-all">
              <div>
                <span className="text-3xl font-bold text-[#066fef]/30 group-hover:text-[#066fef] transition-colors block mb-4">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2 uppercase">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicle Models Maintenance Brochure Cards Grid */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Dành Cho Mọi Dòng Xe</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
              LỊCH BẢO DƯỠNG CHI TIẾT THEO DÒNG XE
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            Xem và tải bản mềm hướng dẫn bảo dưỡng chuẩn hãng dành riêng cho xe của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displaySchedules.map((car, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-none p-5 shadow-xs hover:shadow-md hover:border-[#066fef] transition-all duration-300 flex flex-col gap-4 group"
            >
              <div className="relative w-full h-44 overflow-hidden bg-[#F8F8F8] border border-gray-100 p-4 flex items-center justify-center">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 uppercase tracking-wide group-hover:text-[#066fef] transition-colors">
                    {car.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Lịch trình & định mức tiêu chuẩn</p>
                </div>
                <ul className="space-y-2 text-xs text-[#066fef] border-t border-gray-100 pt-3">
                  {car.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1.5 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
