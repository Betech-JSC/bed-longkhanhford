import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng tính Trả góp Mua xe Ford | Long Khánh Ford",
  description: "Công cụ ước tính khoản vay mua xe Ford trả góp, lịch trả lãi và gốc hàng tháng chi tiết với lãi suất ưu đãi.",
  alternates: {
    canonical: "/cong-cu/uoc-tinh-tra-gop",
  },
};

export default function InstallmentToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
