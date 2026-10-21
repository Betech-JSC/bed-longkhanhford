import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";
import { getPopularVehicleImage, resolveImageUrl } from "@/lib/site-assets";
import { vehiclesAPI } from "@/lib/api";
import { Car, Check } from "lucide-react";

interface LdpVehiclesGridBlockProps {
  data?: {
    title?: string;
    subtitle?: string;
  };
  salesConsultant?: any;
  allVehicles?: any[];
  currentVehicle?: any;
  anchorId?: string;
  isEditMode?: boolean;
}

// Phân nhóm danh mục dựa trên loại xe hoặc tên xe (fallback)
function resolveCategory(vehicle: any): string {
  const type = (vehicle.type || "").toLowerCase();
  const title = (vehicle.title || vehicle.name || "").toLowerCase();

  if (type === "ev" || title.includes("mach-e") || title.includes("điện")) return "ev";
  if (type === "pickup" || title.includes("ranger")) return "pickup";
  if (type === "commercial" || title.includes("transit") || title.includes("tourneo")) return "commercial";
  if (type === "suv" || title.includes("everest") || title.includes("territory") || title.includes("explorer")) return "suv";
  return "other";
}

export default function LdpVehiclesGridBlock({
  data,
  salesConsultant,
  allVehicles = [],
  currentVehicle,
  anchorId,
  isEditMode = false,
}: LdpVehiclesGridBlockProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>(() => {
    if (Array.isArray(allVehicles) && allVehicles.length > 0) return allVehicles;
    if (currentVehicle) return [currentVehicle];
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(!allVehicles || allVehicles.length === 0);

  // Nạp danh mục xe từ API đồng bộ với trang Homepage
  useEffect(() => {
    vehiclesAPI
      .getCategories()
      .then((res: any) => {
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        }
      })
      .catch(() => {});
  }, []);

  // Tự động đồng bộ thông tin và hình ảnh xe từ API trang chủ (/api/vehicles)
  useEffect(() => {
    vehiclesAPI
      .getAll()
      .then((res: any) => {
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          if (Array.isArray(allVehicles) && allVehicles.length > 0) {
            const enriched = allVehicles.map((v: any) => {
              const matched = list.find(
                (hv: any) =>
                  (hv.slug && (hv.slug === v.slug || hv.slug === v.id)) ||
                  String(hv.id) === String(v.id)
              );
              return matched ? { ...v, ...matched, id: v.slug || matched.slug || v.id } : v;
            });
            setVehicles(enriched);
          } else {
            setVehicles(list);
          }
        } else if (Array.isArray(allVehicles) && allVehicles.length > 0) {
          setVehicles(allVehicles);
        } else if (currentVehicle) {
          setVehicles([currentVehicle]);
        }
      })
      .catch(() => {
        if (Array.isArray(allVehicles) && allVehicles.length > 0) {
          setVehicles(allVehicles);
        } else if (currentVehicle) {
          setVehicles([currentVehicle]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [allVehicles, currentVehicle]);

  const consultantSlug =
    salesConsultant?.slug ||
    salesConsultant?.name?.toLowerCase().trim().replace(/\s+/g, "-") ||
    "tu-van";

  // Định dạng tiền tệ VND chuẩn (phân tách hàng nghìn bằng dấu phẩy giống homepage)
  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (!num || isNaN(num)) return "Liên hệ";
    return new Intl.NumberFormat("en-US").format(num) + "đ";
  };

  // Cuộn mượt xuống phần giới thiệu xe, tự động bù trừ chiều cao thanh tab cố định
  const scrollToVehicleIntro = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById("ldp-vehicle-intro");
    if (target) {
      const tabsBar = document.getElementById("ldp-vehicles-tabs");
      const headerOffset = tabsBar ? tabsBar.getBoundingClientRect().height : 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  // Danh sách tab phân loại chuẩn trang chủ
  const displayCategories = useMemo(() => {
    if (categories.length > 0) {
      return [{ slug: "all", title: "Tất cả" }, ...categories];
    }
    return [
      { slug: "all", title: "Tất cả" },
      { slug: "suv", title: "SUV" },
      { slug: "thuong-mai", title: "Thương mại" },
      { slug: "xe-dien", title: "Xe Điện" },
    ];
  }, [categories]);

  // Lọc xe theo tab đang chọn
  const filteredVehicles = useMemo(() => {
    if (selectedCat === "all") return vehicles;
    const cat = categories.find((c) => c.slug === selectedCat);
    return vehicles.filter((v) => {
      if (cat && cat.id) {
        if (Array.isArray(v.category_ids) && v.category_ids.includes(cat.id)) return true;
        if (v.category_id === cat.id) return true;
      }
      const catSlug = v.category?.slug || v.category_slug;
      if (catSlug && catSlug === selectedCat) return true;
      const resolved = resolveCategory(v);
      if (selectedCat === "suv" && resolved === "suv") return true;
      if (
        (selectedCat === "thuong-mai" || selectedCat === "commercial") &&
        (resolved === "commercial" || resolved === "pickup")
      ) {
        return true;
      }
      if ((selectedCat === "xe-dien" || selectedCat === "ev") && resolved === "ev") return true;
      if ((selectedCat === "pickup" || selectedCat === "ban-tai") && resolved === "pickup") return true;
      return false;
    });
  }, [vehicles, selectedCat, categories]);

  // Nếu không có xe nào và đang ở chế độ xem trước trong CMS: Hiển thị placeholder thông minh
  if (!vehicles || vehicles.length === 0) {
    if (isEditMode) {
      return (
        <section
          id={anchorId || "ldp-vehicles-grid"}
          className="w-full bg-[#f8f9fa] py-8 border-y border-dashed border-gray-300 text-center select-none my-4"
        >
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
            <p className="text-[#0562D2] font-bold text-sm flex items-center justify-center gap-1.5">
              <Car className="w-4 h-4" /> 🚗 KHỐI DANH SÁCH DÒNG XE PHỤ TRÁCH (LDP SHOWROOM)
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {isLoading ? "Đang tải danh sách xe từ trang chính..." : "Chưa có danh sách xe để hiển thị."}
            </p>
          </div>
        </section>
      );
    }
    return null;
  }

  // Tiêu đề & mô tả chuẩn giống Homepage
  const isDefaultOrOldTitle =
    !data?.title ||
    data?.title === "CÁC DÒNG XE FORD ĐANG PHÂN PHỐI" ||
    data?.title === "Dòng xe Cố vấn phụ trách" ||
    data?.title === "Dòng xe Chuyên viên kinh doanh phụ trách" ||
    data?.title === "Dòng xe chuyên viên kinh doanh phụ trách";
  const title = isDefaultOrOldTitle ? "Dòng xe Ford Long Khánh" : data.title;

  const isDefaultOrOldSubtitle =
    !data?.subtitle ||
    data?.subtitle.includes("Chọn dòng xe quý khách quan tâm") ||
    data?.subtitle.includes("ưu đãi độc quyền");
  const subtitle = isDefaultOrOldSubtitle
    ? "Đa dạng lựa chọn từ SUV, bán tải đến xe thương mại — tất cả đều có sẵn tại showroom Long Khánh."
    : data.subtitle;

  return (
    <>
      <section
        id={anchorId || "ldp-vehicles-grid"}
        className="w-full py-16 md:py-20 bg-gray-50 border-b border-gray-200"
      >
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          {/* Tiêu đề & mô tả căn giữa chuẩn Homepage */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#00095B] tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Tab phân loại gạch chân căn giữa (Tất cả, SUV, Thương mại, Xe Điện) - Không hiển thị số lượng */}
          <div className="flex justify-center mb-12 border-b border-gray-200 w-full overflow-x-auto scrollbar-none">
            <div className="flex gap-8 md:gap-12">
              {displayCategories.map((cat) => {
                const isActive = selectedCat === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCat(cat.slug)}
                    className={`pb-4 text-sm md:text-base font-semibold transition-all duration-300 relative cursor-pointer border-0 bg-transparent whitespace-nowrap ${
                      isActive
                        ? "text-[#0562D2] border-b-2 border-solid border-[#0562D2] -mb-[2px]"
                        : "text-gray-500 hover:text-[#0562D2] border-b-2 border-transparent -mb-[2px]"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lưới thẻ xe - 3 cột chuẩn phong cách Ford Long Khánh */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => {
              const vehicleSlug = vehicle.slug || vehicle.id;
              const vehicleName = vehicle.title || vehicle.name;
              const vehiclePrice = vehicle.base_price || vehicle.basePrice || 0;
              const isCurrent =
                currentVehicle && (currentVehicle.slug || currentVehicle.id) === vehicleSlug;

              const vehicleCardImage =
                vehicle.image_thumbnail_url ||
                vehicle.image_url ||
                resolveImageUrl(vehicle.image) ||
                getPopularVehicleImage(vehicleSlug, vehicle.images?.[0] || "");

              const href = salesConsultant?.custom_domain
                ? `/${vehicleSlug}#ldp-vehicle-intro`
                : `/ldp/${consultantSlug}/${vehicleSlug}#ldp-vehicle-intro`;

              return (
                <Link
                  key={vehicle.id || vehicleSlug}
                  href={href}
                  scroll={false}
                  onClick={(e) => {
                    // Nếu là dòng xe đang xem sẵn, cuộn ngay xuống phần giới thiệu xe
                    if (isCurrent) {
                      e.preventDefault();
                      scrollToVehicleIntro();
                    }
                  }}
                  className={`bg-white border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group cursor-pointer h-full ${
                    isCurrent
                      ? "border-[#0562D2] ring-2 ring-[#0562D2]/20 shadow-md"
                      : "border-[#EAECF0]"
                  }`}
                >
                  {/* Badge xe đang xem - z-30 nổi hoàn toàn phía trên ảnh */}
                  {isCurrent && (
                    <div className="absolute top-3 right-3 z-30 bg-[#0562D2] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Đang xem</span>
                    </div>
                  )}

                  {/* Khung ảnh xe */}
                  <div className="relative h-48 w-full bg-white overflow-hidden mb-6 flex items-center justify-center">
                    <SafeImage
                      src={vehicleCardImage}
                      alt={vehicleName}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2"
                      unoptimized={true}
                    />
                  </div>

                  {/* Tên xe & Giá khởi điểm chuẩn Homepage */}
                  <div className="space-y-2 mt-auto">
                    <h3
                      className={`text-base font-bold tracking-tight uppercase ${
                        vehicleSlug === "new-mustang-mach-e" ? "text-[#0562D2]" : "text-[#1A1A1A]"
                      }`}
                    >
                      {vehicleName}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">
                      <span>Giá khởi điểm: </span>
                      <span className="text-sm font-bold text-[#0562D2]">
                        {formatPrice(vehiclePrice)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      {/* Neo định danh bắt đầu phần thông tin chi tiết & giới thiệu xe */}
      <div id="ldp-vehicle-intro" className="scroll-mt-28 md:scroll-mt-24 pointer-events-none" />
    </>
  );
}
