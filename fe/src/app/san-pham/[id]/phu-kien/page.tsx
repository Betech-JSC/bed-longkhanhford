import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleAccessoriesClient from "@/components/vehicle/VehicleAccessoriesClient";

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

    const title = `Phụ kiện xe Ford ${vehicle.title} chính hãng | Đồng Nai Ford`;
    const description = `Danh sách phụ kiện nội thất, ngoại thất, mâm lốp, công nghệ và phụ tùng hiệu suất chính hãng thiết kế riêng cho dòng xe Ford ${vehicle.title} tại Đồng Nai Ford.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/phu-kien`,
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
    console.error("Error generating metadata for vehicle accessories page:", error);
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
    console.error("Error loading vehicle in server accessories page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehicleAccessoriesClient />;
}
