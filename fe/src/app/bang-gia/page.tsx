"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { vehiclesAPI } from "@/lib/api";
import { formatVND, formatPriceShort } from "@/lib/rolling-cost";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { ChevronRight, Calculator, FileText } from "lucide-react";
import BookingBanner from "@/components/services/BookingBanner";

// Helper function to group individual dynamic variants into parent model series
function groupVehiclesBySeries(apiVehicles: any[]) {
  const groups: { [key: string]: {
    id: string;
    name: string;
    type: string;
    typeName: string;
    image_url: string;
    versions: any[];
  }} = {};

  apiVehicles.forEach((vehicle) => {
    let seriesKey = "";
    let seriesName = "";
    let typeName = "";
    
    const titleLower = vehicle.title.toLowerCase();
    if (titleLower.includes("territory")) {
      seriesKey = "ford-territory";
      seriesName = "FORD TERRITORY";
      typeName = "SUV 5 Chỗ";
    } else if (titleLower.includes("everest")) {
      seriesKey = "ford-everest";
      seriesName = "FORD EVEREST";
      typeName = "SUV 7 Chỗ";
    } else if (titleLower.includes("ranger") || titleLower.includes("raptor")) {
      seriesKey = "ford-ranger";
      seriesName = "FORD RANGER";
      typeName = "Bán tải 5 Chỗ";
    } else if (titleLower.includes("transit")) {
      seriesKey = "ford-transit-2024";
      seriesName = "FORD TRANSIT";
      typeName = "Thương mại 16 Chỗ";
    } else if (titleLower.includes("tourneo")) {
      seriesKey = "new-tourneo";
      seriesName = "FORD TOURNEO";
      typeName = "MPV 7 Chỗ";
    } else {
      seriesKey = vehicle.slug || `vehicle-${vehicle.id}`;
      seriesName = vehicle.title;
      seriesKey = seriesKey === "ranger-wildtrak" ? "ford-ranger" : seriesKey;
      seriesKey = seriesKey === "everest-titanium-plus" ? "ford-everest" : seriesKey;
      seriesKey = seriesKey === "territory-titanium-x" ? "ford-territory" : seriesKey;
      seriesKey = seriesKey === "transit-premium" ? "ford-transit-2024" : seriesKey;
      seriesName = vehicle.title;
      typeName = vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại";
    }

    if (!groups[seriesKey]) {
      groups[seriesKey] = {
        id: seriesKey,
        name: seriesName,
        type: vehicle.type || "suv",
        typeName: typeName,
        image_url: vehicle.image_thumbnail_url || vehicle.image_url || "",
        versions: []
      };
    }

    const vehicleVersions = vehicle.versions && vehicle.versions.length > 0
      ? vehicle.versions
      : [{
          id: vehicle.slug || `version-${vehicle.id}`,
          name: vehicle.title,
          price: typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : (vehicle.base_price || 0),
          specs: vehicle.specs || {}
        }];

    vehicleVersions.forEach((v: any) => {
      groups[seriesKey].versions.push({
        id: v.slug || v.id || `v-${v.name}`,
        name: v.name || v.title || vehicle.title,
        price: typeof v.price === 'string' ? parseFloat(v.price) : (v.price || 0),
        specs: v.specs || {}
      });
    });
  });

  const seriesList = Object.values(groups);
  seriesList.forEach((group) => {
    group.versions.sort((a, b) => b.price - a.price);
  });

  return seriesList;
}

