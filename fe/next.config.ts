import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 0,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ford.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.dnf.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.longkhanhford.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "client.longkhanhford.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.longkhanhford.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.longkhanhford.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "longkhanhford.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Chuyển hướng 301 dịch vụ WordPress cũ duy nhất sang cấu trúc mới
      {
        source: "/nhan-va-giao-xe-tan-noi",
        destination: "/dich-vu/nhan-va-giao-xe-tan-noi",
        permanent: true,
      },
      {
        source: "/accessories",
        destination: "/phu-kien",
        permanent: true,
      },
      {
        source: "/so-sanh",
        destination: "/cong-cu/so-sanh-xe",
        permanent: true,
      },
      {
        source: "/so-sanh-xe",
        destination: "/cong-cu/so-sanh-xe",
        permanent: true,
      },
      // --- CHUYỂN HƯỚNG URL SẢN PHẨM XE CÓ CHỨA /SAN-PHAM SANG URL NGẮN ---
      // Redirects từ slug xe cũ không có tiền tố "ford-" sang có tiền tố "ford-"
      {
        source: "/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/:slug(everest|territory|explorer)/:subpath(du-toan-lan-banh|phu-kien|so-sanh|tinh-nang)",
        destination: "/ford-:slug/:subpath",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)/:subpath(du-toan-lan-banh|phu-kien|so-sanh|tinh-nang)",
        destination: "/ford-:slug/:subpath",
        permanent: true,
      },
      // Redirects cho transit alias cũ
      {
        source: "/ford-transit-2024",
        destination: "/ford-transit",
        permanent: true,
      },
      {
        source: "/ford-transit-2024/:subpath*",
        destination: "/ford-transit/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024",
        destination: "/ford-transit",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024/:subpath*",
        destination: "/ford-transit/:subpath*",
        permanent: true,
      },
      // Redirects cho mustang alias cũ
      {
        source: "/mustang-fastback",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/mustang-fastback/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/ford-mustang",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/ford-mustang/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      // Tự động Redirect 301 từ URL cũ có .html sang URL mới không có .html
      {
        source: "/:slug.html",
        destination: "/:slug",
        permanent: true,
      },
      // Tự động Redirect 301 từ /category/ sang chuyên mục tiếng Việt /chuyen-muc/
      {
        source: "/category/:slug",
        destination: "/chuyen-muc/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Chuyển hướng nội bộ đường dẫn /khuyen-mai sang trang /tin-tuc
      {
        source: "/khuyen-mai",
        destination: "/tin-tuc",
      },
      {
        source: "/khuyen-mai/:slug*",
        destination: "/tin-tuc/:slug*",
      },
      // Giữ nguyên cấu trúc danh mục bài viết từ WordPress cũ
      {
        source: "/chuyen-muc/:slug",
        destination: "/tin-tuc",
      },
      // Proxy CMS images to inject Cache-Control headers
      {
        source: "/cms-storage/:path*",
        destination: "https://cms.longkhanhford.com.vn/storage/:path*",
      },
      {
        source: "/cms-uploads/:path*",
        destination: "https://cms.longkhanhford.com.vn/uploads/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images-dynamic/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/cms-storage/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/cms-uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
