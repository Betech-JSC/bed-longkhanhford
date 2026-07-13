import Link from "next/link";
import { policiesAPI } from "@/lib/api";

export async function generateMetadata() {
  try {
    const res = await policiesAPI.getBySlug("chinh-sach-bao-mat", { type: "privacy" });
    const content = res?.content;
    return {
      title: `${content?.title || "Chính sách Bảo mật"} | Long Khánh Ford`,
      description: content?.description || "Chính sách bảo mật thông tin khách hàng của Long Khánh Ford.",
    };
  } catch (err) {
    return {
      title: "Chính sách Bảo mật | Long Khánh Ford",
    };
  }
}

export default async function PrivacyPage() {
  let contentData: any = null;
  let sidebarList: any[] = [];
  
  try {
    const res = await policiesAPI.getBySlug("chinh-sach-bao-mat", { type: "privacy" });
    contentData = res?.content;
    sidebarList = res?.list_sidebar || [];
  } catch (err) {
    console.error("Failed to load privacy policy:", err);
  }

  const getLink = (slug: string) => {
    if (slug === 'chinh-sach-bao-mat') return '/chinh-sach-bao-mat';
    if (slug === 'dieu-khoan-su-dung') return '/dieu-khoan-su-dung';
    return `/policies/${slug}`;
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a]">
      {/* Banner Header */}
      <section className="bg-[#00095B] text-white py-16 px-4">
        <div className="max-w-[1152px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0562D2] bg-[#0562D2]/10 px-4 py-1.5 rounded-full">
            Chính sách bảo mật
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[36px] md:text-[48px] tracking-tight uppercase mt-4 mb-2 leading-tight">
            {contentData?.title || "Chính sách bảo mật thông tin"}
          </h1>
          {contentData?.formatted_updated_at && (
            <p className="text-sm text-white/70 max-w-[600px] mx-auto font-['Ford_Antenna',sans-serif] font-normal">
              Cập nhật mới nhất: {contentData.formatted_updated_at}
            </p>
          )}
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-[1152px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Navigation Sidebar */}
          {sidebarList.length > 0 && (
            <aside className="w-full lg:w-[280px] lg:sticky lg:top-[120px] bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs shrink-0">
              <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-sm uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Chính sách & Quy định
              </h3>
              <nav className="flex flex-col gap-1">
                {sidebarList.map((sec) => (
                  <Link
                    key={sec.slug}
                    href={getLink(sec.slug)}
                    className={`font-['Ford_Antenna',sans-serif] font-medium text-sm py-2.5 px-3 rounded-md transition-all duration-200 block ${
                      sec.slug === contentData?.slug
                        ? 'text-[#0562d2] bg-gray-50'
                        : 'text-gray-600 hover:text-[#0562d2] hover:bg-gray-50'
                    }`}
                  >
                    {sec.title}
                  </Link>
                ))}
              </nav>
            </aside>
          )}

          {/* Detailed Content */}
          <div className="flex-1 bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 shadow-xs">
            {contentData ? (
              <div 
                className="prose max-w-none prose-slate font-sans leading-relaxed text-sm md:text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: contentData.content }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">Đang cập nhật nội dung...</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
