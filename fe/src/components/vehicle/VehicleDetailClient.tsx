"use client";

import { useState, useEffect, useRef } from "react";
import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import Blocks from "@/components/blocks/Blocks";
import { vehiclesAPI } from "@/lib/api";
import {
  ArrowLeft,
  Check,
  Plus,
  Minus,
  RotateCcw,
  X,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";

export default function VehicleDetailClient() {
  const {
    vehicle,
    openQuoteDrawer,
    openDriveDrawer
  } = useVehicle();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);
  const [originalBlocks, setOriginalBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // visual page builder states
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [builderTab, setBuilderTab] = useState<"sections" | "library">("sections");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // responsive preview states
  const [previewViewport, setPreviewViewport] = useState<"pc" | "tablet" | "mobile" | "custom">("pc");
  const [previewWidth, setPreviewWidth] = useState<number | string>("100%");
  const isResizingRef = useRef(false);

  // Check URL query parameters for edit mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "true") {
        setIsEditMode(true);
      }
      if (params.get("embedded") === "true" || params.get("embed") === "true") {
        setIsEmbedded(true);
      }
    }
  }, []);

  // Listen to message events from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "INIT_PREVIEW") {
        if (data.blocks) {
          setCurrentBlocks(data.blocks);
        }
        if (data.activeIndex !== undefined) {
          setActiveIndex(data.activeIndex);
        }
      } else if (data.type === "UPDATE_BLOCKS") {
        if (data.blocks) {
          setCurrentBlocks(data.blocks);
        }
        if (data.activeIndex !== undefined) {
          setActiveIndex(data.activeIndex);
        }
      } else if (data.type === "UPDATE_ACTIVE_INDEX") {
        if (data.activeIndex !== undefined) {
          setActiveIndex(data.activeIndex);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Initialize blocks when vehicle loads
  useEffect(() => {
    if (vehicle) {
      const hasBlocks = vehicle.layout_blocks && vehicle.layout_blocks.length > 0;
      
      let blocks = [];
      if (hasBlocks) {
        blocks = vehicle.layout_blocks.filter((b: any) => b.type !== "ThreeSixtyViewer");
      }

      if (blocks.length === 0) {
        blocks = [
          {
            type: "HeroBanner",
            data: {
              title: vehicle.name,
              tagline: vehicle.tagline || "Cơ hội vàng. Sẵn sàng rước xế.",
              button_text: "Đăng ký lái thử",
              button_link: "#drive",
              background_image: vehicle.images?.[0] || vehicle.image_url || "/assets/territory-hero.png"
            }
          },
          {
            type: "Promotions",
            data: {
              title: `Ưu Đãi Đặc Biệt Cho Xe ${vehicle.name}`,
              description: `Nhận ngay ưu đãi giá bán tốt nhất, quà tặng đặc quyền và hỗ trợ trả góp ưu đãi khi mua xe ${vehicle.name} tại Đồng Nai Ford.`,
              image: vehicle.images?.[1] || vehicle.images?.[0] || "/assets/img-gradient-2.png",
              button_text: "Báo giá"
            }
          },
          {
            type: "FeaturesGrid",
            data: {
              title_1: "Thiết kế ấn tượng, khẳng định vị thế vượt trội",
              image_1: vehicle.images?.[1] || vehicle.image_url || "/assets/territory-hero.png",
              image_2: vehicle.images?.[2] || vehicle.image_url || "/assets/territory-tech-split.png",
              image_3: vehicle.images?.[3] || vehicle.image_url || "/assets/territory-promo.png",
              title_2: "Không không gian lái thông minh rộng rãi",
              image_large: vehicle.images?.[4] || vehicle.image_url || "/assets/territory-interior.png",
              title_3: "Nâng tầm tiện nghi & Công nghệ kết nối",
              split_image: vehicle.images?.[0] || vehicle.image_url || "/assets/territory-tech-split.png",
              split_title: "Tiện nghi thông minh",
              split_features: [
                { value: vehicle.versions?.[0]?.specs?.engine || "Động cơ", label: "Động cơ Ford thế hệ mới tối ưu" },
                { value: vehicle.versions?.[0]?.specs?.transmission || "Hộp số", label: "Vận hành êm ái, mượt mà" }
              ]
            }
          },
          {
            type: "VersionsGrid",
            data: {
              title: `Các phiên bản Ford ${vehicle.name}`,
              descriptions: []
            }
          },
          {
            type: "SpecsGrid",
            data: {
              align: "center"
            }
          },
          {
            type: "FAQs",
            data: {
              title: "Câu hỏi thường gặp",
              faqs: [
                { q: "Điều gì tạo nên sự nổi bật của showroom Đồng Nai Ford?", a: "Đồng Nai Ford được đầu ty quy mô về trang thiết bị hiện đại, đội ngũ kỹ thuật tay nghề cao, được đào tạo chuyên nghiệp từ Ford Motor." },
                { q: "Có hỗ trợ mua xe trả góp không?", a: "Có, đại lý hỗ trợ trả góp lên đến 80% giá trị xe với lãi suất ưu đãi và thủ tục nhanh gọn." }
              ]
            }
          },
          {
            type: "BookingBanner",
            data: {
              title: "Kết nối ngay với chuyên viên Đồng Nai Ford",
              phone: "1800 55 68 58",
              btn_text: "Đặt lịch hẹn",
              btn_link: "/lien-he",
              car_image: vehicle.image_url
            }
          }
        ];
      }

      setCurrentBlocks(blocks);
      setOriginalBlocks(JSON.parse(JSON.stringify(blocks)));
    }
  }, [vehicle]);

  const handleSelectBlock = (idx: number) => {
    setActiveIndex(idx);
    if (typeof window !== "undefined") {
      window.parent.postMessage({
        type: 'SELECT_BLOCK',
        index: idx
      }, '*');
    }
  };

  const handleBlockChange = (index: number, updatedData: any) => {
    const nextBlocks = [...currentBlocks];
    nextBlocks[index] = { ...nextBlocks[index], data: updatedData };
    setCurrentBlocks(nextBlocks);
  };

  const handleAddBlock = (type: string) => {
    let newBlock = { type, data: {} as any };
    if (type === "HeroBanner") {
      newBlock.data = { title: vehicle?.name || "Ford Vehicle", tagline: "Tagline giới thiệu", button_text: "Đặt lịch hẹn", button_link: "/lien-he", background_image: "/assets/territory-hero.png" };
    } else if (type === "Promotions") {
      newBlock.data = { title: "Chương trình ưu đãi", description: "Mô tả ngắn khuyến mãi", image: "/assets/img-gradient-2.png", button_text: "Nhận báo giá" };
    } else if (type === "FeaturesGrid") {
      newBlock.data = { title_1: "Thiết kế ấn tượng", image_1: "/assets/territory-hero.png", image_2: "/assets/territory-tech-split.png", image_3: "/assets/territory-promo.png", title_2: "Tiện nghi", image_large: "/assets/territory-interior.png", title_3: "Công nghệ", split_image: "/assets/territory-tech-split.png", split_title: "Chi tiết", split_features: [] };
    } else if (type === "VersionsGrid") {
      newBlock.data = { title: "Các phiên bản xe", descriptions: [] };
    } else if (type === "SpecsGrid") {
      newBlock.data = { align: "center" };
    } else if (type === "FAQs") {
      newBlock.data = { title: "Giải đáp thắc mắc", faqs: [{ q: "Câu hỏi mẫu?", a: "Câu trả lời mẫu." }] };
    } else if (type === "BookingBanner") {
      newBlock.data = { title: "Tư vấn trực tiếp", phone: "1800 55 68 58", btn_text: "Đăng ký lái thử", car_image: vehicle?.image_url };
    }

    setCurrentBlocks([...currentBlocks, newBlock]);
    handleSelectBlock(currentBlocks.length);
  };

  const handleRemoveBlock = (index: number) => {
    const updated = currentBlocks.filter((_, i) => i !== index);
    setCurrentBlocks(updated);
    if (activeIndex === index) handleSelectBlock(null as any);
    else if (activeIndex !== null && activeIndex > index) handleSelectBlock(activeIndex - 1);
  };

  const handleSaveLayout = async () => {
    if (!vehicle) return;
    setSaving(true);
    try {
      const existing360Blocks = (vehicle.layout_blocks || []).filter((b: any) => b.type === "ThreeSixtyViewer");
      const fullBlocks = [...currentBlocks, ...existing360Blocks];
      const res = await vehiclesAPI.updateLayout(vehicle.id, fullBlocks);
      if (res && res.success) {
        alert("Lưu bố cục thành công!");
        setOriginalBlocks(JSON.parse(JSON.stringify(currentBlocks)));
      } else {
        alert(res?.message || "Lưu bố cục thất bại!");
      }
    } catch (err) {
      alert("Đã có lỗi xảy ra khi lưu bố cục!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentBlocks(JSON.parse(JSON.stringify(originalBlocks)));
    setIsEditMode(false);
    handleSelectBlock(null as any);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDraggedOverIndex(index);
  };
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const nextBlocks = [...currentBlocks];
    const draggedBlock = nextBlocks[draggedIndex];
    nextBlocks.splice(draggedIndex, 1);
    nextBlocks.splice(index, 0, draggedBlock);
    setCurrentBlocks(nextBlocks);
    handleSelectBlock(index);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  if (!vehicle) return null;

  return (
    <div className="flex-1 flex flex-col relative min-h-screen bg-light w-full">
      {/* Visual Editor Admin Control Bar */}
      {isEditMode && !isEmbedded && (
        <div className="bg-slate-900 text-white py-3 px-6 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border-0 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Trang Tổng Quan — Bố Cục
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-0.5 rounded-md flex gap-0.5 border border-slate-800">
              <button
                onClick={() => { setPreviewViewport("pc"); setPreviewWidth("100%"); }}
                className={`p-1.5 rounded-md border-0 cursor-pointer transition-all ${previewViewport === "pc" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setPreviewViewport("tablet"); setPreviewWidth(768); }}
                className={`p-1.5 rounded-md border-0 cursor-pointer transition-all ${previewViewport === "tablet" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setPreviewViewport("mobile"); setPreviewWidth(375); }}
                className={`p-1.5 rounded-md border-0 cursor-pointer transition-all ${previewViewport === "mobile" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleSaveLayout}
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white text-xs font-bold rounded-md cursor-pointer border-0 shadow-sm transition-all"
            >
              {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className={isEditMode && !isEmbedded ? "flex-1 flex overflow-hidden w-full relative" : "w-full relative"}>
        {/* Left Side: Blocks List & Settings panel */}
        {isEditMode && !isEmbedded && (
          <div className="w-[320px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 text-slate-300 select-none sticky top-[53px] h-[calc(100vh-53px)] z-40">
            <div className="flex border-b border-slate-800 p-2 gap-1 shrink-0">
              <button
                onClick={() => setBuilderTab("sections")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md border-0 cursor-pointer transition-all ${builderTab === "sections" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
              >
                Khối Đã Dùng
              </button>
              <button
                onClick={() => setBuilderTab("library")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md border-0 cursor-pointer transition-all ${builderTab === "library" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
              >
                Thư Viện Khối
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {builderTab === "sections" ? (
                currentBlocks.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-8">
                    Chưa có khối giao diện nào.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentBlocks.map((block, idx) => (
                      <div
                        key={block.id || idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleSelectBlock(idx)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all active:scale-[0.98] ${
                          activeIndex === idx
                            ? "bg-slate-800 border-[#0562d2] text-white shadow-md shadow-blue-500/10"
                            : draggedOverIndex === idx
                              ? "bg-slate-900 border-dashed border-[#0562d2] text-slate-400"
                              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-slate-400">0{idx + 1}</span>
                          <span className="font-bold">{block.type}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveBlock(idx); }}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-md bg-transparent border-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">Thư viện khối:</span>
                  {[
                    { type: 'HeroBanner', desc: 'Banner chính đầu trang' },
                    { type: 'Promotions', desc: 'Bảng ưu đãi đặc quyền' },
                    { type: 'FeaturesGrid', desc: 'Lưới tính năng & hình ảnh' },
                    { type: 'VersionsGrid', desc: 'Danh sách các phiên bản' },
                    { type: 'SpecsGrid', desc: 'Bảng so sánh thông số chi tiết' },
                    { type: 'FAQs', desc: 'Câu hỏi thường gặp' },
                    { type: 'BookingBanner', desc: 'Khối liên hệ đặt lịch hẹn' }
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddBlock(item.type)}
                      className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700 cursor-pointer transition-all flex flex-col gap-1 hover:text-white"
                    >
                      <span className="font-bold text-xs">{item.type}</span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeIndex !== null && currentBlocks[activeIndex] && (
              <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-950/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-3">Chỉnh Sửa Thuộc Tính:</span>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Căn lề chữ:</label>
                    <select
                      value={currentBlocks[activeIndex].data.align || "center"}
                      onChange={(e) => handleBlockChange(activeIndex, { ...currentBlocks[activeIndex].data, align: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="left">Trái (Left)</option>
                      <option value="center">Giữa (Center)</option>
                      <option value="right">Phải (Right)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Viewport Preview */}
        <div className={isEditMode && !isEmbedded ? "flex-1 bg-slate-100 flex justify-center items-start overflow-y-auto p-0 md:p-4" : "w-full"}>
          <div
            className={isEditMode && !isEmbedded
              ? "bg-white shadow-2xl relative transition-all duration-300 overflow-hidden w-full rounded-xl border border-slate-200"
              : "relative w-full"
            }
            style={{
              width: isEditMode && !isEmbedded ? previewWidth : "100%",
              maxWidth: "100%"
            }}
          >
            <div className="flex flex-col">
              {(() => {
                const heroBlock = currentBlocks.find((b: any) => b.type === "Hero" || b.type === "HeroBanner");
                const otherBlocks = currentBlocks.filter((b: any) => b.type !== "Hero" && b.type !== "HeroBanner");
                
                const handleHeroChange = (idx: number, updatedData: any) => {
                  const actualIdx = currentBlocks.findIndex((b: any) => b.type === "Hero" || b.type === "HeroBanner");
                  if (actualIdx !== -1) {
                    handleBlockChange(actualIdx, updatedData);
                  }
                };

                const handleOtherChange = (idx: number, updatedData: any) => {
                  const targetBlock = otherBlocks[idx];
                  const actualIdx = currentBlocks.findIndex((b: any) => b === targetBlock);
                  if (actualIdx !== -1) {
                    handleBlockChange(actualIdx, updatedData);
                  }
                };

                return (
                  <>
                    {heroBlock && (
                      <Blocks
                        layout={[heroBlock]}
                        vehicle={vehicle}
                        isEditMode={isEditMode}
                        onChangeBlock={handleHeroChange}
                        openQuoteDrawer={openQuoteDrawer}
                        openDriveModal={() => openDriveDrawer()}
                        activeIndex={activeIndex}
                        onSelectBlock={handleSelectBlock}
                        startIndex={currentBlocks.indexOf(heroBlock)}
                      />
                    )}
                    
                    {!isEditMode && <VehicleTabBar />}

                    <Blocks
                      layout={otherBlocks}
                      vehicle={vehicle}
                      isEditMode={isEditMode}
                      onChangeBlock={handleOtherChange}
                      openQuoteDrawer={openQuoteDrawer}
                      openDriveModal={() => openDriveDrawer()}
                      activeIndex={activeIndex}
                      onSelectBlock={handleSelectBlock}
                      startIndex={otherBlocks.length > 0 ? (currentBlocks.indexOf(otherBlocks[0]) !== -1 ? currentBlocks.indexOf(otherBlocks[0]) : 0) : 0}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
