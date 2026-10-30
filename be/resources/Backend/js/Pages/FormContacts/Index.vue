<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Nguồn / Loại Form',
                transform: (data) => {
                    const c = data.data_contact || {};
                    const msg = c['Message'] || c['Nội dung'] || c['Nội dung cần hỗ trợ'] || '';
                    if (msg.includes('[Đăng ký tư vấn từ popup trang chủ]')) {
                        return '🎯 Popup tư vấn trang chủ';
                    }
                    if (msg.includes('[Đăng ký tư vấn từ bài viết')) {
                        return '📰 Tư vấn bài viết tin tức';
                    }
                    if (data.type === 'NEW_CAR_QUOTE_FORM') {
                        const car = c['Dòng xe quan tâm'] || c['Xe quan tâm'] || c['Loại xe'] || 'Tất cả các dòng';
                        return `💰 Báo giá xe mới (${car})`;
                    }
                    if (data.type === 'REPAIR_QUOTE_FORM') {
                        const car = c['Loại xe'] || c['Dòng xe'] || '';
                        return `🔧 Báo giá sửa chữa ${car ? `(${car})` : ''}`;
                    }
                    if (data.type === 'ADVISE_FORM') {
                        return '🚗 Tư vấn sản phẩm';
                    }
                    if (data.type === 'TEST_DRIVE') {
                        return '🚘 Đăng ký lái thử';
                    }
                    if (data.type === 'APPLY_FORM') {
                        return '💼 Tuyển dụng';
                    }
                    if (data.type === 'LDP_CLICK_CALL') {
                        return '📞 Click Gọi điện trên LDP';
                    }
                    if (data.type === 'LDP_CLICK_ZALO') {
                        return '💬 Click Chat Zalo trên LDP';
                    }
                    return '🌐 Form liên hệ website';
                }
            },
            {
                field: 'Họ và tên',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Họ và tên'] || c.Name || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Số điện thoại'] || c.Phone || '';
                }
            },
            {
                field: 'Email',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['E-mail'] || c.Email || '--';
                }
            },
            {
                field: 'Nội dung yêu cầu / Lời nhắn',
                transform: (data) => {
                    const c = data.data_contact || {};
                    if (data.type === 'LDP_CLICK_CALL' || data.type === 'LDP_CLICK_ZALO') {
                        const btnPos = c['Vị trí nút bấm trên trang'] || c['Vị trí nút bấm'] || '';
                        const carView = c['Dòng xe khách đang xem'] || '';
                        const parts = [btnPos ? `Nút: ${btnPos}` : '', carView ? `Xe: ${carView}` : ''].filter(Boolean);
                        if (parts.length > 0) return parts.join(' • ');
                    }
                    let raw = c['Ghi chú yêu cầu thêm'] || c['Nội dung yêu cầu'] || c['Nội dung cần hỗ trợ'] || c['Message'] || c['Nội dung'] || '--';
                    if (typeof raw === 'string') {
                        return raw.replace('[Đăng ký tư vấn từ popup trang chủ] - Nội dung quan tâm: ', '').replace('[Đăng ký tư vấn từ popup trang chủ]', '');
                    }
                    return '--';
                }
            },
            {
                field: 'Nguồn Landing Page',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    const consultantName = data?.sales_consultant?.name || c['Cố vấn phụ trách'] || '';
                    if (consultantName) {
                        const cleanName = String(consultantName).replace(/\s*\(SĐT:.*\)$/i, '').trim();
                        return `LDP TVBH - ${cleanName}`;
                    }
                    if (c.landing_page_id || c.sales_email || data?.sales_consultant_id) {
                        return c.sales_email ? `LDP TVBH (${c.sales_email})` : 'LDP TVBH';
                    }
                    return 'Trang chính Đại lý';
                }
            },
            'status',
            'created_at',
        ]"
        :config="{
            canCreate: false,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
