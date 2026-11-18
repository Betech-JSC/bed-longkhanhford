/**
 * Bộ tách mã quảng cáo từ 1 lần dán duy nhất.
 *
 * Sale chỉ cần dán nguyên khối mã nhận được từ Google Ads / GTM / GA4 /
 * Facebook / TikTok, hàm này sẽ bóc ra từng ID để điền vào đúng ô cấu hình.
 * Không phụ thuộc Vue, có thể test bằng node thuần.
 */

const KNOWN_HOST = /(googletagmanager\.com|google-analytics\.com|googleadservices\.com|googlesyndication\.com|doubleclick\.net|connect\.facebook\.net|facebook\.com\/tr|analytics\.tiktok\.com)/i;
const SKIPPED_EC = /(lead_submit|phoneEC|emailEC)/i;
// Đoạn boilerplate mà hệ thống đã tự sinh — không coi là "script lạ"
const BOILERPLATE = /(dataLayer|gtag\(|gtm\.start|gtm\.js|fbq\(|ttq\b|TiktokAnalyticsObject|fbevents\.js|google-analytics\.com\/gtag)/i;

const uniq = (list) => Array.from(new Set(list));

/**
 * Trích xuất & chuẩn hoá mã GTM (vd: GTM-TVZBCJ4H) từ text/URL/snippet.
 */
export function extractGtmIdFromText(raw) {
    if (typeof raw !== "string") return "";
    const match = raw.match(/\bGTM-[A-Za-z0-9]{4,16}\b/i);
    return match ? match[0].toUpperCase() : "";
}

export function parseTrackingPaste(raw) {
    const text = typeof raw === "string" ? raw : "";
    const result = {
        gtm_id: "",
        google_ads_id: "",
        google_ads_form_label: "",
        ga4_id: "",
        facebook_pixel_id: "",
        tiktok_pixel_id: "",
        unknown_script: "",
        skipped_enhanced_conversion: false,
        matched: [],
        warnings: [],
    };

    if (!text.trim()) {
        return result;
    }

    // ---------- Google Tag Manager ----------
    const gtmIds = uniq((text.match(/\bGTM-[A-Za-z0-9]{4,16}\b/gi) || []).map((s) => s.toUpperCase()));
    if (gtmIds.length > 1) {
        result.warnings.push(`Phát hiện ${gtmIds.length} mã GTM (${gtmIds.join(", ")}). Chỉ dùng mã đầu tiên.`);
    }
    if (gtmIds.length) {
        result.gtm_id = gtmIds[0];
        result.matched.push(`GTM: ${gtmIds[0]}`);
    }

    // ---------- Google Ads AW- (kèm Conversion Label nếu có) ----------
    const awMatches = uniq(text.match(/\bAW-[A-Za-z0-9]{6,20}(?:\/[A-Za-z0-9_-]{3,60})?/gi) || []);
    if (awMatches.length) {
        // Ưu tiên bản có kèm Conversion Label (AW-xxx/AbCd...) hơn bản trần trong src=
        const rawAw = awMatches.find((id) => id.includes("/")) || awMatches[0];
        const [tagId, label] = rawAw.split("/");
        result.google_ads_id = tagId.toUpperCase();
        result.matched.push(`Google Ads: ${result.google_ads_id}`);
        if (label) {
            const cleanLabel = label.replace(/['"\s]/g, "");
            result.google_ads_form_label = cleanLabel;
            result.matched.push(`Conversion Label: ${cleanLabel}`);
        }
        const distinctTags = uniq(awMatches.map((id) => id.split("/")[0].toUpperCase()));
        if (distinctTags.length > 1) {
            result.warnings.push(`Phát hiện ${distinctTags.length} tài khoản Google Ads khác nhau (${distinctTags.join(", ")}). Đã dùng ${tagId.toUpperCase()}.`);
        }
    }

    // ---------- GA4 (G-XXXXXXX) ----------
    const ga4Ids = uniq(text.match(/\bG-[A-Z0-9]{4,20}\b/g) || []).filter((id) => !/^G-?TM/i.test(id));
    if (ga4Ids.length) {
        result.ga4_id = ga4Ids[0];
        result.matched.push(`GA4: ${ga4Ids[0]}`);
        if (ga4Ids.length > 1) {
            result.warnings.push(`Phát hiện ${ga4Ids.length} mã GA4 (${ga4Ids.join(", ")}). Chỉ dùng mã đầu tiên.`);
        }
    }

    // ---------- Google Tag (GT-XXXXXXX) ----------
    const gtIds = uniq((text.match(/\bGT-[A-Za-z0-9]{4,20}\b/gi) || []).map((s) => s.toUpperCase()));
    if (gtIds.length) {
        if (!result.ga4_id) {
            result.ga4_id = gtIds[0];
            result.matched.push(`Google Tag: ${gtIds[0]}`);
        } else if (!result.google_ads_id) {
            result.google_ads_id = gtIds[0];
            result.matched.push(`Google Tag: ${gtIds[0]}`);
        } else {
            result.warnings.push(`Phát hiện Google Tag ${gtIds[0]} nhưng đã có cả mã Google Ads và GA4 nên giữ nguyên 2 mã đó.`);
        }
        if (gtIds.length > 1) {
            result.warnings.push(`Phát hiện ${gtIds.length} mã Google Tag (${gtIds.join(", ")}). Chỉ dùng mã đầu tiên.`);
        }
    }

    // ---------- Facebook Pixel ----------
    const fbPatterns = [
        /fbq\(\s*['"]init['"]\s*,\s*['"](\d{8,22})['"]/i,
        /facebook[_-]?pixel[_-]?id['"]?\s*[:=]\s*['"]?(\d{8,22})/i,
        /connect\.facebook\.net[\s\S]{0,400}?['"](\d{15,16})['"]/i,
    ];
    for (const re of fbPatterns) {
        const m = text.match(re);
        if (m) {
            result.facebook_pixel_id = m[1];
            result.matched.push(`Facebook Pixel: ${m[1]}`);
            break;
        }
    }

    // ---------- TikTok Pixel ----------
    const ttPatterns = [
        /ttq\.load\(\s*['"]([A-Za-z0-9]{10,32})['"]/i,
        /tiktok[_-]?pixel[_-]?id['"]?\s*[:=]\s*['"]?([A-Za-z0-9]{10,32})/i,
    ];
    for (const re of ttPatterns) {
        const m = text.match(re);
        if (m) {
            result.tiktok_pixel_id = m[1];
            result.matched.push(`TikTok Pixel: ${m[1]}`);
            break;
        }
    }

    // ---------- Đoạn lead_submit / phoneEC đã được hệ thống tự bắn ----------
    result.skipped_enhanced_conversion = SKIPPED_EC.test(text);

    // ---------- Script lạ: không nhận diện được thì đưa vào ô mã tuỳ chỉnh ----------
    const unknownBlocks = [];
    const scriptBlocks = text.match(/<script[\s\S]*?<\/script>/gi) || [];
    for (const block of scriptBlocks) {
        if (KNOWN_HOST.test(block) || SKIPPED_EC.test(block) || BOILERPLATE.test(block)) continue;
        unknownBlocks.push(block.trim());
    }
    const inlineTags = text.match(/<(iframe|img)\b[^>]*>/gi) || [];
    for (const tag of inlineTags) {
        if (!KNOWN_HOST.test(tag)) unknownBlocks.push(tag);
    }
    if (unknownBlocks.length) {
        result.unknown_script = uniq(unknownBlocks).join("\n\n");
        result.warnings.push(
            `Có ${unknownBlocks.length} đoạn mã chưa nhận diện. Đã tách riêng để bạn tự kiểm tra trước khi đưa vào ô "Mã Script Tuỳ Chỉnh".`
        );
    }

    if (!result.matched.length && !result.unknown_script && !result.skipped_enhanced_conversion) {
        result.warnings.push("Không tìm thấy mã Google / Facebook / TikTok nào trong đoạn vừa dán.");
    }

    return result;
}

/**
 * Ghép kết quả phân tích vào object cấu hình hiện tại (không ghi đè bằng chuỗi rỗng).
 */
export function mergePasteIntoConfig(config, parsed) {
    const next = { ...(config || {}) };
    const assign = (key, value) => {
        if (value) next[key] = value;
    };
    assign("gtm_id", parsed.gtm_id);
    assign("google_ads_id", parsed.google_ads_id);
    assign("google_ads_form_label", parsed.google_ads_form_label);
    assign("ga4_id", parsed.ga4_id);
    assign("facebook_pixel_id", parsed.facebook_pixel_id);
    assign("tiktok_pixel_id", parsed.tiktok_pixel_id);
    return next;
}
