import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phụ kiện & Đồ chơi xe Ford chính hãng | Long Khánh Ford",
  description:
    "Danh mục phụ kiện, đồ chơi xe Ford chính hãng nhập khẩu: nắp thùng bán tải, phim cách nhiệt, camera hành trình, mâm lốp, thảm lót sàn cao cấp tại Long Khánh Ford.",
  keywords: [
    "phụ kiện xe Ford",
    "đồ chơi xe Ranger",
    "nắp thùng bán tải Ranger",
    "phụ kiện Everest",
    "phụ kiện chính hãng Ford",
  ],
  alternates: {
    canonical: "/phu-kien",
  },
  openGraph: {
    title: "Phụ kiện & Đồ chơi xe Ford chính hãng | Long Khánh Ford",
    description:
      "Trang bị phụ kiện cao cấp chính hãng nâng cấp cho xe Ford của bạn tại Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function AccessoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
