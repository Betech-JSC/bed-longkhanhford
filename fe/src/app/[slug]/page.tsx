import { notFound, redirect } from "next/navigation";
import { vehiclesAPI, postsAPI, servicesAPI } from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DynamicRootSlugPage({ params }: Props) {
  const { slug } = await params;

  if (!slug || slug.includes(".")) {
    notFound();
  }

  // 1. Check if slug matches a vehicle
  try {
    const vehicleRes = await vehiclesAPI.getBySlug(slug).catch(() => null);
    if (vehicleRes && (vehicleRes.data || vehicleRes.id)) {
      const vData = vehicleRes.data || vehicleRes;
      const targetSlug = vData.seo_slug || vData.slug || slug;
      redirect(`/san-pham/${targetSlug}`);
    } else {
      const allVehiclesRes = await vehiclesAPI.getAll({ with_versions: false }).catch(() => null);
      const items = (allVehiclesRes as any)?.data || allVehiclesRes;
      if (Array.isArray(items)) {
        const found = items.find((v: any) => v.slug === slug || v.seo_slug === slug);
        if (found) {
          redirect(`/san-pham/${found.seo_slug || found.slug || slug}`);
        }
      }
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  // 2. Check if slug matches a news post
  try {
    const postRes = await postsAPI.getBySlug(slug).catch(() => null);
    if (postRes && (postRes.post || postRes.data)) {
      const post = postRes.post || postRes.data;
      redirect(`/tin-tuc/${post.seo_slug || post.slug || slug}`);
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  // 3. Check if slug matches a service
  try {
    const serviceRes = await servicesAPI.getBySlug(slug).catch(() => null);
    if (serviceRes && (serviceRes.service || serviceRes.data)) {
      const service = serviceRes.service || serviceRes.data;
      redirect(`/dich-vu/${service.seo_slug || service.slug || slug}`);
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  notFound();
}
