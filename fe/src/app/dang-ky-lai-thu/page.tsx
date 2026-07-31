import { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import DangKyLaiThuClient from "./DangKyLaiThuClient";

export const metadata: Metadata = {
  title: "Đăng Ký Lái Thử Xe Ford | Long Khánh Ford",
  description:
    "Đăng ký lái thử xe Ford miễn phí tại Long Khánh Ford. Trải nghiệm Ford Everest, Ranger, Territory, Raptor trực tiếp tại đại lý chính hãng.",
  alternates: { canonical: "/dang-ky-lai-thu" },
  openGraph: {
    title: "Đăng Ký Lái Thử Xe Ford | Long Khánh Ford",
    description: "Đăng ký lái thử xe Ford miễn phí tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Đăng ký lái thử — Server Component (SSR)
 */
export default async function TestDrivePage() {
  let initialVehicles: any[] = [];

  try {
    const res = await vehiclesAPI.getAll().catch(() => null);
    const items = (res as any)?.data || res;
    if (Array.isArray(items)) initialVehicles = items;
  } catch (err) {
    console.error("Error prefetching vehicles for test drive (SSR):", err);
  }

  return <DangKyLaiThuClient initialVehicles={initialVehicles} />;
}
