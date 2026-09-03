<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Họ và tên',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Họ và tên'] || c['Name'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Số điện thoại'] || c['Phone'] || '';
                }
            },
            {
                field: 'Chi tiết dịch vụ đăng ký',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    if (data?.type === 'REPAIR_QUOTE_FORM' || c['Gói dịch vụ'] || c['Mốc bảo dưỡng']) {
                        const pkg = c['Gói dịch vụ'] || 'Báo giá sửa chữa';
                        const km = c['Mốc bảo dưỡng'] ? ` (${c['Mốc bảo dưỡng']})` : '';
                        const car = c['Loại xe'] || c['Dòng xe'] ? ` - ${c['Loại xe'] || c['Dòng xe']}` : '';
                        return `${pkg}${km}${car}`;
                    }
                    if (data?.type === 'SERVICE_BOOKING') {
                        return 'Đặt hẹn dịch vụ trực tuyến';
                    }
                    return 'Dịch vụ bảo dưỡng & sửa chữa';
                }
            },
            {
                field: 'Biển số xe',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Biển số xe'] || '--';
                }
            },
            {
                field: 'Thời gian hẹn',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Thời gian hẹn'] || '--';
                }
            },
            {
                field: 'Địa điểm',
                transform: (data) => {
                    const c = data?.data_contact || {};
                    return c['Địa điểm làm dịch vụ'] || c['Tại'] || 'Tại đại lý';
                }
            },
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
