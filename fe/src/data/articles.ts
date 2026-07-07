export interface ArticleContentBlock {
  type: "paragraph" | "heading" | "image" | "list";
  value: string | string[];
}

export interface Article {
  id: string;
  title: string;
  category: "Xe Ford" | "Khuyến Mãi" | "Tin tức";
  date: string;
  image: string;
  content: string; // Short summary
  body: ArticleContentBlock[];
}

export const articles: Article[] = [];

export function getArticleById(id: string): Article | undefined {
  return articles.find((art) => art.id === id);
}

export function getArticlesByCategory(category: "Xe Ford" | "Khuyến Mãi" | "Tin tức"): Article[] {
  return articles.filter((art) => art.category === category);
}
