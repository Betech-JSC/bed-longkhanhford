import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleVersionDetailClient from "@/components/vehicle/VehicleVersionDetailClient";

type Props = {
  params: Promise<{
    id: string; // The URL slug of the vehicle
    versionSlug: string; // The URL slug of the version
  }>;
};

// Vietnamese-accent-safe URL slug generator
const getVersionSlug = (verName: string) => {
  return verName.toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const getVersionDisplayName = (verName: string, vehicleName: string) => {
  if (verName.toLowerCase().startsWith(vehicleName.toLowerCase())) {
    return verName.substring(vehicleName.length).trim();
  }
  return verName;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { id, versionSlug } = await params;
    const res = await vehiclesAPI.getBySlug(id).catch(() => null);
    const vehicle = res?.data;

    if (!vehicle) return {};

    const versions = vehicle.versions || [];
    const matchedVersion = versions.find((v: any) => getVersionSlug(v.name) === versionSlug);

    const vehicleName = vehicle.title || "";
    const versionDisplayName = matchedVersion 
      ? getVersionDisplayName(matchedVersion.name, vehicleName) 
      : "";

    const title = matchedVersion 
      ? `${vehicleName} ${versionDisplayName} | Thông số & Giá lăn bánh | Long Khánh Ford`
      : `${vehicleName} | Thông số & Giá lăn bánh | Long Khánh Ford`;

    const description = matchedVersion?.description || vehicle.tagline || `Khám phá chi tiết phiên bản Ford ${vehicleName} ${versionDisplayName} chính hãng tại Long Khánh Ford. Nhận báo giá lăn bánh mới nhất.`;

    let imageUrl = "";
    if (matchedVersion && matchedVersion.image_url) {
      imageUrl = matchedVersion.image_url;
    } else if (vehicle.image_url) {
      imageUrl = vehicle.image_url;
    }

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/${versionSlug}`,
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
    console.error("Error generating metadata for product version page:", error);
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
    console.error("Error loading vehicle in server version page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  return <VehicleVersionDetailClient />;
}
