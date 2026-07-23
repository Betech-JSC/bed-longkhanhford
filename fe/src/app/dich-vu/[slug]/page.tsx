import { notFound } from "next/navigation";
import { servicesAPI, maintenanceAPI } from "@/lib/api";
import PeriodicMaintenanceLayout from "@/components/services/layouts/PeriodicMaintenance";
import ExpressMaintenanceLayout from "@/components/services/layouts/ExpressMaintenance";
import PickupDeliveryLayout from "@/components/services/layouts/PickupDelivery";
import CustomerCareLayout from "@/components/services/layouts/CustomerCare";
import GeneralRepairLayout from "@/components/services/layouts/GeneralRepair";
import RoadsideAssistanceLayout from "@/components/services/layouts/RoadsideAssistance";
import UsedCarsLayout from "@/components/services/layouts/UsedCars";
import VehicleUpgradeLayout from "@/components/services/layouts/VehicleUpgrade";
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
    const titleMap: Record<string, string> = {
      "bao-duong-dinh-ky": "Dịch vụ bảo dưỡng xe ô tô định kỳ tiêu chuẩn Ford",
      "dich-vu-bao-duong": "Dịch vụ bảo dưỡng xe ô tô định kỳ tiêu chuẩn Ford",
      "bao-duong-nhanh": "Dịch vụ bảo dưỡng nhanh 60 phút",
      "dich-vu-bao-duong-nhanh": "Dịch vụ bảo dưỡng nhanh 60 phút",
      "giao-nhan-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "dich-vu-giao-nhan-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "nhan-va-giao-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "cham-soc-khach-hang": "Dịch vụ chăm sóc khách hàng & Detailing",
      "dich-vu-cham-soc-xe": "Dịch vụ chăm sóc khách hàng & Detailing",
      "dich-vu-sua-chua": "Dịch vụ sửa chữa chẩn đoán & Đồng sơn 3S",
      "sua-chua-xe": "Dịch vụ sửa chữa chẩn đoán & Đồng sơn 3S",
      "dich-vu-cuu-ho-247": "Dịch vụ cứu hộ giao thông 24/7",
      "cuu-ho-247": "Dịch vụ cứu hộ giao thông 24/7",
      "dich-vu-xe-da-qua-su-dung": "Dịch vụ mua bán xe Ford đã qua sử dụng (Ford Assured)",
      "xe-da-qua-su-dung": "Dịch vụ mua bán xe Ford đã qua sử dụng (Ford Assured)",
      "dich-vu-nang-cap-xe": "Dịch vụ nâng cấp phụ kiện & Đồ chơi xe Ford",
      "nang-cap-xe": "Dịch vụ nâng cấp phụ kiện & Đồ chơi xe Ford"
    };

    serviceData = {
      title: titleMap[slug] || "Dịch vụ chăm sóc xe Ford chính hãng",
      slug: slug,
      description: "Xưởng dịch vụ lớn nhất khu vực Đồng Nai của đại lý Long Khánh Ford. Cung cấp các gói bảo dưỡng định kỳ, bảo dưỡng nhanh 60 phút, sửa chữa chung và giao nhận xe tận nhà."
    };
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
  if (slug === "giao-nhan-xe-tan-noi" || slug === "dich-vu-giao-nhan-xe-tan-noi" || slug === "nhan-va-giao-xe-tan-noi") {
    return <PickupDeliveryLayout service={serviceData} />;
  }

  // 4. Customer Care Layout Switcher
  if (slug === "cham-soc-khach-hang" || slug === "dich-vu-cham-soc-xe") {
    return <CustomerCareLayout service={serviceData} />;
  }

  // 5. General Repair & Body Paint Layout Switcher
  if (slug === "dich-vu-sua-chua" || slug === "sua-chua-xe") {
    return <GeneralRepairLayout service={serviceData} />;
  }

  // 6. Roadside Assistance 24/7 Rescue Layout Switcher
  if (slug === "dich-vu-cuu-ho-247" || slug === "cuu-ho-247" || slug === "cuu-ho-giao-thong") {
    return <RoadsideAssistanceLayout service={serviceData} />;
  }

  // 7. Ford Assured Certified Pre-Owned Used Cars Layout Switcher
  if (slug === "dich-vu-xe-da-qua-su-dung" || slug === "xe-da-qua-su-dung") {
    return <UsedCarsLayout service={serviceData} />;
  }

  // 8. Vehicle Accessories Upgrade Layout Switcher
  if (slug === "dich-vu-nang-cap-xe" || slug === "nang-cap-xe" || slug === "phu-kien-nang-cap") {
    return <VehicleUpgradeLayout service={serviceData} />;
  }

  // 9. Default Fallback layout (Dynamic CMS Layout)
  return <GenericServiceLayout service={serviceData} />;
}
