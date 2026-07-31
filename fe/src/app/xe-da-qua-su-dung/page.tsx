import { Metadata } from "next";
import { usedVehiclesAPI } from "@/lib/api";
import XeDaQuaSuDungClient from "./XeDaQuaSuDungClient";

export const metadata: Metadata = {
  title: "Xe Ford Đã Qua Sử Dụng | Long Khánh Ford",
  description:
    "Xe Ford đã qua sử dụng chính hãng tại Long Khánh Ford. Xe đã kiểm tra chất lượng, bảo hành, giá tốt nhất Đồng Nai.",
  alternates: { canonical: "/xe-da-qua-su-dung" },
  openGraph: {
    title: "Xe Ford Đã Qua Sử Dụng | Long Khánh Ford",
    description: "Xe Ford đã qua sử dụng chính hãng tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Xe đã qua sử dụng — Server Component (SSR)
 */
export default async function UsedVehiclesPage() {
  let initialVehicles: any[] = [];

  try {
    const response = await usedVehiclesAPI.getAll();
    const items = (response as any)?.data || response;
    if (Array.isArray(items)) initialVehicles = items;
  } catch (err) {
    console.error("Error prefetching used vehicles data (SSR):", err);
  }

  return <XeDaQuaSuDungClient initialVehicles={initialVehicles} />;
}
