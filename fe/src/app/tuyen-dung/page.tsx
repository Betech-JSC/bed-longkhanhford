import { Metadata } from "next";
import { jobsAPI } from "@/lib/api";
import TuyenDungClient from "./TuyenDungClient";

export const metadata: Metadata = {
  title: "Tuyển Dụng | Long Khánh Ford - Cơ hội nghề nghiệp",
  description:
    "Tìm kiếm cơ hội việc làm tại Long Khánh Ford - đại lý Ford chính hãng tại Đồng Nai. Tuyển dụng kỹ thuật viên, tư vấn bán hàng, nhân viên dịch vụ.",
  alternates: { canonical: "/tuyen-dung" },
  openGraph: {
    title: "Tuyển Dụng | Long Khánh Ford",
    description: "Cơ hội nghề nghiệp tại Long Khánh Ford, Đồng Nai.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Tuyển dụng — Server Component (SSR)
 */
export default async function TuyenDungPage() {
  let initialJobs: any[] = [];

  try {
    const res = (await jobsAPI.getAll()) as any;
    const items = res?.jobs || res?.data || res;
    if (Array.isArray(items)) initialJobs = items;
  } catch (err) {
    console.error("Error prefetching jobs data (SSR):", err);
  }

  return <TuyenDungClient initialJobs={initialJobs} />;
}
