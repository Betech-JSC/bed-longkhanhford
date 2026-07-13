"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, MessageCircle, Copy, Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { handleImageError } from "@/lib/site-assets";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function ArticleDetailClient({
  article,
  relatedArticles,
}: {
  article: any;
  relatedArticles: any[];
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen py-12 flex flex-col items-center w-full">
      {/* Back button container */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full mb-6 font-antenna">
        <Link 
          href="/tin-tuc" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#424242] hover:text-[#066fef] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Tin tức & Ưu Đãi
        </Link>
      </div>

      {/* Article Detail Card Container */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col items-center mb-16">
        <div className="bg-white border border-gray-200 rounded-none p-6 md:p-12 w-full max-w-[860px] shadow-xs flex flex-col gap-8">
          
          {/* Header Metadata */}
          <div className="flex flex-col items-center gap-4 text-center font-antenna">
            {article.category && (
              <span className="text-[#066fef] text-sm font-bold uppercase tracking-wider">
                {article.category.title}
              </span>
            )}
            <h1 className="font-display font-bold text-[28px] md:text-[36px] leading-[1.25] text-[#066fef] max-w-[760px] uppercase tracking-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#424242] mt-2">
              <Calendar className="w-4 h-4 text-[#808080]" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.image?.url && (
            <div className="aspect-[16/9] relative rounded-none overflow-hidden w-full bg-gray-50 border border-gray-100">
              <img 
                src={article.image.url} 
                alt={article.title} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          )}

          {/* Article Content Body */}
          <div 
            className="font-sans text-[#1a1a1a] leading-relaxed text-[16px] max-w-[760px] mx-auto w-full prose prose-blue font-antenna"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Call to Action Booking Box */}
          <div className="bg-gray-50 rounded-none p-6 border border-gray-200 text-center flex flex-col items-center gap-4 mt-4 font-antenna">
            <h4 className="font-display font-bold text-lg text-[#066fef] uppercase tracking-wide">
              Bạn đang quan tâm tới dòng xe hoặc dịch vụ của Ford?
            </h4>
            <p className="text-sm text-[#424242] max-w-[500px]">
              Đặt lịch hẹn ngay hôm nay tại đại lý Long Khánh Ford để được tư vấn giá lăn bánh tốt nhất cùng các chương trình khuyến mãi tốt nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
              <Link 
                href="/dang-ky-lai-thu" 
                className="w-full sm:w-[200px] py-2.5 bg-[#066fef] hover:bg-[#01095c] text-white font-bold text-xs uppercase tracking-wider rounded-[4px] text-center transition shadow-xs cursor-pointer"
              >
                Đăng ký lái thử
              </Link>
              <Link 
                href="/lien-he" 
                className="w-full sm:w-[200px] py-2.5 border border-[#066fef] hover:bg-[#066fef]/5 text-[#066fef] font-bold text-xs uppercase tracking-wider rounded-[4px] text-center transition cursor-pointer"
              >
                Nhận báo giá
              </Link>
            </div>
          </div>

          {/* Social Sharing Drawer */}
          <div className="border-t border-[#e5e5e5] pt-6 flex items-center justify-between font-antenna">
            <span className="text-sm font-semibold text-[#1d2939] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#808080]" /> Chia sẻ bài viết
            </span>
            <div className="flex gap-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-[4px] transition hover:text-[#066fef] hover:border-[#066fef]"
                title="Chia sẻ Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a 
                href={`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-[4px] transition hover:text-[#066fef] hover:border-[#066fef]"
                title="Chia sẻ Zalo"
              >
                <MessageCircle className="w-4.5 h-4.5" />
              </a>
              <button 
                onClick={handleCopyLink}
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-[4px] transition relative cursor-pointer hover:text-[#066fef] hover:border-[#066fef]"
                title="Sao chép liên kết"
              >
                {copied ? <Check className="w-4.5 h-4.5 text-green-600" /> : <Copy className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* RELATED ARTICLES */}
      {relatedArticles.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full bg-[#F8F8F8] py-12 border-t border-[#e5e5e5] flex justify-center">
          <div className="flex flex-col gap-8 w-full">
            <h2 className="font-display font-bold text-[32px] leading-[1.32] text-[#1a1a1a] text-center uppercase tracking-wide">
              Tin tức & Ưu Đãi liên quan
            </h2>
            
            <div className="relative group w-full px-4">
              {/* Scroll Left Button */}
              <button 
                onClick={scrollLeft}
                className="absolute left-0 lg:left-[-40px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-[4px] bg-white border border-gray-250 shadow-xs flex items-center justify-center text-gray-700 hover:text-[#066fef] hover:border-[#066fef] transition cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Slide left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto scrollbar-none gap-6 pb-4 snap-x snap-mandatory font-antenna"
                style={{ scrollbarWidth: 'none' }}
              >
                {relatedArticles.map((art) => (
                  <div key={art.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] max-w-[360px] flex-shrink-0 snap-start">
                    <Link
                      href={`/${art.slug}`}
                      className="bg-white rounded-none overflow-hidden border border-gray-200 shadow-xs hover:shadow-sm transition-premium group flex flex-col h-full no-underline"
                    >
                      <div className="aspect-[600/400] relative overflow-hidden w-full bg-gray-100">
                        <img
                          src={art.image?.url || "/placeholder-news.jpg"}
                          alt={art.title}
                          className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          onError={handleImageError}
                        />
                        {art.category && (
                          <div className="absolute top-4 left-4 bg-[#066fef] text-white text-xs font-bold px-3 py-1 rounded-[4px] uppercase tracking-wider">
                            {art.category.title}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1 gap-2.5">
                        <span className="text-xs font-medium text-gray-500">
                          {formatDate(art.published_at)}
                        </span>
                        <h3 className="font-display font-bold text-[16px] leading-[1.4] text-[#1a1a1a] group-hover:text-[#066fef] transition-colors duration-200 line-clamp-2 uppercase">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#424242] leading-relaxed line-clamp-3 mt-1">
                          {art.description}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Scroll Right Button */}
              <button 
                onClick={scrollRight}
                className="absolute right-0 lg:right-[-40px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-[4px] bg-white border border-gray-250 shadow-xs flex items-center justify-center text-gray-700 hover:text-[#066fef] hover:border-[#066fef] transition cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Slide right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
