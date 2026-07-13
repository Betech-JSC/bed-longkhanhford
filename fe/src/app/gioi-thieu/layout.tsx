import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu về Long Khánh Ford | Đại lý ủy quyền Ford Việt Nam",
  description: "Tìm hiểu lịch sử hình thành, tầm nhìn sứ mệnh, cơ sở vật chất hiện đại và cơ hội tuyển dụng nghề nghiệp hấp dẫn tại Long Khánh Ford.",
  alternates: {
    canonical: "/gioi-thieu",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
