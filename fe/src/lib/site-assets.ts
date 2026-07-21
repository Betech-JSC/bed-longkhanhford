export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/ford_ranger_banner.png",
    "/images-dynamic/image-hero-3.jpg",
  ],
  showroomBg: "/showroom_bg.png",
  serviceBannerBg: "/assets/service-banner-bg.png",
  serviceBannerFg: "/assets/service-banner-fg.png",
  serviceCustomerCare: "/service-support-customer.jpg",
  serviceMaintenance: "/service-fixed-car.jpg",
  serviceDelivery: "/service-delivery.png",
  bookingCar: "/assets/booking-car.png",
  qualityCareBadge: "/assets/quality-care-circle.png",
  expressFlow: "/assets/express-maintenance-flow.png",
  carPlaceholder: "/assets/car-mach-e.png",
  ourStoryBanner: "/showroom_bg.png",
  testDriveBg: "/assets/test-drive-bg.png",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.269457792476!2d107.22851607480749!3d10.925769689283734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174f9d504505f59%3A0x6e2b1b3b1b3b1b3b!2sLong%20Kh%C3%A1nh%20Ford!5e0!3m2!1svi!2s!4v1721464860000!5m2!1svi!2s",
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
  "ford-transit-2024": "/assets/transit_premium.png",
  "ford-transit": "/assets/transit_premium.png",
  "mustang-fastback": "/assets/mustang_dark_horse.png",
  "ford-mustang": "/assets/mustang_dark_horse.png",
};

export function getPopularVehicleImage(vehicleId: string, fallback?: string) {
  if (fallback && fallback !== "") return fallback;
  return popularVehicleImages[vehicleId] ?? siteAssets.carPlaceholder;
}

export const imageFallbackSvg = "/images/ford_placeholder.png";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null;
  e.currentTarget.srcset = "";
  e.currentTarget.src = imageFallbackSvg;
}

