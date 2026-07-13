"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  Eye
} from "lucide-react";
import { vehicles as staticVehicles, Vehicle, Version } from "@/data/vehicles";
import { vehiclesAPI, settingsAPI } from "@/lib/api";

interface RepaymentRow {
  period: number;
  remainingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
}

export default function InstallmentCalculatorPage() {
  // Dynamic vehicle list state defaulting to static vehicles
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(staticVehicles);

  // State for car selection
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(staticVehicles[0]);
  const [selectedVersion, setSelectedVersion] = useState<Version>(staticVehicles[0].versions[0]);
  
  // Form input states
  const [listPrice, setListPrice] = useState<number>(staticVehicles[0].versions[0].price);
  const [prepaidPercentage, setPrepaidPercentage] = useState<number>(20);
  const [prepaidAmount, setPrepaidAmount] = useState<number>(
    Math.round(staticVehicles[0].versions[0].price * 0.2)
  );
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60); // 5 years (60 months)
  const [rateYear1, setRateYear1] = useState<number>(8.5); // 8.5%
  const [rateSubsequent, setRateSubsequent] = useState<number>(11.0); // 11%
  const repaymentMethod = "declining";
  
  // UI States
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isTermOpen, setIsTermOpen] = useState(false);
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);
  const vehicleDropdownRef = useRef<HTMLDivElement>(null);
  const versionDropdownRef = useRef<HTMLDivElement>(null);
  const termDropdownRef = useRef<HTMLDivElement>(null);

  // Set date on client mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("vi-VN"));
  }, []);

  // Fetch vehicles and default interest settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch interest rates config from CMS
        const ratesRes = await settingsAPI.getInstallmentRates().catch(() => null);
        if (ratesRes && ratesRes.success && ratesRes.data) {
          setRateYear1(ratesRes.data.rate_year_1);
          setRateSubsequent(ratesRes.data.rate_subsequent);
        }

        // Fetch active vehicles from CMS
        const vehiclesRes = await vehiclesAPI.getAll({ with_versions: 1 }).catch(() => null);
        if (vehiclesRes && vehiclesRes.success && Array.isArray(vehiclesRes.data) && vehiclesRes.data.length > 0) {
          const mappedVehicles: Vehicle[] = vehiclesRes.data.map((apiCar: any) => {
            const versions = apiCar.versions ? apiCar.versions.map((apiVer: any) => ({
              id: String(apiVer.id),
              name: apiVer.name,
              price: typeof apiVer.price === 'string' ? parseFloat(apiVer.price) : apiVer.price,
              specs: {
                engine: apiVer.specs?.engine || '',
                power: apiVer.specs?.power || '',
                torque: apiVer.specs?.torque || '',
                transmission: apiVer.specs?.transmission || '',
                drivetrain: apiVer.specs?.drivetrain || '',
                dimensions: apiVer.specs?.dimensions || '',
                clearance: apiVer.specs?.clearance || '',
                fuelEconomy: apiVer.specs?.fuelEconomy || apiVer.specs?.fuel_economy || '',
              }
            })) : [];

            // If versions is empty, push a fallback version matching the basePrice
            if (versions.length === 0) {
              versions.push({
                id: 'base-' + apiCar.slug,
                name: 'Tiêu chuẩn',
                price: typeof apiCar.base_price === 'string' ? parseFloat(apiCar.base_price) : apiCar.base_price,
                specs: {
                  engine: '', power: '', torque: '', transmission: '', drivetrain: '', dimensions: '', clearance: '', fuelEconomy: ''
                }
              });
            }

            return {
              id: apiCar.slug,
              name: apiCar.title,
              type: apiCar.type || 'suv',
              typeName: apiCar.type === 'suv' 
                ? (apiCar.title?.toLowerCase().includes('everest') ? 'SUV 7 Chỗ' : apiCar.title?.toLowerCase().includes('territory') ? 'SUV 5 Chỗ' : 'SUV')
                : apiCar.type === 'pickup' 
                  ? 'Bán tải' 
                  : (apiCar.title?.toLowerCase().includes('transit') ? 'Xe Thương Mại 16 Chỗ' : apiCar.title?.toLowerCase().includes('tourneo') ? 'Thương Mại 7 Chỗ' : 'Thương mại'),
              isBestSeller: apiCar.is_best_seller,
              basePrice: typeof apiCar.base_price === 'string' ? parseFloat(apiCar.base_price) : apiCar.base_price,
              tagline: apiCar.tagline || '',
              description: apiCar.description || '',
              images: (apiCar.images && apiCar.images.length > 0) ? [apiCar.image_thumbnail_url || apiCar.images[0]] : [apiCar.image_thumbnail_url || apiCar.image_url].filter(Boolean),
              colors: apiCar.colors ? apiCar.colors.map((c: any) => ({
                name: c.name,
                hex: c.hex,
                image: c.image_path || ''
              })) : [],
              versions: versions
            };
          });

          setVehicleList(mappedVehicles);
          
          // Pre-select first vehicle and version from the API list to ensure clean bindings
          const defaultCar = mappedVehicles[0];
          setSelectedVehicle(defaultCar);
          
          const defaultVersion = defaultCar.versions[0];
          setSelectedVersion(defaultVersion);
          setListPrice(defaultVersion.price);
          setPrepaidAmount(Math.round(defaultVersion.price * 0.2));
        }
      } catch (err) {
        console.error("Failed to load dynamic data, using static fallback", err);
      }
    };

    loadData();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target as Node)) {
        setIsVehicleOpen(false);
      }
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target as Node)) {
        setIsVersionOpen(false);
      }
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target as Node)) {
        setIsTermOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update version and pricing when vehicle changes
  const handleVehicleChange = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const defaultVersion = vehicle.versions[0] || { id: "none", name: "Đang cập nhật", price: vehicle.basePrice };
    setSelectedVersion(defaultVersion);
    setListPrice(defaultVersion.price);
    
    // Recalculate prepaid amount based on new price and current percentage
    const newPrepaidAmount = Math.round(defaultVersion.price * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
    setIsVehicleOpen(false);
  };

  // Update pricing when version changes
  const handleVersionChange = (version: Version) => {
    setSelectedVersion(version);
    setListPrice(version.price);
    
    // Recalculate prepaid amount based on new price and current percentage
    const newPrepaidAmount = Math.round(version.price * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
    setIsVersionOpen(false);
  };

  // Manual list price input handler
  const handleListPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const val = rawVal ? parseInt(rawVal, 10) : 0;
    setListPrice(val);
    
    // Recalculate prepaid amount
    const newPrepaidAmount = Math.round(val * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
  };

  // Manual prepaid amount input handler
  const handlePrepaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const val = rawVal ? parseInt(rawVal, 10) : 0;
    
    // Limit prepaid amount to list price
    const safeVal = Math.min(val, listPrice);
    setPrepaidAmount(safeVal);
    
    // Recalculate percentage
    if (listPrice > 0) {
      const percentage = parseFloat(((safeVal / listPrice) * 100).toFixed(1));
      setPrepaidPercentage(percentage);
    }
  };

  // Prepaid percentage preset buttons handler
  const handlePrepaidPercentagePreset = (pct: number) => {
    setPrepaidPercentage(pct);
    const amount = Math.round(listPrice * (pct / 100));
    setPrepaidAmount(amount);
  };

  // Calculations details
  const loanAmount = Math.max(0, listPrice - prepaidAmount);
  
  // Format currency output helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val) + " đ";
  };

  const formatInputValue = (val: number) => {
    if (!val) return "";
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  // Compute Amortization Schedule
  const scheduleRows: RepaymentRow[] = [];
  let tempRemaining = loanAmount;
  const monthlyPrincipal = loanAmount > 0 && loanTermMonths > 0 ? Math.round(loanAmount / loanTermMonths) : 0;

  for (let t = 1; t <= loanTermMonths; t++) {
    const annualRate = t <= 12 ? rateYear1 : rateSubsequent;
    const monthlyRate = annualRate / 12 / 100;
    
    let principalPaid = monthlyPrincipal;
    if (t === loanTermMonths) {
      principalPaid = tempRemaining; // Pay off exactly the remainder at the final month
    }
    
    let interestPaid = 0;
    if (repaymentMethod === "declining") {
      interestPaid = Math.round(tempRemaining * monthlyRate);
    } else {
      interestPaid = Math.round(loanAmount * monthlyRate);
    }
    
    const totalPaid = principalPaid + interestPaid;
    
    scheduleRows.push({
      period: t,
      remainingPrincipal: tempRemaining,
      principalPaid,
      interestPaid,
      totalPaid
    });
    
    tempRemaining = Math.max(0, tempRemaining - principalPaid);
  }

  // Totals calculations
  const totalPrincipal = loanAmount;
  const totalInterest = scheduleRows.reduce((sum, r) => sum + r.interestPaid, 0);
  const totalRepayment = totalPrincipal + totalInterest;

  const firstMonthTotal = scheduleRows[0]?.totalPaid || 0;

  const handleCalculate = () => {
    setIsCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const termOptions = [
    { label: "1 năm (12 tháng)", months: 12 },
    { label: "2 năm (24 tháng)", months: 24 },
    { label: "3 năm (36 tháng)", months: 36 },
    { label: "4 năm (48 tháng)", months: 48 },
    { label: "5 năm (60 tháng)", months: 60 },
    { label: "6 năm (72 tháng)", months: 72 },
    { label: "7 năm (84 tháng)", months: 84 },
    { label: "8 năm (96 tháng)", months: 96 },
  ];

  return (
    <section className="bg-gray-50/50 py-8 md:py-16 font-sans print:bg-white print:py-0 w-full">
      {/* Print-only Dealership Header */}
      <div className="hidden print:block mb-8 border-b pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#00095B] uppercase tracking-tight">LONG KHÁNH FORD</h1>
            <p className="text-xs text-gray-500 mt-1">
              Địa chỉ: Đường Hùng Vương, Phường Xuân An, Thành Phố Long Khánh, Tỉnh Đồng Nai
            </p>
            <p className="text-xs text-gray-500">Hotline KD: 0918 90 90 60 | Email: marketing@longkhanhford.com.vn</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-800">BẢNG ƯỚC TÍNH CHI PHÍ TRẢ GÓP</h2>
            <p className="text-xs text-gray-500 mt-1">Ngày lập: {currentDate}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col items-center gap-[32px]">
        
        {/* Page Header (14144:5312) */}
        <div className="w-full flex flex-col gap-[12px] items-start print:hidden">
          <h1 className="font-sans font-bold text-[#0562d2] text-[32px] leading-[1.2] tracking-tight">
            Ước tính chi phí trả góp
          </h1>
          <p className="font-sans font-normal text-[#424242] text-[16px] leading-[1.5]">
            Nhập thông tin để tính toán khoản vay của bạn
          </p>
        </div>

        {/* Form and Image row (14144:5315) - 50/50 flex layout with gap-80px */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-stretch w-full print:hidden">
          
          {/* Left Column: Input Form (14144:5316) */}
          <div className="flex-1 flex flex-col gap-[25px] items-start w-full">
            
            {/* Input Select: Chọn mẫu xe */}
            <div className="relative w-full" ref={vehicleDropdownRef}>
              <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left">
                Chọn mẫu xe
              </label>
              <button
                type="button"
                onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                className="w-full bg-white border border-[#d6d6d6] rounded-[8px] px-[14px] py-[10px] text-[14px] text-[#333] text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-between"
              >
                <span className="truncate font-semibold">{selectedVehicle.name}</span>
                <ChevronDown className="w-[20px] h-[20px] text-gray-400" />
              </button>
              {isVehicleOpen && (
                <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow-lg py-1">
                  {vehicleList.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => handleVehicleChange(car)}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                        selectedVehicle.id === car.id ? "text-vivid font-bold bg-blue-50/20" : "text-[#333]"
                      }`}
                    >
                      <span>{car.name}</span>
                      <span className="text-xs text-gray-400">{car.typeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Select: Chọn phiên bản */}
            <div className="relative w-full" ref={versionDropdownRef}>
              <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left">
                Chọn phiên bản
              </label>
              <button
                type="button"
                disabled={selectedVehicle.versions.length <= 1 && selectedVehicle.versions[0]?.id === "none"}
                onClick={() => setIsVersionOpen(!isVersionOpen)}
                className="w-full bg-white border border-[#d6d6d6] rounded-[8px] px-[14px] py-[10px] text-[14px] text-[#333] text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-between disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="truncate font-medium">{selectedVersion.name}</span>
                <ChevronDown className="w-[20px] h-[20px] text-gray-400" />
              </button>
              {isVersionOpen && (
                <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow-lg py-1">
                  {selectedVehicle.versions.map((ver) => (
                    <button
                      key={ver.id}
                      type="button"
                      onClick={() => handleVersionChange(ver)}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                        selectedVersion.id === ver.id ? "text-vivid font-bold bg-blue-50/20" : "text-[#333]"
                      }`}
                    >
                      <span>{ver.name}</span>
                      <span className="text-xs text-vivid font-bold">{formatCurrency(ver.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Field: Giá niêm yết */}
            <div className="w-full">
              <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left">
                Giá niêm yết (VNĐ)
              </label>
              <div className="relative rounded-[8px] bg-white border border-[#d6d6d6] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden w-full flex items-center px-[14px] py-[10px]">
                <input
                  type="text"
                  value={formatInputValue(listPrice)}
                  onChange={handleListPriceChange}
                  placeholder="Nhập giá xe..."
                  className="w-full bg-transparent border-0 p-0 text-[14px] text-[#333] font-semibold focus:outline-none placeholder:text-[#808080]"
                />
              </div>
            </div>

            {/* Input Field: Khoản trả trước */}
            <div className="w-full">
              <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left flex justify-between">
                <span>Khoản trả trước (VNĐ)</span>
                <span className="text-vivid font-bold text-xs bg-blue-50 px-2 py-0.5 rounded">
                  {prepaidPercentage}%
                </span>
              </label>
              <div className="relative rounded-[8px] bg-white border border-[#d6d6d6] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden w-full flex items-center px-[14px] py-[10px] mb-2">
                <input
                  type="text"
                  value={formatInputValue(prepaidAmount)}
                  onChange={handlePrepaidAmountChange}
                  placeholder="Nhập số tiền trả trước..."
                  className="w-full bg-transparent border-0 p-0 text-[14px] text-[#333] font-medium focus:outline-none placeholder:text-[#808080]"
                />
              </div>
              <div className="flex gap-2">
                {[20, 30, 50, 70].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePrepaidPercentagePreset(pct)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer font-medium ${
                      prepaidPercentage === pct
                        ? "bg-vivid text-white border-vivid"
                        : "bg-gray-50 text-gray-600 border-gray-250 hover:bg-gray-100"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Input Select: Thời gian vay */}
            <div className="relative w-full" ref={termDropdownRef}>
              <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left">
                Thời gian vay
              </label>
              <button
                type="button"
                onClick={() => setIsTermOpen(!isTermOpen)}
                className="w-full bg-white border border-[#d6d6d6] rounded-[8px] px-[14px] py-[10px] text-[14px] text-[#333] text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-between"
              >
                <span className="truncate font-medium">
                  {termOptions.find((t) => t.months === loanTermMonths)?.label || `${loanTermMonths} tháng`}
                </span>
                <ChevronDown className="w-[20px] h-[20px] text-gray-400" />
              </button>
              {isTermOpen && (
                <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow-lg py-1">
                  {termOptions.map((opt) => (
                    <button
                      key={opt.months}
                      type="button"
                      onClick={() => {
                        setLoanTermMonths(opt.months);
                        setIsTermOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 cursor-pointer ${
                        loanTermMonths === opt.months ? "text-vivid font-bold" : "text-[#333]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row: Lãi suất năm đầu & Lãi suất năm sau */}
            <div className="grid grid-cols-2 gap-[25px] w-full">
              {/* Lãi suất năm đầu */}
              <div>
                <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left truncate">
                  Lãi suất năm đầu tiên
                </label>
                <div className="relative rounded-[8px] bg-white border border-[#d6d6d6] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden w-full flex items-center px-[14px] py-[10px]">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={rateYear1}
                    onChange={(e) => setRateYear1(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-0 p-0 text-[14px] text-[#333] font-medium focus:outline-none text-center"
                  />
                  <span className="text-gray-400 text-sm ml-1">%</span>
                </div>
              </div>

              {/* Lãi suất năm sau */}
              <div>
                <label className="block text-[14px] font-medium text-[#424242] mb-[6px] text-left truncate">
                  Lãi suất các năm sau
                </label>
                <div className="relative rounded-[8px] bg-white border border-[#d6d6d6] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden w-full flex items-center px-[14px] py-[10px]">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={rateSubsequent}
                    onChange={(e) => setRateSubsequent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-0 p-0 text-[14px] text-[#333] font-medium focus:outline-none text-center"
                  />
                  <span className="text-gray-400 text-sm ml-1">%</span>
                </div>
              </div>
            </div>

            {/* Action button matching Figma node 5278 rounded-[800px] */}
            <button
              type="button"
              onClick={handleCalculate}
              className="bg-[#0562d2] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center px-[24px] py-[12px] rounded-[800px] w-full text-white text-[16px] tracking-[0.18px] font-semibold cursor-pointer hover:bg-[#0451b0] transition-all active:scale-[0.99] border-0 mt-2"
            >
              Tính số tiền phải trả
            </button>
          </div>

          {/* Right Column: Interactive Image Card (14144:5327) */}
          <div className="aspect-[400/500] flex-1 min-w-px relative rounded-[12px] overflow-hidden" data-node-id="14144:5327" data-name="image 140">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Mua xe trả góp" 
              className="absolute inset-0 w-full h-full object-cover rounded-[12px]" 
              src="/assets/figma_card_visual.png" 
            />
          </div>
        </div>

        {/* Results Block - Plan breakdown (Figma 14144:5395) - baby blue card bg-[#edf6ff] */}
        {isCalculated && loanAmount > 0 && (
          <div ref={resultsRef} className="w-full flex flex-col items-center py-[32px] mt-8 scroll-mt-24">
            
            {/* Card wrapper styled matching Figma: bg-[#edf6ff], rounded-[12px], p-[24px], gap-[32px] */}
            <div className="bg-[#edf6ff] border border-blue-200/40 p-[24px] rounded-[12px] w-full max-w-[800px] flex flex-col gap-[32px] items-stretch shadow-md print:bg-white print:border-0 print:shadow-none print:p-0">
              
              {/* Title Header */}
              <h3 className="font-sans font-bold text-[#0562d2] text-[32px] leading-[1.2] text-center w-full uppercase tracking-wide">
                KẾ HOẠCH TRẢ GÓP
              </h3>

              {/* Metrics summary list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-[#d6d6d6] print:bg-white print:border print:border-gray-205">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Mẫu xe & Phiên bản</span>
                  <span className="text-xs font-bold text-gray-800 block truncate">{selectedVehicle.name} - {selectedVersion.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Số tiền vay</span>
                  <span className="text-xs font-bold text-[#0562d2] block">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Kỳ hạn vay</span>
                  <span className="text-xs font-bold text-gray-800 block">{loanTermMonths} tháng ({loanTermMonths / 12} năm)</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Trả tháng đầu</span>
                  <span className="text-xs font-bold text-green-600 block">{formatCurrency(firstMonthTotal)}</span>
                </div>
              </div>

              {/* Plan Table - border-[#94c5ff] */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] flex flex-col gap-[16px] text-body-1 text-gray-dark font-medium w-full">
                  
                  {/* Table Header Row - border-[#94c5ff] */}
                  <div className="border-b border-[#94c5ff] border-solid flex font-semibold gap-[12px] items-center pb-[12px] text-[#333] w-full text-xs uppercase tracking-wide">
                    <p className="w-[64px] text-center">Kỳ</p>
                    <p className="flex-1">Số dư nợ</p>
                    <p className="flex-1 text-right">Gốc</p>
                    <p className="flex-1 text-right">Lãi</p>
                    <p className="flex-1 text-right">Gốc + Lãi</p>
                  </div>

                  {/* Period 0 - Initial state */}
                  <div className="border-b border-[#94c5ff] border-solid flex gap-[12px] items-center pb-[12px] text-[#555] w-full text-[15px]">
                    <p className="w-[64px] text-center font-bold">0</p>
                    <p className="flex-1 font-semibold">{formatCurrency(loanAmount)}</p>
                    <p className="flex-1 text-right text-gray-400">-</p>
                    <p className="flex-1 text-right text-gray-400">-</p>
                    <p className="flex-1 text-right text-gray-400 font-bold">-</p>
                  </div>

                  {/* Render list of rows */}
                  {scheduleRows
                    .slice(0, showAllSchedule ? scheduleRows.length : 12)
                    .map((row) => (
                      <div key={row.period} className="border-b border-[#94c5ff] border-solid flex gap-[12px] items-center pb-[12px] text-[#333] w-full text-[15px]">
                        <p className="w-[64px] text-center font-bold text-gray-500">{row.period}</p>
                        <p className="flex-1">{formatCurrency(row.remainingPrincipal)}</p>
                        <p className="flex-1 text-right">{formatCurrency(row.principalPaid)}</p>
                        <p className="flex-1 text-right">{formatCurrency(row.interestPaid)}</p>
                        <p className="flex-1 text-right font-semibold">{formatCurrency(row.totalPaid)}</p>
                      </div>
                    ))}
                  
                  {/* Totals row - border-[#94c5ff] */}
                  <div className="border-b border-[#94c5ff] border-solid flex font-bold gap-[12px] items-center pb-[12px] text-[#333] w-full text-[16px]">
                    <p className="w-[64px] text-center">Tổng</p>
                    <p className="flex-1"></p>
                    <p className="flex-1 text-right">{formatCurrency(totalPrincipal)}</p>
                    <p className="flex-1 text-right text-green-600">{formatCurrency(totalInterest)}</p>
                    <p className="flex-1 text-right text-vivid text-base">{formatCurrency(totalRepayment)}</p>
                  </div>
                </div>
              </div>

              {/* Amortization Collapse Button */}
              {loanTermMonths > 12 && (
                <div className="flex justify-center print:hidden">
                  <button
                    type="button"
                    onClick={() => setShowAllSchedule(!showAllSchedule)}
                    className="flex items-center gap-1.5 text-xs text-vivid font-bold hover:text-secondary bg-white hover:bg-gray-50 border border-blue-200 px-4 py-2 rounded-full cursor-pointer transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      {showAllSchedule 
                        ? `Ẩn bớt lịch trả nợ (chỉ hiện 12 tháng đầu)` 
                        : `Xem chi tiết tất cả lịch trả nợ (${loanTermMonths} tháng)`}
                    </span>
                  </button>
                </div>
              )}

              {/* Action Buttons (Figma 14144:5412) - rounded-[800px] flex-row gap-24px */}
              <div className="flex flex-col sm:flex-row gap-[24px] items-center w-full print:hidden">
                <Link
                  href={`/${selectedVehicle.id}`}
                  className="bg-[#0562d2] border border-[#0562d2] border-solid rounded-[800px] text-white px-[24px] py-[10px] text-[18px] font-semibold flex-1 text-center hover:bg-secondary transition-colors cursor-pointer border-0 w-full"
                >
                  Xem sản phẩm
                </Link>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-white border border-[#d6d6d6] border-solid rounded-[800px] text-[#424242] px-[24px] py-[10px] text-[18px] font-semibold flex-1 text-center hover:bg-gray-50 transition-colors cursor-pointer w-full"
                >
                  Xuất kết quả PDF
                </button>
              </div>

              {/* Print Specific Footer Notes */}
              <div className="hidden print:block text-[10px] text-gray-400 mt-4 border-t pt-4">
                <p>* Bảng tính này chỉ mang tính chất tham khảo. Lãi suất thực tế sẽ được cập nhật cụ thể theo quy định của ngân hàng đối tác tại từng thời điểm.</p>
                <p>Mọi chi tiết xin vui lòng liên hệ Long Khánh Ford - Hotline KD: 0918 90 90 60 để nhận báo giá chính xác nhất.</p>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
