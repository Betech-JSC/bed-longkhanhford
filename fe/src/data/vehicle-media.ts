export type VehicleMediaAssets = {
  promoTitle: string;
  promoDesc: string;
  promoImage: string;
  grid1: string;
  grid2: string;
  grid3: string;
  bannerLarge: string;
  splitLeft: string;
  splitTitle: string;
  splitDesc: string;
  features: string[];
};

export const vehicleMediaAssets: Record<string, VehicleMediaAssets> = {
  "ford-territory": {
    promoTitle: "Cơ hội vàng. Sẵn sàng rước xế.",
    promoDesc:
      "Ưu đãi lãi suất cố định 0% trị giá lên đến 15 triệu đồng khi mua Ford Territory trong tháng 5/2026.",
    promoImage: "/assets/territory-promo.png",
    grid1: "/assets/territory-grid-1.png",
    grid2: "/assets/territory-grid-2.png",
    grid3: "/assets/territory-grid-3.png",
    bannerLarge: "/assets/territory-interior.png",
    splitLeft: "/assets/territory-tech-split.png",
    splitTitle: "Kết nối liền mạch cùng với trang bị màn hình đôi cỡ lớn",
    splitDesc:
      "Hệ thống kết nối không dây Apple CarPlay & Android Auto tích hợp màn hình kép kỹ thuật số 12.3 inch tạo không gian tương lai sang trọng.",
    features: [
      "12.3” Màn hình cảm ứng",
      "Apple CarPlayTM Kết nối không dây",
      "Android AutoTM Kết nối không dây",
    ],
  },
  "ford-everest": {
    promoTitle: "Bứt phá giới hạn. Dẫn đầu mọi hành trình.",
    promoDesc:
      "Tặng gói bảo hiểm vật chất 1 năm và ưu đãi 50% lệ phí trước bạ khi ký hợp đồng xe Ford Everest trong tháng.",
    promoImage: "/assets/car-everest.png",
    grid1: "/assets/img-gradient-1.png",
    grid2: "/assets/img-gradient-2.png",
    grid3: "/assets/img-gradient-3.png",
    bannerLarge: "/assets/territory-interior.png",
    splitLeft: "/assets/territory-tech-split.png",
    splitTitle: "Không gian nội thất hạng sang cùng cửa sổ trời toàn cảnh",
    splitDesc:
      "Khoang cabin 7 chỗ rộng rãi bọc da cao cấp, kết hợp cửa sổ trời toàn cảnh Panorama đem lại cảm giác thoáng đãng sang trọng.",
    features: [
      "Cửa sổ trời toàn cảnh Panorama rộng lớn",
      "Hàng ghế thứ 3 gập điện thông minh",
      "Hệ thống chống ồn chủ động vượt trội",
    ],
  },
  "new-mustang-mach-e": {
    promoTitle: "Tương lai xanh. Trải nghiệm thể thao thuần khiết.",
    promoDesc:
      "Tặng ngay bộ sạc Wallbox chính hãng 7.4 kW và miễn phí lắp đặt tại gia đình cho chủ nhân sở hữu Mustang Mach-E sớm nhất.",
    promoImage: "/assets/car-mach-e.png",
    grid1: "/assets/img-gradient-2.png",
    grid2: "/assets/img-gradient-3.png",
    grid3: "/assets/img-gradient.png",
    bannerLarge: "/assets/territory-interior.png",
    splitLeft: "/assets/territory-tech-split.png",
    splitTitle: "Bảng điều khiển trung tâm tối giản kết nối SYNC 4A",
    splitDesc:
      "Màn hình cảm ứng dọc 15.5 inch điều khiển toàn bộ tính năng xe, học hỏi thói quen người dùng bằng trí tuệ nhân tạo.",
    features: [
      "Màn hình trung tâm 15.5 inch đặt dọc",
      "Hệ thống âm thanh cao cấp B&O 10 loa",
      "Cập nhật phần mềm qua mạng không dây (OTA)",
    ],
  },
  "ford-ranger": {
    promoTitle: "Vua bán tải. Sức mạnh bứt phá mọi cung đường.",
    promoDesc:
      "Tặng nắp thùng cuộn điện chính hãng và gói phụ kiện offroad chuyên dụng cho các hợp đồng giao xe nhanh.",
    promoImage: "/assets/car-ranger.png",
    grid1: "/assets/img-gradient-1.png",
    grid2: "/assets/img-gradient-3.png",
    grid3: "/assets/img-gradient.png",
    bannerLarge: "/assets/territory-interior.png",
    splitLeft: "/assets/territory-tech-split.png",
    splitTitle: "Bộ giảm xóc FOX Racing Live Valve đỉnh cao",
    splitDesc:
      "Hệ thống treo FOX kiểm soát hành trình chủ động thích ứng với địa hình 500 lần/giây, đem lại cảm giác êm ái hoàn hảo.",
    features: [
      "Bộ giảm xóc FOX Racing 2.5 inch chất lượng",
      "Bảng điều khiển phụ trợ cho thiết bị gắn ngoài",
      "Hệ thống xả van chủ động (Active Valve Exhaust)",
    ],
  },
  "ford-transit-2024": {
    promoTitle: "Giải pháp vận tải chuyên nghiệp. Tối ưu hóa dòng tiền.",
    promoDesc:
      "Hỗ trợ lệ phí trước bạ lên đến 100% cùng chương trình vay lãi suất đặc quyền cố định dài hạn tại Long Khánh Ford.",
    promoImage: "/assets/car-transit.png",
    grid1: "/assets/img-gradient-3.png",
    grid2: "/assets/img-gradient-1.png",
    grid3: "/assets/img-gradient-2.png",
    bannerLarge: "/assets/territory-interior.png",
    splitLeft: "/assets/territory-tech-split.png",
    splitTitle: "Không gian cabin linh hoạt, tiện nghi chuẩn 16 chỗ",
    splitDesc:
      "Thiết kế trần xe cao và lối đi rộng rãi kết hợp các cổng sạc USB phân bổ đều khắp các hàng ghế mang lại tiện nghi vượt trội.",
    features: [
      "Hệ thống điều hòa độc lập hai dàn lạnh",
      "Bậc bước chân tự động trượt ra vào",
      "Không gian hành lý mở rộng phía sau thông minh",
    ],
  },
  "mustang-fastback": {
    promoTitle: "Biểu tượng xe cơ bắp Mỹ thế hệ mới.",
    promoDesc:
      "Trải nghiệm sức mạnh Coyote V8 huyền thoại cùng khoang lái kỹ thuật số lấy cảm hứng từ máy bay chiến đấu phản lực.",
    promoImage: "/images/360/mustang/ecoboostfastback/exterior/desktop/adriatic-blue-green/64f/001-adriatic-blue-green-64f.jpeg",
    grid1: "/assets/cat_exterior_1780394164078.png",
    grid2: "/assets/cat_tech_1780394190516.png",
    grid3: "/assets/cat_wheels_1780394211840.png",
    bannerLarge: "/assets/cat_interior_1780394142653.png",
    splitLeft: "/assets/cat_performance_1780394235184.png",
    splitTitle: "Buồng lái kỹ thuật số lấy cảm hứng từ máy bay chiến đấu",
    splitDesc:
      "Màn hình cong kép cỡ lớn hướng về người lái, tích hợp hệ thống thông tin giải trí SYNC 4 hiện đại nhất.",
    features: [
      "12.4” Màn hình cụm đồng hồ kỹ thuật số",
      "13.2” Màn hình trung tâm đặt nghiêng",
      "Động cơ Coyote V8 thế hệ thứ 4 mạnh mẽ",
    ],
  },
};

export function getVehicleMediaAssets(vehicleId: string): VehicleMediaAssets {
  if (vehicleMediaAssets[vehicleId]) {
    return vehicleMediaAssets[vehicleId];
  }
  const idLower = vehicleId.toLowerCase();
  if (idLower.includes("everest")) {
    return vehicleMediaAssets["ford-everest"];
  }
  if (idLower.includes("territory")) {
    return vehicleMediaAssets["ford-territory"];
  }
  if (idLower.includes("ranger") || idLower.includes("raptor")) {
    return vehicleMediaAssets["ford-ranger"];
  }
  if (idLower.includes("transit")) {
    return vehicleMediaAssets["ford-transit-2024"];
  }
  if (idLower.includes("mach-e")) {
    return vehicleMediaAssets["new-mustang-mach-e"];
  }
  if (idLower.includes("mustang")) {
    return vehicleMediaAssets["mustang-fastback"];
  }
  return vehicleMediaAssets["ford-territory"]; // ultimate fallback
}
