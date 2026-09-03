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
                    let raw = c['Ghi chú yêu cầu thêm'] || c['Nội dung yêu cầu'] || c['Nội dung cần hỗ trợ'] || c['Message'] || c['Nội dung'] || '--';
                    if (typeof raw === 'string') {
                        return raw.replace('[Đăng ký tư vấn từ popup trang chủ] - Nội dung quan tâm: ', '').replace('[Đăng ký tư vấn từ popup trang chủ]', '');
                    }
                    return '--';
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
