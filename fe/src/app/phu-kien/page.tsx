import { Metadata } from "next";
import { accessoriesAPI } from "@/lib/api";
import PhuKienClient from "./PhuKienClient";

export const metadata: Metadata = {
  title: "Phụ Kiện Ford Chính Hãng | Long Khánh Ford",
  description:
    "Phụ kiện Ford chính hãng tại Long Khánh Ford. Phụ kiện nội thất, ngoại thất, bảo vệ cho Ford Everest, Ranger, Territory. Lắp đặt chuyên nghiệp, bảo hành chính hãng.",
  alternates: { canonical: "/phu-kien" },
  openGraph: {
    title: "Phụ Kiện Ford Chính Hãng | Long Khánh Ford",
    description: "Phụ kiện Ford chính hãng tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Phụ kiện — Server Component (SSR)
 */
export default async function AccessoriesPage() {
  let initialAccessories: any[] = [];
  let initialCategories: any[] = [];

  try {
    const [accRes, catRes] = await Promise.all([
      accessoriesAPI.getAll().catch(() => null),
      accessoriesAPI.getCategories().catch(() => null),
    ]);

    const accData = (accRes as any)?.data || accRes;
    if (Array.isArray(accData)) initialAccessories = accData;

    const catData = (catRes as any)?.data || catRes;
    if (Array.isArray(catData)) initialCategories = catData;
  } catch (err) {
    console.error("Error prefetching accessories data (SSR):", err);
  }

  return (
    <PhuKienClient
      initialAccessories={initialAccessories}
      initialCategories={initialCategories}
    />
  );
}
