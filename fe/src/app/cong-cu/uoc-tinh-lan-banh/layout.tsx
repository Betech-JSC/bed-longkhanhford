import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự toán Chi phí Lăn bánh Xe Ford | Long Khánh Ford",
  description: "Tính toán chính xác tổng chi phí lăn bánh xe Ford theo từng tỉnh thành (phí trước bạ, biển số, bảo hiểm, đăng kiểm).",
  alternates: {
    canonical: "/cong-cu/uoc-tinh-lan-banh",
  },
};

export default function RollingCostToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
