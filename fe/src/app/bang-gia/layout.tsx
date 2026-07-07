import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng Giá Xe Ford 2026 | Đồng Nai Ford — Giá niêm yết mới nhất",
  description:
    "Bảng giá xe Ford mới nhất 2026 tại Đồng Nai: Ford Everest, Territory, Ranger, Raptor, Transit, Mustang. Giá niêm yết chính hãng, hỗ trợ trả góp.",
  keywords: [
    "bảng giá xe Ford",
    "giá xe Ford Đồng Nai",
    "giá Ford Everest",
    "giá Ford Ranger",
    "giá Ford Territory",
  ],
  openGraph: {
    title: "Bảng Giá Xe Ford 2026 | Đồng Nai Ford",
    description:
      "Bảng giá xe Ford mới nhất 2026 tại showroom Đồng Nai Ford.",
  },
};

export default function PriceListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
