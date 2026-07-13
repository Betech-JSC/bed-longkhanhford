/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  GripVertical,
  Minus,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { vehicles, Vehicle } from "@/data/vehicles";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

interface FormSubmitData {
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  license_plate?: string;
  date?: string;
  time?: string;
  type?: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Xin chào! 👋 Tôi là trợ lý AI của **Ford Long Khánh**. Tôi có thể giúp bạn:\n\n• Tư vấn các dòng xe Ford\n• Tra cứu giá xe & ước tính lăn bánh\n• Đặt lịch lái thử\n• Thông tin dịch vụ bảo dưỡng\n\nBạn cần hỗ trợ gì ạ?",
  timestamp: new Date(),
};

const BUBBLE_SIZE = 56; // 14 * 4 = 56px (w-14)
const CHAT_WIDTH = 480;
const CHAT_HEIGHT = 650;
const EDGE_MARGIN = 16;

interface ParsedContent {
  text: string;
  recommendation?: { slugs: string[]; reason: string };
  leadForm?: { type: "test_drive" | "quote" | "callback"; vehicle?: string };
  serviceForm?: { step: string };
}

function parseMessageContent(content: string): ParsedContent {
  let text = content;
  let recommendation: ParsedContent["recommendation"];
  let leadForm: ParsedContent["leadForm"];
  let serviceForm: ParsedContent["serviceForm"];

  // 1. Check for RECOMMEND_VEHICLE
  const recommendMatch = text.match(/\[RECOMMEND_VEHICLE\]([\s\S]*?)\[\/RECOMMEND_VEHICLE\]/);
  if (recommendMatch) {
    try {
      recommendation = JSON.parse(recommendMatch[1]);
      text = text.replace(recommendMatch[0], "");
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Check for SHOW_LEAD_FORM
  const leadMatch = text.match(/\[SHOW_LEAD_FORM\]([\s\S]*?)\[\/SHOW_LEAD_FORM\]/);
  if (leadMatch) {
    try {
      leadForm = JSON.parse(leadMatch[1]);
      text = text.replace(leadMatch[0], "");
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Check for SHOW_SERVICE_FORM
  const serviceMatch = text.match(/\[SHOW_SERVICE_FORM\]([\s\S]*?)\[\/SHOW_SERVICE_FORM\]/);
  if (serviceMatch) {
    try {
      serviceForm = JSON.parse(serviceMatch[1]);
      text = text.replace(serviceMatch[0], "");
    } catch (e) {
      console.error(e);
    }
  }

  return {
    text: text.trim(),
    recommendation,
    leadForm,
    serviceForm,
  };
}

const getVehicleBySlug = (slug: string): Vehicle | undefined => {
  const cleanSlug = slug.toLowerCase();
  const id = cleanSlug.startsWith("ford-") ? cleanSlug : `ford-${cleanSlug}`;
  return vehicles.find((v) => v.id === id);
};

interface RecommendationCarouselProps {
  slugs: string[];
  reason: string;
}

export function RecommendationCarousel({ slugs, reason }: RecommendationCarouselProps) {
  const recommendedVehicles = slugs
    .map((slug) => getVehicleBySlug(slug))
    .filter((v): v is Vehicle => !!v);

  if (!recommendedVehicles.length) return null;

  return (
    <div className="mt-2 space-y-2 max-w-[90%]">
      {reason && (
        <p className="text-[11px] text-gray-500 italic font-medium">💡 {reason}</p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
        {recommendedVehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="p-2 bg-gray-50 flex items-center justify-center h-24 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={vehicle.images[0]} 
                alt={vehicle.name} 
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
              <div>
                <h4 className="text-xs font-bold text-gray-900 truncate tracking-tight">{vehicle.name}</h4>
                <p className="text-[9px] text-gray-400 truncate mt-0.5">{vehicle.tagline}</p>
                <p className="text-[10px] font-semibold text-[#0562d2] mt-0.5">
                  Giá từ: {vehicle.basePrice.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <Link 
                href={`/${vehicle.id}`}
                className="w-full py-1.5 bg-[#0562d2] hover:bg-[#044ea7] text-white text-[9px] font-bold rounded-lg text-center flex items-center justify-center transition-colors"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InChatLeadFormProps {
  type: "test_drive" | "quote" | "callback";
  vehicle?: string;
  onSubmit: (data: FormSubmitData) => void;
}

export function InChatLeadForm({ type, vehicle, onSubmit }: InChatLeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const title = {
    test_drive: `Đăng ký Lái thử ${vehicle ? `- ${vehicle}` : ""}`,
    quote: `Yêu cầu báo giá xe ${vehicle ? `- ${vehicle}` : ""}`,
    callback: "Yêu cầu Gọi lại Tư vấn",
  }[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng điền Họ tên và Số điện thoại.");
      return;
    }
    if (!/^(0|\+84)\d{9,10}$/.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    setError("");
    onSubmit({ name, phone, email, vehicle, type });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl text-center max-w-[90%]">
        <p className="text-xs font-bold text-green-800">✅ Đăng ký thông tin thành công!</p>
        <p className="text-[10px] text-green-600 mt-1">Yêu cầu của bạn đã được ghi nhận. Tư vấn viên sẽ liên hệ lại trong thời gian sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 max-w-[90%] shadow-sm">
      <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-1">{title}</h4>
      
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-gray-500 uppercase">Họ và tên *</label>
        <input 
          type="text" 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:border-[#0562d2] focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold text-gray-500 uppercase">Số điện thoại *</label>
        <input 
          type="tel" 
          required 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ví dụ: 0912345678"
          className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:border-[#0562d2] focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold text-gray-500 uppercase">Email (Không bắt buộc)</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ví dụ: name@example.com"
          className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:border-[#0562d2] focus:outline-none"
        />
      </div>

      {error && <p className="text-[10px] font-semibold text-red-600">{error}</p>}

      <button 
        type="submit"
        className="w-full py-1.5 bg-[#0562d2] hover:bg-[#044ea7] text-white text-xs font-bold rounded-lg transition-colors border-0 cursor-pointer shadow-sm"
      >
        Gửi thông tin đăng ký
      </button>
    </form>
  );
}

interface InChatServiceFormProps {
  onSubmit: (data: FormSubmitData) => void;
}

export function InChatServiceForm({ onSubmit }: InChatServiceFormProps) {
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicle, setVehicle] = useState("Ranger");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !licensePlate.trim() || !date || !time) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }
    if (!/^(0|\+84)\d{9,10}$/.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    setError("");
    onSubmit({
      phone,
      license_plate: licensePlate,
      vehicle,
      date,
      time,
      type: "service_booking",
    });
    setIsSubmitted(true);
  };

  const today = new Date().toISOString().split("T")[0];

  if (isSubmitted) {
    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl text-center max-w-[90%]">
        <p className="text-xs font-bold text-green-800">✅ Đăng ký lịch bảo dưỡng thành công!</p>
        <p className="text-[10px] text-green-600 mt-1">Yêu cầu của bạn đã được ghi nhận. Cố vấn dịch vụ sẽ gọi điện xác nhận lịch hẹn sớm.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 max-w-[90%] shadow-sm">
      <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-1 flex items-center">
        <Calendar className="w-3.5 h-3.5 mr-1 text-[#0562d2]" />
        Đặt lịch Hẹn Bảo dưỡng / Sửa chữa
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-500 uppercase">SĐT liên hệ *</label>
          <input 
            type="tel" 
            required 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09123..."
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-500 uppercase">Biển số xe *</label>
          <input 
            type="text" 
            required 
            value={licensePlate} 
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="Ví dụ: 60A-12345"
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-500 uppercase">Ngày hẹn *</label>
          <input 
            type="date" 
            required 
            min={today}
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-500 uppercase">Giờ hẹn *</label>
          <select 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:outline-none bg-transparent"
          >
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="13:30">13:30</option>
            <option value="14:30">14:30</option>
            <option value="15:30">15:30</option>
            <option value="16:30">16:30</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold text-gray-500 uppercase">Dòng xe bảo dưỡng</label>
        <select 
          value={vehicle} 
          onChange={(e) => setVehicle(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-[#0562d2] focus:outline-none bg-transparent"
        >
          <option value="Everest">Ford Everest</option>
          <option value="Ranger">Ford Ranger</option>
          <option value="Territory">Ford Territory</option>
          <option value="Transit">Ford Transit</option>
          <option value="Raptor">Ford Raptor</option>
          <option value="Mach-E">Ford Mustang Mach-E</option>
        </select>
      </div>

      {error && <p className="text-[10px] font-semibold text-red-600">{error}</p>}

      <button 
        type="submit"
        className="w-full py-1.5 bg-[#0562d2] hover:bg-[#044ea7] text-white text-xs font-bold rounded-lg transition-colors border-0 cursor-pointer shadow-sm"
      >
        Gửi yêu cầu đặt lịch hẹn
      </button>
    </form>
  );
}

export default function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPulse, setShowPulse] = useState(true);
  const [showDisclaimers, setShowDisclaimers] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fixed Position State (Bottom-Left of the screen, slightly shifted right)
  const [position, setPosition] = useState<Position>({ x: 84, y: -1 });
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [hasCompareItems, setHasCompareItems] = useState(false);

  // Sync with compare list to shift bubble up if active
  useEffect(() => {
    const checkCompare = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("compare-vehicles");
        if (stored) {
          try {
            const ids = JSON.parse(stored);
            setHasCompareItems(Array.isArray(ids) && ids.length > 0);
            return;
          } catch (e) {}
        }
      }
      setHasCompareItems(false);
    };

    checkCompare();
    window.addEventListener("compare-updated", checkCompare);
    return () => window.removeEventListener("compare-updated", checkCompare);
  }, []);

  const updatePosition = useCallback(() => {
    const isMobile = window.innerWidth < 640;
    const offset = (isMobile && hasCompareItems) ? 56 : 0;
    setPosition({
      x: 84,
      y: window.innerHeight - BUBBLE_SIZE - 24 - offset,
    });
  }, [hasCompareItems]);

  // Set mounted & listen to window resize
  useEffect(() => {
    setMounted(true);
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  // Update position when hasCompareItems changes
  useEffect(() => {
    updatePosition();
  }, [hasCompareItems, updatePosition]);

  // Check and listen to cookie consent
  useEffect(() => {
    const consent = localStorage.getItem("ford-cookie-consent");
    const sessionClosed = sessionStorage.getItem("ford-cookie-consent-closed");
    if (consent || sessionClosed) {
      setShowChatWidget(true);
    }

    const handleConsentDismissed = () => {
      setShowChatWidget(true);
    };

    window.addEventListener("cookie-consent-dismissed", handleConsentDismissed);
    return () => {
      window.removeEventListener("cookie-consent-dismissed", handleConsentDismissed);
    };
  }, []);

  // Calculate chat window position relative to bubble
  const getChatPosition = (): React.CSSProperties => {
    const bubbleCenterX = position.x + BUBBLE_SIZE / 2;
    const isRightSide = bubbleCenterX > window.innerWidth / 2;

    // Horizontal: align to right edge if bubble is on right, left edge if on left
    // We adjust the right boundary limit to leave 84px space for the QuickAccessToolbar
    const chatX = isRightSide
      ? Math.max(EDGE_MARGIN, Math.min(position.x + BUBBLE_SIZE, window.innerWidth - 84) - CHAT_WIDTH)
      : Math.max(EDGE_MARGIN, Math.min(position.x, window.innerWidth - CHAT_WIDTH - EDGE_MARGIN));

    // Vertical: place above the bubble, fall below if not enough space
    const spaceAbove = position.y - EDGE_MARGIN;
    const chatY =
      spaceAbove >= CHAT_HEIGHT + 12
        ? position.y - CHAT_HEIGHT - 12
        : position.y + BUBBLE_SIZE + 12;

    // Clamp within viewport
    const clampedY = Math.min(
      Math.max(EDGE_MARGIN, chatY),
      window.innerHeight - CHAT_HEIGHT - EDGE_MARGIN
    );

    return {
      left: `${chatX}px`,
      top: `${clampedY}px`,
    };
  };

  // Load session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dnf_chat_session");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.messages?.length > 1) {
          setMessages(
            data.messages.map((m: Omit<Message, "timestamp"> & { timestamp: string }) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }))
          );
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (sessionId || messages.length > 1) {
      localStorage.setItem(
        "dnf_chat_session",
        JSON.stringify({
          sessionId,
          messages: messages.slice(-30),
        })
      );
    }
  }, [sessionId, messages]);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setShowPulse(false);
      }, 300);
    }
  }, [isOpen]);

  // Close chat when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node) &&
        windowRef.current &&
        !windowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleFormSubmit = useCallback(async (data: FormSubmitData, formType: string) => {
    setIsLoading(true);
    let messageText = "";
    if (formType === "service_booking") {
      messageText = `[Đăng ký lịch dịch vụ] Xe: ${data.vehicle}, Biển số: ${data.license_plate}, Hẹn lúc: ${data.time} ngày ${data.date}, SĐT: ${data.phone}`;
    } else {
      const typeLabel = (data.type && {
        test_drive: "Đăng ký lái thử",
        quote: "Yêu cầu báo giá",
        callback: "Yêu cầu gọi lại",
      }[data.type as "test_drive" | "quote" | "callback"]) || "Đăng ký thông tin";
      messageText = `[${typeLabel}] Họ tên: ${data.name}, SĐT: ${data.phone}${data.email ? `, Email: ${data.email}` : ""}${data.vehicle ? `, Xe: ${data.vehicle}` : ""}`;
    }
    const userMsg = { id: `user_form_${Date.now()}`, role: "user" as const, content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ message: messageText, session_id: sessionId, form_data: data })
      });
      const resData = await res.json();
      const reply = resData?.data?.reply || resData?.reply;
      const newSessionId = resData?.data?.session_id || resData?.session_id;
      if (newSessionId && !sessionId) setSessionId(newSessionId);
      if (reply) {
        setMessages((prev) => [...prev, { id: `bot_${Date.now()}`, role: "assistant", content: reply, timestamp: new Date() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: `bot_err_${Date.now()}`, role: "assistant", content: "Cảm ơn thông tin của bạn. Lịch hẹn của bạn đã được ghi nhận. Cố vấn dịch vụ sẽ gọi xác nhận ngay nhé!", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const reply = data?.data?.reply || data?.reply;
      const newSessionId = data?.data?.session_id || data?.session_id;

      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      if (reply) {
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content:
          "Xin lỗi, tôi đang gặp sự cố kết nối. Bạn vui lòng gọi Hotline **0918 90 90 60** để được hỗ trợ trực tiếp nhé!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
      .replace(
        /• (.*?)(?=<br|$)/g,
        '<span class="flex gap-1.5 items-start"><span class="text-[#0562d2] mt-0.5">•</span><span>$1</span></span>'
      );
  };

  // Don't render until mounted and position is initialized and cookie consent is dismissed
  if (!mounted || position.x < 0 || !showChatWidget) return null;

  return (
    <>
      {/* Fixed Chat Bubble */}
      <button
        ref={bubbleRef}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`fixed z-[60] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer select-none ${
          isOpen
            ? "bg-[#333] hover:bg-[#1a1a1a]"
            : "bg-[#0562d2] hover:bg-[#044ea7]"
        }`}
        title={isOpen ? "Đóng chat" : "Chat với AI tư vấn"}
        aria-label={isOpen ? "Đóng chat" : "Mở chat AI tư vấn Ford Long Khánh"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white pointer-events-none" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white pointer-events-none" />
            {showPulse && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse pointer-events-none" />
            )}
          </>
        )}
      </button>

      {/* Chat Window — positioned relative to bubble */}
      <div
        ref={windowRef}
        style={{
          ...getChatPosition(),
          width: `${CHAT_WIDTH}px`,
        }}
        className={`fixed z-[60] max-w-[calc(100vw-32px)] transition-all duration-300 origin-bottom-left ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div 
          style={{ height: `${CHAT_HEIGHT}px`, maxHeight: "calc(100dvh - 32px)" }}
          className="bg-white rounded-[24px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col w-full"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
            {/* Left Options */}
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors bg-transparent border-0 cursor-pointer text-gray-500 flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Centered Title */}
            <h3 className="text-gray-900 text-[16px] font-bold font-['Ford_Antenna',sans-serif] tracking-wide text-center flex-1">
              Ford AI Chat
            </h3>

            {/* Right Buttons */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors bg-transparent border-0 cursor-pointer text-gray-500 flex items-center justify-center"
                title="Thu nhỏ"
              >
                <Minus className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors bg-transparent border-0 cursor-pointer text-gray-500 flex items-center justify-center"
                title="Đóng chat"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white select-text">
            {messages.map((msg) => {
              const parsed = msg.role === "assistant" ? parseMessageContent(msg.content) : null;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-9 h-9 rounded-full bg-[#0562d2] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="max-w-[80%] flex flex-col gap-2">
                    <div
                      className={`text-[15px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#edf6ff] text-[#0562d2] px-4 py-2.5 rounded-[18px] rounded-br-[4px] shadow-sm font-medium"
                          : "text-gray-800 px-1 py-1"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatContent(parsed ? parsed.text : msg.content),
                      }}
                    />
                    {parsed?.recommendation && (
                      <RecommendationCarousel
                        slugs={parsed.recommendation.slugs}
                        reason={parsed.recommendation.reason}
                      />
                    )}
                    {parsed?.leadForm && (
                      <InChatLeadForm
                        type={parsed.leadForm.type}
                        vehicle={parsed.leadForm.vehicle}
                        onSubmit={(data) => handleFormSubmit(data, parsed.leadForm!.type)}
                      />
                    )}
                    {parsed?.serviceForm && (
                      <InChatServiceForm
                        onSubmit={(data) => handleFormSubmit(data, "service_booking")}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-9 h-9 rounded-full bg-[#0562d2] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-[18px] rounded-bl-[4px] border border-gray-100 shadow-sm flex items-center">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-[#0562d2] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#0562d2] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#0562d2] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="relative flex items-center w-full">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Đang xử lý phản hồi..." : "Nhập câu hỏi tại đây..."}
                disabled={isLoading}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-[14px] pl-4 pr-12 py-3.5 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent disabled:opacity-50 placeholder:text-gray-400"
                maxLength={2000}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-transparent hover:bg-gray-100 disabled:hover:bg-transparent rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer border-0 text-[#0562d2] disabled:text-gray-300"
                aria-label="Gửi tin nhắn"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Disclaimers Collapsible */}
          <div className="border-t border-gray-100 flex-shrink-0 bg-white">
            <button
              onClick={() => setShowDisclaimers((prev) => !prev)}
              className="w-full px-6 py-3.5 flex items-center justify-between bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-0 cursor-pointer text-left font-['Ford_Antenna',sans-serif]"
            >
              <span>Điều khoản & Miễn trừ trách nhiệm</span>
              {showDisclaimers ? (
                <Minus className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-gray-500" />
              )}
            </button>
            {showDisclaimers && (
              <div className="px-6 pb-4 text-[11px] leading-relaxed text-gray-400 bg-white font-['Ford_Antenna',sans-serif]">
                Trợ lý AI này là công cụ hỗ trợ thông tin nhanh dành cho khách hàng tìm hiểu xe Ford tại Đồng Nai. Mọi câu trả lời của AI (bao gồm ước tính chi phí lăn bánh, thông số kỹ thuật) được tạo tự động và chỉ mang tính chất tham khảo. Vui lòng liên hệ trực tiếp hotline <a href="tel:0918909060" className="text-[#0562d2] font-semibold hover:underline">0918 90 90 60</a> để nhận báo giá chính thức và tư vấn chuẩn xác nhất.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
