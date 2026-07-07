import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleCompareClient from "@/components/vehicle/VehicleCompareClient";

type Props = {
  params: Promise<{
    id: string; // The URL slug of the vehicle
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const res = await vehiclesAPI.getBySlug(id).catch(() => null);
    const vehicle = res?.data;

    if (!vehicle) return {};

    const title = `Thông số kỹ thuật & So sánh xe Ford ${vehicle.title} | Đồng Nai Ford`;
    const description = `Chi tiết bảng thông số kỹ thuật xe Ford ${vehicle.title}, so sánh trang bị giữa các phiên bản. Nhận báo giá lăn bánh mới nhất tại Đồng Nai Ford.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/so-sanh`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: vehicle.image_url ? [{ url: vehicle.image_url }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for comparison page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  let vehicle = null;

  try {
    const res = await vehiclesAPI.getBySlug(id).catch(() => null);
    vehicle = res?.data;
  } catch (error) {
    console.error("Error loading vehicle in server comparison page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehicleCompareClient />;
}
