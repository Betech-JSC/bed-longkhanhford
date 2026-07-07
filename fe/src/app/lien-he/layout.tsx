import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ Đồng Nai Ford | Hotline: 0918 90 90 60",
  description: "Địa chỉ showroom, số điện thoại Hotline kinh doanh, hỗ trợ dịch vụ & cứu hộ 24/7 của Đại lý ủy quyền Đồng Nai Ford.",
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
