import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
        hostname: "cms.dongnaiford.com.vn",
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
      // --- CHUYỂN HƯỚNG URL SẢN PHẨM XE CÓ CHỨA /SAN-PHAM SANG URL NGẮN ---
      // Redirects từ slug xe cũ không có tiền tố "ford-" sang có tiền tố "ford-"
      {
        source: "/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/:slug(everest|territory|explorer)/:subpath*",
        destination: "/ford-:slug/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)/:subpath*",
        destination: "/ford-:slug/:subpath*",
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
      // Chuyển hướng chuẩn từ /san-pham/[slug-dung] sang /[slug-dung]
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer|ford-transit|ford-mustang-mach-e)",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer|ford-transit|ford-mustang-mach-e)/:subpath*",
        destination: "/:slug/:subpath*",
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
      // Chuyển hướng nội bộ cho các dòng xe Ford (rút ngắn URL)
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit|ford-mustang-mach-e|ford-explorer)",
        destination: "/san-pham/:slug",
      },
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit|ford-mustang-mach-e|ford-explorer)/:subpath*",
        destination: "/san-pham/:slug/:subpath*",
      },
      // Chuyển hướng nội bộ đường dẫn /khuyen-mai sang trang /tin-tuc
      {
        source: "/khuyen-mai",
        destination: "/tin-tuc",
      },
      // Giữ nguyên cấu trúc danh mục bài viết từ WordPress cũ
      {
        source: "/chuyen-muc/:slug",
        destination: "/tin-tuc",
      },
      // Định tuyến chung cho các bài viết không có /tin-tuc (loại trừ các đường dẫn tĩnh hệ thống)
      {
        source: "/:slug((?!tin-tuc$|khuyen-mai$|chuyen-muc$|category$|san-pham$|admin$|api$|lien-he$|gioi-thieu$|bang-gia$|dang-ky-lai-thu$|tim-kiem$|thu-vien-media$|xe-da-qua-su-dung$|phu-kien$|tuyen-dung$|dich-vu$)[^/]+)",
        destination: "/tin-tuc/:slug",
      },
    ];
  },
};

export default nextConfig;
