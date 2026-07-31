import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://longkhanhford.com.vn";
  const isProduction =
    process.env.NODE_ENV === "production" ||
    siteUrl.includes("longkhanhford.com.vn");

  if (isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/api/",
            "/tim-kiem",
            "/khao-sat-dich-vu",
            "/khao-sat-lai-thu",
            "/test-api",
          ],
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