export default function PriceListPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehiclesAPI
      .getAll({ with_versions: 1 })
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const grouped = groupVehiclesBySeries(res.data);
          setVehicles(grouped);
        }
      })
      .catch((err) => {
        console.error("Error loading vehicles for price list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-neutral-900 to-[#01095c] text-white pt-28 pb-14 md:pb-18 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] relative z-10">
          {/* Breadcrumb inside Hero */}
          <div className="text-xs text-white/60 font-medium flex items-center gap-1.5 mb-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Bảng giá xe Ford</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-[1.2] mb-3 font-antenna">
              Bảng giá xe Ford 2026
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-antenna">
              Giá niêm yết chính hãng mới nhất, cập nhật liên tục. Liên hệ
              Hotline <strong className="text-white">0918 90 90 60</strong> để
              nhận ưu đãi tốt nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Price Table */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px]">
          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin inline-block w-10 h-10 border-4 border-[#0562d2] border-t-transparent rounded-full" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Đang tải bảng giá xe mới nhất...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-none border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#00095B] text-white text-sm font-bold">
                      <th className="text-left py-4 px-6 w-[80px]">Hình ảnh</th>
                      <th className="text-left py-4 px-6">Dòng xe</th>
                      <th className="text-left py-4 px-6">Phiên bản</th>
                      <th className="text-left py-4 px-6">Loại xe</th>
                      <th className="text-right py-4 px-6 whitespace-nowrap">Giá niêm yết</th>
                      <th className="text-center py-4 px-6 w-[200px]">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle: any) =>
                      vehicle.versions.map((version: any, vIdx: number) => (
                        <tr
                          key={`${vehicle.id}-${version.id}`}
                          className={`border-t border-gray-100 hover:bg-blue-50/30 transition-colors ${
                            vIdx === 0 ? "border-t-2 border-t-gray-200" : ""
                          }`}
                        >
                          {/* Image — only for first version */}
                          {vIdx === 0 && (
                            <td
                              className="py-4 px-6 align-top"
                              rowSpan={vehicle.versions.length}
                            >
                              <div className="relative w-[72px] h-[48px]">
                                <Image
                                  src={
                                    vehicle.image_url ||
                                    getPopularVehicleImage(vehicle.id)
                                  }
                                  alt={vehicle.name}
                                  fill
                                  sizes="72px"
                                  className="object-contain"
                                  onError={handleImageError}
                                />
                              </div>
                            </td>
                          )}
                          {/* Vehicle Name — only for first version */}
                          {vIdx === 0 && (
                            <td
                              className="py-4 px-6 align-top"
                              rowSpan={vehicle.versions.length}
                            >
                              <Link
                                href={`/${vehicle.id}`}
                                className="font-bold text-[#1a1a1a] hover:text-[#066fef] transition-colors uppercase text-sm"
                              >
                                {vehicle.name}
                              </Link>
                            </td>
                          )}
                          {/* Version Name */}
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-700 font-medium">
                              {version.name}
                            </span>
                          </td>
                          {/* Vehicle Type — only for first version */}
                          {vIdx === 0 && (
                            <td
                              className="py-4 px-6 align-top"
                              rowSpan={vehicle.versions.length}
                            >
                              <span className="text-xs font-semibold text-[#066fef] bg-[#066fef]/10 px-2.5 py-1 rounded-[4px]">
                                {vehicle.typeName}
                              </span>
                            </td>
                          )}
                          {/* Price */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <span className="font-bold text-[#066fef] text-sm">
                              {formatVND(version.price)}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/cong-cu/uoc-tinh-lan-banh?vehicle=${vehicle.id}&version=${version.id}`}
                                className="text-xs font-semibold text-gray-600 hover:text-[#066fef] transition-colors flex items-center gap-1"
                                title="Ước tính lăn bánh"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                                Lăn bánh
                              </Link>
                              <span className="text-gray-300">|</span>
                              <Link
                                href="/lien-he"
                                className="text-xs font-semibold text-[#066fef] hover:text-[#01095c] transition-colors flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Báo giá
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-xs"
                  >
                    {/* Vehicle Header */}
                    <Link
                      href={`/${vehicle.id}`}
                      className="flex items-center gap-4 p-4 border-b border-gray-100"
                    >
                      <div className="relative w-[64px] h-[42px] flex-shrink-0">
                        <Image
                          src={
                            vehicle.image_url ||
                            getPopularVehicleImage(vehicle.id)
                          }
                          alt={vehicle.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm uppercase text-[#1a1a1a]">
                          {vehicle.name}
                        </h3>
                        <span className="text-xs text-[#066fef] font-semibold">
                          {vehicle.typeName}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>

                    {/* Versions */}
                    <div className="divide-y divide-gray-50">
                      {vehicle.versions.map((version: any) => (
                        <div
                          key={version.id}
                          className="px-4 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {version.name}
                            </p>
                            <p className="text-sm font-bold text-[#066fef] whitespace-nowrap">
                              {formatVND(version.price)}
                            </p>
                          </div>
                          <Link
                            href="/lien-he"
                            className="text-xs font-semibold text-white bg-[#066fef] hover:bg-[#01095c] px-3.5 py-1.5 rounded-[4px] transition-colors uppercase tracking-wider text-[11px]"
                          >
                            Báo giá
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-800 rounded-none">
                <strong>Lưu ý:</strong> Giá niêm yết trên chưa bao gồm các khoản
                phí lăn bánh (thuế trước bạ, biển số, đăng kiểm, bảo hiểm...). Vui
                lòng sử dụng{" "}
                <Link
                  href="/cong-cu/uoc-tinh-lan-banh"
                  className="text-[#066fef] font-semibold underline"
                >
                  Công cụ Ước tính Lăn bánh
                </Link>{" "}
                hoặc liên hệ Hotline{" "}
                <strong className="text-amber-900">0918 90 90 60</strong> để nhận
                báo giá chính xác nhất.
              </div>
            </>
          )}
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
