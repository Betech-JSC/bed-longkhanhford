"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TabContentItem = {
  title: string;
  title_content: string;
  content: string;
};

type BenefitItem = {
  title: string;
  description: string;
};

type ImageItem = {
  url: string;
  alt: string;
};

type ServiceDetails = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  custom_link: string;
  image: ImageItem;
  banner_image?: ImageItem;
  is_content_by_tab: boolean;
  content_by_tab: TabContentItem[];
  benefit_title: string;
  benefit_image: ImageItem;
  benefits: BenefitItem[];
  sliders: ImageItem[];
};

export default function GenericServiceLayout({ service }: { service: ServiceDetails }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const sImg = service.image?.url || "/service-support-customer.jpg";
  const tabs = service.content_by_tab || [];
  const benefits = service.benefits || [];
  const sliders = service.sliders || [];

  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      <ServicePageBanner title={service.title} backgroundImage={service.banner_image?.url}>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/lien-he"
            className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Đặt hẹn dịch vụ
          </Link>
          <a
            href="tel:0918909060"
            className="border border-white hover:bg-white/10 transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </ServicePageBanner>

      {/* Description */}
      {service.description && (
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16 text-center">
          <div className="max-w-[1000px] mx-auto text-xl md:text-2xl text-gray-900 leading-relaxed font-normal italic">
            "{service.description}"
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] pb-16 flex flex-col gap-12">
        {service.content && (
          <div 
            className="prose max-w-none text-gray-700 text-lg leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        )}

        {/* Content by Tab */}
        {service.is_content_by_tab && tabs.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex border-b border-gray-200 overflow-x-auto gap-2 pb-px scrollbar-none">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`py-3 px-6 font-bold text-sm md:text-base border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === idx
                      ? "border-[#0562d2] text-[#0562d2]"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {tabs[activeTab]?.title_content && (
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {tabs[activeTab].title_content}
                </h3>
              )}
              {tabs[activeTab]?.content && (
                <div
                  className="prose max-w-none text-gray-600 text-base md:text-lg leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
                />
              )}
            </div>
          </div>
        )}

        {/* Sliders Gallery */}
        {sliders.length > 0 && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm bg-gray-900">
            <Image
              src={sliders[activeSlide]?.url}
              alt={sliders[activeSlide]?.alt || service.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
            {sliders.length > 1 && (
              <>
                <button
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight border-b border-gray-100 pb-4">
                {service.benefit_title || "Ưu điểm nổi bật"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col gap-2.5">
                    <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <span className="shrink-0 size-2 bg-[#0562d2] rounded-full" />
                      <span>{benefit.title}</span>
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {service.benefit_image?.url && (
              <div className="lg:col-span-5 relative w-full h-[320px] lg:h-[420px] rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src={service.benefit_image.url}
                  alt={service.benefit_image.alt || service.benefit_title || "Lợi ích"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <BookingBanner />
      <FaqAccordion />
    </div>
  );
}
