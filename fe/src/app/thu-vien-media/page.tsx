import { Metadata } from "next";
import { postsAPI } from "@/lib/api";
import ThuVienMediaClient from "./ThuVienMediaClient";

export const metadata: Metadata = {
  title: "Thư Viện Media | Long Khánh Ford - Hình ảnh & Video",
  description:
    "Thư viện hình ảnh và video về xe Ford, sự kiện, showroom tại Long Khánh Ford. Xem hình ảnh chi tiết Ford Everest, Ranger, Territory.",
  alternates: { canonical: "/thu-vien-media" },
  openGraph: {
    title: "Thư Viện Media | Long Khánh Ford",
    description: "Thư viện hình ảnh và video xe Ford tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Thư viện media — Server Component (SSR)
 */
export default async function MediaPage() {
  let initialData: any = null;

  try {
    const res = await postsAPI.getAll({ type: "MEDIA", page: "1" }).catch(() => null);
    initialData = res;
  } catch (err) {
    console.error("Error prefetching media data (SSR):", err);
  }

  return <ThuVienMediaClient initialData={initialData} />;
}
