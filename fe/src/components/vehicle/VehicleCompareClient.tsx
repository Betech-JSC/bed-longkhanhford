"use client";

import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import Blocks from "@/components/blocks/Blocks";

export default function VehicleCompareClient() {
  const {
    vehicle,
    openQuoteDrawer,
    openDriveDrawer
  } = useVehicle();

  if (!vehicle) return null;

  // Filter specs block: SpecsGrid
  const specsBlocks = (vehicle.layout_blocks || []).filter((b: any) =>
    b.type === "SpecsGrid"
  );

  // Fallback block if CMS layout_blocks has no SpecsGrid block configured
  const displayBlocks = specsBlocks.length > 0 ? specsBlocks : [
    {
      type: "SpecsGrid",
      data: {
        align: "center"
      }
    }
  ];

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans pb-24">
      <VehicleTabBar />
      {/* Specs Grid Blocks */}
      <div className="space-y-16">
        <Blocks
          layout={displayBlocks}
          vehicle={vehicle}
          isEditMode={false}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
        />
      </div>
    </div>
  );
}
