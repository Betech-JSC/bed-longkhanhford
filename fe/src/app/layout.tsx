import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { settingsAPI } from "@/lib/api";
// import AIChatWidget from "@/components/shared/AIChatWidget";
// import CompareDrawer from "@/components/shared/CompareDrawer";
import ClientWidgets from "@/components/shared/ClientWidgets";
import PageTransitionLoader from "@/components/shared/PageTransitionLoader";
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



const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Long Khánh Ford - Công Ty TNHH Dịch Vụ Thương Mại Ô Tô Tấn Phát",
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
        <link rel="preconnect" href="https://cms.dnf.betech-digital.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cms.dnf.betech-digital.com" />
        <link rel="preconnect" href="https://cms.longkhanhford.com.vn" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cms.longkhanhford.com.vn" />
        {/* Preload Critical Fonts & LCP Hero Banner */}
        <link rel="preload" href="/fonts/FordAntenna-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FordAntenna-Medium.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FordAntenna-Semibold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FordAntenna-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/images-dynamic/ford_ranger_banner.webp" as="image" type="image/webp" media="(min-width: 768px)" fetchPriority="high" />
        <link rel="preload" href="/images-dynamic/ford_ranger_banner.webp" as="image" type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Dynamic Head Inject Code from CMS */}
        {injectHead && (
          <>
            <noscript dangerouslySetInnerHTML={{ __html: injectHead }} />
            <script
              id="cms-head-inject"
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    try {
                      // Dùng JSON.stringify để escape an toàn tuyệt đối mọi ký tự đặc biệt, regex, xuống dòng
                      var raw = ${JSON.stringify(injectHead).replace(/</g, '\\u003c')};
                      var parser = new DOMParser();
                      var doc = parser.parseFromString(raw, 'text/html');
                      var nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));
                      nodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                          var s = document.createElement('script');
                          Array.from(node.attributes).forEach(function(a) { s.setAttribute(a.name, a.value); });
                          s.text = node.textContent || '';
                          document.head.appendChild(s);
                        } else if (node.nodeType === 1 && node.tagName !== 'NOSCRIPT') {
                          document.head.appendChild(document.importNode(node, true));
                        }
                      });
                    } catch (e) {
                      console.error('Lỗi khi chèn mã Head từ CMS:', e);
                    }
                  })();
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-light text-dark font-sans" suppressHydrationWarning>
        {/* Dynamic Body Start Inject Code from CMS */}
        {injectBodyStart && (
          <>
            <noscript dangerouslySetInnerHTML={{ __html: injectBodyStart }} />
            <script
              id="cms-body-start-inject"
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    try {
                      var raw = ${JSON.stringify(injectBodyStart).replace(/</g, '\\u003c')};
                      var parser = new DOMParser();
                      var doc = parser.parseFromString(raw, 'text/html');
                      var nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));
                      var target = document.getElementById('cms-body-start-inject');
                      nodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                          var s = document.createElement('script');
                          Array.from(node.attributes).forEach(function(a) { s.setAttribute(a.name, a.value); });
                          s.text = node.textContent || '';
                          document.body.insertBefore(s, target ? target.nextSibling : document.body.firstChild);
                        } else if (node.nodeType === 1 && node.tagName !== 'NOSCRIPT') {
                          document.body.insertBefore(document.importNode(node, true), target ? target.nextSibling : document.body.firstChild);
                        }
                      });
                    } catch (e) {
                      console.error('Lỗi khi chèn mã Body Start từ CMS:', e);
                    }
                  })();
                `,
              }}
            />
          </>
        )}
        <Navbar />
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>
        <Footer />
        {/* <AIChatWidget /> */}
        {/* <CompareDrawer /> */}
        <ClientWidgets />
        {/* Dynamic Body End Inject Code from CMS */}
        {injectBodyEnd && (
          <script
            id="cms-body-end-inject"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var raw = ${JSON.stringify(injectBodyEnd).replace(/</g, '\\u003c')};
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(raw, 'text/html');
                    var nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));
                    nodes.forEach(function(node) {
                      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        var s = document.createElement('script');
                        Array.from(node.attributes).forEach(function(a) { s.setAttribute(a.name, a.value); });
                        s.text = node.textContent || '';
                        document.body.appendChild(s);
                      } else if (node.nodeType === 1) {
                        document.body.appendChild(document.importNode(node, true));
                      }
                    });
                  } catch (e) {
                    console.error('Lỗi khi chèn mã Body End từ CMS:', e);
                  }
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
