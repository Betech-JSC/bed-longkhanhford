import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ldpAPI, postsAPI } from "@/lib/api";
import { formatPersonName } from "@/lib/formatters";
import LdpArticleDetailClient from "@/components/vehicle/LdpArticleDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    salesSlug: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { salesSlug, slug } = await params;
    const [ldpRes, postRes] = await Promise.all([
      ldpAPI.getBySalesSlug(salesSlug).catch(() => null),
      postsAPI.getBySlug(slug).catch(() => null) as Promise<any>,
    ]);

    const article = postRes?.post;
    const ldp = ldpRes?.data;
    const consultant = ldp?.sales_consultant;
    const consultantName = consultant?.name ? formatPersonName(consultant.name) : "Chuyên Viên Tư Vấn";

    if (!article) return {};

    const title = `${article.title} | ${consultantName} - Long Khánh Ford`;
    const description =
      article.seo_description ||
      article.description ||
      `Chương trình khuyến mãi và ưu đãi đặc quyền từ chuyên viên tư vấn ${consultantName} tại Long Khánh Ford.`;
    const imageUrl = article.seo_image || article.image?.url || "";

    return {
      title,
      description,
      keywords: article.seo_keywords || `Khuyến mãi Ford, ${consultantName}, Long Khánh Ford`,
      alternates: {
        canonical: `/ldp/${salesSlug}/tin-tuc/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        locale: "vi_VN",
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for LDP article page:", error);
    return {};
  }
}

export default async function LdpArticlePage({ params }: Props) {
  const { salesSlug, slug } = await params;

  let ldpData: any = null;
  let article: any = null;
  let relatedArticles: any[] = [];

  try {
    const [ldpRes, postRes] = await Promise.all([
      ldpAPI.getBySalesSlug(salesSlug).catch((err) => {
        console.error("DIAGNOSTIC: ldpAPI.getBySalesSlug failed:", err);
        return null;
      }),
      postsAPI.getBySlug(slug).catch((err) => {
        console.error("DIAGNOSTIC: postsAPI.getBySlug failed:", err);
        return null;
      }) as Promise<any>,
    ]);

    if (ldpRes?.data) {
      ldpData = ldpRes.data;
    }

    if (postRes) {
      if (postRes.redirect_to) {
        redirect(`/ldp/${salesSlug}/tin-tuc/${postRes.redirect_to}`);
      }
      if (postRes.post) {
        article = postRes.post;
        relatedArticles = postRes.related_posts || [];
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error fetching LDP article data:", error);
  }

  // Nếu không tìm thấy Cố vấn bán hàng hoặc không tìm thấy bài viết -> 404
  if (!ldpData?.sales_consultant || !article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://longkhanhford.com.vn";
  const consultantName = formatPersonName(ldpData.sales_consultant.name);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description || article.seo_description || "",
    image: article.image?.url ? [article.image.url] : [],
    datePublished: article.published_at || article.created_at,
    author: {
      "@type": "Person",
      name: consultantName,
      jobTitle: "Chuyên viên tư vấn",
      worksFor: {
        "@type": "AutoDealer",
        name: "Long Khánh Ford",
        url: siteUrl,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Long Khánh Ford",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <LdpArticleDetailClient
        article={article}
        relatedArticles={relatedArticles}
        salesConsultant={ldpData.sales_consultant}
        allVehicles={ldpData.vehicles || []}
        landingPageId={ldpData.id}
        salesEmail={ldpData.sales_email || ldpData.sales_consultant?.email}
        salesSlug={salesSlug}
      />
    </>
  );
}

