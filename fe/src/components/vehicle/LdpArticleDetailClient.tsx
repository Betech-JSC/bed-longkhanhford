"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  FileText,
  Calendar,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Car,
} from "lucide-react";
import VehicleLayoutClient, { useVehicle } from "./VehicleLayoutClient";
import LdpTrackingManager from "./LdpTrackingManager";
import { formatPersonName } from "@/lib/formatters";
import { resolveImageUrl, handleImageError } from "@/lib/site-assets";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
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

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M24 4C12.954 4 4 12.597 4 23.2C4 29.566 7.228 35.228 12.302 38.835L10.22 43.682C9.972 44.258 10.518 44.838 11.084 44.576L17.708 41.516C19.704 42.093 21.815 42.4 24 42.4C35.046 42.4 44 33.803 44 23.2C44 12.597 35.046 4 24 4Z"
      fill="#0068FF"
    />
    <path
      d="M17.5 17H13V19.5L16.2 24.2H13V26.5H18V24L14.8 19.3H18V17H17.5ZM21.5 17H19.5V26.5H24V24.5H21.5V17ZM28.5 17H25V26.5H27V23H28.5C30.4 23 31.5 21.8 31.5 20C31.5 18.2 30.4 17 28.5 17ZM28.3 21.2H27V18.8H28.3C29.2 18.8 29.6 19.3 29.6 20C29.6 20.7 29.2 21.2 28.3 21.2ZM35.5 17C33.6 17 32 18.6 32 21.75C32 24.9 33.6 26.5 35.5 26.5C37.4 26.5 39 24.9 39 21.75C39 18.6 37.4 17 35.5 17ZM35.5 24.6C34.7 24.6 34 23.6 34 21.75C34 19.9 34.7 18.9 35.5 18.9C36.3 18.9 37 19.9 37 21.75C37 23.6 36.3 24.6 35.5 24.6Z"
      fill="white"
    />
  </svg>
);

const resolveZaloUrl = (zaloUrl?: string, phone?: string): string => {
  const target = (zaloUrl || phone || "").trim();
  if (!target) return "https://zalo.me/0397987689";
  if (target.startsWith("http://") || target.startsWith("https://")) return target;
  if (target.startsWith("zalo.me/")) return `https://${target}`;
  const cleanPhone = target.replace(/[^0-9]/g, "");
  if (cleanPhone) return `https://zalo.me/${cleanPhone}`;
  return "https://zalo.me/0397987689";
};

interface LdpArticleDetailClientProps {
  article: any;
  relatedArticles: any[];
  salesConsultant: any;
  allVehicles: any[];
  landingPageId?: number | string;
  salesEmail?: string;
  salesSlug: string;
}

