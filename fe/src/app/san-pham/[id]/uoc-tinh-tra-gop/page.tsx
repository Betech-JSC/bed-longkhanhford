import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleInstallmentCalculatorClient from "@/components/vehicle/VehicleInstallmentCalculatorClient";

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

    const title = `Ước tính chi phí trả góp xe Ford ${vehicle.title} | Long Khánh Ford`;
    const description = `Tính toán chi phí trả góp, thời gian vay, lãi suất và lịch trả nợ dự kiến của xe Ford ${vehicle.title} tại Long Khánh Ford.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/uoc-tinh-tra-gop`,
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
    console.error("Error generating metadata for installment page:", error);
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
    console.error("Error loading vehicle in server installment page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehicleInstallmentCalculatorClient />;
}
