import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm | Long Khánh Ford — Các dòng xe Ford chính hãng",
  description:
    "Khám phá đầy đủ các dòng xe Ford chính hãng tại Long Khánh Ford: SUV, bán tải, xe thương mại. Giá ưu đãi, hỗ trợ trả góp 80%.",
  keywords: [
    "xe Ford",
    "Ford Long Khánh",
    "Ford Everest",
    "Ford Ranger",
    "Ford Territory",
    "Ford Transit",
    "mua xe Ford",
  ],
  openGraph: {
    title: "Sản phẩm | Long Khánh Ford",
    description:
      "Khám phá đầy đủ các dòng xe Ford chính hãng tại showroom Ford Long Khánh.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
