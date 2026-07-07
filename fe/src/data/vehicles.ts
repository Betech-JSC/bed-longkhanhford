export interface Specs {
  engine: string;          /* Động cơ */
  power: string;           /* Công suất cực đại */
  torque: string;          /* Mô-men xoắn cực đại */
  transmission: string;    /* Hộp số */
  drivetrain: string;      /* Hệ dẫn động */
  dimensions: string;      /* Kích thước (DxRxC) */
  clearance: string;       /* Khoảng sáng gầm xe */
  fuelEconomy: string;     /* Tiêu hao nhiên liệu (kết hợp) */
}

export interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

export interface Version {
  id: string;
  name: string;
  price: number;
  specs: Specs;
  image_url?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: "suv" | "pickup" | "commercial";
  typeName: string;
  isBestSeller?: boolean;
  basePrice: number;
  tagline: string;
  description: string;
  images: string[];
  colors: ColorOption[];
  versions: Version[];
  images_360_external?: string[];
  images_360_internal?: string[];
  image_360_internal_url?: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "ford-territory",
    name: "FORD TERRITORY",
    type: "suv",
    typeName: "SUV 5 Chỗ",
    isBestSeller: true,
    basePrice: 739000000,
    tagline: "Cơ hội vàng. Sẵn sàng rước xế.",
    description: "Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc. Ford Territory là lựa chọn hoàn hảo cho gia đình trẻ năng động.",
    images: [
      "/assets/territory-hero.png"
    ],
    colors: [
      { name: "Đỏ Hỏa Tinh", hex: "#c61918", image: "red" },
      { name: "Trắng Kim Cương", hex: "#e0e0e0", image: "white" },
      { name: "Xám Ánh Trăng", hex: "#9e9ea3", image: "gray" },
      { name: "Xanh Biển Sâu", hex: "#67859f", image: "blue" },
      { name: "Đen Tuyệt Đối", hex: "#000000", image: "black" }
    ],
    versions: [
      {
        id: "titanium-x",
        name: "Territory Titanium X 1.5L AT",
        price: 954000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      },
      {
        id: "titanium",
        name: "Territory Titanium 1.5L AT",
        price: 899000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      },
      {
        id: "trend",
        name: "Territory Trend 1.5L AT",
        price: 739000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      }
    ]
  },
  {
    id: "ford-everest",
    name: "FORD EVEREST",
    type: "suv",
    typeName: "SUV 7 Chỗ",
    isBestSeller: true,
    basePrice: 1099000000,
    tagline: "Dấn bước. Dẫn đầu​.",
    description: "Được thiết kế để chinh phục mọi thử thách, Ford Everest thế hệ mới kết hợp khả năng vận hành mạnh mẽ ưu việt, nội thất sang trọng đỉnh cao và hệ thống an toàn thông minh bậc nhất.",
    images: [
      "/assets/car-everest.png"
    ],
    colors: [
      { name: "Đỏ Cam", hex: "#c2410c", image: "orange" },
      { name: "Xám Falcon", hex: "#4b5563", image: "gray" },
      { name: "Trắng Tuyết", hex: "#fafafa", image: "white" },
      { name: "Đen Bóng", hex: "#000000", image: "black" }
    ],
    versions: [
      {
        id: "everest-active",
        name: "Everest Active 2.0L Single-Turbo 6AT",
        price: 1099000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Một cầu sau (RWD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "7.5 L/100km"
        }
      },
      {
        id: "everest-sport",
        name: "Everest Sport 2.0L Single-Turbo 6AT",
        price: 1178000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Một cầu sau (RWD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "7.6 L/100km"
        }
      },
      {
        id: "everest-platinum-4x2",
        name: "Everest Platinum 2.0L Bi-Turbo 10AT 4x2",
        price: 1399000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Một cầu sau (RWD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "7.8 L/100km"
        }
      },
      {
        id: "everest-platinum-4x4",
        name: "Everest Platinum 2.0L Bi-Turbo 10AT 4x4",
        price: 1468000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động (4WD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "8.0 L/100km"
        }
      },
      {
        id: "everest-platinum-23",
        name: "Everest Platinum 2.3L EcoBoost 10AT 4x4",
        price: 1540000000,
        specs: {
          engine: "2.3L EcoBoost Xăng tăng áp",
          power: "270 Hp @ 5500 rpm",
          torque: "420 Nm @ 3000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động (4WD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "9.2 L/100km"
        }
      }
    ]
  },
  {
    id: "ford-ranger",
    name: "FORD RANGER",
    type: "pickup",
    typeName: "Xe Bán Tải",
    isBestSeller: true,
    basePrice: 669000000,
    tagline: "Vua bán tải chinh phục mọi nẻo đường.",
    description: "Được thiết kế để chinh phục những địa hình khắc nghiệt nhất, Ford Ranger kết hợp khả năng vận hành mạnh mẽ ưu việt cùng thiết kế hầm hố chuẩn Mỹ.",
    images: [
      "/assets/car-ranger.png"
    ],
    colors: [
      { name: "Cam Code Orange", hex: "#ea580c", image: "orange" },
      { name: "Xám Meteor", hex: "#4b5563", image: "gray" },
      { name: "Đen Tuyệt Đối", hex: "#000000", image: "black" },
      { name: "Trắng Bạch Kim", hex: "#f8fafc", image: "white" }
    ],
    versions: [
      {
        id: "ranger-xls",
        name: "Ranger XLS 2.0L Single-Turbo 6AT 4x2",
        price: 669000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Một cầu sau (4x2)",
          dimensions: "5.362 x 1.918 x 1.875 mm",
          clearance: "235 mm",
          fuelEconomy: "7.8 L/100km"
        }
      },
      {
        id: "ranger-xlt",
        name: "Ranger XLT 2.0L Single-Turbo 6AT 4x4",
        price: 779000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Hai cầu chủ động (4x4)",
          dimensions: "5.362 x 1.918 x 1.875 mm",
          clearance: "235 mm",
          fuelEconomy: "7.9 L/100km"
        }
      },
      {
        id: "ranger-wildtrak",
        name: "Ranger Wildtrak 2.0L Bi-Turbo 10AT 4x4",
        price: 979000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động bán thời gian",
          dimensions: "5.362 x 1.918 x 1.875 mm",
          clearance: "235 mm",
          fuelEconomy: "8.0 L/100km"
        }
      },
      {
        id: "ranger-stormtrak",
        name: "Ranger Stormtrak 2.0L Bi-Turbo 10AT 4x4",
        price: 1039000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động bán thời gian",
          dimensions: "5.362 x 1.918 x 1.875 mm",
          clearance: "235 mm",
          fuelEconomy: "8.1 L/100km"
        }
      },
      {
        id: "ranger-raptor",
        name: "Ranger Raptor 2.0L Bi-Turbo 10AT 4x4",
        price: 1299000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4 Ford Performance",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động bán thời gian thông minh",
          dimensions: "5.381 x 2.028 x 1.922 mm",
          clearance: "272 mm",
          fuelEconomy: "8.9 L/100km"
        }
      }
    ]
  },
  {
    id: "ford-transit-2024",
    name: "FORD TRANSIT",
    type: "commercial",
    typeName: "Xe Thương Mại",
    isBestSeller: false,
    basePrice: 905000000,
    tagline: "Giải pháp vận chuyển hành khách chuyên nghiệp.",
    description: "Ford Transit Thế hệ Mới được thiết kế tối ưu với không gian rộng rãi hơn, tiện nghi vượt trội cùng độ bền bỉ cao, giúp tối đa hóa hiệu quả kinh doanh của doanh nghiệp.",
    images: [
      "/assets/car-transit.png"
    ],
    colors: [
      { name: "Bạc Tinh Thể", hex: "#cbd5e1", image: "silver" },
      { name: "Trắng Kim Cương", hex: "#ffffff", image: "white" }
    ],
    versions: [
      {
        id: "transit-trend",
        name: "Transit Trend 2.2L TDCi 6MT",
        price: 905000000,
        specs: {
          engine: "Turbo Diesel 2.2L TDCi",
          power: "135 Hp @ 3750 rpm",
          torque: "375 Nm @ 1500-2500 rpm",
          transmission: "Số sàn 6 cấp",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "5.981 x 2.059 x 2.481 mm",
          clearance: "165 mm",
          fuelEconomy: "8.5 L/100km"
        }
      },
      {
        id: "transit-premium-16s",
        name: "Transit Premium 16S 2.2L TDCi 6MT",
        price: 949000000,
        specs: {
          engine: "Turbo Diesel 2.2L TDCi",
          power: "135 Hp @ 3750 rpm",
          torque: "375 Nm @ 1500-2500 rpm",
          transmission: "Số sàn 6 cấp",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "5.981 x 2.059 x 2.481 mm",
          clearance: "165 mm",
          fuelEconomy: "8.6 L/100km"
        }
      },
      {
        id: "transit-premium-18s",
        name: "Transit Premium 18S 2.2L TDCi 6MT",
        price: 1087000000,
        specs: {
          engine: "Turbo Diesel 2.2L TDCi",
          power: "135 Hp @ 3750 rpm",
          torque: "375 Nm @ 1500-2500 rpm",
          transmission: "Số sàn 6 cấp",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "6.081 x 2.059 x 2.581 mm",
          clearance: "165 mm",
          fuelEconomy: "9.0 L/100km"
        }
      }
    ]
  },
  {
    id: "new-mustang-mach-e",
    name: "NEW MUSTANG MACH-E",
    type: "suv",
    typeName: "SUV Điện Thể Thao",
    isBestSeller: false,
    basePrice: 1699000000,
    tagline: "Tương lai của hiệu năng và phong cách.",
    description: "Dòng SUV thuần điện đầu tiên lấy cảm hứng từ biểu tượng xe cơ bắp Mỹ Mustang. Khả năng tăng tốc vượt trội, phạm vi di chuyển ấn tượng và thiết kế khí động học tương lai.",
    images: [
      "/assets/car-mach-e.png"
    ],
    colors: [
      { name: "Xanh Lucid", hex: "#0b3c5d", image: "lucid-blue" },
      { name: "Đỏ Rapid", hex: "#b22222", image: "rapid-red" },
      { name: "Đen Shadow", hex: "#0a0a0a", image: "shadow-black" }
    ],
    versions: [
      {
        id: "mach-e-premium",
        name: "Mustang Mach-E Premium AWD",
        price: 1699000000,
        specs: {
          engine: "Động cơ điện Dual-Motor",
          power: "346 Hp / 258 kW",
          torque: "580 Nm",
          transmission: "Một cấp tự động",
          drivetrain: "Hai cầu toàn thời gian (AWD)",
          dimensions: "4.713 x 1.881 x 1.597 mm",
          clearance: "147 mm",
          fuelEconomy: "18.7 kWh/100km"
        }
      }
    ]
  },
  {
    id: "mustang-fastback",
    name: "MUSTANG FASTBACK",
    type: "suv",
    typeName: "Xe Thể Thao 2 Cửa",
    isBestSeller: true,
    basePrice: 1150000000,
    tagline: "Biểu tượng xe cơ bắp Mỹ thế hệ mới.",
    description: "Trải nghiệm sức mạnh huyền thoại từ khối động cơ Coyote V8 kết hợp với thiết kế đột phá và khoang lái kỹ thuật số tối tân hướng trọn về người lái.",
    images: [
      "/assets/mustang-hero.png"
    ],
    colors: [
      { name: "Adriatic Blue Metallic", hex: "#15444c", image: "adriatic-blue-green" },
      { name: "Orange Fury Metallic", hex: "#ff7e00", image: "orange-fury" },
      { name: "Avalanche Gray", hex: "#dadbce", image: "avalanche-gray" },
      { name: "Shadow Black", hex: "#10101d", image: "shadow-black" },
      { name: "Carbonized Gray", hex: "#8c8989", image: "carbonized-gray" },
      { name: "Vapor Blue Metallic", hex: "#424e5a", image: "vapor-blue" },
      { name: "Molten Magenta Metallic", hex: "#850034", image: "molten-magenta" },
      { name: "Race Red", hex: "#d50f00", image: "race-red" },
      { name: "Oxford White", hex: "#e4e2e5", image: "oxford-white" }
    ],
    versions: [
      {
        id: "ecoboostfastback",
        name: "Mustang® EcoBoost® Fastback",
        price: 1150000000,
        specs: {
          engine: "2.3L EcoBoost® I4 tăng áp",
          power: "315 Hp @ 5500 rpm",
          torque: "475 Nm @ 3000 rpm",
          transmission: "Tự động 10 cấp SelectShift®",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "4.811 x 1.915 x 1.397 mm",
          clearance: "140 mm",
          fuelEconomy: "9.5 L/100km"
        }
      },
      {
        id: "ecoboostpremiumfastback",
        name: "Mustang® EcoBoost® Premium Fastback",
        price: 1350000000,
        specs: {
          engine: "2.3L EcoBoost® I4 tăng áp",
          power: "315 Hp @ 5500 rpm",
          torque: "475 Nm @ 3000 rpm",
          transmission: "Tự động 10 cấp SelectShift®",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "4.811 x 1.915 x 1.397 mm",
          clearance: "140 mm",
          fuelEconomy: "9.5 L/100km"
        }
      },
      {
        id: "gtfastback",
        name: "Mustang® GT Fastback",
        price: 1850000000,
        specs: {
          engine: "5.0L Coyote V8 thế hệ thứ 4",
          power: "480 Hp @ 7150 rpm",
          torque: "563 Nm @ 4900 rpm",
          transmission: "Số sàn 6 cấp Getrag hoặc 10 cấp SelectShift®",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "4.811 x 1.915 x 1.397 mm",
          clearance: "140 mm",
          fuelEconomy: "11.8 L/100km"
        }
      },
      {
        id: "gtpremiumfastback",
        name: "Mustang® GT Premium Fastback",
        price: 2150000000,
        specs: {
          engine: "5.0L Coyote V8 thế hệ thứ 4",
          power: "480 Hp @ 7150 rpm",
          torque: "563 Nm @ 4900 rpm",
          transmission: "Số sàn 6 cấp Getrag hoặc 10 cấp SelectShift®",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "4.811 x 1.915 x 1.397 mm",
          clearance: "140 mm",
          fuelEconomy: "11.8 L/100km"
        }
      },
      {
        id: "dark-horse",
        name: "Mustang® Dark Horse®",
        price: 2950000000,
        specs: {
          engine: "5.0L Coyote V8 hiệu năng cao",
          power: "500 Hp @ 7250 rpm",
          torque: "567 Nm @ 4900 rpm",
          transmission: "Số sàn 6 cấp TREMEC® hoặc 10 cấp SelectShift®",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "4.817 x 1.915 x 1.397 mm",
          clearance: "135 mm",
          fuelEconomy: "12.5 L/100km"
        }
      }
    ]
  }
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find(v => v.id === id);
}

export function getVehiclesByType(type: "suv" | "pickup" | "commercial"): Vehicle[] {
  return vehicles.filter(v => v.type === type);
}
