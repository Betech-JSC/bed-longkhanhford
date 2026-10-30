<template>
    <div v-if="config" class="card mt-4">
        <div class="card-header font-bold text-gray-900 border-b pb-2 flex items-center justify-between flex-wrap gap-2">
            <span>{{ isLdpSync ? '🎯 Mã Theo Dõi Quảng Cáo & Chuyển Đổi (Đồng Bộ Theo Cố Vấn)' : '🎯 Mã Theo Dõi Quảng Cáo & Chuyển Đổi (Google Ads, GTM, Pixel)' }}</span>
            <template v-if="isLdpSync">
                <span v-if="consultantName" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Cố vấn: {{ consultantName }}
                </span>
                <span v-else class="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Chưa chọn Cố vấn phụ trách
                </span>
            </template>
            <span v-else class="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Áp dụng cho toàn bộ trang LDP của Sale này
            </span>
        </div>
        <div class="card-body mt-4 space-y-5">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3.5 rounded-r-lg text-xs text-blue-900 leading-relaxed space-y-1.5">
                <div class="font-bold">💡 Chỉ cần nhập 1 lần — Tự động áp dụng cho toàn bộ các trang LDP của {{ consultantName || 'Cố vấn này' }}:</div>
                <p v-if="isLdpSync">Khi bạn lưu trang này, bộ mã bên dưới sẽ được <strong>lưu trực tiếp vào hồ sơ Cố vấn ({{ consultantName || 'Sale phụ trách' }})</strong> và tự động kích hoạt trên <strong>Trang Showroom Tổng (/ldp/[ten-sale])</strong> lẫn <strong>tất cả các dòng xe</strong> mà Cố vấn phụ trách.</p>
                <ul class="list-disc pl-5 space-y-0.5">
                    <li><strong>Chuyển đổi 1 — Khách gửi Form Báo giá / Lái thử:</strong> Tự động bắn Google Ads Form Label, FB Pixel <code>Lead</code>, TikTok <code>SubmitForm</code>, GTM <code>ldp_form_submit</code>.</li>
                    <li><strong>Chuyển đổi 2 — Khách bấm nút Gọi điện (tel:):</strong> Tự động bắn Google Ads Call Label, FB Pixel <code>Contact</code>, TikTok <code>Contact</code>, GTM <code>ldp_click_call</code> + <strong>Báo về Quản lý Liên hệ & Telegram kèm tên Sale</strong>.</li>
                    <li><strong>Chuyển đổi 3 — Khách bấm nút Chat Zalo (zalo.me):</strong> Tự động bắn Google Ads Zalo Label, FB Pixel <code>Contact</code>, TikTok <code>Contact</code>, GTM <code>ldp_click_zalo</code> + <strong>Báo về Quản lý Liên hệ & Telegram kèm tên Sale</strong>.</li>
                </ul>
            </div>
            <div class="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4">
                <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h4 class="text-sm font-bold text-gray-900">1. Google Ads Tag &amp; 3 Nhãn Chuyển Đổi (Conversion Label)</h4>
                    <span class="text-[11px] text-gray-500 font-mono">Google Ads (gtag.js)</span>
                </div>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                    Lấy mã tại <strong>Google Ads → Mục tiêu → Lượt chuyển đổi → Tóm tắt → Bấm vào hành động chuyển đổi → Thiết lập thẻ → Tự cài đặt thẻ</strong>. Ví dụ mã <code>AW-16543210987/AbCdEfGhIjKlMnOpQrSt</code> thì <code>AW-16543210987</code> là Tag ID, phần sau dấu <code>/</code> là Conversion Label.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Field v-model="config.google_ads_id" :field="{ type: 'text', name: 'tracking_google_ads_id', label: 'Mã Google Ads Tag ID (AW-XXXXXXXXX)', placeholder: 'vd: AW-16543210987' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Mã ID tài khoản Google Ads của Sale (bắt đầu bằng AW-).</p>
                    </div>
                    <div>
                        <Field v-model="config.google_ads_form_label" :field="{ type: 'text', name: 'tracking_google_ads_form_label', label: 'Conversion Label — Khách Điền Form Báo Giá / Lái Thử', placeholder: 'vd: AbCdEfGhIjKlMnOpQrSt' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Nhãn chuyển đổi kích hoạt khi khách bấm gửi Form thành công.</p>
                    </div>
                    <div>
                        <Field v-model="config.google_ads_call_label" :field="{ type: 'text', name: 'tracking_google_ads_call_label', label: 'Conversion Label — Khách Bấm Nút Gọi Điện (Tel:)', placeholder: 'vd: XyZaBcDeFgHiJkLmNoPq' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Nhãn chuyển đổi kích hoạt ngay khi khách bấm nút Gọi điện cho Sale.</p>
                    </div>
                    <div>
                        <Field v-model="config.google_ads_zalo_label" :field="{ type: 'text', name: 'tracking_google_ads_zalo_label', label: 'Conversion Label — Khách Bấm Nút Chat Zalo', placeholder: 'vd: QwErTyUiOpAsDfGhJkLz' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Nhãn chuyển đổi kích hoạt ngay khi khách bấm nút Chat Zalo với Sale.</p>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4">
                <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h4 class="text-sm font-bold text-gray-900">2. Google Tag Manager (GTM), Facebook Pixel &amp; TikTok Pixel</h4>
                    <span class="text-[11px] text-gray-500 font-mono">GTM / Meta / TikTok</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Field v-model="config.gtm_id" :field="{ type: 'text', name: 'tracking_gtm_id', label: 'Mã Google Tag Manager (GTM)', placeholder: 'vd: GTM-XXXXXXX' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Tự động đẩy sự kiện <code>ldp_form_submit</code>, <code>ldp_click_call</code>, <code>ldp_click_zalo</code> vào <code>dataLayer</code>.</p>
                    </div>
                    <div>
                        <Field v-model="config.facebook_pixel_id" :field="{ type: 'text', name: 'tracking_facebook_pixel_id', label: 'Mã Facebook Pixel ID', placeholder: 'vd: 123456789012345' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Chỉ điền dãy số Pixel ID của Meta Ads. Tự động đo <code>PageView</code>, <code>Lead</code>, <code>Contact</code>.</p>
                    </div>
                    <div>
                        <Field v-model="config.tiktok_pixel_id" :field="{ type: 'text', name: 'tracking_tiktok_pixel_id', label: 'Mã TikTok Pixel ID', placeholder: 'vd: C1234567890ABCDEFG' }" />
                        <p class="text-[11px] text-gray-500 mt-1">Chỉ điền mã Pixel ID của TikTok Ads. Tự động đo <code>PageView</code>, <code>SubmitForm</code>, <code>Contact</code>.</p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4">
                <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h4 class="text-sm font-bold text-gray-900">3. Mã Script Tuỳ Chỉnh Nâng Cao (Tuỳ chọn)</h4>
                    <span class="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Chỉ dùng khi cần nhúng thêm mã khác</span>
                </div>
                <Field v-model="config.inject_head" :field="{ type: 'textarea', name: 'tracking_inject_head', label: 'Mã Script Tuỳ Chỉnh Trong <Head>', placeholder: 'Dán thẻ <script>...<\/script> hoặc <meta> riêng của Sale (nếu có)...', rows: 3 }" />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field v-model="config.inject_body_start" :field="{ type: 'textarea', name: 'tracking_inject_body_start', label: 'Mã Script Ngay Sau <Body>', placeholder: 'vd: <noscript> GTM của Sale...', rows: 2 }" />
                    <Field v-model="config.inject_body_end" :field="{ type: 'textarea', name: 'tracking_inject_body_end', label: 'Mã Script Trước </Body>', placeholder: 'vd: Mã livechat hoặc widget riêng...', rows: 2 }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export function normalizeTrackingConfig(raw) {
    let parsed = raw
    if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed) } catch (e) { parsed = {} }
    }
    const tc = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {}
    return {
        google_ads_id: tc.google_ads_id ?? '',
        google_ads_form_label: tc.google_ads_form_label ?? '',
        google_ads_call_label: tc.google_ads_call_label ?? '',
        google_ads_zalo_label: tc.google_ads_zalo_label ?? '',
        gtm_id: tc.gtm_id ?? '',
        facebook_pixel_id: tc.facebook_pixel_id ?? '',
        tiktok_pixel_id: tc.tiktok_pixel_id ?? '',
        inject_head: tc.inject_head ?? '',
        inject_body_start: tc.inject_body_start ?? '',
        inject_body_end: tc.inject_body_end ?? '',
    }
}

export default {
    props: {
        config: { type: Object, default: null },
        consultantName: { type: String, default: '' },
        isLdpSync: { type: Boolean, default: false },
    },
}
</script>
