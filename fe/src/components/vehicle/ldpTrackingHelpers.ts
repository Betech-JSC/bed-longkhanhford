export interface LdpTrackingConfig {
  google_ads_id?: string;
  google_ads_form_label?: string;
  google_ads_call_label?: string;
  google_ads_zalo_label?: string;
  gtm_id?: string;
  facebook_pixel_id?: string;
  tiktok_pixel_id?: string;
  inject_head?: string;
  inject_body_start?: string;
  inject_body_end?: string;
}

export interface LdpConsultantForTracking {
  id?: number | string;
  name?: string;
  slug?: string;
  phone?: string;
  email?: string;
  zalo_url?: string;
  tracking_config?: LdpTrackingConfig | null;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ttq?: any;
  }
}

export const extractGtagId = (raw?: string) => (raw ? (raw.trim().match(/(AW|G|GT|DC)-[A-Za-z0-9]+/i)?.[0]?.toUpperCase() || "") : "");
export const cleanConversionLabel = (raw?: string, gtagId?: string) => (!raw ? "" : (raw.trim().includes("/") ? (raw.trim().split("/")[1]?.replace(/['"\s]/g, "") || "") : (gtagId && raw.trim().toUpperCase() === gtagId ? "" : raw.trim().replace(/['"\s]/g, ""))));
export const extractGtmId = (raw?: string) => (raw ? (raw.trim().match(/GTM-[A-Za-z0-9]+/i)?.[0]?.toUpperCase() || "") : "");
export const extractNumericId = (raw?: string) => (raw ? (raw.trim().match(/\d{8,22}/)?.[0] || "") : "");
export const extractAlphanumericId = (raw?: string) => (raw ? (raw.trim().match(/^[A-Za-z0-9]{10,32}$/)?.[0] || raw.trim().match(/ttq\.load\(['"]([A-Za-z0-9]{10,32})['"]\)/)?.[1] || "") : "");
export function injectRawHtmlFragment(html: string, target: HTMLElement, position: "append" | "prepend", markerAttr: string): Element[] {
  const created: Element[] = [];
  if (!html || !html.trim() || typeof document === "undefined") return created;
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const nodes = Array.from(tpl.content.children);
  const ordered = position === "prepend" ? [...nodes].reverse() : nodes;
  for (const el of ordered) {
    let toInsert: Element;
    if (el.tagName.toLowerCase() === "script") {
      const s = document.createElement("script");
      Array.from(el.attributes).forEach((attr) => s.setAttribute(attr.name, attr.value));
      s.textContent = el.textContent;
      toInsert = s;
    } else {
      toInsert = el.cloneNode(true) as Element;
    }
    toInsert.setAttribute("data-ldp-sale-track", markerAttr);
    if (position === "prepend") target.insertBefore(toInsert, target.firstChild);
    else target.appendChild(toInsert);
    created.push(toInsert);
  }
  return created;
}

export function resolveClickedButtonLabel(anchor: HTMLAnchorElement): string {
  const titleAttr = anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "";
  const visibleText = (anchor.innerText || anchor.textContent || "").replace(/\s+/g, " ").trim();
  const combined = visibleText || titleAttr;
  if (anchor.closest('[class*="fixed"]')) return combined ? `Nút nổi góc màn hình (${combined.slice(0, 60)})` : "Nút nổi góc màn hình (Floating CTA)";
  if (anchor.closest("header, nav")) return combined ? `Thanh đầu trang (${combined.slice(0, 60)})` : "Thanh đầu trang";
  if (anchor.closest("footer")) return combined ? `Chân trang (${combined.slice(0, 60)})` : "Chân trang";
  return combined ? `Nút trên trang (${combined.slice(0, 70)})` : "Nút liên hệ trực tiếp trên LDP";
}
export function fireLdpFormConversion(params: {
  salesConsultant?: LdpConsultantForTracking | null;
  formType?: string;
  isTestDrive?: boolean;
  targetVehicleName?: string;
  customerPhone?: string;
}) {
  if (typeof window === "undefined") return;
  const { salesConsultant, formType, isTestDrive, targetVehicleName } = params;
  const tc = salesConsultant?.tracking_config;
  const resolvedFormType = formType || (isTestDrive ? "TEST_DRIVE" : "ADVISE_FORM");
  const gtagId = extractGtagId(tc?.google_ads_id);
  const formLabel = cleanConversionLabel(tc?.google_ads_form_label, gtagId);

  try {
    if (gtagId && typeof window.gtag === "function") {
      if (formLabel) {
        window.gtag("event", "conversion", { send_to: `${gtagId}/${formLabel}`, value: 1.0, currency: "VND" });
      } else {
        window.gtag("event", "generate_lead", { send_to: gtagId, event_category: "ldp_form", event_label: targetVehicleName || salesConsultant?.name || "" });
      }
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "ldp_form_submit",
      ldp_action: resolvedFormType,
      consultant_id: salesConsultant?.id || null,
      consultant_name: salesConsultant?.name || "",
      vehicle_name: targetVehicleName || "",
      page_url: window.location.href,
    });
    if (extractNumericId(tc?.facebook_pixel_id) && typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: targetVehicleName || "Tư vấn xe Ford", content_category: resolvedFormType });
    }
    if (extractAlphanumericId(tc?.tiktok_pixel_id) && window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track("SubmitForm", { content_name: targetVehicleName || "Tư vấn xe Ford" });
    }
  } catch (err) {
    console.warn("[LdpTracking] Form conversion warning:", err);
  }
}
export function fireLdpClickConversion(params: {
  isCallClick: boolean;
  consultant?: LdpConsultantForTracking | null;
  vehicleName?: string;
  buttonLocation: string;
  href: string;
}) {
  if (typeof window === "undefined") return;
  const { isCallClick, consultant, vehicleName, buttonLocation, href } = params;
  const tc = consultant?.tracking_config;
  const gtagId = extractGtagId(tc?.google_ads_id);
  const label = cleanConversionLabel(isCallClick ? tc?.google_ads_call_label : tc?.google_ads_zalo_label, gtagId);

  try {
    if (gtagId && typeof window.gtag === "function") {
      if (label) {
        window.gtag("event", "conversion", { send_to: `${gtagId}/${label}`, value: 1.0, currency: "VND", transport_type: "beacon" });
      } else {
        window.gtag("event", isCallClick ? "ldp_click_call" : "ldp_click_zalo", { send_to: gtagId, event_category: "ldp_contact_click", event_label: buttonLocation, transport_type: "beacon" });
      }
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: isCallClick ? "ldp_click_call" : "ldp_click_zalo",
      consultant_id: consultant?.id || null,
      consultant_name: consultant?.name || "",
      vehicle_name: vehicleName || "",
      button_location: buttonLocation,
      target_href: href,
      page_url: window.location.href,
    });
    if (extractNumericId(tc?.facebook_pixel_id) && typeof window.fbq === "function") {
      window.fbq("track", "Contact", { content_name: vehicleName || consultant?.name || "LDP", contact_method: isCallClick ? "phone_call" : "zalo_chat" });
    }
    if (extractAlphanumericId(tc?.tiktok_pixel_id) && window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track("Contact", { content_name: vehicleName || consultant?.name || "LDP" });
    }
  } catch (err) {
    console.warn("[LdpTracking] Click conversion warning:", err);
  }
}
