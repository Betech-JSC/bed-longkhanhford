import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký lái thử xe Ford | Long Khánh Ford",
  description: "Đăng ký lái thử các dòng xe Ford Everest, Ranger, Territory, Explorer... tại Long Khánh Ford để trải nghiệm thực tế công nghệ an toàn và cảm giác lái.",
  alternates: {
    canonical: "/dang-ky-lai-thu",
  },
};

export default function TestDriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
