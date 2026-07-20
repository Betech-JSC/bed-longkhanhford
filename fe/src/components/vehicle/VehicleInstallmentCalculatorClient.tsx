"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useVehicle } from "@/components/vehicle/VehicleLayoutClient";
import { settingsAPI, contactsAPI } from "@/lib/api";
import { Check, Info, FileText, Eye, ChevronDown } from "lucide-react";

interface RepaymentRow {
  period: number;
  remainingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
}

export default function VehicleInstallmentCalculatorClient() {
  const { vehicle } = useVehicle();

  // Selected state
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [prepaidPercentage, setPrepaidPercentage] = useState<number>(20);
  const [prepaidAmount, setPrepaidAmount] = useState<number>(0);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60); // 5 years default
  const [rateYear1, setRateYear1] = useState<number>(8.5); // 8.5% default
  const [rateSubsequent, setRateSubsequent] = useState<number>(11.0); // 11% default
  const repaymentMethod = "declining"; // Declining balance method (dư nợ giảm dần)

  // Dropdown states
  const [isTermOpen, setIsTermOpen] = useState(false);
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const [isCalculated, setIsCalculated] = useState(true); // default to true since it's product specific
  const [currentDate, setCurrentDate] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);
  const termDropdownRef = useRef<HTMLDivElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set date on client mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("vi-VN"));
  }, []);

  // Set default selected version
  useEffect(() => {
    if (vehicle && vehicle.versions && vehicle.versions.length > 0) {
      const defaultVersion = vehicle.versions[0];
      setSelectedVersionId(defaultVersion.id);
      setPrepaidAmount(Math.round((defaultVersion.price || 0) * 0.2));
    }
  }, [vehicle]);

  // Load interest rates from CMS
  useEffect(() => {
    settingsAPI.getInstallmentRates()
      .then((res) => {
        if (res && res.success && res.data) {
          setRateYear1(res.data.rate_year_1);
          setRateSubsequent(res.data.rate_subsequent);
        }
      })
      .catch((err) => {
        console.error("Error loading installment rates config:", err);
      });
  }, []);

  // Close term dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target as Node)) {
        setIsTermOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedVersion = () => {
    if (!vehicle || !vehicle.versions) return null;
    return vehicle.versions.find((v: any) => v.id === selectedVersionId) || vehicle.versions[0] || null;
  };

  const selectedVersion = getSelectedVersion();
  const listPrice = selectedVersion?.price || 0;

  // Handle version dropdown change
  const handleVersionChange = (versionId: string) => {
    setSelectedVersionId(versionId);
    const ver = vehicle.versions.find((v: any) => v.id === versionId);
    if (ver) {
      const price = ver.price || 0;
      setPrepaidAmount(Math.round(price * (prepaidPercentage / 100)));
    }
  };

  // Manual list price input handler (if they override it)
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

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const productTitle = `${vehicle.name} - ${selectedVersion?.name || ""}`;
      const note = formData.note || `Yêu cầu tư vấn mua trả góp xe ${productTitle}. Giá xe: ${formatCurrency(listPrice)}. Trả trước: ${formatCurrency(prepaidAmount)} (${prepaidPercentage}%). Vay ngân hàng: ${formatCurrency(loanAmount)} trong ${loanTermMonths} tháng. Trả tháng đầu: ${formatCurrency(firstMonthTotal)}.`;

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: formData.fullName,
            Phone: formData.phone,
            Email: formData.email || undefined,
            Province: "Đồng Nai",
            Product: {
              id: String(vehicle.id),
              slug: vehicle.slug || String(vehicle.id),
              title: productTitle,
              type: "vehicle",
            },
            "Nội dung cần hỗ trợ": note
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ fullName: "", phone: "", email: "", note: "" });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Installment advise submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số)!";
          } else if (backendMessage.Name) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else {
          errMsg = backendMessage;
        }
      }
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
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

  if (!vehicle) return null;

  return (
    <div className="flex-1 bg-[#F8F8F8] py-12 flex flex-col items-center w-full">
      {/* Print-only Dealership Header */}
      <div className="hidden print:block mb-8 border-b pb-4 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#00095B] uppercase tracking-tight">LONG KHÁNH FORD</h1>
            <p className="text-xs text-gray-500 mt-1">
              Địa chỉ: Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn, Thành phố Đồng Nai, Việt Nam
            </p>
            <p className="text-xs text-gray-500">Hotline KD: 0812 86 86 22 | Email: Marketing@longkhanhford.com.vn</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-800">BẢNG ƯỚC TÍNH CHI PHÍ TRẢ GÓP</h2>
            <p className="text-xs text-gray-500 mt-1">Ngày lập: {currentDate}</p>
          </div>
        </div>
      </div>

      <section className="max-w-[1440px] mx-auto px-4 xl:px-[80px] w-full flex flex-col gap-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium font-antenna print:hidden">
          <Link href="/" className="hover:text-[#066fef] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-[#066fef] transition-colors">
            Sản phẩm
          </Link>
          <span>/</span>
          <Link href={`/${vehicle.id}`} className="hover:text-[#066fef] transition-colors">
            {vehicle.name}
          </Link>
          <span>/</span>
          <span className="text-[#333] font-semibold">Ước tính trả góp</span>
        </div>

        {/* Dynamic header title */}
        <div className="flex flex-col gap-3 items-start w-full border-b border-gray-200 pb-6 font-antenna print:hidden">
          <h1 className="font-display font-bold text-[#066fef] text-[32px] md:text-[36px] leading-[1.2] uppercase tracking-wide">
            Ước tính trả góp xe Ford {vehicle.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Nhập tỷ lệ trả trước, kỳ hạn vay và lãi suất để ước tính kế hoạch tài chính mua xe trả góp chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-8 bg-white border border-[#e5e5e5] rounded-none p-6 md:p-8 flex flex-col gap-6 shadow-xs print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-antenna">
              
              {/* Version Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Phiên bản xe *</label>
                <select
                  value={selectedVersionId}
                  onChange={(e) => handleVersionChange(e.target.value)}
                  className="w-full bg-white border border-gray-350 px-3 py-2.5 rounded-[4px] text-sm text-black focus:outline-none focus:border-[#066fef]"
                >
                  {vehicle.versions?.map((ver: any) => (
                    <option key={ver.id} value={ver.id}>
                      {ver.name} ({formatCurrency(ver.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Term Selector */}
              <div className="relative flex flex-col gap-1.5" ref={termDropdownRef}>
                <label className="text-sm font-semibold text-gray-700">Thời gian vay *</label>
                <button
                  type="button"
                  onClick={() => setIsTermOpen(!isTermOpen)}
                  className="w-full bg-white border border-gray-350 rounded-[4px] px-3 py-2.5 text-sm text-black text-left focus:outline-none focus:border-[#066fef] cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {termOptions.find((t) => t.months === loanTermMonths)?.label || `${loanTermMonths} tháng`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {isTermOpen && (
                  <div className="absolute left-0 right-0 top-full z-15 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-[4px] shadow-lg py-1">
                    {termOptions.map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => {
                          setLoanTermMonths(opt.months);
                          setIsTermOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 cursor-pointer ${
                          loanTermMonths === opt.months ? "text-[#066fef] font-bold" : "text-[#333]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Prepaid Amount Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  <span>Số tiền trả trước (VNĐ) *</span>
                  <span className="text-[#066fef] font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-[4px]">
                    {prepaidPercentage}%
                  </span>
                </label>
                <input
                  type="text"
                  value={formatInputValue(prepaidAmount)}
                  onChange={handlePrepaidAmountChange}
                  placeholder="Nhập số tiền..."
                  className="w-full px-3 py-2 rounded-[4px] border border-gray-350 text-sm focus:outline-none focus:border-[#066fef] bg-white text-black font-semibold"
                />
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {[20, 30, 50, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePrepaidPercentagePreset(pct)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer font-medium ${
                        prepaidPercentage === pct
                          ? "bg-[#066fef] text-white border-[#066fef]"
                          : "bg-gray-50 text-gray-600 border-gray-250 hover:bg-gray-100"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Rates config */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 truncate">Lãi suất năm đầu (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={rateYear1}
                    onChange={(e) => setRateYear1(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-[4px] border border-gray-350 text-sm focus:outline-none focus:border-[#066fef] text-center"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 truncate">Lãi suất năm sau (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={rateSubsequent}
                    onChange={(e) => setRateSubsequent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-[4px] border border-gray-350 text-sm focus:outline-none focus:border-[#066fef] text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-4 bg-white border border-[#e5e5e5] rounded-none p-6 md:p-8 flex flex-col gap-6 shadow-xs sticky top-[140px] print:hidden">
            <h3 className="font-display font-bold text-lg text-[#066fef] border-b border-gray-150 pb-4 uppercase tracking-wide">
              Nhận tư vấn mua xe trả góp
            </h3>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 font-antenna">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-[4px] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-950">Gửi yêu cầu thành công!</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Bộ phận tư vấn trả góp của Long Khánh Ford sẽ liên hệ sớm nhất để hỗ trợ quý khách làm hồ sơ vay.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-antenna">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-[4px] text-xs text-center font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="0918xxxxxx"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Địa chỉ Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Yêu cầu cụ thể</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ví dụ: tôi muốn vay qua ngân hàng BIDV, muốn vay tối đa 80%..."
                    className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#066fef] bg-white resize-none text-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#066fef] hover:bg-[#01095c] text-white py-3 rounded-[4px] font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border-0 mt-2 shadow-xs font-antenna"
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng ký tư vấn trả góp"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Results Block - Amortization breakdown */}
        {isCalculated && loanAmount > 0 && (
          <div ref={resultsRef} className="w-full flex flex-col items-center py-4 scroll-mt-24">
            <div className="bg-[#edf6ff] border border-blue-200/40 p-6 md:p-8 rounded-[12px] w-full flex flex-col gap-6 shadow-md print:bg-white print:border-0 print:shadow-none print:p-0">
              
              <h3 className="font-display font-bold text-[#066fef] text-2xl leading-[1.2] text-center w-full uppercase tracking-wider print:text-[#333]">
                KẾ HOẠCH TRẢ GÓP DỰ KIẾN (DƯ NỢ GIẢM DẦN)
              </h3>

              {/* Metrics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-[#d6d6d6] rounded-[8px] font-antenna">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Mẫu xe & Phiên bản</span>
                  <span className="text-xs font-bold text-gray-800 block truncate">{vehicle.name} - {selectedVersion?.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wide">Số tiền vay</span>
                  <span className="text-xs font-bold text-[#066fef] block">{formatCurrency(loanAmount)}</span>
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

              {/* Amortization Table */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] flex flex-col gap-[14px] text-sm text-gray-700 font-medium w-full font-antenna">
                  
                  {/* Table Header */}
                  <div className="border-b border-[#94c5ff] border-solid flex font-bold gap-[12px] items-center pb-[10px] text-[#333] w-full text-xs uppercase tracking-wider">
                    <p className="w-[64px] text-center">Kỳ hạn</p>
                    <p className="flex-1">Dư nợ còn lại</p>
                    <p className="flex-1 text-right">Tiền gốc trả</p>
                    <p className="flex-1 text-right">Tiền lãi trả</p>
                    <p className="flex-1 text-right">Tổng gốc + Lãi</p>
                  </div>

                  {/* Month 0 */}
                  <div className="border-b border-[#94c5ff]/50 border-solid flex gap-[12px] items-center pb-[10px] text-gray-500 w-full">
                    <p className="w-[64px] text-center font-bold">0</p>
                    <p className="flex-1 font-semibold">{formatCurrency(loanAmount)}</p>
                    <p className="flex-1 text-right">-</p>
                    <p className="flex-1 text-right">-</p>
                    <p className="flex-1 text-right font-bold">-</p>
                  </div>

                  {/* Rows */}
                  {scheduleRows
                    .slice(0, showAllSchedule ? scheduleRows.length : 12)
                    .map((row) => (
                      <div key={row.period} className="border-b border-[#94c5ff]/50 border-solid flex gap-[12px] items-center pb-[10px] text-[#333] w-full">
                        <p className="w-[64px] text-center font-bold text-gray-500">{row.period}</p>
                        <p className="flex-1">{formatCurrency(row.remainingPrincipal)}</p>
                        <p className="flex-1 text-right">{formatCurrency(row.principalPaid)}</p>
                        <p className="flex-1 text-right">{formatCurrency(row.interestPaid)}</p>
                        <p className="flex-1 text-right font-semibold text-gray-900">{formatCurrency(row.totalPaid)}</p>
                      </div>
                    ))}
                  
                  {/* Totals */}
                  <div className="border-b border-[#94c5ff] border-solid flex font-bold gap-[12px] items-center pb-[10px] text-[#333] w-full">
                    <p className="w-[64px] text-center">Tổng cộng</p>
                    <p className="flex-1"></p>
                    <p className="flex-1 text-right">{formatCurrency(totalPrincipal)}</p>
                    <p className="flex-1 text-right text-green-600">{formatCurrency(totalInterest)}</p>
                    <p className="flex-1 text-right text-[#066fef] text-base">{formatCurrency(totalRepayment)}</p>
                  </div>
                </div>
              </div>

              {/* Collapse/Expand schedule button */}
              {loanTermMonths > 12 && (
                <div className="flex justify-center print:hidden">
                  <button
                    type="button"
                    onClick={() => setShowAllSchedule(!showAllSchedule)}
                    className="flex items-center gap-1.5 text-xs text-[#066fef] font-bold hover:text-[#01095c] bg-white border border-blue-200 px-4 py-2 rounded-full cursor-pointer transition-colors shadow-xs"
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

              {/* Action Print PDF */}
              <div className="flex justify-end print:hidden border-t border-blue-200/40 pt-4 mt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-white border border-gray-350 text-gray-700 px-6 py-2.5 rounded-[4px] font-bold text-xs uppercase tracking-wider hover:bg-gray-50 hover:text-[#066fef] transition-all cursor-pointer shadow-xs"
                >
                  Xuất bảng tính PDF
                </button>
              </div>

              {/* Print Footer Note */}
              <div className="hidden print:block text-[10px] text-gray-400 mt-4 border-t pt-4 w-full">
                <p>* Bảng tính lãi suất mang tính chất tham khảo. Lãi suất và các chi tiết khoản vay thực tế sẽ được cập nhật cụ thể theo quy định ngân hàng đối tác tại từng thời điểm.</p>
                <p>Mọi chi tiết xin vui lòng liên hệ Long Khánh Ford - Hotline KD: 0812 86 86 22 để nhận tư vấn chính xác nhất.</p>
              </div>

            </div>
          </div>
        )}
      </section>
    </div>
  );
}
