import { Metadata } from "next";
import { jobsAPI, settingsAPI } from "@/lib/api";
import GioiThieuClient from "./GioiThieuClient";

export const metadata: Metadata = {
  title: "Giới Thiệu Long Khánh Ford | Đại lý Ford chính hãng lớn nhất Đồng Nai",
  description:
    "Tìm hiểu về Long Khánh Ford - đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Showroom đạt chuẩn Signature, đội ngũ chuyên nghiệp, dịch vụ hậu mãi xuất sắc.",
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: "Giới Thiệu Long Khánh Ford",
    description: "Đại lý ủy quyền chính thức Ford Việt Nam tại Long Khánh, Đồng Nai.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Giới thiệu — Server Component (SSR)
 */
export default async function AboutPage() {
  let initialJobs: any[] = [];
  let initialTeamImages: any = null;

  try {
    const [jobsRes, settingsRes] = await Promise.allSettled([
      jobsAPI.getAll(),
      settingsAPI.getGeneral(),
    ]);

    if (jobsRes.status === "fulfilled" && jobsRes.value) {
      const res: any = jobsRes.value;
      const items = res?.jobs || res?.data || res;
      if (Array.isArray(items)) initialJobs = items;
    }

    if (settingsRes.status === "fulfilled" && settingsRes.value) {
      const res = settingsRes.value;
      initialTeamImages = res?.data?.about_team_images || null;
    }
  } catch (err) {
    console.error("Error prefetching about page data (SSR):", err);
  }

  return (
    <GioiThieuClient
      initialJobs={initialJobs}
      initialTeamImages={initialTeamImages}
    />
  );
}
