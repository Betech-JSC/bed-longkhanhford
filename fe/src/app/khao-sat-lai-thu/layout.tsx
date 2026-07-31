import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khảo sát ý kiến lái thử xe | Long Khánh Ford",
  description: "Khảo sát trải nghiệm lái thử các dòng xe Ford tại Long Khánh Ford.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TestDriveSurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
