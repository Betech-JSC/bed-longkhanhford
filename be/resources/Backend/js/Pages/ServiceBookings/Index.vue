<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Họ và tên',
                transform: (data) => {
                    return data.data_contact['Họ và tên'] || data.data_contact['Name'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    return data.data_contact['Số điện thoại'] || data.data_contact['Phone'] || '';
                }
            },
            {
                field: 'Chi tiết dịch vụ đăng ký',
                transform: (data) => {
                    const c = data.data_contact || {};
                    if (data.type === 'REPAIR_QUOTE_FORM' || c['Gói dịch vụ'] || c['Mốc bảo dưỡng']) {
                        const pkg = c['Gói dịch vụ'] || 'Báo giá sửa chữa';
                        const km = c['Mốc bảo dưỡng'] ? ` (${c['Mốc bảo dưỡng']})` : '';
                        const car = c['Loại xe'] || c['Dòng xe'] ? ` - ${c['Loại xe'] || c['Dòng xe']}` : '';
                        return `${pkg}${km}${car}`;
                    }
                    if (data.type === 'SERVICE_BOOKING') {
                        return 'Đặt hẹn dịch vụ trực tuyến';
                    }
                    return 'Dịch vụ bảo dưỡng & sửa chữa';
                }
            },
            {
                field: 'Biển số xe',
                transform: (data) => {
                    return data.data_contact['Biển số xe'] || '--';
                }
            },
            {
                field: 'Thời gian hẹn',
                transform: (data) => {
                    return data.data_contact['Thời gian hẹn'] || '--';
                }
            },
            {
                field: 'Địa điểm',
                transform: (data) => {
                    return data.data_contact['Địa điểm làm dịch vụ'] || data.data_contact['Tại'] || 'Tại đại lý';
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
