import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Công cụ So sánh Xe Ford | Long Khánh Ford",
  description: "So sánh chi tiết thông số kỹ thuật, giá bán và trang bị giữa các phiên bản xe Ford chính hãng.",
  alternates: {
    canonical: "/cong-cu/so-sanh-xe",
  },
};

export default function CompareToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
