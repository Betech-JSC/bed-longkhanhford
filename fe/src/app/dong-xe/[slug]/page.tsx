import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import ProductsPage from "../../san-pham/page";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const staticCategories = [
  { slug: "suv", title: "SUV" },
  { slug: "ban-tai", title: "Bán tải" },
  { slug: "thuong-mai", title: "Thương mại" },
];

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const res = await vehiclesAPI.getCategories().catch(() => null);
    const categories = res?.data || res || [];
    
    const matched = categories.find((c: any) => c.slug === slug) 
      || staticCategories.find((c: any) => c.slug === slug);

    const title = matched 
      ? `Các dòng xe Ford ${matched.title} | Long Khánh Ford`
      : `Các dòng xe Ford | Long Khánh Ford`;

    const description = matched
      ? `Khám phá danh sách các dòng xe Ford ${matched.title} thế hệ mới chính hãng tại Long Khánh Ford. Xem giá niêm yết, thông số kỹ thuật và nhận dự toán chi phí lăn bánh.`
      : `Khám phá danh sách các dòng xe Ford thế hệ mới chính hãng tại Long Khánh Ford.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/dong-xe/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for category page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  // Verify category exists
  const res = await vehiclesAPI.getCategories().catch(() => null);
  const categories = res?.data || res || [];
  const exists = categories.some((c: any) => c.slug === slug) 
    || staticCategories.some((c: any) => c.slug === slug);

  if (!exists) {
    notFound();
  }

  return <ProductsPage initialCategory={slug} />;
}
