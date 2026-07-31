import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khảo sát ý kiến dịch vụ | Long Khánh Ford",
  description: "Khảo sát đánh giá mức độ hài lòng dịch vụ của khách hàng tại Long Khánh Ford.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ServiceSurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
