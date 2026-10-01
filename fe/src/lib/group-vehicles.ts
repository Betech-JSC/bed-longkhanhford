import { getPopularVehicleImage, resolveImageUrl } from "@/lib/site-assets";

// Helper function to group individual dynamic variants into parent model series
export function groupVehiclesBySeries(apiVehicles: any[]) {
  const groups: { [key: string]: {
    id: string;
    name: string;
    type: string;
    typeName: string;
    image_url: string;
    versions: any[];
  }} = {};

  apiVehicles.forEach((vehicle) => {
    // Use unique vehicle slug/id as series key so distinct CMS vehicles remain separate
    const seriesKey = vehicle.slug || `vehicle-${vehicle.id}`;
    const seriesName = (vehicle.title || "").toUpperCase();
    
    let typeName = vehicle.type_name || vehicle.typeName;
    let vehicleType = vehicle.type || "suv";
    const titleLower = (vehicle.title || "").toLowerCase();
    const slugLower = (vehicle.slug || "").toLowerCase();

    if (titleLower.includes("raptor") || slugLower.includes("raptor")) {
      typeName = "Bán Tải Hiệu Suất Cao";
      vehicleType = "pickup";
    } else if (titleLower.includes("ranger") || slugLower.includes("ranger")) {
      typeName = "Bán tải 5 Chỗ";
      vehicleType = "pickup";
    } else if (titleLower.includes("territory")) {
      typeName = "SUV 5 Chỗ";
      vehicleType = "suv";
    } else if (titleLower.includes("everest")) {
      typeName = "SUV 7 Chỗ";
      vehicleType = "suv";
    } else if (titleLower.includes("transit")) {
      typeName = "Thương mại 16 Chỗ";
      vehicleType = "commercial";
    } else if (titleLower.includes("tourneo")) {
      typeName = "MPV 7 Chỗ";
      vehicleType = "commercial";
    } else if (!typeName) {
      typeName = vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại";
    }

    if (!groups[seriesKey]) {
      const rawImg = vehicle.image_thumbnail_url || vehicle.image_url || vehicle.image || "";
      const resolvedImg = resolveImageUrl(rawImg) || getPopularVehicleImage(seriesKey, getPopularVehicleImage(seriesName));

      groups[seriesKey] = {
        id: seriesKey,
        name: seriesName,
        type: vehicleType,
        typeName: typeName,
        image_url: resolvedImg,
        versions: []
      };
    }

    const vehicleVersions = vehicle.versions && vehicle.versions.length > 0
      ? vehicle.versions
      : [{
          id: vehicle.slug || `version-${vehicle.id}`,
          name: vehicle.title,
          price: typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : (vehicle.base_price || 0),
          specs: vehicle.specs || {}
        }];

    vehicleVersions.forEach((v: any) => {
      const vName = (v.name || v.title || vehicle.title).trim();
      const existing = groups[seriesKey].versions.find((item: any) => item.name.toLowerCase() === vName.toLowerCase());
      if (!existing) {
        groups[seriesKey].versions.push({
          id: v.slug || v.id || `v-${vName}`,
          name: vName,
          price: typeof v.price === 'string' ? parseFloat(v.price) : (v.price || 0),
          specs: v.specs || {}
        });
      }
    });
  });

  const seriesList = Object.values(groups);
  seriesList.forEach((group) => {
    group.versions.sort((a, b) => b.price - a.price);
  });

  return seriesList;
}
