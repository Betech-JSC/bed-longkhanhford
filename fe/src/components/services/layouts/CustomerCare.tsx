import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { siteAssets } from "@/lib/site-assets";

export default function CustomerCareLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      <ServicePageBanner title={service?.title || "Dịch vụ chăm sóc khách hàng"} backgroundImage={service?.banner_image?.url}>
        <div className="flex flex-wrap gap-4 justify-center font-antenna">
          <Link
            href="/lien-he"
            className="bg-[#066fef] hover:bg-[#01095c] border border-[#066fef] transition-colors text-white font-bold px-6 py-3 rounded-[4px] text-xs uppercase tracking-wider shadow-xs"
          >
            Đặt hẹn
          </Link>
          <a
            href="tel:0918909060"
            className="border border-white hover:bg-white/10 transition-colors text-white font-bold px-6 py-3 rounded-[4px] text-xs uppercase tracking-wider shadow-xs"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </ServicePageBanner>

      {/* Intro Description */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 text-center">
        {service?.content ? (
          <div 
            className="prose max-w-none text-xl md:text-2xl text-gray-900 leading-relaxed font-normal text-left md:text-center font-antenna"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <div className="max-w-[1000px] mx-auto text-xl md:text-2xl text-gray-900 leading-relaxed font-normal font-antenna">
            Quy trình dịch vụ tiêu chuẩn Ford toàn cầu Quality Care service được áp dụng tại tất cả các đại lý ủy quyền. Hàng năm, Ford tổ chức đánh giá và củng cố việc tuân thủ quy trình tại đại lý nhằm đảm bảo chất lượng dịch vụ cao nhất.
          </div>
        )}
      </div>

      {/* Quality Care Badge Image Display */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-[6px] flex justify-center">
        <div className="relative w-[500px] h-[500px] max-w-full">
          <Image
            src={siteAssets.qualityCareBadge}
            alt="Ford Quality Care Badge"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Core Detailed Columns */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 grid grid-cols-1 md:grid-cols-3 gap-12 font-antenna">
        {service?.benefits && Array.isArray(service.benefits) && service.benefits.length > 0 && service.benefits.some((b: any) => b && (b.title || b.description)) ? (
          service.benefits.filter((b: any) => b && (b.title || b.description)).map((benefit: any, bidx: number) => (
            <div key={bidx} className="flex flex-col gap-5">
              <h3 className="font-display font-bold text-lg text-gray-900 border-b border-gray-200 pb-3 uppercase tracking-wide">
                {benefit.title}
              </h3>
              {benefit.description && (
                <div 
                  className="text-sm text-gray-650 leading-relaxed space-y-2 prose"
                  dangerouslySetInnerHTML={{ __html: benefit.description }}
                />
              )}
            </div>
          ))
        ) : (
          <>
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              <h3 className="font-display font-bold text-lg text-gray-900 border-b border-gray-200 pb-3 uppercase tracking-wide">
                Hài lòng khách hàng là mục tiêu hàng đầu
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 leading-relaxed">
                <li>Quy trình chăm sóc khách hàng theo tiêu chuẩn Ford toàn cầu</li>
                <li>Hệ thống đánh giá hài lòng khách hàng: CVP và GQRS</li>
                <li>Năm 2015, Ford Việt Nam đứng vị trí số 1 tại khu vực Ford Châu Á Thái Bình Dương về chất lượng dịch vụ (CVP)</li>
                <li>Chúng tôi luôn cam kết mang đến chất lượng dịch vụ tốt nhất hướng tới sự hài lòng khách hàng cao nhất</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-5 items-start">
              <h3 className="font-display font-bold text-lg text-gray-900 border-b border-gray-200 pb-3 w-full uppercase tracking-wide">
                Phiếu kiểm tra tình trạng xe
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 leading-relaxed">
                <li>Tại các Đại lý ủy quyền của Ford, các kỹ thuật viên luôn ghi lại việc kiểm tra, đo đạc phụ tùng lên phiếu kiểm tra xe và đánh dấu theo màu các trạng thái.</li>
                <li>Thẻ kiểm tra như 1 bản tóm tắt thông tin nhanh về tình trạng xe.</li>
                <li>Việc này giúp khách hàng biết rõ tình trạng các phụ tùng trên xe, kiểm soát và đưa ra các quyết định phù hợp.</li>
              </ul>
              <a
                href="/assets/express-maintenance-flow.png"
                download
                className="flex items-center gap-2 text-[#066fef] font-bold text-sm hover:underline mt-2"
              >
                <Download className="w-5 h-5" />
                <span>Tải phiếu tại đây</span>
              </a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-5">
              <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-lg text-gray-900 border-b border-gray-200 pb-3">
                Mạng lưới dịch vụ ủy quyền
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 leading-relaxed">
                <li>Mạng lưới phân phối & cung cấp dịch vụ của Ford liên tục được mở rộng</li>
                <li>Năm 2016, Ford Việt Nam có hơn 29 trung tâm dịch vụ ủy quyền trên toàn quốc.</li>
                <li>Các xưởng dịch vụ được xây dựng theo tiêu chuẩn của Ford Châu Á Thái Bình Dương</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
