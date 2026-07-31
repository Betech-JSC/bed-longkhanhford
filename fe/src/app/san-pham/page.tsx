import { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import SanPhamClient from "./SanPhamClient";

export const metadata: Metadata = {
  title: "Tất Cả Dòng Xe Ford | Long Khánh Ford - Đại lý chính hãng Đồng Nai",
  description:
    "Khám phá tất cả dòng xe Ford chính hãng tại Long Khánh Ford: Everest, Ranger, Territory, Transit, Raptor. Xem thông số, giá bán, ưu đãi mới nhất.",
  alternates: { canonical: "/san-pham" },
  openGraph: {
    title: "Dòng Xe Ford | Long Khánh Ford",
    description: "Khám phá tất cả dòng xe Ford tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Sản phẩm — Server Component (SSR)
 */
export default async function ProductsPage() {
  let initialVehicles: any[] = [];
  let initialCategories: any[] = [];

  try {
    const [vehiclesRes, catsRes] = await Promise.all([
      vehiclesAPI.getAll({ with_versions: true }).catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
    ]);

    const vehiclesData = (vehiclesRes as any)?.data || vehiclesRes;
    if (Array.isArray(vehiclesData)) initialVehicles = vehiclesData;

    const catsData = (catsRes as any)?.data || catsRes;
    if (Array.isArray(catsData)) initialCategories = catsData;
  } catch (err) {
    console.error("Error prefetching products data (SSR):", err);
  }

  return (
    <SanPhamClient
      initialVehicles={initialVehicles}
      initialCategories={initialCategories}
    />
  );
}
