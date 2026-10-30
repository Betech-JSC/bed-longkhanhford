"use client";

import { useEffect, useRef } from "react";
import { contactsAPI } from "@/lib/api";
import {
  LdpConsultantForTracking,
  extractGtagId,
  extractGtmId,
  extractNumericId,
  extractAlphanumericId,
  injectRawHtmlFragment,
  resolveClickedButtonLabel,
  fireLdpClickConversion,
  fireLdpFormConversion,
} from "./ldpTrackingHelpers";

export { fireLdpFormConversion };

interface LdpTrackingManagerProps {
  salesConsultant?: LdpConsultantForTracking | null;
  landingPageId?: number | string;
  salesEmail?: string;
  vehicleName?: string;
}

export default function LdpTrackingManager({ salesConsultant, landingPageId, salesEmail, vehicleName }: LdpTrackingManagerProps) {
  const lastClickMapRef = useRef<Record<string, number>>({});
  const latestPropsRef = useRef({ salesConsultant, landingPageId, salesEmail, vehicleName });
  latestPropsRef.current = { salesConsultant, landingPageId, salesEmail, vehicleName };

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || !salesConsultant) return;
    const tc = salesConsultant.tracking_config;
    if (!tc || typeof tc !== "object") return;
    const insertedElements: Element[] = [];
    const marker = `sale-${salesConsultant.id || "ldp"}`;

    const gtagId = extractGtagId(tc.google_ads_id);
    if (gtagId) {
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gtagId}"]`)) {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`;
        s.setAttribute("data-ldp-sale-track", marker);
        document.head.appendChild(s);
        insertedElements.push(s);
      }
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = function () { window.dataLayer!.push(arguments); };
        window.gtag("js", new Date());
      }
      window.gtag("config", gtagId);
    }

    const gtmId = extractGtmId(tc.gtm_id);
    if (gtmId && !document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      s.setAttribute("data-ldp-sale-track", marker);
      document.head.appendChild(s);
      insertedElements.push(s);
    }
    const fbPixelId = extractNumericId(tc.facebook_pixel_id);
    if (fbPixelId) {
      if (typeof window.fbq !== "function") {
        const n: any = (window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
        if (!window._fbq) window._fbq = n;
        n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
        const s = document.createElement("script");
        s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
        s.setAttribute("data-ldp-sale-track", marker);
        document.head.appendChild(s);
        insertedElements.push(s);
      }
      window.fbq!("init", fbPixelId);
      window.fbq!("track", "PageView");
    }

    const ttPixelId = extractAlphanumericId(tc.tiktok_pixel_id);
    if (ttPixelId) {
      const s = document.createElement("script");
      s.setAttribute("data-ldp-sale-track", marker);
      s.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load(${JSON.stringify(ttPixelId)});ttq.page()}(window,document,'ttq');`;
      document.head.appendChild(s);
      insertedElements.push(s);
    }

    if (tc.inject_head) insertedElements.push(...injectRawHtmlFragment(tc.inject_head, document.head, "append", `${marker}-head`));
    if (tc.inject_body_start) insertedElements.push(...injectRawHtmlFragment(tc.inject_body_start, document.body, "prepend", `${marker}-bstart`));
    if (tc.inject_body_end) insertedElements.push(...injectRawHtmlFragment(tc.inject_body_end, document.body, "append", `${marker}-bend`));

    return () => {
      insertedElements.forEach((el) => { try { el.parentNode?.removeChild(el); } catch {} });
    };
  }, [salesConsultant]);
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || !salesConsultant) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const rawHref = (anchor.getAttribute("href") || "").trim();
      const lowerHref = rawHref.toLowerCase();
      const isCallClick = lowerHref.startsWith("tel:");
      const isZaloClick = !isCallClick && (lowerHref.includes("zalo.me/") || lowerHref.startsWith("zalo://"));
      if (!isCallClick && !isZaloClick) return;

      const cur = latestPropsRef.current;
      const consultant = cur.salesConsultant;
      if (!consultant) return;
      const clickKey = `${isCallClick ? "call" : "zalo"}:${consultant.id || ""}`;
      const now = Date.now();
      if (now - (lastClickMapRef.current[clickKey] || 0) < 3000) return;
      lastClickMapRef.current[clickKey] = now;

      const buttonLocation = resolveClickedButtonLabel(anchor);
      fireLdpClickConversion({ isCallClick, consultant, vehicleName: cur.vehicleName, buttonLocation, href: rawHref });

      contactsAPI.submit({
        contact: {
          type: isCallClick ? "LDP_CLICK_CALL" : "LDP_CLICK_ZALO",
          sales_consultant_id: consultant.id ? Number(consultant.id) : undefined,
          data: {
            landing_page_id: cur.landingPageId ? Number(cur.landingPageId) : undefined,
            sales_email: cur.salesEmail || consultant.email || undefined,
            "Họ và tên": isCallClick ? "Khách bấm Gọi điện trên LDP" : "Khách bấm Chat Zalo trên LDP",
            "Cố vấn phụ trách": `${consultant.name || ""}${consultant.phone ? ` (${consultant.phone})` : ""}`,
            "SĐT Cố vấn nhận liên hệ": consultant.phone || "",
            "Dòng xe khách đang xem": cur.vehicleName || "Trang Showroom Cố Vấn",
            "Vị trí nút bấm trên trang": buttonLocation,
            "Đường dẫn trang (URL)": window.location.href,
            source: isCallClick ? "📞 Khách bấm nút Gọi điện trên LDP" : "💬 Khách bấm nút Chat Zalo trên LDP",
          },
        },
      }, { keepalive: true }).catch(() => null);
    };
    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [salesConsultant]);
  return null;
}
