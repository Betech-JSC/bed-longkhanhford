export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/ford_ranger_banner.png",
    "/images-dynamic/image-hero-3.jpg",
  ],
  showroomBg: "/showroom_bg.png",
  serviceBannerBg: "/assets/service-banner-bg.png",
  serviceBannerFg: "/assets/service-banner-fg.png",
  serviceBanners: {
    periodic: "/assets/service-periodic-banner.png",
    express: "/assets/service-express-banner.png",
    delivery: "/assets/service-delivery-banner.png",
    customerCare: "/assets/service-customer-banner.png",
    repair: "/assets/service-repair-banner.png",
    roadside: "/assets/service-roadside-banner.png",
    usedCars: "/assets/service-usedcars-banner.png",
    upgrade: "/assets/service-upgrade-banner.png",
  },
  serviceCustomerCare: "/service-support-customer.jpg",
  serviceMaintenance: "/service-fixed-car.jpg",
  serviceDelivery: "/service-delivery.png",
  bookingCar: "/assets/booking-car.png",
  qualityCareBadge: "/assets/quality-care-circle.png",
  expressFlow: "/assets/express-maintenance-flow.png",
  carPlaceholder: "/assets/mach-e-hero.png",
  ourStoryBanner: "/showroom_bg.png",
  testDriveBg: "/assets/test-drive-bg.png",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5398246330363!2d107.2311657!3d10.9088728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174ff5aeaf5554b%3A0x32451be987015d38!2sLong%20Kh%C3%A1nh%20Ford!5e0!3m2!1svi!2s!4v1721570000000!5m2!1svi!2s",
  googleMapsUrl: "https://maps.app.goo.gl/4Edf7CwNdArgsXu26",
} as const;

export const aboutAssets = {
  hero: "/showroom_bg.png",
  ourStory: "/images-dynamic/image-hero-1.jpg",
  history: "/images-dynamic/image-hero-2.jpg",
  facilities: "/service-fixed-car.jpg",
  visionGallery: [
    "/assets/img-gradient-1.png",
    "/assets/img-gradient-2.png",
    "/assets/img-gradient-3.png",
    "/assets/img-gradient.png",
  ],
} as const;

export const popularVehicleImages: Record<string, string> = {
  "ford-territory": "/assets/territory-hero.png",
  "ford-everest": "/assets/everest_platinum.png",
  "new-mustang-mach-e": "/assets/mach-e-hero.png",
  "ford-mustang-mach-e": "/assets/mach-e-hero.png",
  "ford-ranger": "/assets/ranger_wildtrak.png",
  "ford-ranger-2026": "/assets/ranger_wildtrak.png",
  "ford-ranger-raptor": "/assets/ranger_raptor.png",
  "ford-ranger-raptor-2026": "/assets/ranger_raptor.png",
  "ford-range-raptor-2026": "/assets/ranger_raptor.png",
  "ford-transit-2024": "/assets/transit_premium.png",
  "ford-transit": "/assets/transit_premium.png",
  "mustang-fastback": "/assets/mustang_dark_horse.png",
  "ford-mustang": "/assets/mustang_dark_horse.png",
};

export function getPopularVehicleImage(vehicleId: string, fallback?: string) {
  if (fallback && fallback !== "") return fallback;
  const key = vehicleId?.toLowerCase() || "";
  if (key.includes("raptor")) return popularVehicleImages["ford-ranger-raptor"];
  if (key.includes("ranger")) return popularVehicleImages["ford-ranger"];
  if (key.includes("everest")) return popularVehicleImages["ford-everest"];
  if (key.includes("territory")) return popularVehicleImages["ford-territory"];
  if (key.includes("transit")) return popularVehicleImages["ford-transit"];
  if (key.includes("mach-e") || key.includes("mustang")) return popularVehicleImages["ford-mustang"];

  return popularVehicleImages[vehicleId] ?? siteAssets.carPlaceholder;
}

export const imageFallbackSvg = "/images/ford_placeholder.png";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (!target.dataset.failed) {
    target.dataset.failed = "true";
    target.srcset = "";
    target.src = siteAssets.carPlaceholder;
  }
};

