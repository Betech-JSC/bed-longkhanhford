import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";

type StepItem = {
  title: string;
  icon: string;
  bullets: string[];
  note?: string;
};

const steps: StepItem[] = [
  {
    title: "Liên hệ",
    icon: "/assets/icon-contact.svg",
    bullets: [
      "Khách hàng liên hệ Long Khánh Ford online hoặc gọi điện thoại đến Long Khánh Ford.",
      "Nhân viên Long Khánh Ford sẽ giới thiệu chi tiết về các Dịch vụ và tư vấn cho Khách hàng.",
      "Giới thiệu Phương thức thanh toán không dùng tiền mặt an toàn."
    ]
  },
  {
    title: "Đặt hẹn",
    icon: "/assets/icon-booking.svg",
    bullets: [
      "Khách hàng gọi điện thoại đặt hẹn với Long Khánh Ford qua đường dây Chăm sóc Khách hàng (*).",
      "Chọn Dịch vụ “ Nhận và Giao xe Tận nơi Miễn phí (**).",
      "Nhân viên Long Khánh Ford sẽ giới thiệu chi tiết về Dịch vụ và tư vấn cho Khách hàng.",
      "Nhân viên Long Khánh Ford xác nhận cuộc hẹn với khách hàng."
    ],
    note: "(*) Tham khảo Hotline Dịch vụ 1900 888 992 – 02513 646 998 | (**) Liên hệ Long Khánh Ford để có thêm chi tiết."
  },
  {
    title: "Tiếp nhận xe tại nhà",
    icon: "/assets/icon-delivery.svg",
    bullets: [
      "Nhân viên Long Khánh Ford đến nhà Khách hàng nhận xe.",
      "Tiếp nhận xe và tiến hành khử khuẩn nhanh tại chỗ.",
      "Lái xe của Khách hàng an toàn về xưởng Dịch vụ."
    ]
  },
  {
    title: "Tiến hành sửa chữa",
    icon: "/assets/icon-service.svg",
    bullets: [
      "Cố vấn Dịch vụ kiểm tra xe và gọi điện thoại thông báo / báo giá chi tiết cho Khách hàng.",
      "Kỹ thuật viên lành nghề thực hiện sửa chữa, bảo dưỡng.",
      "Vệ sinh và khử khuẩn toàn bộ xe sau khi hoàn tất sửa chữa.",
      "Xác nhận phương thức thanh toán và thời gian giao xe cụ thể."
    ]
  },
  {
    title: "Bàn giao xe tại nhà",
    icon: "/assets/icon-handover.svg",
    bullets: [
      "Nhân viên Long Khánh Ford lái xe đến bàn giao tận nhà cho Khách hàng.",
      "Giao xe and tiến hành khử khuẩn nhanh lần cuối tại chỗ.",
      "Khách hàng xác nhận và hoàn tất thanh toán trực tuyến an toàn."
    ]
  },
  {
    title: "Thanh toán không bằng tiền mặt",
    icon: "/assets/icon-payment.svg",
    bullets: [
      "Khuyến khích Khách hàng sử dụng các phương thức thanh toán không tiền mặt."
    ]
  }
];

export default function PickupDeliveryLayout({ service }: { service?: any }) {
  return (
    <div className="w-full bg-[#F8F8F8] min-h-screen flex flex-col items-center">
      <ServicePageBanner title={service?.title || "Dịch vụ nhận và giao xe tận nơi"} backgroundImage={service?.banner_image?.url}>
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

      {/* Intro / COVID-19 Safety Statement Segment */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] py-16 font-antenna">
        {service?.content ? (
          <div 
            className="bg-white border border-gray-200 rounded-none p-8 shadow-xs text-gray-800 text-base md:text-lg leading-relaxed font-normal prose max-w-none"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-none p-8 shadow-xs text-gray-800 text-base md:text-lg leading-relaxed font-normal">
            <p className="mb-4 font-bold text-gray-950 text-lg md:text-xl font-display uppercase tracking-wide">
              Sức khỏe và sự an toàn của Quý Khách hàng luôn là ưu tiên hàng đầu với Long Khánh Ford!
            </p>
            Trong giai đoạn diễn biến phức tạp của dịch bệnh, để thuận tiện và an toàn cho Khách hàng, Long Khánh Ford đang cung cấp Dịch vụ Nhận và Giao xe Tận nơi miễn phí (*) cho Quý Khách hàng để giúp giảm thiểu giao tiếp trực tiếp với nhân viên của chúng tôi và các khách hàng khác. Để đảm bảo mọi biện pháp phòng ngừa được thực hiện nghiêm ngặt, xe của Quý khách hàng sẽ được người lái xe khử khuẩn tại thời điểm chúng tôi tiếp nhận xe và tại thời điểm giao xe cho Quý Khách hàng. Quý Khách hàng vui lòng xem thông tin phía dưới cho quy trình Nhận và Giao xe Tận nơi miễn phí (*).
          </div>
        )}
      </div>

      {/* 5-Step Process Cards Grid */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[80px] pb-20 mt-4 flex flex-col gap-10">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 tracking-tight uppercase">
          QUY TRÌNH DỊCH VỤ NHẬN VÀ GIAO XE TẬN NƠI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-antenna">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-200 rounded-none p-6 shadow-xs hover:shadow-sm hover:border-[#066fef]/40 transition-all duration-300 flex flex-col gap-5"
            >
              {/* Icon Container */}
              <div 
                className="bg-[#01095c] rounded-[4px] flex items-center justify-center p-3.5 size-16 shadow-xs relative overflow-hidden shrink-0"
                aria-label={step.title}
              >
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* Title & Bullets */}
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-xl text-[#066fef] uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-650 list-disc pl-5 leading-relaxed">
                    {step.bullets.map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {/* Optional Footnote */}
                {step.note && (
                  <p className="text-xs text-gray-400 italic mt-3 pt-3 border-t border-gray-50 leading-relaxed">
                    {step.note}
                  </p>
                )}
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
