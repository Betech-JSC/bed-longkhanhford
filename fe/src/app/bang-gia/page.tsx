import { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import { resolveImageUrl, getPopularVehicleImage } from "@/lib/site-assets";
import BangGiaClient, { groupVehiclesBySeries } from "./BangGiaClient";

export const metadata: Metadata = {
  title: "Bảng Giá Xe Ford 2026 | Long Khánh Ford - Đại lý chính hãng",
  description:
    "Bảng giá xe Ford 2026 chính hãng mới nhất tại Long Khánh Ford. Xem giá niêm yết Ford Everest, Ranger, Territory, Transit. Hỗ trợ trả góp 80%, ưu đãi đặc biệt.",
  alternates: { canonical: "/bang-gia" },
  openGraph: {
    title: "Bảng Giá Xe Ford 2026 | Long Khánh Ford",
    description:
      "Bảng giá xe Ford 2026 chính hãng mới nhất tại Long Khánh Ford. Xem giá niêm yết Ford Everest, Ranger, Territory, Transit.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Bảng giá — Server Component (SSR)
 */
export default async function PriceListPage() {
  let vehicles: any[] = [];

  try {
    const res = await vehiclesAPI.getAll({ with_versions: 1 });
    if (res && res.success && Array.isArray(res.data)) {
      vehicles = groupVehiclesBySeries(res.data);
    }
  } catch (err) {
    console.error("Error loading vehicles for price list (SSR):", err);
  }

  return <BangGiaClient vehicles={vehicles} />;
}
