import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

// Primary service subpages
const staticServicePages = [
  "/dich-vu",
  "/dich-vu/bao-duong-dinh-ky",
  "/dich-vu/bao-duong-nhanh",
  "/dich-vu/giao-nhan-xe-tan-noi",
  "/dich-vu/cham-soc-khach-hang",
  "/dich-vu/dich-vu-sua-chua",
  "/dich-vu/dich-vu-cuu-ho-247",
  "/dich-vu/dich-vu-xe-da-qua-su-dung",
  "/dich-vu/dich-vu-nang-cap-xe",
  "/dich-vu/ford-sync",
  "/dich-vu/ung-dung-ford",
  "/dich-vu/ford-ensure",
  "/dich-vu/intelligent-oil-life-monitor",
];

// Default static pages to prevent empty sitemap in case of API failure
const defaultStaticPages: MetadataRoute.Sitemap = [
  {
    url: "https://longkhanhford.com.vn",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: "https://longkhanhford.com.vn/san-pham",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "https://longkhanhford.com.vn/tin-tuc",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "https://longkhanhford.com.vn/bang-gia",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "https://longkhanhford.com.vn/phu-kien",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "https://longkhanhford.com.vn/xe-da-qua-su-dung",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: "https://longkhanhford.com.vn/gioi-thieu",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://longkhanhford.com.vn/lien-he",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://longkhanhford.com.vn/dang-ky-lai-thu",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "https://longkhanhford.com.vn/tuyen-dung",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "https://longkhanhford.com.vn/thu-vien-media",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: "https://longkhanhford.com.vn/cong-cu/so-sanh-xe",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "https://longkhanhford.com.vn/cong-cu/uoc-tinh-lan-banh",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "https://longkhanhford.com.vn/cong-cu/uoc-tinh-tra-gop",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  ...staticServicePages.map((path) => ({
    url: `https://longkhanhford.com.vn${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/dich-vu" ? 0.9 : 0.8,
  })),
];

// Trigger rebuild to clear sitemap cache and load correct staging URLs
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.warn("NEXT_PUBLIC_API_URL is not set. Sitemap will default to static fallback pages.");
    return defaultStaticPages;
  }

  try {
    const res = await fetch(`${apiUrl}/sitemap`, {
      cache: "no-store",
      headers: {
        Accept: "application/xml, text/xml, */*",
      },
    });

    if (!res.ok) {
      console.error(`Sitemap fetch failed with status: ${res.status}`);
      return defaultStaticPages;
    }

    const xml = await res.text();
    const urls: MetadataRoute.Sitemap = [];
    const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);

    for (const match of urlMatches) {
      const content = match[1];
      const locMatch = content.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = content.match(/<lastmod>(.*?)<\/lastmod>/);
      const changefreqMatch = content.match(/<changefreq>(.*?)<\/changefreq>/);
      const priorityMatch = content.match(/<priority>(.*?)<\/priority>/);

      if (locMatch) {
        let locUrl = locMatch[1];
        const siteUrl = "https://longkhanhford.com.vn";

        try {
          const urlObj = new URL(locUrl);
          locUrl = `${siteUrl}${urlObj.pathname}${urlObj.search}`;
        } catch {
          locUrl = locUrl.replace(/https?:\/\/[^\/]+/, siteUrl);
        }

        urls.push({
          url: locUrl,
          lastModified: lastmodMatch ? new Date(lastmodMatch[1]) : undefined,
          changeFrequency: changefreqMatch ? (changefreqMatch[1] as any) : "daily",
          priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.8,
        });
      }
    }

    // Ensure all core service subpages are present in the final sitemap
    for (const servicePath of staticServicePages) {
      const fullUrl = `https://longkhanhford.com.vn${servicePath}`;
      if (!urls.some((u) => u.url === fullUrl || u.url.endsWith(servicePath))) {
        urls.push({
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: servicePath === "/dich-vu" ? 0.9 : 0.8,
        });
      }
    }

    return urls;
  } catch (error) {
    console.error("Failed to fetch backend sitemap, using static fallbacks:", error);
    return defaultStaticPages;
  }
}
