"use client";

import Image from "next/image";
import Link from "next/link";
import { Smartphone, Zap, MapPin, Activity, HelpCircle, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import ScrollReveal from "@/components/common/ScrollReveal";
import { siteAssets } from "@/lib/site-assets";

const appFeatures = [
  {
    icon: Zap,
    title: "Khởi động xe & Điều hòa từ xa",
    desc: "Khởi động động cơ và kích hoạt hệ thống làm mát cabin từ xa bằng điện thoại, giúp khoang lái luôn mát mẻ trước khi bạn lên xe."
  },
  {
    icon: MapPin,
    title: "Định vị vị trí xe thời gian thực",
    desc: "Tìm thấy vị trí đỗ xe của mình dễ dàng tại các hầm xe trung tâm thương mại hoặc các bãi đỗ lớn thông qua bản đồ tích hợp trên ứng dụng."
  },
  {
    icon: Activity,
    title: "Kiểm tra tình trạng sức khỏe xe",
    desc: "Theo dõi lượng nhiên liệu còn lại, tuổi thọ dầu động cơ, áp suất lốp, tổng số km đã đi và nhận cảnh báo kỹ thuật kịp thời."
  },
  {
    icon: ShieldAlert,
    title: "Mở & Khóa cửa xe từ xa",
    desc: "Khóa hoặc mở khóa cửa xe nhanh chóng từ bất kỳ khoảng cách nào chỉ với một chạm duy nhất trên giao diện chính của ứng dụng."
  }
];

const activationSteps = [
  {
    step: "01",
    title: "Tải ứng dụng FordPass",
    desc: "Truy cập App Store hoặc Google Play Store để tải ứng dụng FordPass chính thức về điện thoại."
  },
  {
    step: "02",
    title: "Tạo tài khoản & Quét VIN",
    desc: "Đăng ký tài khoản Ford, sau đó sử dụng camera quét mã vạch số VIN nằm ở kính lái hoặc sườn cửa xe để liên kết."
  },
  {
    step: "03",
    title: "Kích hoạt modem kết nối",
    desc: "Lên xe khởi động máy, trên màn hình SYNC chọn 'Cho phép' (Allow) để cấp quyền truy cập dữ liệu cho ứng dụng."
  },
  {
    step: "04",
    title: "Hoàn tất & Trải nghiệm",
    desc: "Chờ vài phút để hệ thống đồng bộ hóa. Giao diện điều khiển từ xa đã sẵn sàng phục vụ bạn."
  }
];

export default function FordAppLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      {/* Hero Banner */}
      <ServicePageBanner 
        title={service?.title || "Ứng Dụng Kết Nối Thông Minh FordPass™"} 
        backgroundImage={service?.banner_image?.url || siteAssets.serviceBanners.upgrade} 
      />

      {/* Intro Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block">Chiếc Xe Trong Tầm Tay</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
                ỨNG DỤNG FORDPASS™ - ĐIỀU KHIỂN & KẾT NỐI XE TỪ XA
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Ứng dụng FordPass™ mang đến trải nghiệm sở hữu xe thông minh thế hệ mới. Được kết nối trực tiếp với modem tích hợp bên trong chiếc Ford của bạn, ứng dụng cho phép bạn quản lý, định vị và điều khiển xe một cách toàn diện chỉ bằng chiếc điện thoại di động.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Miễn phí duy trì trọn đời theo xe",
                  "Gửi thông báo khẩn cấp khi xe gặp lỗi kỹ thuật trực tiếp đến đại lý",
                  "Đặt hẹn dịch vụ bảo dưỡng nhanh chóng chỉ trong vài giây",
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
            <div className="relative aspect-video w-full border border-gray-200 shadow-md bg-gray-950 flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/img-gradient-1.png" // Fallback to territory car image representing the app backdrop
                alt="FordPass App Visualization"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-[#001c40]/40 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                <Smartphone className="w-16 h-16 text-[#38bdf8] drop-shadow-md" />
                <h3 className="font-bold text-lg uppercase tracking-wider text-white">
                  Kết Nối Thông Minh FordPass Connect®
                </h3>
                <p className="text-xs text-white/80 max-w-sm">
                  Kích hoạt modem tích hợp trên xe ngay hôm nay để nhận trọn gói đặc quyền điều khiển xe từ xa.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* App Features Grid */}
      <section className="w-full bg-[#f0f4f8]/40 border-y border-gray-200/50 py-16 font-antenna">
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Đặc Quyền Kết Nối</span>
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
              TÍNH NĂNG ĐỘC QUYỀN TRÊN FORDPASS™
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feat, idx) => {
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

      {/* Activation Steps */}
      <section className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#066fef] font-bold text-xs uppercase tracking-widest block mb-2">Kích Hoạt Nhanh</span>
          <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 uppercase tracking-tight">
            4 BƯỚC CÀI ĐẶT & KÍCH HOẠT ỨNG DỤNG FORDPASS™
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activationSteps.map((step, idx) => (
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

        {/* Call to action buttons to download */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a
            href="https://apps.apple.com/vn/app/fordpass/id1113063544"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#002F6C] hover:bg-[#066fef] text-white text-xs font-bold uppercase px-8 py-3.5 rounded-none transition-colors tracking-wider"
          >
            Tải Cho iOS (App Store)
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.ford.fordpass"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold uppercase px-8 py-3.5 rounded-none transition-colors tracking-wider"
          >
            Tải Cho Android (Google Play)
          </a>
        </div>
      </section>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
