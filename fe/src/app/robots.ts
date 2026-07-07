import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dongnaiford.com.vn";
  const isProduction = siteUrl.includes("dongnaiford.com.vn");

  if (isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // Môi trường Staging/Thử nghiệm: Chỉ cho phép công cụ test Screaming Frog crawl
  return {
    rules: [
      {
        userAgent: "Screaming Frog SEO Spider",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
