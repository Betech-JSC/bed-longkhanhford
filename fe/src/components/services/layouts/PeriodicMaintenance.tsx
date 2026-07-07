import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";

type VehicleSchedule = {
  name: string;
  image: string;
  links: { label: string; url: string }[];
};

export default function PeriodicMaintenanceLayout({
  service,
  displaySchedules,
}: {
  service?: any;
  displaySchedules: VehicleSchedule[];
}) {
  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      <ServicePageBanner title={service?.title || "Lịch bảo dưỡng xe ô tô định kỳ"} backgroundImage={service?.banner_image?.url}>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/lien-he"
            className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Đặt hẹn
          </Link>
          <a
            href="tel:0918909060"
            className="border border-white hover:bg-white/10 transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </ServicePageBanner>

      {/* Intro Heading Section */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16">
        {service?.content ? (
          <div 
            className="prose max-w-none text-xl md:text-2xl text-gray-900 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight leading-relaxed max-w-[1100px]">
            Bảo dưỡng định kỳ giúp bạn lái xe an toàn, kéo dài tuổi thọ của xe & tiết kiệm nhiên liệu đảm bảo chiếc xe Ford của bạn luôn ở trong tình trạng tốt nhất.
          </h2>
        )}
      </div>

      {/* Grid of Vehicle Schedule Cards */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displaySchedules.map((car, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
            >
              {/* Car Image Wrapper */}
              <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-50/50">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Links */}
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-lg text-gray-900">
                  {car.name}
                </h3>
                <ul className="space-y-2 text-sm text-[#0562d2]">
                  {car.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="shrink-0 size-1.5 bg-[#0562d2] rounded-full" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
