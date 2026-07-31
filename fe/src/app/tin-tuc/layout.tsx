import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện | Long Khánh Ford",
  description:
    "Cập nhật các thông tin tin tức xe Ford mới nhất, sự kiện đại lý, chương trình khuyến mãi ưu đãi và kinh nghiệm chăm sóc xe từ Long Khánh Ford.",
  keywords: [
    "tin tức xe Ford",
    "khuyến mãi Long Khánh Ford",
    "sự kiện Ford Đồng Nai",
    "kinh nghiệm lái xe Ford",
  ],
  alternates: {
    canonical: "/tin-tuc",
  },
  openGraph: {
    title: "Tin tức & Sự kiện | Long Khánh Ford",
    description:
      "Cập nhật tin tức xe Ford mới nhất và các chương trình ưu đãi đặc biệt tại đại lý Long Khánh Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
