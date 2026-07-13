import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuyển dụng | Ford Long Khánh — Cơ hội nghề nghiệp",
  description:
    "Tuyển dụng tại Ford Long Khánh. Tham gia đội ngũ đại lý ủy quyền Ford uy tín nhất tại Đồng Nai với nhiều vị trí hấp dẫn.",
  openGraph: {
    title: "Tuyển dụng | Ford Long Khánh",
    description:
      "Tham gia đội ngũ Ford Long Khánh — môi trường làm việc chuyên nghiệp, phúc lợi hấp dẫn.",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
