import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm | Long Khánh Ford",
  description: "Trang kết quả tìm kiếm thông tin xe, bài viết, phụ kiện tại đại lý Long Khánh Ford.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
