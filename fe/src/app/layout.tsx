import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { settingsAPI } from "@/lib/api";
// import AIChatWidget from "@/components/shared/AIChatWidget";
// import CompareDrawer from "@/components/shared/CompareDrawer";
import QuickAccessToolbar from "@/components/shared/QuickAccessToolbar";
import PageTransitionLoader from "@/components/shared/PageTransitionLoader";
import CookieConsent from "@/components/shared/CookieConsent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://longkhanhford.com.vn"),
  title: "Long Khánh Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai",
  description: "Đại lý ủy quyền chính thức của Ford Việt Nam tại Long Khánh, Đồng Nai. Cung cấp các dòng xe Ford Everest, Ford Ranger, Ford Territory chính hãng, bảo dưỡng nhanh, hỗ trợ trả góp 80%.",
  keywords: ["Ford Long Khánh", "Long Khánh Ford", "đại lý Ford Long Khánh", "mua xe Ford Long Khánh", "Ford Everest", "Ford Ranger", "Ford Territory"],
  authors: [{ name: "Long Khánh Ford" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Long Khánh Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai",
    description: "Đại lý ủy quyền chính thức của Ford Việt Nam tại Long Khánh, Đồng Nai. Cung cấp các dòng xe Ford Everest, Ranger, Territory, Raptor chính hãng giá ưu đãi.",
    type: "website",
    locale: "vi_VN",
  },
};

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Ford Long Khánh (Đại lý Tấn Phát Đạt)",
  alternateName: "Long Khánh Ford",
  description:
    "Đại lý ủy quyền chính thức của Ford Việt Nam tại Long Khánh, Đồng Nai. Cung cấp các dòng xe Ford chính hãng, dịch vụ bảo dưỡng, sửa chữa, phụ kiện.",
  url: "https://longkhanhford.com.vn",
  telephone: "+84812868622",
  email: "marketing@longkhanhford.com.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn",
    addressLocality: "Thành phố Long Khánh",
    addressRegion: "Đồng Nai",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.9381,
    longitude: 107.2415,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "07:30",
    closes: "17:30",
  },
  brand: {
    "@type": "Brand",
    name: "Ford",
  },
  sameAs: [
    "https://www.facebook.com/longkhanhfordofficial/",
    "https://www.tiktok.com/@longkhanhford.official",
    "https://youtube.com/@longkhanhford",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let injectHead = "";
  let injectBodyStart = "";
  let injectBodyEnd = "";

  try {
    const settingsRes = await settingsAPI.getGeneral();
    if (settingsRes && settingsRes.success && settingsRes.data) {
      injectHead = settingsRes.data.inject_head || "";
      injectBodyStart = settingsRes.data.inject_body_start || "";
      injectBodyEnd = settingsRes.data.inject_body_end || "";
    }
  } catch (error) {
    console.error("Failed to fetch general layout settings:", error);
  }

  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Dynamic Head Inject Code from CMS */}
        {injectHead && (
          <script
            id="cms-head-inject"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const temp = document.createElement('div');
                  temp.innerHTML = \`${injectHead.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\/script>/gi, '<\\/script>')}\`;
                  Array.from(temp.childNodes).forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                      const script = document.createElement('script');
                      Array.from(node.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
                      script.innerHTML = node.innerHTML;
                      document.head.appendChild(script);
                    } else if (node.nodeType === 1 || node.nodeType === 3 || node.nodeType === 8) {
                      document.head.appendChild(node.cloneNode(true));
                    }
                  });
                })();
              `
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-light text-dark font-sans" suppressHydrationWarning>
        {/* Dynamic Body Start Inject Code from CMS */}
        {injectBodyStart && (
          <div
            id="cms-body-start-inject"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: injectBodyStart }}
          />
        )}
        <Navbar />
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        {/* <AIChatWidget /> */}
        {/* <CompareDrawer /> */}
        <QuickAccessToolbar />
        <CookieConsent />
        {/* Dynamic Body End Inject Code from CMS */}
        {injectBodyEnd && (
          <div
            id="cms-body-end-inject"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: injectBodyEnd }}
          />
        )}
      </body>
    </html>
  );
}
