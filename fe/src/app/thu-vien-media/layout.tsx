import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư viện Media & Hình ảnh Xe Ford | Long Khánh Ford",
  description:
    "Bộ sưu tập hình ảnh, video đánh giá trải nghiệm thực tế các dòng xe Ford Everest, Ranger, Territory, Transit tại đại lý Long Khánh Ford.",
  keywords: [
    "hình ảnh xe Ford",
    "video đánh giá xe Ford",
    "thư viện media Long Khánh Ford",
  ],
  alternates: {
    canonical: "/thu-vien-media",
  },
  openGraph: {
    title: "Thư viện Media & Hình ảnh Xe Ford | Long Khánh Ford",
    description:
      "Khám phá bộ sưu tập hình ảnh và video chất lượng cao các dòng xe Ford chính hãng.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function MediaLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
