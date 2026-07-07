import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehiclePriceCalculatorClient from "@/components/vehicle/VehiclePriceCalculatorClient";

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

    const title = `Dự toán chi phí lăn bánh xe Ford ${vehicle.title} | Đồng Nai Ford`;
    const description = `Tính dự toán chi phí lăn bánh xe Ford ${vehicle.title} tại Đồng Nai, TP.HCM và các tỉnh thành khác. Nhận dự toán thuế trước bạ, phí cấp biển số xe.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/du-toan-lan-banh`,
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
    console.error("Error generating metadata for rolling cost page:", error);
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
    console.error("Error loading vehicle in server calculator page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehiclePriceCalculatorClient />;
}
