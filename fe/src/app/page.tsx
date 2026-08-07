import { bannersAPI, vehiclesAPI, servicesAPI, postsAPI, customerHandoversAPI } from "@/lib/api";
import { siteAssets, resolveImageUrl } from "@/lib/site-assets";
import HomeClient from "./HomeClient";

/**
 * Homepage — Server Component (SSR)
 *
 * All data is fetched server-side in parallel using Promise.all.
 * The rendered HTML includes real content (not empty skeletons),
 * which improves SEO crawlability and perceived performance.
 *
 * Interactive parts (sliders, carousels, lightbox) are handled
 * by the HomeClient component ("use client").
 */
export default async function Home() {
  // Fetch all data in parallel on the server
  const [bannersData, categoriesData, vehiclesData, servicesData, handoversData, postsData] =
    await Promise.all([
      bannersAPI.getAll().catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
      vehiclesAPI.getAll().catch(() => null),
      servicesAPI.getAll().catch(() => null),
      customerHandoversAPI.getAll().catch(() => null),
      postsAPI.getAll({ type: "POST" }).catch(() => null),
    ]);

  // --- Transform Banners ---
  const defaultSlogans = [
    { title: "Ford Everest Thế Hệ Mới", subtitle: "Định hình phong cách sống thượng lưu, nâng tầm vị thế" },
    { title: "Ford Ranger Thế Hệ Mới", subtitle: "Bản lĩnh chinh phục mọi thử thách, thống trị mọi địa hình" },
    { title: "Ford Territory Thế Hệ Mới", subtitle: "Không gian thông minh, công nghệ tương lai cho gia đình bạn" },
  ];

  const bannersItems = (bannersData as any)?.data || bannersData;
  let heroSlides: any[];

  if (Array.isArray(bannersItems) && bannersItems.length > 0) {
    heroSlides = bannersItems.map((item: any, idx: number) => {
      const ds = defaultSlogans[idx % defaultSlogans.length];
      return {
        title: item.title || ds.title,
        subtitle: item.subtitle || ds.subtitle,
        image: item.image_url || siteAssets.heroSlides[0],
        imageMobile: item.image_mobile_url || item.image_url || siteAssets.heroSlides[0],
        linkVehicleId: item.button_link || "",
      };
    });
  } else {
    heroSlides = defaultSlogans.map((ds, i) => ({
      title: ds.title,
      subtitle: ds.subtitle,
      image: siteAssets.heroSlides?.[i] || `/assets/hero_${["everest", "ranger", "territory"][i]}.jpg`,
      imageMobile: siteAssets.heroSlides?.[i] || `/assets/hero_${["everest", "ranger", "territory"][i]}_mobile.jpg`,
      linkVehicleId: "",
    }));
  }

  // --- Transform Categories ---
  const categoriesItems = (categoriesData as any)?.data || categoriesData;
  const categories = Array.isArray(categoriesItems) ? categoriesItems : [];

  // --- Transform Vehicles ---
  const vehiclesItems = (vehiclesData as any)?.data || vehiclesData;
  const vehiclesList = Array.isArray(vehiclesItems) ? vehiclesItems : [];

  // --- Build Brand Items from vehicles ---
  const brandItems = vehiclesList.map((v: any) => ({
    title: v.title,
    category: v.title.toUpperCase().includes("FORD") ? v.title : `FORD ${v.title.toUpperCase()} MỚI`,
    slogan: v.tagline || "Mạnh mẽ. Thông minh.",
    description: v.description || "",
    image: resolveImageUrl(v.image_featured_url || v.image_thumbnail_url || v.image_url || v.image || ""),
    link: `/dong-xe/${v.slug}`,
  }));

  // --- Transform Services ---
  const servicesItems = (servicesData as any)?.services || (servicesData as any)?.data || servicesData;
  const servicesList = Array.isArray(servicesItems) ? servicesItems : [];

  // --- Transform Customer Handovers ---
  const handoversItems = (handoversData as any)?.data || handoversData;
  const customerHandovers = Array.isArray(handoversItems)
    ? handoversItems.map((item: any) => ({
        ...item,
        image_url: resolveImageUrl(item.image_url || item.image?.url || item.image || "/images/team/team_1.jpg"),
      }))
    : [];

  // --- Transform Posts ---
  const topPosts = (postsData as any)?.top_posts || [];
  const seenIds = new Set<string>();
  const articles: any[] = [];

  for (const item of topPosts) {
    if (!item) continue;
    const itemId = item.id || item.slug;
    if (!itemId || seenIds.has(String(itemId))) continue;
    seenIds.add(String(itemId));
    if (articles.length >= 3) break;

    const rawImg = item.image_url || item.image_thumbnail_url || item.image?.url || item.image || item.image_thumbnail;
    articles.push({
      id: item.slug || item.id || String(Math.random()),
      title: item.title || "",
      image: resolveImageUrl(rawImg) || "/assets/everest_platinum.jpg",
      published_at: item.published_at || "",
      category: item.category ? { title: item.category.title } : { title: "Tin tức" },
      description: item.description || item.excerpt || "",
    });
  }

  return (
    <HomeClient
      initialHeroSlides={heroSlides}
      initialArticles={articles}
      initialCategories={categories}
      initialVehicles={vehiclesList}
      initialBrandItems={brandItems}
      initialServices={servicesList}
      initialHandovers={customerHandovers}
    />
  );
}
