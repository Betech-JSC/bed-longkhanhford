import { notFound } from "next/navigation";
import { accessoriesAPI } from "@/lib/api";
import AccessoryDetailClient from "@/components/accessories/AccessoryDetailClient";

type Props = {
  params: Promise<{
    id: string; // The URL slug/id of the accessory
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const response = await accessoriesAPI.getBySlug(id);
    const accessory = response?.data || response;

    if (!accessory) return {};

    const title = `${accessory.title} | Phụ kiện chính hãng | Đồng Nai Ford`;
    const description = accessory.description || `Mua lắp đặt phụ kiện xe Ford ${accessory.title} chất lượng cao, nhập khẩu chính hãng tại Đồng Nai Ford.`;
    const imageUrl = accessory.image?.url || (accessory.images?.[0]?.url) || "";

    return {
      title,
      description,
      alternates: {
        canonical: `/phu-kien/${id}`,
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
    console.error("Error generating metadata for accessory page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  let accessory = null;
  let allAccessories = [];

  try {
    const [detailRes, allRes] = await Promise.all([
      accessoriesAPI.getBySlug(id).catch(() => null),
      accessoriesAPI.getAll().catch(() => null),
    ]);

    if (detailRes && detailRes.success && detailRes.data) {
      accessory = detailRes.data;
    }
    if (allRes && allRes.success && Array.isArray(allRes.data)) {
      allAccessories = allRes.data;
    }
  } catch (error) {
    console.error("Error loading accessory in server page:", error);
  }

  if (!accessory) {
    notFound();
  }

  return (
    <AccessoryDetailClient 
      apiAccessory={accessory} 
      apiAllAccessories={allAccessories} 
    />
  );
}
