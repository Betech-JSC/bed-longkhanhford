import { vehicles, Vehicle, Version } from "@/data/vehicles";

export interface RollingCostBreakdown {
  basePrice: number;
  registrationTax: number;
  plateFee: number;
  registryFee: number;
  roadFee: number;
  insuranceFee: number;
  serviceFee?: number;
  total: number;
}

export const PROVINCES = [
  "Đồng Nai",
  "TP. Hồ Chí Minh",
  "Bình Dương",
  "Bà Rịa - Vũng Tàu",
  "Long An",
  "Tây Ninh",
  "Bình Phước",
  "Bình Thuận",
  "Lâm Đồng",
  "Hà Nội",
  "Đà Nẵng",
  "Khác",
] as const;

export type Province = (typeof PROVINCES)[number];

/**
 * Tính chi phí lăn bánh cho một phiên bản xe tại một tỉnh/thành phố.
 */
export function calculateRollingCost(
  vehicle: any,
  version: any,
  province: string,
  registrationFees?: any[]
): RollingCostBreakdown {
  const basePrice = typeof version.price === 'string' ? parseFloat(version.price) : (version.price || 0);

  const vehicleNameLower = (vehicle.name || vehicle.title || "").toLowerCase();
  const vehicleIdLower = String(vehicle.id || "").toLowerCase();

  // 1. Phân loại xe
  const isPickup =
    vehicle.type === "pickup" ||
    vehicleNameLower.includes("ranger") ||
    vehicleNameLower.includes("raptor") ||
    vehicleIdLower.includes("ranger") ||
    vehicleIdLower.includes("raptor");

  const isTransit =
    vehicleNameLower.includes("transit") ||
    vehicleIdLower.includes("transit");

  // Tìm cấu hình phí từ Backend nếu có
  const dbFee = registrationFees?.find(
    (f: any) =>
      f.province_name?.toLowerCase() === province.toLowerCase() ||
      province.toLowerCase().includes(f.province_name?.toLowerCase() || '') ||
      (f.province_name && (strContainsNormalized(province, f.province_name) || strContainsNormalized(f.province_name, province)))
  );

  // Hàm so sánh không dấu và chữ thường
  function strContainsNormalized(str1: string, str2: string): boolean {
    const s1 = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const s2 = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return s1.includes(s2);
  }

  // 2. Thuế trước bạ theo khu vực & dòng xe
  const provinces12Percent = ["Hà Nội", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Quảng Ninh", "Lào Cai", "Cao Bằng", "Lạng Sơn", "Sơn La"];
  const is12PercentProvince = provinces12Percent.some(p => province.toLowerCase().includes(p.toLowerCase()));
  const isHaTinh = province.toLowerCase().includes("hà tĩnh");

  let baseTaxRate = 0.10; // Mặc định 10%
  if (dbFee) {
    baseTaxRate = dbFee.registration_tax_percent / 100;
  } else {
    if (is12PercentProvince) {
      baseTaxRate = 0.12;
    } else if (isHaTinh) {
      baseTaxRate = 0.11;
    }
  }

  let registrationTaxRate = baseTaxRate;
  if (isPickup) {
    // Thuế xe bán tải = 60% xe con
    registrationTaxRate = baseTaxRate * 0.6;
  } else if (isTransit) {
    // Xe thương mại chở khách (16 chỗ) chịu thuế trước bạ 2%
    registrationTaxRate = 0.02;
  }
  
  // Thuế trước bạ xe điện (Mustang Mach-E / Mustang / EV) bằng 0%
  const isElectric =
    vehicleNameLower.includes("mach-e") ||
    vehicleIdLower.includes("mach-e") ||
    vehicleNameLower.includes("mustang") ||
    vehicleIdLower.includes("mustang") ||
    vehicleNameLower.includes("ev ") ||
    vehicleIdLower.includes("ev-");
  if (isElectric) {
    registrationTaxRate = 0;
  }

  const registrationTax = basePrice * registrationTaxRate;

  // 3. Lệ phí biển số
  let plateFee = 1_000_000;
  const isHanoiOrHCMC = province.toLowerCase().includes("hà nội") || province.toLowerCase().includes("hồ chí minh");

  if (isPickup) {
    // Xe bán tải biển số cố định 500k
    plateFee = 500_000;
  } else if (isTransit) {
    // Xe Transit biển số 500k ở HN/HCM, 150k ở tỉnh khác
    plateFee = isHanoiOrHCMC ? 500_000 : 150_000;
  } else {
    // Xe du lịch dưới 9 chỗ
    if (dbFee) {
      plateFee = dbFee.license_plate_fee;
    } else {
      plateFee = isHanoiOrHCMC ? 20_000_000 : 1_000_000;
    }
  }

  // 4. Phí đăng kiểm
  let registryFee = 340_000;
  if (dbFee) {
    registryFee = dbFee.inspection_fee;
  }

  // 5. Phí bảo trì đường bộ (12 tháng)
  let roadFee = 1_560_000;
  if (isPickup || isTransit) {
    roadFee = 2_160_000; // Bán tải / Xe khách cố định theo luật
  } else if (dbFee) {
    roadFee = dbFee.road_maintenance_fee;
  }

  // 6. Phí bảo hiểm TNDS bắt buộc (đã bao gồm VAT)
  let insuranceFee = 480_700; // Xe dưới 6 chỗ
  const is7Seater =
    vehicleIdLower.includes("everest") ||
    vehicleNameLower.includes("everest") ||
    vehicleIdLower.includes("tourneo") ||
    vehicleNameLower.includes("tourneo") ||
    String(vehicle.typeName || "").includes("7 Chỗ");

  if (isPickup) {
    insuranceFee = 1_026_300; // Bán tải
  } else if (isTransit) {
    insuranceFee = 1_397_000; // 16 chỗ
  } else if (is7Seater) {
    insuranceFee = 873_400; // Xe 7-9 chỗ
  } else if (dbFee) {
    insuranceFee = dbFee.civil_insurance_fee;
  }

  // Phí dịch vụ đăng ký
  const serviceFee = dbFee ? dbFee.service_fee : 0;

  const total =
    basePrice + registrationTax + plateFee + registryFee + roadFee + insuranceFee + serviceFee;

  return {
    basePrice,
    registrationTax,
    plateFee,
    registryFee,
    roadFee,
    insuranceFee,
    serviceFee,
    total,
  };
}

/**
 * Format giá tiền VNĐ
 */
export function formatVND(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
}

/**
 * Format giá ngắn gọn (cho bảng giá)
 */
export function formatPriceShort(price: number): string {
  return new Intl.NumberFormat("en-US").format(price) + "đ";
}

/**
 * Lấy tất cả vehicles (tiện cho re-export)
 */
export { vehicles };
