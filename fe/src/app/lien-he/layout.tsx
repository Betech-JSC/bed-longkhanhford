import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ Long Khánh Ford | Hotline: 0812 86 86 22",
  description: "Địa chỉ showroom, số điện thoại Hotline kinh doanh, hỗ trợ dịch vụ & cứu hộ 24/7 của Đại lý ủy quyền Long Khánh Ford.",
  alternates: {
    canonical: "/lien-he",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
