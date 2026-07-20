import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { siteAssets } from "@/lib/site-assets";

export default function ExpressMaintenanceLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      <ServicePageBanner title={service?.title || "Dịch vụ bảo dưỡng nhanh"} backgroundImage={service?.banner_image?.url}>
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

      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 flex flex-col gap-10 font-antenna">
        {service?.content ? (
          <div 
            className="prose max-w-none text-xl md:text-2xl text-gray-900 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 tracking-tight uppercase">
            QUY TRÌNH BẢO DƯỠNG NHANH
          </h2>
        )}

        <div className="relative w-full aspect-[1440/500] rounded-none overflow-hidden border border-gray-200 shadow-xs">
          <Image
            src={siteAssets.expressFlow}
            alt="Express Maintenance Flow"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 text-gray-900 mt-4">
          <h3 className="font-display font-bold text-2xl text-[#066fef] uppercase tracking-wide">
            {service?.benefit_title || "Ưu Điểm Chính"}
          </h3>
          <ul className="space-y-4 text-lg text-gray-700 leading-relaxed font-normal">
            {service?.benefits && Array.isArray(service.benefits) && service.benefits.length > 0 && service.benefits.some((b: any) => b && (b.title || b.description)) ? (
              service.benefits.filter((b: any) => b && (b.title || b.description)).map((benefit: any, bidx: number) => (
                <li key={bidx} className="flex items-start gap-2.5">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
                  <div>
                    <strong className="text-gray-950 font-bold block text-base md:text-lg mb-0.5">{benefit.title}</strong>
                    {benefit.description && (
                      <div 
                        className="text-sm text-gray-650 prose leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: benefit.description }}
                      />
                    )}
                  </div>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2.5 text-base text-gray-650">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
                  <span>Sử dụng các dụng cụ bảo dưỡng tiêu chuẩn, các trang thiết bị hiện đại.</span>
                </li>
                <li className="flex items-start gap-2.5 text-base text-gray-650">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
                  <span>Phụ tùng bảo dưỡng chính hãng luôn được chuẩn bị sẵn sàng.</span>
                </li>
                <li className="flex items-start gap-2.5 text-base text-gray-650">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
                  <span>Đội ngũ kỹ thuật viên được đào tạo chuyên sâu về bảo dưỡng nhanh các dòng xe Ford.</span>
                </li>
                <li className="flex items-start gap-2.5 text-base text-gray-650">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
                  <span>Toàn bộ công đoạn bảo dưỡng nhanh chỉ diễn ra trong 60 phút với đầy đủ các quy trình và công đoạn như bảo dưỡng thông thường.</span>
                </li>
                <li className="flex items-start gap-2.5 text-base text-gray-650">
                  <span className="text-[#066fef] mt-1.5 shrink-0 size-2 bg-[#066fef] rounded-full" />
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
