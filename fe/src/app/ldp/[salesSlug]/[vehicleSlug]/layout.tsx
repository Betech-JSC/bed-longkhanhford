import { ldpAPI } from "@/lib/api";
import { headers } from "next/headers";
import { resolveImageUrl as resolveFileUrl } from "@/lib/site-assets";
import { formatPersonName } from "@/lib/formatters";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    salesSlug: string;
    vehicleSlug: string;
  }>;
};

function getCanonicalUrl(host: string, salesSlug: string, vehicleSlug: string, seoCanonical?: string): string {
  if (seoCanonical) {
    return seoCanonical.startsWith("http") ? seoCanonical : `https://${host}${seoCanonical}`;
  }

  const systemDomains = ["longkhanhford.com.vn", "cms.longkhanhford.com.vn", "localhost", "127.0.0.1"];
  const cleanHost = host.split(":")[0];
  const isSystemDomain = systemDomains.some(d => cleanHost === d || cleanHost.endsWith(d));

  if (!isSystemDomain) {
    // Đối với tên miền vệ tinh của Sale, URL hiển thị sạch là domain.com/vehicle-slug
    return `https://${cleanHost}/${vehicleSlug}`;
  }

  // Đối với web hãng chính, URL hiển thị là longkhanhford.com.vn/ldp/sales-slug/vehicle-slug
  return `https://longkhanhford.com.vn/ldp/${salesSlug}/${vehicleSlug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ salesSlug: string; vehicleSlug: string }> }) {
  try {
    const { salesSlug, vehicleSlug } = await params;
    const res = await ldpAPI.getBySlug(salesSlug, vehicleSlug).catch(() => null);
    const ldp = res?.data;

    if (!ldp) return {};

    const headersList = await headers();
    const host = headersList.get("host") || "longkhanhford.com.vn";
    const canonicalUrl = getCanonicalUrl(host, salesSlug, vehicleSlug, ldp.seo?.canonical);

    const consultantName = formatPersonName(ldp.sales_consultant?.name);
    const title = ldp.seo?.meta_title || `${ldp.title} - Chuyên viên kinh doanh ${consultantName}`;
    const description = ldp.seo?.meta_description || `Landing Page giới thiệu xe Ford và ưu đãi đặc quyền từ chuyên viên kinh doanh ${consultantName} tại Long Khánh Ford.`;
    const keywords = ldp.seo?.meta_keywords || "";

    const robotsStr = ldp.seo?.meta_robots || "index, follow";
    const noIndex = robotsStr.includes("noindex");
    const noFollow = robotsStr.includes("nofollow");

    const rawImage = ldp.seo?.image || ldp.vehicle?.image_url || ldp.vehicle?.image || ldp.sales_consultant?.avatar;
    const resolvedImageUrl = resolveFileUrl(rawImage);

    return {
      title,
      description,
      keywords,
      robots: {
        index: !noIndex,
        follow: !noFollow,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: resolvedImageUrl ? [{ url: resolvedImageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for LDP layout:", error);
    return {};
  }
}

export default async function LdpLayout({
  children,
  params,
}: LayoutProps) {
  const { salesSlug, vehicleSlug } = await params;
  const res = await ldpAPI.getBySlug(salesSlug, vehicleSlug).catch(() => null);
  const ldp = res?.data;

  if (!ldp) return <>{children}</>;

  const headersList = await headers();
  const host = headersList.get("host") || "longkhanhford.com.vn";
  const canonicalUrl = getCanonicalUrl(host, salesSlug, vehicleSlug, ldp.seo?.canonical);
  
  const consultantName = formatPersonName(ldp.sales_consultant?.name);
  const title = ldp.seo?.meta_title || `${ldp.title} - Chuyên viên kinh doanh ${consultantName}`;
  const description = ldp.seo?.meta_description || `Landing Page giới thiệu xe Ford và ưu đãi đặc quyền từ chuyên viên kinh doanh ${consultantName} tại Long Khánh Ford.`;

  const hostUrl = `https://${host.split(":")[0]}`;

  const autoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "@id": `${canonicalUrl}/#webpage`,
        "url": canonicalUrl,
        "name": title,
        "description": description
      },
      ldp.vehicle ? {
        "@type": "Product",
        "@id": `${canonicalUrl}/#product`,
        "name": ldp.vehicle.title,
        "image": resolveFileUrl(ldp.vehicle.image_url || ldp.vehicle.image) || resolveFileUrl(ldp.seo?.image),
        "description": ldp.vehicle.description || description,
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "VND",
          "price": ldp.vehicle.price || "0",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "AutoDealer",
            "name": "Long Khánh Ford",
            "url": "https://longkhanhford.com.vn"
          }
        }
      } : null,
      ldp.sales_consultant ? {
        "@type": "Person",
        "@id": `${canonicalUrl}/#sales-consultant`,
        "name": formatPersonName(ldp.sales_consultant.name),
        "jobTitle": "Chuyên viên kinh doanh",
        "telephone": ldp.sales_consultant.phone,
        "image": ldp.sales_consultant.avatar_url,
        "worksFor": {
          "@type": "AutoDealer",
          "name": "Long Khánh Ford",
          "url": "https://longkhanhford.com.vn"
        }
      } : null
    ].filter(Boolean)
  };

  const customSchema = ldp.seo?.seo_schemas;
  let customSchemaHtml = null;
  if (customSchema) {
    if (customSchema.trim().startsWith("<script")) {
      customSchemaHtml = customSchema;
    } else {
      try {
        JSON.parse(customSchema);
        customSchemaHtml = `<script type="application/ld+json">${customSchema}</script>`;
      } catch (e) {
        customSchemaHtml = customSchema;
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoSchema) }}
      />
      {customSchemaHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: customSchemaHtml }}
          style={{ display: "none" }}
        />
      )}
      {children}
    </>
  );
}
