import { notFound } from "next/navigation";
import { servicesAPI, maintenanceAPI } from "@/lib/api";
import PeriodicMaintenanceLayout from "@/components/services/layouts/PeriodicMaintenance";
import ExpressMaintenanceLayout from "@/components/services/layouts/ExpressMaintenance";
import PickupDeliveryLayout from "@/components/services/layouts/PickupDelivery";
import CustomerCareLayout from "@/components/services/layouts/CustomerCare";
import GenericServiceLayout from "@/components/services/layouts/GenericService";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const response = await servicesAPI.getBySlug(slug) as any;
    const service = response?.service;
    const seo = response?.seo;

    if (!service) return {};

    return {
      title: seo?.title || `${service.title} | Long Khánh Ford`,
      description: seo?.description || service.description || "",
      keywords: seo?.keywords || "",
      alternates: {
        canonical: seo?.canonical || `/dich-vu/${slug}`,
      },
      openGraph: {
        title: seo?.title || service.title,
        description: seo?.description || service.description,
        images: seo?.image ? [{ url: seo.image }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  let serviceData: any = null;
  
  try {
    const response = await servicesAPI.getBySlug(slug) as any;
    if (response && response.service) {
      serviceData = response.service;
    }
  } catch (error) {
    console.error("Failed to load service from CMS API:", error);
  }

  if (!serviceData) {
    notFound();
  }

  // 1. Periodic Maintenance Layout Switcher
  if (slug === "bao-duong-dinh-ky" || slug === "dich-vu-bao-duong") {
    let displaySchedules: any[] = [];
    try {
      const scheduleRes = await maintenanceAPI.getSchedules();
      if (scheduleRes && scheduleRes.success && Array.isArray(scheduleRes.data)) {
        displaySchedules = scheduleRes.data.map((item: any) => ({
          name: item.name || "",
          image: item.image || "/assets/car-placeholder.png",
          links: Array.isArray(item.links) ? item.links : [],
        }));
      }
    } catch (error) {
      console.error("Failed to load maintenance schedules for Periodic layout:", error);
    }
    return <PeriodicMaintenanceLayout service={serviceData} displaySchedules={displaySchedules} />;
  }

  // 2. Express Maintenance Layout Switcher
  if (slug === "bao-duong-nhanh" || slug === "dich-vu-bao-duong-nhanh") {
    return <ExpressMaintenanceLayout service={serviceData} />;
  }

  // 3. Pickup & Delivery Layout Switcher
  if (slug === "giao-nhan-xe-tan-noi" || slug === "dich-vu-giao-nhan-xe-tan-noi") {
    return <PickupDeliveryLayout service={serviceData} />;
  }

  // 4. Customer Care Layout Switcher
  if (slug === "cham-soc-khach-hang" || slug === "dich-vu-cham-soc-xe") {
    return <CustomerCareLayout service={serviceData} />;
  }

  // 5. Default Fallback layout (Dynamic CMS Layout)
  return <GenericServiceLayout service={serviceData} />;
}
