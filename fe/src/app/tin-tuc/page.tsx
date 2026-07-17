"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { handleImageError } from "@/lib/site-assets";
import { postsAPI, reviewsAPI } from "@/lib/api";

function NewsListPageContent() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return categories.filter((cat) => {
      if (!cat || !cat.title) return false;
      const titleKey = cat.title.trim().toLowerCase();
      const isDuplicate = seen.has(titleKey);
      seen.add(titleKey);
      return !isDuplicate;
    });
  }, [categories]);

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

  // Testimonials Carousel Slide State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTestimonialInteracted, setIsTestimonialInteracted] = useState(false);

  // Drag states and refs for Testimonials
  const [testimonialDragOffset, setTestimonialDragOffset] = useState(0);
  const testimonialDragStartX = useRef(0);
  const isTestimonialDragging = useRef(false);
  const testimonialWasDragged = useRef(false);

  // Debounce search query to prevent excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load data from Laravel API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: String(currentPage),
        };
        if (activeTab !== "all") {
          params.categories = String(activeTab);
        }
        if (debouncedSearchQuery.trim() !== "") {
          params.keyword = debouncedSearchQuery;
        }

        const res: any = await postsAPI.getAll(params).catch(() => null);
        if (res) {
          if (res.categories) {
            setCategories(res.categories);
          }
          if (res.top_posts) {
            setTopPosts(res.top_posts);
          }
          if (res.posts) {
            setPosts(res.posts.data || []);
            setTotalPages(res.posts.last_page || 1);
          }
        }
      } catch (err) {
        console.error("Error loading news list data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, activeTab, debouncedSearchQuery]);

  // Match category from URL search query parameters (ID or slug) or pathname once categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      if (pathname === "/khuyen-mai") {
        const found = categories.find((c) => c.slug === "khuyen-mai");
        if (found) {
          setActiveTab(found.id);
        }
      } else {
        let catParam = searchParams.get("category");
        if (!catParam) {
          if (pathname.startsWith("/category/")) {
            catParam = pathname.replace("/category/", "").replace(/\/$/, "");
          } else if (pathname.startsWith("/chuyen-muc/")) {
            catParam = pathname.replace("/chuyen-muc/", "").replace(/\/$/, "");
          }
        }

        if (catParam) {
          const found = categories.find(
            (c) => String(c.id) === catParam || c.slug === catParam
          );
          if (found) {
            setActiveTab(found.id);
          }
        } else {
          setActiveTab("all");
        }
      }
    }
  }, [categories, searchParams, pathname]);

  // Load reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await reviewsAPI.getAll().catch(() => null);
        const reviewsItems = (reviewsData as any)?.data || reviewsData;
        if (Array.isArray(reviewsItems) && reviewsItems.length > 0) {
          setTestimonials(reviewsItems.map((item: any) => ({
            name: item.customer_name || "Khách hàng",
            role: "Khách hàng",
            avatarText: (item.customer_name || "KH").substring(0, 2).toUpperCase(),
            stars: item.rating || 5,
            comment: item.content || ""
          })));
        }
      } catch (err) {
        console.error("Error loading customer reviews", err);
      }
    };
    fetchReviews();
  }, []);

  // Auto-play testimonials every 2.5 seconds, pause on hover or if interacted
  useEffect(() => {
    if (isHovered || isTestimonialInteracted || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isHovered, isTestimonialInteracted, testimonials.length]);

  // Reset testimonial interacted flag after 5 seconds of inactivity to resume auto-play
  useEffect(() => {
    if (isTestimonialInteracted) {
      const timer = setTimeout(() => {
        setIsTestimonialInteracted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTestimonialInteracted]);

  // Drag handlers for Testimonials
  const handleTestimonialStart = (clientX: number) => {
    testimonialDragStartX.current = clientX;
    isTestimonialDragging.current = true;
    setIsTestimonialInteracted(true); // Pause autoplay
  };

  const handleTestimonialMove = (clientX: number) => {
    if (!isTestimonialDragging.current) return;
    const diff = clientX - testimonialDragStartX.current;
    setTestimonialDragOffset(diff);
  };

  const handleTestimonialEnd = () => {
    if (!isTestimonialDragging.current) return;
    isTestimonialDragging.current = false;
    
    const dist = Math.abs(testimonialDragOffset);
    if (dist > 10) {
      testimonialWasDragged.current = true;
      setTimeout(() => {
        testimonialWasDragged.current = false;
      }, 50);
    } else {
      testimonialWasDragged.current = false;
    }

    if (testimonialDragOffset > 50) {
      setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else if (testimonialDragOffset < -50) {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
    
    setTestimonialDragOffset(0);
  };

  const handleTabChange = (tabId: number | "all") => {
    setCurrentPage(1);

    if (tabId === "all") {
      router.push("/tin-tuc", { scroll: false });
    } else {
      const cat = categories.find((c) => c.id === tabId);
      const catSlug = cat && cat.slug ? cat.slug : String(tabId);

      router.push(`/chuyen-muc/${catSlug}`, { scroll: false });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
    <div className="bg-[#F8F8F8] flex-1 min-h-screen flex flex-col items-center w-full pb-16">
      {/* HERO BANNER */}
      <section className="relative w-full h-[320px] bg-slate-900 overflow-hidden flex items-end pt-24 pb-10 mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/banner.jpg"
            alt="Tin tức Long Khánh Ford"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full z-10">
          <h1 className="text-[40px] md:text-[48px] font-bold text-white leading-tight uppercase font-antenna">
            {pathname === "/khuyen-mai" ? "Chương trình Khuyến mãi" : "Tin tức & Sự kiện"}
          </h1>
          <p className="text-white/80 text-base max-w-2xl mt-2 font-antenna">
            {pathname === "/khuyen-mai" 
              ? "Tổng hợp các chương trình ưu đãi, khuyến mãi mới nhất từ đại lý Long Khánh Ford."
              : "Cập nhật tin tức mới nhất về các dòng xe Ford và hoạt động tại đại lý."}
          </p>
        </div>
      </section>

      {/* 1. FEATURED NEWS SECTION */}
      {pathname !== "/khuyen-mai" && topPosts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full mb-16">
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[36px] leading-[1.32] text-[#1a1a1a] mb-8">
            Tin tức nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {topPosts.slice(0, 2).map((art) => (
              <Link
                key={`featured-${art.id}`}
                href={`/${art.slug}`}
                className="bg-white rounded-none overflow-hidden border border-[#e5e5e5] hover:shadow-sm transition-premium group flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[600/380] relative overflow-hidden w-full bg-gray-100">
                  <img
                    src={art.image?.url || "/placeholder-news.jpg"}
                    alt={art.title}
                    className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                    onError={handleImageError}
                  />
                  {art.category && (
                    <div className="absolute top-4 left-4 bg-[#066fef] text-white text-xs font-semibold px-3 py-1 rounded-[4px] uppercase tracking-wider">
                      {art.category.title}
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <span className="text-sm font-medium text-[#424242]">
                    {formatDate(art.published_at)}
                  </span>
                  <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[18px] leading-[1.45] text-[#1a1a1a] group-hover:text-[#066fef] transition-colors duration-200 line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-sm text-[#424242] leading-relaxed line-clamp-3 mt-1 font-antenna">
                    {art.description}
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-[#066fef] group-hover:underline uppercase tracking-wider text-[11px]">
                    Xem chi tiết
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 2. ALL NEWS & FILTER SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full">
        <div className="flex flex-col gap-8">
          {/* Section Heading & Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e5e5e5] pb-4">
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] leading-[1.2] text-[#1a1a1a] shrink-0 font-display">
              Danh sách bài viết
            </h2>

            {/* Filter controls wrapper */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto lg:justify-end">
              {/* Category tabs */}
              {pathname !== "/khuyen-mai" && (
                <div className="flex overflow-x-auto scrollbar-none border-b sm:border-b-0 border-gray-200">
                  <button
                    onClick={() => handleTabChange("all")}
                    className={`px-5 py-2.5 text-base font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                      activeTab === "all"
                        ? "text-[#066fef] border-b-2 border-[#066fef]"
                        : "text-[#424242] hover:text-[#066fef]"
                    }`}
                  >
                    Tất cả
                  </button>
                  {uniqueCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleTabChange(cat.id)}
                      className={`px-5 py-2.5 text-base font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                        activeTab === cat.id
                          ? "text-[#066fef] border-b-2 border-[#066fef]"
                          : "text-[#424242] hover:text-[#066fef]"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative min-w-[200px] sm:w-[240px]">
                <input
                  type="text"
                  placeholder="Tìm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#066fef] transition shadow-xs"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              </div>
            </div>
          </div>

          {/* Loading Indicator or Grid of paginated articles */}
          {loading ? (
            <div className="text-center py-20 bg-white border border-[#e5e5e5] rounded-none">
              <p className="text-gray-500 text-sm">Đang tải danh sách bài viết...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((art) => (
                <Link
                  key={art.id}
                  href={`/${art.slug}`}
                  className="bg-white rounded-none overflow-hidden border border-[#e5e5e5] hover:shadow-xs transition-premium group flex flex-col h-full"
                >
                  <div className="aspect-[600/400] relative overflow-hidden w-full bg-gray-100">
                    <img
                      src={art.image?.url || "/placeholder-news.jpg"}
                      alt={art.title}
                      className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                      onError={handleImageError}
                    />
                    {art.category && (
                      <div className="absolute top-4 left-4 bg-[#066fef] text-white text-xs font-semibold px-3 py-1 rounded-[4px] uppercase tracking-wider">
                        {art.category.title}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    <span className="text-xs font-medium text-[#424242]">
                      {formatDate(art.published_at)}
                    </span>
                    <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.4] text-[#1a1a1a] group-hover:text-[#066fef] transition-colors duration-200 line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#424242] leading-relaxed line-clamp-3 mt-1 font-antenna">
                      {art.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#e5e5e5] rounded-none">
              <p className="text-gray-500 text-sm">Không tìm thấy bài viết nào phù hợp.</p>
            </div>
          )}

          {/* Pagination component block */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="bg-white border border-[#e5e5e5] flex gap-2 items-center px-4 py-2 rounded-none shadow-xs">
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition cursor-pointer ${
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
                            ? "bg-[#066fef] text-white"
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
                  className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition cursor-pointer ${
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
      </section>

      {/* 3. CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section id="media" className="bg-gray-light border-y border-gray-200 py-20 px-0 overflow-x-clip w-full mt-16">
          <div className="w-full">
            <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold text-[#066fef] uppercase tracking-wider block mb-2 font-antenna">
                  Ý KIẾN TỪ KHÁCH HÀNG
                </span>
                <h2 className="font-['Ford_Antenna',sans-serif] text-[36px] font-semibold text-[#1a1a1a] leading-tight">
                  Cảm nhận khách hàng
                </h2>
              </div>

              {/* Arrows controllers */}
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => {
                    setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                    setIsTestimonialInteracted(true);
                  }}
                  className="p-2 border border-gray-300 hover:bg-[#0562d2] hover:text-white hover:border-[#0562d2] text-primary rounded-full transition-colors cursor-pointer bg-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
                    setIsTestimonialInteracted(true);
                  }}
                  className="p-2 border border-gray-300 hover:bg-[#0562d2] hover:text-white hover:border-[#0562d2] text-primary rounded-full transition-colors cursor-pointer bg-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testimonial Active Display Card Row */}
            <div className="relative w-full overflow-visible py-4 select-none">
              <div
                className="flex cursor-grab active:cursor-grabbing"
                style={{
                  gap: 'var(--card-gap-testimonial)',
                  transform: `translateX(calc(50% - (var(--card-width-testimonial) / 2) - ${activeTestimonialIndex} * (var(--card-width-testimonial) + var(--card-gap-testimonial)) + ${testimonialDragOffset}px))`,
                  transition: isTestimonialDragging.current ? "none" : "transform 500ms ease-in-out"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={(e) => {
                  setIsHovered(false);
                  handleTestimonialEnd();
                }}
                onMouseDown={(e) => handleTestimonialStart(e.clientX)}
                onMouseMove={(e) => handleTestimonialMove(e.clientX)}
                onMouseUp={handleTestimonialEnd}
                onTouchStart={(e) => {
                  setIsHovered(true);
                  handleTestimonialStart(e.touches[0].clientX);
                }}
                onTouchMove={(e) => handleTestimonialMove(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  setIsHovered(false);
                  handleTestimonialEnd();
                }}
              >
                {testimonials.map((item, idx) => {
                  const isActive = idx === activeTestimonialIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (testimonialWasDragged.current) return;
                        setActiveTestimonialIndex(idx);
                      }}
                      className={`h-auto min-h-[320px] sm:h-[320px] bg-white px-5 py-6 sm:px-6 sm:py-8 rounded-none flex-shrink-0 flex flex-col justify-between cursor-pointer transition-all ${isActive
                        ? "border-b-4 border-[#066fef] shadow-xs scale-100 opacity-100"
                        : "border-b border-gray-200 scale-95 opacity-50"
                        }`}
                      style={{
                        width: 'var(--card-width-testimonial)',
                      }}
                    >
                      {/* Comment text */}
                      <p className="text-[15px] sm:text-[18px] text-[#424242] font-normal leading-[1.5] font-antenna">
                        &ldquo;{item.comment}&rdquo;
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                        <div className="size-[48px] sm:size-[64px] rounded-[4px] border-[2px] sm:border-[3px] border-[#066fef] bg-[#00095B] flex items-center justify-center font-bold text-white text-base sm:text-lg flex-shrink-0">
                          {item.avatarText}
                        </div>
                        <div>
                          <h4 className="text-[15px] sm:text-[18px] font-semibold text-[#1a1a1a] tracking-[0.18px] leading-tight font-display">
                            {item.name}
                          </h4>
                          <p className="text-[14px] sm:text-[16px] text-[#333333] mt-0.5 sm:mt-1 font-antenna">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Indicators dots */}
            <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTestimonialIndex(idx);
                    setIsTestimonialInteracted(true);
                  }}
                  className={`h-2 transition-all rounded-full cursor-pointer ${activeTestimonialIndex === idx ? "w-6 bg-[#066fef]" : "w-2 bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function NewsListPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F8F8F8] min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#066fef]" />
      </div>
    }>
      <NewsListPageContent />
    </Suspense>
  );
}
