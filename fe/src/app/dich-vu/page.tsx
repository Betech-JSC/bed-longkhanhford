import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { servicesAPI } from "@/lib/api";
import { siteAssets } from "@/lib/site-assets";

export const metadata: Metadata = {
  title: "Dịch vụ Bảo hành, Sửa chữa & Chăm sóc xe chính hãng | Long Khánh Ford",
  description: "Xưởng dịch vụ lớn nhất khu vực Đồng Nai của đại lý Long Khánh Ford. Cung cấp các gói bảo dưỡng định kỳ, bảo dưỡng nhanh 60 phút, sửa chữa chung, và nhận giao xe tận nhà chuyên nghiệp.",
  keywords: "dịch vụ bảo dưỡng xe ford, sửa xe ford chính hãng, long khánh ford, bảo dưỡng nhanh long khánh, thay nhớt ford long khánh",
  alternates: {
    canonical: "/dich-vu",
  },
};

// 4 Fallback services in case CMS returns empty
const fallbackServices = [
  {
    title: "Bảo dưỡng định kỳ",
    slug: "bao-duong-dinh-ky",
    description: "Dịch vụ bảo dưỡng định kỳ tiêu chuẩn giúp xe Ford của bạn luôn vận hành êm ái, an toàn tối đa và kéo dài tuổi thọ động cơ.",
    image: siteAssets.serviceMaintenance,
    badge: "Tiêu chuẩn Ford"
  },
  {
    title: "Bảo dưỡng nhanh 60 phút",
    slug: "bao-duong-nhanh",
    description: "Tối ưu hóa thời gian chờ đợi của bạn. Quy trình thực hiện bởi hai kỹ thuật viên chuyên nghiệp chỉ trong vòng 60 phút.",
    image: siteAssets.serviceMaintenance,
    badge: "Tiết kiệm thời gian"
  },
  {
    title: "Nhận & Giao xe tận nơi",
    slug: "giao-nhan-xe-tan-noi",
    description: "Giải pháp giao nhận xe bảo dưỡng tại nhà hoặc văn phòng vô cùng tiện lợi cho khách hàng có lịch trình bận rộn.",
    image: siteAssets.serviceDelivery,
    badge: "Tiện ích cao cấp"
  },
  {
    title: "Chăm sóc khách hàng & Cứu hộ",
    slug: "cham-soc-khach-hang",
    description: "Chính sách hậu mãi chu đáo, hỗ trợ tư vấn kỹ thuật và dịch vụ cứu hộ giao thông 24/7 bảo vệ bạn trên mọi nẻo đường.",
    image: siteAssets.serviceCustomerCare,
    badge: "Hỗ trợ 24/7"
  }
];

export default async function ServicesPage() {
  let displayServices = [];

  try {
    const response = await servicesAPI.getAll() as any;
    const cmsServices = response?.services;

    if (Array.isArray(cmsServices) && cmsServices.length > 0) {
      displayServices = cmsServices.map((item: any) => {
        // Find matching badge from fallbacks if applicable
        const fallback = fallbackServices.find(f => f.slug === item.slug);
        return {
          title: item.title || "",
          slug: item.slug || "",
          description: item.description || "",
          image: item.image?.url || fallback?.image || siteAssets.showroomBg,
          href: (item.custom_link && item.custom_link.startsWith('/dich-vu/'))
            ? item.custom_link
            : `/dich-vu/${item.slug}`,
          badge: fallback?.badge || "Dịch vụ Ford"
        };
      });
    } else {
      displayServices = fallbackServices.map(item => ({
        ...item,
        href: `/dich-vu/${item.slug}`
      }));
    }
  } catch (error) {
    console.error("Failed to load services from CMS API, using fallbacks:", error);
    displayServices = fallbackServices.map(item => ({
      ...item,
      href: `/dich-vu/${item.slug}`
    }));
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Long Khánh Ford - Xưởng Dịch Vụ Chính Hãng",
    "image": "https://longkhanhford.com.vn" + siteAssets.showroomBg,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn",
      "addressLocality": "Thành phố Long Khánh",
      "addressRegion": "Đồng Nai",
      "postalCode": "810000",
      "addressCountry": "VN"
    },
    "telephone": "1900888992",
    "priceRange": "$$",
    "openingHours": "Mo-Sa 08:00-17:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.948647",
      "longitude": "106.867678"
    },
    "areaServed": ["Đồng Nai", "Biên Hòa", "Bình Dương", "Vũng Tàu"]
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 to-[#01095c] text-white pt-28 pb-16 md:pb-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/60 font-medium flex items-center gap-1.5 mb-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Dịch vụ chính hãng</span>
          </div>
          <div className="text-center">
            <span className="bg-white/15 text-white/95 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[4px] border border-white/10 mb-4 inline-block">
              Xưởng Dịch Vụ Chuẩn 3S Lớn Nhất Đồng Nai
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-tight mb-4 mt-2 font-antenna">
              Dịch vụ chăm sóc xe chuyên nghiệp
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-antenna">
              Hạ tầng kỹ thuật hiện đại, thiết bị chuẩn đoán độc quyền và đội ngũ kỹ thuật viên tay nghề cao giúp xế cưng của bạn luôn an toàn trên mọi hành trình.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">30+</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium uppercase tracking-wider">Khoang Sửa Chữa</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">100%</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium uppercase tracking-wider">Phụ Tùng Chính Hãng</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">60 Phút</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium uppercase tracking-wider">Bảo Dưỡng Nhanh</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#066fef] mb-1">24/7</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium uppercase tracking-wider">Cứu Hộ Giao Thông</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3.5xl font-bold text-gray-900 tracking-tight mb-3">
              DANH MỤC DỊCH VỤ CHÍNH
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Lựa chọn các gói dịch vụ bảo dưỡng, sửa chữa phù hợp nhất để đảm bảo khả năng hoạt động tốt nhất cho chiếc xe của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => (
              <div
                key={service.slug || index}
                className="bg-white rounded-none border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
              >
                {/* Image Container with 16:9 aspect ratio and fit/full styles */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#066fef] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] shadow-sm uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#066fef] transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1 text-[#066fef] font-bold text-sm hover:gap-2 transition-all uppercase tracking-wider text-[11px]"
                    >
                      Xem chi tiết dịch vụ
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Booking Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          <div className="bg-[#00095B] border border-neutral-800 rounded-none p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-2xl md:text-3.5xl font-bold mb-3 tracking-tight">
                ĐẶT LỊCH HẸN BẢO DƯỠNG NGAY
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Đăng ký đặt lịch hẹn sửa chữa và bảo dưỡng nhanh trực tuyến để nhận ưu tiên làm ngay khi tới xưởng dịch vụ Long Khánh Ford, không mất thời gian chờ đợi.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/lien-he"
                className="bg-[#066fef] hover:bg-[#01095c] text-white font-bold text-center px-8 py-4 rounded-[4px] transition-colors text-sm shadow-md uppercase tracking-wider text-[11px]"
              >
                Đặt hẹn dịch vụ
              </Link>
              <a
                href="tel:0879276699"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-center px-8 py-4 rounded-[4px] transition-all text-sm uppercase tracking-wider text-[11px]"
              >
                Hotline Cứu Hộ &amp; Kỹ Thuật: 0879 276 699
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
