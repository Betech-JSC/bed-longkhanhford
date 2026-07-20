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
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      <ServicePageBanner title={service?.title || "Lịch bảo dưỡng xe ô tô định kỳ"} backgroundImage={service?.banner_image?.url}>
        <div className="flex flex-wrap gap-4 justify-center font-antenna">
          <Link
            href="/lien-he"
            className="bg-[#066fef] hover:bg-[#01095c] border border-[#066fef] transition-colors text-white font-bold px-6 py-3 rounded-[4px] text-xs uppercase tracking-wider shadow-xs"
          >
            Đặt hẹn
          </Link>
          <a
            href="tel:1900888992"
            className="border border-white hover:bg-white/10 transition-colors text-white font-bold px-6 py-3 rounded-[4px] text-xs uppercase tracking-wider shadow-xs"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </ServicePageBanner>

      {/* Intro Heading Section */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        {service?.content ? (
          <div 
            className="prose max-w-none text-xl md:text-2xl text-gray-900 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 tracking-tight leading-relaxed max-w-[1100px] uppercase">
            Bảo dưỡng định kỳ giúp bạn lái xe an toàn, kéo dài tuổi thọ của xe & tiết kiệm nhiên liệu đảm bảo chiếc xe Ford của bạn luôn ở trong tình trạng tốt nhất.
          </h2>
        )}
      </div>

      {/* Grid of Vehicle Schedule Cards */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 font-antenna">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displaySchedules.map((car, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-none p-5 shadow-xs hover:shadow-sm hover:border-[#066fef]/40 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Car Image Wrapper */}
              <div className="relative w-full h-40 overflow-hidden rounded-none bg-[#F8F8F8] border border-gray-100">
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
                <h3 className="font-display font-bold text-lg text-gray-905 uppercase">
                  {car.name}
                </h3>
                <ul className="space-y-2 text-sm text-[#066fef]">
                  {car.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="shrink-0 size-1.5 bg-[#066fef] rounded-[2px]" />
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
