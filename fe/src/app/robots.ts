import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://longkhanhford.com.vn";

  let hostname = "";
  try {
    hostname = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname.toLowerCase();
  } catch {
    hostname = siteUrl.toLowerCase();
  }

  // Chỉ cho phép index khi hostname là longkhanhford.com.vn hoặc www.longkhanhford.com.vn
  // và tuyệt đối không thuộc domain staging/thử nghiệm (betech-digital.com hoặc chứa 'staging')
  const isProduction =
    (hostname === "longkhanhford.com.vn" || hostname === "www.longkhanhford.com.vn") &&
    !siteUrl.includes("betech-digital.com") &&
    !siteUrl.includes("staging");

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
      sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
    };
  }

  // Môi trường Staging hoặc domain lạ: Khóa cứng bot tìm kiếm và không xuất sitemap
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
