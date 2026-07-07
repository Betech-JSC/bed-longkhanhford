"use client";

import { useState, useEffect, Suspense } from "react";
import { Video, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { postsAPI } from "@/lib/api";

interface VideoItem {
  id: string;
  tiktokId: string;
  title: string;
  description: string;
  url: string;
}

const SkeletonCard = () => (
  <div className="w-full max-w-[325px] h-[580px] bg-white rounded-2xl border border-gray-200/60 p-4 flex flex-col justify-between animate-pulse shadow-sm">
    {/* Header profile skeleton */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-2 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="w-12 h-6 bg-gray-200 rounded-full" />
    </div>

    {/* Video player body skeleton */}
    <div className="flex-1 bg-gray-100 rounded-xl my-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center">
        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white/60 border-b-8 border-b-transparent ml-1" />
      </div>
      <div className="absolute right-3 bottom-6 flex flex-col gap-4 items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200/50" />
        <div className="w-8 h-8 rounded-full bg-gray-200/50" />
        <div className="w-8 h-8 rounded-full bg-gray-200/50" />
      </div>
    </div>

    {/* Footer skeleton */}
    <div className="flex flex-col gap-2">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-2.5 bg-gray-200 rounded w-5/6" />
      <div className="h-2.5 bg-gray-200 rounded w-4/5" />
    </div>
  </div>
);

function getTikTokId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  
  // If it's already just digits, it's the video ID
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  
  // Match standard link: https://www.tiktok.com/@username/video/731234567890 or photo/731234567890
  const match = trimmed.match(/\/(video|photo)\/(\d+)/);
  if (match && match[2]) {
    return match[2];
  }
  
  return "";
}

const TikTokCard = ({ video }: { video: VideoItem }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    let observer: MutationObserver | null = null;
    let checkInterval: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;

    const container = document.getElementById(`tiktok-card-${video.id}`);
    if (!container) return;

    const setupIframeListener = (iframe: HTMLIFrameElement) => {
      const handleLoad = () => {
        if (active) setIframeLoaded(true);
      };

      try {
        if (iframe.contentDocument?.readyState === 'complete') {
          setIframeLoaded(true);
          return;
        }
      } catch (e) {
        // Cross-origin fallback
      }

      iframe.addEventListener('load', handleLoad);

      fallbackTimeout = setTimeout(() => {
        if (active) setIframeLoaded(true);
      }, 6000);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        if (fallbackTimeout) clearTimeout(fallbackTimeout);
      };
    };

    const existingIframe = container.querySelector('iframe');
    let cleanupLoad: (() => void) | undefined;
    if (existingIframe) {
      cleanupLoad = setupIframeListener(existingIframe);
    } else {
      observer = new MutationObserver(() => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          cleanupLoad = setupIframeListener(iframe);
          if (observer) {
            observer.disconnect();
            observer = null;
          }
        }
      });
      observer.observe(container, { childList: true, subtree: true });

      checkInterval = setInterval(() => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          cleanupLoad = setupIframeListener(iframe);
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }
      }, 100);
    }

    return () => {
      active = false;
      if (observer) observer.disconnect();
      if (checkInterval) clearInterval(checkInterval);
      if (cleanupLoad) cleanupLoad();
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [video.id]);

  return (
    <div
      id={`tiktok-card-${video.id}`}
      className={`w-full max-w-[325px] relative rounded-2xl border border-gray-200/60 shadow-sm bg-white flex justify-center animate-fade-in ${
        iframeLoaded ? "h-auto" : "h-[580px] overflow-hidden"
      }`}
    >
      {!iframeLoaded && (
        <div className="absolute inset-0 bg-white p-4 flex flex-col justify-between animate-pulse z-10 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-2 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full" />
          </div>

          <div className="flex-1 bg-gray-100 rounded-xl my-4 flex items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white/60 border-b-8 border-b-transparent ml-1" />
            </div>
            <div className="absolute right-3 bottom-6 flex flex-col gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200/50" />
              <div className="w-8 h-8 rounded-full bg-gray-200/50" />
              <div className="w-8 h-8 rounded-full bg-gray-200/50" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-2.5 bg-gray-200 rounded w-5/6" />
            <div className="h-2.5 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      )}

      <div className={`w-full transition-opacity duration-300 ${iframeLoaded ? 'opacity-100 h-auto' : 'opacity-0 h-full'}`}>
        <blockquote
          className="tiktok-embed"
          cite={video.url}
          data-video-id={video.tiktokId}
          style={{ width: "100%", margin: "0px" }}
        >
          <section />
        </blockquote>
      </div>
    </div>
  );
};

function MediaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) || 1 : 1;

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      }
    }

    const result: (number | string)[] = [];
    let prev: number | null = null;

    for (const page of pages) {
      if (prev !== null) {
        if (page - prev === 2) {
          result.push(prev + 1);
        } else if (page - prev > 2) {
          result.push("...");
        }
      }
      result.push(page);
      prev = page;
    }

    return result;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res: any = await postsAPI.getAll({ type: "MEDIA", page: String(currentPage) });
        const items = res?.posts?.data || res?.posts || res?.data || res;

        if (Array.isArray(items) && items.length > 0) {
          const mappedVideos: VideoItem[] = items.map((post: any) => ({
            id: post.slug || String(post.id),
            tiktokId: getTikTokId(post.author || ""),
            title: post.title || "",
            description: post.description || "",
            url: post.author || ""
          }));
          // Only show videos that have a valid TikTok ID
          setVideos(mappedVideos.filter(v => v.tiktokId));
          setTotalPages(res?.posts?.last_page || 1);
        } else {
          setVideos([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching media library videos:", err);
        setVideos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [currentPage]);

  // Dynamically load/trigger official TikTok Embed Script with polling fallback for client-side navigation
  useEffect(() => {
    if (videos.length > 0) {
      const triggerRender = () => {
        if ((window as any).tiktokEmbed) {
          try {
            const tiktoks = document.querySelectorAll('blockquote.tiktok-embed');
            if (tiktoks.length > 0) {
              (window as any).tiktokEmbed.lib.render(Array.from(tiktoks));
              return true; // render successful
            }
          } catch (e) {
            console.error("Error triggering TikTok render:", e);
          }
        }
        return false; // not ready yet
      };

      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }

      // Poll every 100ms up to 20 times (2 seconds) to wait for both the script execution
      // and React DOM mount to complete, ensuring consistent rendering on client-side routing.
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const success = triggerRender();
        if (success || attempts > 20) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [videos]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/thu-vien-media?page=${page}`);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 w-full flex flex-col gap-12 items-center">

        {/* Header Title Section */}
        <div className="flex flex-col gap-4 text-center max-w-3xl w-full">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0562d2] uppercase tracking-widest justify-center">
            <Video className="w-4 h-4" /> Thư viện Media
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-3xl md:text-5xl leading-tight text-[#00095b] tracking-tight uppercase">
            Video Ngắn TikTok
          </h1>
          <div className="font-sans text-sm md:text-base leading-relaxed text-gray-600 mt-2 space-y-4 max-w-2xl mx-auto">
            <p>
              Khám phá chuỗi video ngắn chia sẻ kinh nghiệm, lái thử xe và các mẹo sử dụng xe Ford hữu ích từ đội ngũ chuyên gia tại Đồng Nai Ford.
            </p>
          </div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[1000px] mx-auto justify-items-center items-start">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : videos.length > 0 ? (
          <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[1000px] mx-auto justify-items-center items-start">
              {videos.map((video) => (
                <TikTokCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="bg-white border border-[#e5e5e5] flex gap-2 items-center px-4 py-2 rounded-[400px] shadow-xs">
                  {/* Prev button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer ${
                      currentPage === 1
                        ? "text-gray-300 pointer-events-none"
                        : "text-[#424242] hover:bg-gray-100"
                    }`}
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-11 h-11 flex items-center justify-center text-gray-400 font-semibold text-sm select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = page as number;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-11 h-11 flex items-center justify-center font-semibold text-sm rounded-[4px] transition cursor-pointer ${
                          isActive
                            ? "bg-[#044ea7] text-white"
                            : "bg-white text-[#808080] hover:bg-gray-100"
                        }`}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer ${
                      currentPage === totalPages
                        ? "text-gray-300 pointer-events-none"
                        : "text-[#424242] hover:bg-gray-100"
                    }`}
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <p className="text-sm">Chưa có video TikTok nào được đăng tải.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#fafafa] min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0562d2]" />
      </div>
    }>
      <MediaPageContent />
    </Suspense>
  );
}
