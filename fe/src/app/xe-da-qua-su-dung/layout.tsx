import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Ford đã qua sử dụng chính hãng (Assured) | Long Khánh Ford",
  description:
    "Mua bán xe Ford lướt, Ford đã qua sử dụng được kiểm tra 167 điểm chất lượng tiêu chuẩn Ford Assured. Bảo hành chính hãng, nguồn gốc rõ ràng, hỗ trợ trả góp.",
  keywords: [
    "xe Ford cũ",
    "xe Ford lướt Long Khánh",
    "Ford Everest cũ",
    "Ford Ranger cũ",
    "Ford Assured Long Khánh",
  ],
  alternates: {
    canonical: "/xe-da-qua-su-dung",
  },
  openGraph: {
    title: "Xe Ford đã qua sử dụng chính hãng (Assured) | Long Khánh Ford",
    description:
      "Mua bán xe Ford đã qua sử dụng kiểm định 167 điểm kỹ thuật tiêu chuẩn Ford Assured.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function UsedVehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
