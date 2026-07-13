import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleFeaturesClient from "@/components/vehicle/VehicleFeaturesClient";

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

    const title = `Tính năng & Công nghệ xe Ford ${vehicle.title} | Long Khánh Ford`;
    const description = `Khám phá các tính năng thông minh, trang bị an toàn Co-Pilot360, tiện nghi cabin và hiệu năng vận hành vượt trội trên xe Ford ${vehicle.title} mới nhất.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/tinh-nang`,
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
    console.error("Error generating metadata for features page:", error);
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
    console.error("Error loading vehicle in server features page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehicleFeaturesClient />;
}
