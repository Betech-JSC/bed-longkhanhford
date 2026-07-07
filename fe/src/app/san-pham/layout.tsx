import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm | Đồng Nai Ford — Các dòng xe Ford chính hãng",
  description:
    "Khám phá đầy đủ các dòng xe Ford chính hãng tại Đồng Nai Ford: SUV, bán tải, xe thương mại. Giá ưu đãi, hỗ trợ trả góp 80%.",
  keywords: [
    "xe Ford",
    "Ford Đồng Nai",
    "Ford Everest",
    "Ford Ranger",
    "Ford Territory",
    "Ford Transit",
    "mua xe Ford",
  ],
  openGraph: {
    title: "Sản phẩm | Đồng Nai Ford",
    description:
      "Khám phá đầy đủ các dòng xe Ford chính hãng tại showroom Ford Đồng Nai.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
