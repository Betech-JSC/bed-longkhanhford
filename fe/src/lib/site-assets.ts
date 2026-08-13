export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/ford_ranger_banner.webp",
    "/images-dynamic/image-hero-3.webp",
  ],
  showroomBg: "/showroom_bg.webp",
  serviceBannerBg: "/assets/service-banner-bg.webp",
  serviceBannerFg: "/assets/service-banner-fg.webp",
  serviceBanners: {
    periodic: "/assets/service-periodic-banner.jpg",
    express: "/assets/service-express-banner.jpg",
    delivery: "/assets/service-delivery-banner.jpg",
    customerCare: "/assets/service-customer-banner.jpg",
    repair: "/assets/service-repair-banner.jpg",
    roadside: "/assets/service-roadside-banner.jpg",
    usedCars: "/assets/service-usedcars-banner.jpg",
    upgrade: "/assets/service-upgrade-banner.jpg",
  },
  serviceCustomerCare: "/service-support-customer.jpg",
  serviceMaintenance: "/service-fixed-car.jpg",
  serviceDelivery: "/service-delivery.webp",
  bookingCar: "/assets/booking-car.webp",
  qualityCareBadge: "/assets/quality-care-circle.jpg",
  expressFlow: "/assets/express-maintenance-flow.jpg",
  carPlaceholder: "/assets/mach-e-hero.webp",
  ourStoryBanner: "/showroom_bg.webp",
  testDriveBg: "/assets/test-drive-bg.webp",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5398246330363!2d107.2311657!3d10.9088728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174ff5aeaf5554b%3A0x32451be987015d38!2sLong%20Kh%C3%A1nh%20Ford!5e0!3m2!1svi!2s!4v1721570000000!5m2!1svi!2s",
  googleMapsUrl: "https://maps.app.goo.gl/4Edf7CwNdArgsXu26",
} as const;

export const aboutAssets = {
  hero: "/showroom_bg.webp",
  ourStory: "/images-dynamic/image-hero-1.jpg",
  history: "/images-dynamic/image-hero-2.webp",
  facilities: "/service-fixed-car.jpg",
  visionGallery: [
    "/assets/img-gradient-1.jpg",
    "/assets/img-gradient-2.webp",
    "/assets/img-gradient-3.webp",
    "/assets/img-gradient.webp",
  ],
} as const;

export const popularVehicleImages: Record<string, string> = {
  "ford-territory": "/assets/territory-hero.jpg",
  "ford-everest": "/assets/everest_platinum.jpg",
  "new-mustang-mach-e": "/assets/mach-e-hero.webp",
  "ford-mustang-mach-e": "/assets/mach-e-hero.webp",
  "ford-ranger": "/assets/ranger_wildtrak.jpg",
  "ford-ranger-2026": "/assets/ranger_wildtrak.jpg",
  "ford-ranger-raptor": "/assets/ranger_raptor.webp",
  "ford-ranger-raptor-2026": "/assets/ranger_raptor.webp",
  "ford-range-raptor-2026": "/assets/ranger_raptor.webp",
  "ford-transit-2024": "/assets/transit_premium.jpg",
  "ford-transit": "/assets/transit_premium.jpg",
  "mustang-fastback": "/assets/mustang_dark_horse.jpg",
  "ford-mustang": "/assets/mustang_dark_horse.jpg",
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

export const imageFallbackSvg = "/images/ford_placeholder.webp";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (!target.dataset.failed) {
    target.dataset.failed = "true";
    target.srcset = "";
    if (target.dataset.fallback) {
      target.src = target.dataset.fallback;
    } else {
      target.src = siteAssets.carPlaceholder;
    }
  }
};

export const resolveImageUrl = (img: string | { url?: string; path?: string; static_url?: string } | null | undefined): string => {
  const getBaseDomain = (): string => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
    }
    if (typeof window !== "undefined") {
      if (window.location.hostname.includes("longkhanhford")) {
        return "https://cms.longkhanhford.betech-digital.com";
      }
      return window.location.origin;
    }
    return "https://cms.longkhanhford.betech-digital.com";
  };
  const baseDomain = getBaseDomain();

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

  // 2. Local frontend public assets in Next.js /public/ directory
  if (
    path.startsWith("/assets/") ||
    path.startsWith("assets/") ||
    path.startsWith("/images/") ||
    path.startsWith("images/") ||
    path.startsWith("/images-dynamic/") ||
    path.startsWith("images-dynamic/") ||
    path.startsWith("/showroom_bg") ||
    path.startsWith("/service-")
  ) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  // 3. Absolute URLs (e.g. https://cms.longkhanhford.betech-digital.com/... or third-party URLs)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const parsed = new URL(path);
      const host = parsed.hostname.toLowerCase();
      const isCmsHost = host.includes("longkhanhford") || host.includes("betech") || host === "localhost" || host === "127.0.0.1";
      
      if (isCmsHost) {
        if (parsed.pathname.startsWith("/storage/")) {
          return `/cms-storage${parsed.pathname.replace(/^\/storage/, "")}`;
        }
        if (parsed.pathname.startsWith("/uploads/")) {
          return `/cms-uploads${parsed.pathname.replace(/^\/uploads/, "")}`;
        }
      }
      return path;
    } catch {
      // keep path as is
    }
  }

  let clean = path.replace(/^([a-zA-Z0-9.-]+\.(com|vn|net|org|digital|app|dev)(:\d+)?)\/?/gi, "");
  clean = clean.replace(/^(\/?static)+/gi, "/static");
  clean = clean.replace(/^(\/?uploads)+/gi, "/uploads");
  clean = clean.replace(/^(\/?storage)+/gi, "/storage");

  if (clean.startsWith("/storage/")) {
    return `/cms-storage${clean.replace(/^\/storage/, "")}`;
  }
  if (clean.startsWith("storage/")) {
    return `/cms-storage/${clean.replace(/^storage\//, "")}`;
  }
  if (clean.startsWith("/uploads/")) {
    return `/cms-uploads${clean.replace(/^\/uploads/, "")}`;
  }
  if (clean.startsWith("uploads/")) {
    return `/cms-uploads/${clean.replace(/^uploads\//, "")}`;
  }

  const cleanPath = clean.replace(/^\//, "");
  return `${baseDomain}/static/${cleanPath}`;
};
