import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

// Default static pages to prevent empty sitemap in case of API failure
const defaultStaticPages: MetadataRoute.Sitemap = [
  {
    url: "https://longkhanhford.com.vn",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
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
    url: "https://longkhanhford.com.vn/bang-gia",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "https://longkhanhford.com.vn/dang-ky-lai-thu",
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
    url: "https://longkhanhford.com.vn/dich-vu",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
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
        "Accept": "application/xml, text/xml, */*"
      }
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
    
    // Add static services landing page explicitly if not present
    if (!urls.some(u => u.url.endsWith("/dich-vu"))) {
      urls.push({
        url: "https://longkhanhford.com.vn/dich-vu",
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
    
    return urls;
  } catch (error) {
    console.error("Failed to fetch backend sitemap, using static fallbacks:", error);
    return defaultStaticPages;
  }
}
