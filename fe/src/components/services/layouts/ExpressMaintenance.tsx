import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { siteAssets } from "@/lib/site-assets";

export default function ExpressMaintenanceLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      <ServicePageBanner title={service?.title || "Dịch vụ bảo dưỡng nhanh"} backgroundImage={service?.banner_image?.url}>
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

      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16 flex flex-col gap-10">
        {service?.content ? (
          <div 
            className="prose max-w-none text-xl md:text-2xl text-gray-900 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
            QUY TRÌNH BẢO DƯỠNG NHANH
          </h2>
        )}

        <div className="relative w-full aspect-[1440/500] rounded-xl overflow-hidden shadow-sm">
          <Image
            src={siteAssets.expressFlow}
            alt="Express Maintenance Flow"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 text-gray-900 mt-4">
          <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl text-gray-900">
            {service?.benefit_title || "Ưu Điểm Chính"}
          </h3>
          <ul className="space-y-4 text-lg text-gray-700 leading-relaxed font-normal">
            {service?.benefits && Array.isArray(service.benefits) && service.benefits.length > 0 && service.benefits.some((b: any) => b && (b.title || b.description)) ? (
              service.benefits.filter((b: any) => b && (b.title || b.description)).map((benefit: any, bidx: number) => (
                <li key={bidx} className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <div>
                    <strong className="text-gray-950 font-bold block text-base md:text-lg mb-0.5">{benefit.title}</strong>
                    {benefit.description && (
                      <div 
                        className="text-sm text-gray-600 prose leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: benefit.description }}
                      />
                    )}
                  </div>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <span>Sử dụng các dụng cụ bảo dưỡng tiêu chuẩn, các trang thiết bị hiện đại.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <span>Phụ tùng bảo dưỡng chính hãng luôn được chuẩn bị sẵn sàng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <span>Đội ngũ kỹ thuật viên được đào tạo chuyên sâu về bảo dưỡng nhanh các dòng xe Ford.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <span>Toàn bộ công đoạn bảo dưỡng nhanh chỉ diễn ra trong 60 phút với đầy đủ các quy trình và công đoạn như bảo dưỡng thông thường.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
                  <span>Giảm thiểu thời gian chờ đợi bảo dưỡng xe Ford của khách hàng.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
