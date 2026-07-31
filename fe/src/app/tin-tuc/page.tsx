import { Metadata } from "next";
import { postsAPI, reviewsAPI } from "@/lib/api";
import TinTucClient from "./TinTucClient";

export const metadata: Metadata = {
  title: "Tin Tức Ford | Long Khánh Ford - Đại lý chính hãng Đồng Nai",
  description:
    "Cập nhật tin tức mới nhất về xe Ford, khuyến mãi, sự kiện tại Long Khánh Ford. Đánh giá xe, so sánh xe Ford Everest, Ranger, Territory.",
  alternates: { canonical: "/tin-tuc" },
  openGraph: {
    title: "Tin Tức Ford | Long Khánh Ford",
    description: "Cập nhật tin tức mới nhất về xe Ford tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Tin tức — Server Component (SSR)
 *
 * Initial page data is fetched server-side for SEO.
 * Client handles search, pagination, category filtering.
 */
export default async function TinTucPage() {
  let initialData: any = null;
  let initialReviews: any[] = [];

  try {
    const [postsRes, reviewsRes] = await Promise.all([
      postsAPI.getAll({ page: "1" }).catch(() => null),
      reviewsAPI.getAll().catch(() => null),
    ]);
    initialData = postsRes;

    const reviewsItems = (reviewsRes as any)?.data || reviewsRes;
    if (Array.isArray(reviewsItems) && reviewsItems.length > 0) {
      initialReviews = reviewsItems.map((item: any) => ({
        name: item.customer_name || "Khách hàng",
        role: "Khách hàng",
        avatarText: (item.customer_name || "KH").substring(0, 2).toUpperCase(),
        stars: item.rating || 5,
        comment: item.content || "",
      }));
    }
  } catch (err) {
    console.error("Error prefetching news data (SSR):", err);
  }

  return (
    <TinTucClient
      initialData={initialData}
      initialReviews={initialReviews}
    />
  );
}
