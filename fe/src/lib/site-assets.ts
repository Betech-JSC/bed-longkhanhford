export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/image-hero-2.webp",
    "/assets/car-mach-e.png",
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
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9639.97148545994!2d106.86767807583985!3d10.948647055991795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfa7287e67b7%3A0xe69044f2892be499!2zxJDhu5NuZyBOYWkgRm9yZA!5e1!3m2!1svi!2s!4v1782375726740!5m2!1svi!2s",
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
  "ford-everest": "/assets/car-everest.png",
  "new-mustang-mach-e": "/assets/car-mach-e.png",
  "ford-ranger": "/assets/car-ranger.png",
  "ford-transit-2024": "/assets/car-transit.png",
  "mustang-fastback": "/assets/mustang-hero.png",
};

export function getPopularVehicleImage(vehicleId: string, fallback?: string) {
  return (
    popularVehicleImages[vehicleId] ??
    (fallback && fallback !== "" ? fallback : undefined) ??
    siteAssets.carPlaceholder
  );
}

export const imageFallbackSvg = "/images/ford_placeholder.png";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null;
  e.currentTarget.srcset = "";
  e.currentTarget.src = imageFallbackSvg;
}

