"use client";

import Image from "next/image";
import Link from "next/link";
import { Mic, Navigation, Smartphone, Radio, Settings, HelpCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const syncFeatures = [
  {
    icon: Mic,
    title: "Điều khiển bằng giọng nói thông minh",
    desc: "Ra lệnh rảnh tay để thực hiện cuộc gọi, thay đổi nhiệt độ điều hòa, hoặc chọn danh sách nhạc yêu thích mà không cần rời tay khỏi vô lăng."
  },
  {
    icon: Navigation,
    title: "Bản đồ & Hệ thống dẫn đường GPS",
    desc: "Hệ thống bản đồ 3D hiển thị trực quan thông tin giao thông theo thời gian thực, giúp bạn tìm ra lộ trình nhanh nhất và an toàn nhất."
  },
  {
    icon: Smartphone,
    title: "Apple CarPlay & Android Auto không dây",
    desc: "Kết nối điện thoại thông minh của bạn với màn hình trung tâm của xe hoàn toàn không dây, dễ dàng sử dụng các ứng dụng bản đồ, nghe nhạc."
  },
  {
    icon: Radio,
    title: "Hệ thống giải trí đỉnh cao",
    desc: "Tích hợp hoàn hảo với hệ thống loa B&O cao cấp, mang lại trải nghiệm âm thanh sống động, trung thực trên mọi cung đường."
  }
];

const connectionSteps = [
  {
    step: "01",
    title: "Bật Bluetooth trên điện thoại",
    desc: "Vào phần Cài đặt trên điện thoại thông minh của bạn và bật tính năng Bluetooth."
  },
  {
    step: "02",
    title: "Tìm kiếm thiết bị trên SYNC",
    desc: "Trên màn hình cảm ứng SYNC của xe, nhấn vào 'Thêm điện thoại' (Add Phone) và làm theo hướng dẫn."
  },
  {
    step: "03",
    title: "Xác nhận mã liên kết PIN",
    desc: "Đối chiếu mã số PIN hiển thị trên màn hình xe và điện thoại trùng khớp, sau đó chọn 'Ghép đôi' (Pair)."
  },
  {
    step: "04",
    title: "Bắt đầu trải nghiệm kết nối",
    desc: "Đồng bộ hóa danh bạ và cho phép kết nối Apple CarPlay / Android Auto để bắt đầu sử dụng."
  }
];

export default function FordSyncLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner 
        title={service?.title || "Công Nghệ Kết Nối Thông Minh Ford SYNC®"} 
        backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.upgrade} 
      />

      {/* Intro Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Trải Nghiệm Tương Lai</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
                FORD SYNC® - KẾT NỐI KHÔNG GIỚI HẠN GIỮA BẠN VÀ XE
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Hệ thống thông tin giải trí và kết nối Ford SYNC® được phát triển nhằm mang lại sự an toàn và tiện nghi tuyệt đối. Cho phép bạn tương tác hoàn hảo với chiếc Ford của mình chỉ qua giọng nói hoặc màn hình cảm ứng tràn viền siêu mượt.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Giao diện trực quan trực tiếp lấy cảm hứng từ điện thoại thông minh",
                  "Cập nhật phần mềm không dây Ford Power-Up liên tục",
                  "Hỗ trợ kết nối đa thiết bị cùng lúc mượt mà",
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
            <div className="relative aspect-video w-full border border-gray-200 shadow-md bg-gray-900">
              <Image 
                src="/assets/img-gradient-1.png" // Fallback to territorial car image representing the interior screen
                alt="Ford SYNC Interface"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <span className="text-white font-bold text-lg uppercase tracking-wider bg-black/60 px-4 py-2 border border-white/20">
                  SYNC® 4A Cảm Ứng Trực Quan
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sync Features Grid */}
      <section className="w-full bg-[#f0f4f8]/40 border-y border-gray-200/50 py-16 font-antenna">
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Tính Năng Vượt Trội</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              CÁC TIỆN ÍCH NỔI BẬT CỦA FORD SYNC®
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {syncFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-white border border-gray-200 p-6 rounded-none shadow-xs hover:border-[#066fef] transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 bg-[#002F6C] text-white flex items-center justify-center rounded-[4px] mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-gray-900 mb-2 uppercase group-hover:text-[#066fef] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connection Guide Step-by-Step */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Hướng Dẫn Kết Nối</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            4 BƯỚC KẾT NỐI ĐIỆN THOẠI VỚI HỆ THỐNG SYNC®
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {connectionSteps.map((step, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-none relative">
              <span className="absolute top-4 right-6 text-4xl font-extrabold text-[#066fef]/10 select-none">
                {step.step}
              </span>
              <h3 className="font-bold text-sm text-gray-900 uppercase mb-2 mt-4">
                {step.title}
              </h3>
              <p className="text-xs text-gray-650 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
