import { notFound } from "next/navigation";
import { usedVehiclesAPI } from "@/lib/api";
import UsedVehicleDetailClient from "@/components/used-vehicles/UsedVehicleDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const response = await usedVehiclesAPI.getBySlug(slug);
    const vehicle = response?.data || response;

    if (!vehicle) return {};

    const title = `${vehicle.title} | Xe cũ chính hãng | Đồng Nai Ford`;
    const description = vehicle.tagline || `Mua bán xe đã qua sử dụng ${vehicle.title} chất lượng cao, kiểm định 167 điểm nghiêm ngặt từ Đồng Nai Ford.`;
    const imageUrl = vehicle.image_url || "";

    return {
      title,
      description,
      alternates: {
        canonical: `/xe-da-qua-su-dung/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for used vehicle page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  let vehicle = null;

  try {
    const response = await usedVehiclesAPI.getBySlug(slug);
    vehicle = response?.data || response;
  } catch (error) {
    console.error("Error loading used vehicle in server page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <UsedVehicleDetailClient vehicle={vehicle} />;
}
