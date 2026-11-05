import { getPopularVehicleImage, resolveImageUrl } from "@/lib/site-assets";

// Helper function to group individual dynamic variants into parent model series
export function groupVehiclesBySeries(apiVehicles: any[]) {
  const groups: { [key: string]: any } = {};

  apiVehicles.forEach((vehicle) => {
    // Tự động gom nhóm theo họ xe (family series) để tránh tạo mục trùng theo năm (ví dụ: Territory 2026)
    const titleLower = (vehicle.title || vehicle.name || "").toLowerCase();
    const slugLower = (vehicle.slug || "").toLowerCase();

    let seriesKey = vehicle.slug || `vehicle-${vehicle.id}`;
    let seriesName = (vehicle.title || vehicle.name || "").toUpperCase();
    let typeName = vehicle.type_name || vehicle.typeName;
    let vehicleType = vehicle.type || "suv";

    if (titleLower.includes("raptor") || slugLower.includes("raptor")) {
      seriesKey = "ford-ranger-raptor";
      seriesName = "FORD RANGER RAPTOR";
      typeName = "Bán Tải Hiệu Suất Cao";
      vehicleType = "pickup";
    } else if (titleLower.includes("territory") || slugLower.includes("territory")) {
      seriesKey = "ford-territory";
      seriesName = "FORD TERRITORY";
      typeName = "SUV 5 Chỗ";
      vehicleType = "suv";
    } else if (titleLower.includes("everest") || slugLower.includes("everest")) {
      seriesKey = "ford-everest";
      seriesName = "FORD EVEREST";
      typeName = "SUV 7 Chỗ";
      vehicleType = "suv";
    } else if (titleLower.includes("ranger") || slugLower.includes("ranger")) {
      seriesKey = "ford-ranger";
      seriesName = "FORD RANGER";
      typeName = "Bán tải 5 Chỗ";
      vehicleType = "pickup";
    } else if (titleLower.includes("transit") || slugLower.includes("transit")) {
      seriesKey = "ford-transit";
      seriesName = "FORD TRANSIT";
      typeName = "Thương mại 16 Chỗ";
      vehicleType = "commercial";
    } else if (titleLower.includes("tourneo") || slugLower.includes("tourneo")) {
      seriesKey = "ford-tourneo";
      seriesName = "FORD TOURNEO";
      typeName = "MPV 7 Chỗ";
      vehicleType = "commercial";
    } else if (titleLower.includes("mach-e") || slugLower.includes("mach-e")) {
      seriesKey = "ford-mustang-mach-e";
      seriesName = "FORD MUSTANG MACH-E";
      typeName = "SUV Điện";
      vehicleType = "suv";
    } else if (titleLower.includes("mustang") || slugLower.includes("mustang")) {
      seriesKey = "ford-mustang";
      seriesName = "FORD MUSTANG";
      typeName = "Xe Thể Thao";
      vehicleType = "suv";
    } else if (!typeName) {
      typeName = vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại";
    }

    if (!groups[seriesKey]) {
      const rawImg = vehicle.image_thumbnail_url || vehicle.image_url || vehicle.image || "";
      const resolvedImg = resolveImageUrl(rawImg) || getPopularVehicleImage(seriesKey, getPopularVehicleImage(seriesName));
      const rawCatIds = vehicle.category_ids && Array.isArray(vehicle.category_ids)
        ? vehicle.category_ids
        : (vehicle.category_id ? [vehicle.category_id] : []);

      groups[seriesKey] = {
        id: seriesKey,
        name: seriesName,
        title: seriesName,
        slug: seriesKey,
        type: vehicleType,
        typeName: typeName,
        image_url: resolvedImg,
        category_ids: rawCatIds,
        category_id: vehicle.category_id || rawCatIds[0],
        base_price: typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : (vehicle.base_price || 0),
        versions: []
      };
    } else if (vehicle.category_ids && Array.isArray(vehicle.category_ids)) {
      groups[seriesKey].category_ids = Array.from(new Set([...(groups[seriesKey].category_ids || []), ...vehicle.category_ids]));
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
  seriesList.forEach((group: any) => {
    group.versions.sort((a: any, b: any) => b.price - a.price);
    const validPrices = group.versions.map((v: any) => v.price).filter((p: number) => typeof p === "number" && p > 0);
    if (validPrices.length > 0) {
      group.base_price = Math.min(...validPrices);
    }
  });

  return seriesList;
}
