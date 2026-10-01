import { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import BangGiaClient from "./BangGiaClient";
import { groupVehiclesBySeries } from "@/lib/group-vehicles";
import { vehicles as fallbackVehicles } from "@/data/vehicles";

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
 * Truyền raw API data để client tự group bằng groupVehiclesBySeries
 * Kèm Structured Data JSON-LD Schema (Product / AggregateOffer)
 */
export default async function PriceListPage() {
  let rawVehicles: any[] = [];

  try {
    const res = await vehiclesAPI.getAll({ with_versions: 1 });
    if (res && res.success && Array.isArray(res.data)) {
      rawVehicles = res.data;
    }
  } catch (err) {
    console.error("Error loading vehicles for price list (SSR):", err);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://longkhanhford.com.vn";

  const displayVehicles = (rawVehicles && rawVehicles.length > 0)
    ? groupVehiclesBySeries(rawVehicles)
    : fallbackVehicles.map(v => ({
        id: v.id,
        name: v.name,
        image_url: v.images?.[0] ? (v.images[0].startsWith("http") ? v.images[0] : `${siteUrl}${v.images[0]}`) : "",
        versions: v.versions,
      }));

  const productSchemas = displayVehicles.map((vehicle: any) => {
    const prices = (vehicle.versions || [])
      .map((v: any) => (typeof v.price === "string" ? parseFloat(v.price) : v.price))
      .filter((p: number) => typeof p === "number" && p > 0);

    const lowPrice = prices.length > 0 ? Math.min(...prices) : (vehicle.basePrice || vehicle.base_price || 0);
    const highPrice = prices.length > 0 ? Math.max(...prices) : lowPrice;
    const offerCount = vehicle.versions?.length || 1;
    const carImages = vehicle.image_url
      ? [vehicle.image_url.startsWith("http") ? vehicle.image_url : `${siteUrl}${vehicle.image_url}`]
      : [];

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": vehicle.name,
      "description": `Bảng giá xe Ford ${vehicle.name} chính hãng 2026 tại Long Khánh Ford. Giá niêm yết từ ${new Intl.NumberFormat('vi-VN').format(lowPrice)} VNĐ.`,
      "image": carImages,
      "brand": {
        "@type": "Brand",
        "name": "Ford"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "VND",
        "lowPrice": lowPrice,
        "highPrice": highPrice,
        "offerCount": offerCount,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": `${siteUrl}/${vehicle.id}`,
        "seller": {
          "@type": "AutoDealer",
          "name": "Long Khánh Ford",
          "url": siteUrl
        }
      }
    };
  });

  return (
    <>
      {productSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemas) }}
        />
      )}
      <BangGiaClient rawVehicles={rawVehicles} />
    </>
  );
}
