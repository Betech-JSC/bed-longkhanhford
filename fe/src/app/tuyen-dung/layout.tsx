import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuyển dụng | Ford Đồng Nai — Cơ hội nghề nghiệp",
  description:
    "Tuyển dụng tại Ford Đồng Nai. Tham gia đội ngũ đại lý ủy quyền Ford uy tín nhất tại Đồng Nai với nhiều vị trí hấp dẫn.",
  openGraph: {
    title: "Tuyển dụng | Ford Đồng Nai",
    description:
      "Tham gia đội ngũ Ford Đồng Nai — môi trường làm việc chuyên nghiệp, phúc lợi hấp dẫn.",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
