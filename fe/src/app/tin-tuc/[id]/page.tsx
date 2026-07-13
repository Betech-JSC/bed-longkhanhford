import { notFound, redirect } from "next/navigation";
import { postsAPI } from "@/lib/api";
import ArticleDetailClient from "@/components/news/ArticleDetailClient";

type Props = {
  params: Promise<{
    id: string; // The URL slug of the post
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const res = await postsAPI.getBySlug(id).catch((err) => {
      console.error("DIAGNOSTIC metadata: postsAPI.getBySlug failed:", err);
      return null;
    }) as any;
    const article = res?.post;

    if (!article) return {};

    const title = article.seo_title || `${article.title} | Tin tức | Long Khánh Ford`;
    const description = article.seo_description || article.description || "";
    const imageUrl = article.seo_image || article.image?.url || "";

    return {
      title,
      description,
      keywords: article.seo_keywords || "",
      alternates: {
        canonical: `/${id}`,
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
    console.error("Error generating metadata for news page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  let article = null;
  let relatedArticles: any[] = [];

  try {
    const res = await postsAPI.getBySlug(id).catch((err) => {
      console.error("DIAGNOSTIC: postsAPI.getBySlug failed:", err);
      return null;
    }) as any;
    if (res) {
      if (res.redirect_to) {
        redirect(`/${res.redirect_to}`);
      }
      if (res.post) {
        article = res.post;
        relatedArticles = res.related_posts || [];
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error fetching article in server page:", error);
  }

  if (!article) {
    notFound();
  }

  return (
    <ArticleDetailClient 
      article={article} 
      relatedArticles={relatedArticles} 
    />
  );
}