export const resolveImageUrl = (img: string | { url?: string; path?: string; static_url?: string } | null | undefined): string => {
  if (!img) return "";
  let path = "";
  if (typeof img === "string") {
    path = img.trim();
  } else if (typeof img === "object") {
    path = img.url || img.path || img.static_url || "";
  }
  if (!path) return "";

  // 1. Data URLs
  if (path.startsWith("data:")) {
    return path;
  }

  // 2. Check if path is a known frontend local static asset in Next.js /public/ directory
  const cleanPathLower = path.toLowerCase();
  
  // Direct matches for local frontend vehicle & static assets
  if (cleanPathLower.includes("territory-hero") || cleanPathLower.includes("territory_hero")) {
    return "/assets/territory-hero.png";
  }
  if (cleanPathLower.includes("everest_platinum") || cleanPathLower.includes("everest-platinum")) {
    return "/assets/everest_platinum.png";
  }
  if (cleanPathLower.includes("ranger_wildtrak") || cleanPathLower.includes("ranger-wildtrak")) {
    return "/assets/ranger_wildtrak.png";
  }
  if (cleanPathLower.includes("ranger_raptor") || cleanPathLower.includes("ranger-raptor")) {
    return "/assets/ranger_raptor.png";
  }
  if (cleanPathLower.includes("transit_premium") || cleanPathLower.includes("transit-premium")) {
    return "/assets/transit_premium.png";
  }
  if (cleanPathLower.includes("mach-e-hero") || cleanPathLower.includes("mach_e_hero")) {
    return "/assets/mach-e-hero.png";
  }
  if (cleanPathLower.includes("mustang_dark_horse") || cleanPathLower.includes("mustang-dark-horse")) {
    return "/assets/mustang_dark_horse.png";
  }

  if (
    cleanPathLower.startsWith("/assets/") ||
    cleanPathLower.startsWith("assets/") ||
    cleanPathLower.startsWith("/images/") ||
    cleanPathLower.startsWith("images/") ||
    cleanPathLower.startsWith("/images-dynamic/") ||
    cleanPathLower.startsWith("images-dynamic/") ||
    cleanPathLower.startsWith("/showroom_bg") ||
    cleanPathLower.startsWith("/service-")
  ) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  // 3. Foreign absolute URLs (e.g. Unsplash, Google maps, third-party CDN)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const parsed = new URL(path);
      const host = parsed.hostname.toLowerCase();
      const isCmsHost = host.includes("longkhanhford") || host.includes("betech") || host === "localhost" || host === "127.0.0.1";
      
      if (!isCmsHost) {
        return path;
      }
      
      // If it's from CMS host, extract pathname
      path = parsed.pathname + parsed.search;
    } catch {
      // keep path as is
    }
  }

  // 4. CMS Base Domain
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cms.longkhanhford.betech-digital.com/api";
  let baseDomain = apiUrl.replace(/\/api\/?$/, "");

  if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
    if (window.location.hostname.includes("longkhanhford")) {
      baseDomain = "https://cms.longkhanhford.betech-digital.com";
    }
  }

  let clean = path;
  clean = clean.replace(/^([a-zA-Z0-9.-]+\.(com|vn|net|org|digital|app|dev)(:\d+)?)\/?/gi, "");
  clean = clean.replace(/^(\/?static)+/gi, "/static");
  clean = clean.replace(/^(\/?uploads)+/gi, "/uploads");
  clean = clean.replace(/^(\/?storage)+/gi, "/storage");

  if (clean.startsWith("/static/") || clean.startsWith("/uploads/") || clean.startsWith("/storage/")) {
    return `${baseDomain}${clean}`;
  }
  if (clean.startsWith("static/") || clean.startsWith("uploads/") || clean.startsWith("storage/")) {
    return `${baseDomain}/${clean}`;
  }

  const cleanPath = clean.replace(/^\//, "");
  return `${baseDomain}/static/${cleanPath}`;
};