function LdpArticleDetailInner({
  article,
  relatedArticles,
  salesConsultant,
  allVehicles,
  landingPageId,
  salesEmail,
  salesSlug,
}: LdpArticleDetailClientProps) {
  const { openQuoteDrawer } = useVehicle();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const consultantName = salesConsultant?.name
    ? formatPersonName(salesConsultant.name)
    : "Chuyên Viên Tư Vấn";
  const phone = salesConsultant?.phone || "";
  const finalZaloUrl = resolveZaloUrl(salesConsultant?.zalo_url, phone);
  const avatarUrl =
    (salesConsultant?.avatar ? resolveImageUrl(salesConsultant.avatar) : null) ||
    salesConsultant?.avatar_url ||
    "";
  const consultantSlug = salesSlug || salesConsultant?.slug || "tu-van";

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const articleImg =
    article.image?.url ||
    article.image_url ||
    (article.image ? resolveImageUrl(article.image) : "");

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 md:pb-16 font-sans">
      {/* Tracking Scripts riêng của Cố vấn */}
      <LdpTrackingManager
        salesConsultant={salesConsultant}
        landingPageId={landingPageId}
        salesEmail={salesEmail}
        vehicleName={article.title}
      />

      {/* 1. TOP SUB-HEADER: THANH CỐ VẤN BÁN HÀNG & QUAY LẠI LDP */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Nút quay lại LDP Cố vấn */}
          <Link
            href={`/ldp/${consultantSlug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0562D2] transition-colors shrink-0 group py-1"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#0562D2] transition-colors" />
            <span className="hidden sm:inline">Về Showroom LDP của</span>
            <span className="font-bold text-slate-900 group-hover:text-[#0562D2]">
              {consultantName}
            </span>
          </Link>

          {/* Quick Actions của Cố vấn */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {avatarUrl && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 hidden md:block">
                <img
                  src={avatarUrl}
                  alt={consultantName}
                  className="w-full h-full object-cover object-top"
                  onError={handleImageError}
                />
              </div>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{phone}</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => openQuoteDrawer()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0562D2] hover:bg-[#0451B0] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer border-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Nhận báo giá</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMBS */}
      <nav className="max-w-[960px] mx-auto px-4 sm:px-6 pt-5 pb-2 text-xs text-slate-500 flex items-center flex-wrap gap-1.5">
        <Link href={`/ldp/${consultantSlug}`} className="hover:text-[#0562D2] transition-colors font-medium">
          LDP {consultantName}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href={`/ldp/${consultantSlug}#promotions`} className="hover:text-[#0562D2] transition-colors font-medium">
          Khuyến mãi &amp; Ưu đãi
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-semibold line-clamp-1 max-w-[280px] sm:max-w-none">
          {article.title}
        </span>
      </nav>

      {/* 3. MAIN ARTICLE CONTAINER */}
      <main className="max-w-[960px] mx-auto px-4 sm:px-6 pt-4">
        <article className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 p-5 sm:p-8 md:p-10 shadow-sm">
          {/* Header Tag / Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0562D2] text-xs font-bold tracking-wide uppercase border border-blue-100">
              <Sparkles className="w-3 h-3" />
              <span>Chương trình ưu đãi tháng</span>
            </span>

            {article.published_at && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium px-2.5 py-1 rounded-full bg-slate-100">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{formatDate(article.published_at)}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Tư vấn bởi: {consultantName}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight mb-4">
            {article.title}
          </h1>

          {/* Lead / Short Description */}
          {article.description && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 pb-6 border-b border-slate-100">
              {article.description}
            </p>
          )}

          {/* Social Share Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              Chia sẻ bài viết:
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                title="Chia sẻ lên Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://chat.zalo.me/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0068FF] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                title="Chia sẻ qua Zalo"
              >
                <ZaloIcon className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors cursor-pointer border-0"
                title="Sao chép liên kết"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sao chép link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {articleImg && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 mb-8 border border-slate-200/80 shadow-xs">
              <img
                src={articleImg}
                alt={article.title}
                className="w-full h-full object-cover object-center"
                onError={handleImageError}
              />
            </div>
          )}

          {/* HTML Article Content */}
          <div
            className="prose prose-slate prose-base sm:prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-[#0562D2] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm prose-img:mx-auto leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />

          {/* 4. CALL-TO-ACTION BOX RIÊNG CỦA CỐ VẤN Ở CHÂN BÀI VIẾT */}
          <section className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-[#0562D2]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                {/* Avatar Cố vấn */}
                {avatarUrl && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white shadow-md shrink-0">
                    <img
                      src={avatarUrl}
                      alt={consultantName}
                      className="w-full h-full object-cover object-top"
                      onError={handleImageError}
                    />
                  </div>
                )}

                {/* Nội dung mời chào */}
                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0562D2] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Đặc quyền khách hàng LDP</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Nhận Ưu Đãi &amp; Báo Giá Lăn Bánh Từ {consultantName}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Quý khách đang quan tâm đến chương trình khuyến mãi này? Đừng ngần ngại liên hệ trực tiếp với chuyên viên tư vấn{" "}
                    <strong>{consultantName}</strong> để nhận bảng dự toán lăn bánh chính xác nhất kèm ưu đãi giá đặc quyền và quà tặng phụ kiện chính hãng.
                  </p>

                  {/* Nhóm nút tác vụ */}
                  <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => openQuoteDrawer()}
                      className="px-5 py-2.5 bg-[#0562D2] hover:bg-[#0451B0] text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0 inline-flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Nhận Báo Giá Lăn Bánh</span>
                    </button>

                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Hotline: {phone}</span>
                      </a>
                    )}

                    <a
                      href={finalZaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-white hover:bg-slate-100 text-[#0068FF] rounded-xl text-sm font-bold border border-blue-200 shadow-xs hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                      <ZaloIcon className="w-4 h-4" />
                      <span>Chat Zalo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 5. BÀI VIẾT LIÊN QUAN (GIỮ NGUYÊN LINK TRONG LDP) */}
        {Array.isArray(relatedArticles) && relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0562D2]" />
                <span>Chương trình &amp; Khuyến mãi khác</span>
              </h2>
              <Link
                href={`/ldp/${consultantSlug}#promotions`}
                className="text-xs sm:text-sm font-bold text-[#0562D2] hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả ưu đãi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((item: any, idx: number) => {
                const itemImg =
                  item.image?.url ||
                  item.image_url ||
                  (item.image ? resolveImageUrl(item.image) : "");

                return (
                  <Link
                    key={item.id || idx}
                    href={`/ldp/${consultantSlug}/tin-tuc/${item.slug}`}
                    className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {itemImg && (
                        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            onError={handleImageError}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <span className="text-[11px] font-bold text-[#0562D2] uppercase tracking-wider block mb-1.5">
                          Khuyến mãi LDP
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0562D2] transition-colors">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <span className="text-xs font-bold text-[#0562D2] group-hover:underline flex items-center gap-1">
                        <span>Đọc tiếp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 6. MOBILE STICKY BOTTOM BAR RIÊNG CỦA CỐ VẤN */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 flex items-center justify-between gap-2 md:hidden shadow-lg">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 py-2 px-2 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Gọi ngay</span>
          </a>
        )}

        <a
          href={finalZaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-2 bg-[#0068FF] active:bg-blue-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
        >
          <ZaloIcon className="w-3.5 h-3.5 shrink-0" />
          <span>Chat Zalo</span>
        </a>

        <button
          type="button"
          onClick={() => openQuoteDrawer()}
          className="flex-[1.2] py-2 px-2 bg-[#0562D2] active:bg-[#0451B0] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs border-0 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Báo giá lăn bánh</span>
        </button>
      </div>
    </div>
  );
}

export default function LdpArticleDetailClient(props: LdpArticleDetailClientProps) {
  const { salesConsultant, allVehicles = [], landingPageId, salesEmail } = props;

  return (
    <VehicleLayoutClient
      initialVehicle={allVehicles[0]}
      allVehicles={allVehicles}
      salesConsultant={salesConsultant}
      salesConsultantId={salesConsultant?.id}
      salesEmail={salesEmail || salesConsultant?.email}
      landingPageId={typeof landingPageId === "string" ? parseInt(landingPageId, 10) : landingPageId}
    >
      <LdpArticleDetailInner {...props} />
    </VehicleLayoutClient>
  );
}

