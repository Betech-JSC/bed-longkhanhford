<template layout>
    <Table
        :schema="schema"
        :columns="displayColumns"
    />
</template>
<script>
export default {
    props: ['schema', 'data'],
    computed: {
        displayColumns() {
            return [
                'id',
                {
                    field: 'sales_consultant_id',
                    label: 'Cố vấn bán hàng',
                    transform: (row) => row.sales_consultant ? row.sales_consultant.name : '—'
                },
                {
                    field: 'vehicle_id',
                    label: 'Dòng xe áp dụng',
                    transform: (row) => {
                        if (row.vehicles_list && row.vehicles_list.length > 0) {
                            return row.vehicles_list.map(v => v.title).join(', ');
                        }
                        return row.vehicle ? row.vehicle.title : '—';
                    }
                },
                {
                    field: 'urls',
                    label: 'Đường dẫn LDP',
                    transform: (row) => {
                        if (!row.sales_consultant) return '—';
                        const consultantSlug = row.sales_consultant.slug || this.slugify(row.sales_consultant.name);
                        let clientUrl = '';
                        const origin = window.location.origin;
                        const hostname = window.location.hostname;
                        const port = window.location.port;

                        if (port === '8000' || hostname === 'localhost' || hostname === '127.0.0.1') {
                            clientUrl = origin.replace(':8000', ':3000');
                        } else {
                            clientUrl = 'https://longkhanhford.com.vn';
                        }

                        let vehicles = row.vehicles_list || [];
                        if (vehicles.length === 0 && row.vehicle) {
                            vehicles = [row.vehicle];
                        }
                        if (vehicles.length === 0) return '—';

                        if (row.sales_consultant.custom_domain) {
                            const cleanDomain = row.sales_consultant.custom_domain.replace(/^https?:\/\//i, '').replace(/\/$/, '');
                            return vehicles.map(v => `https://${cleanDomain}/${v.slug}`).join('\n');
                        }

                        return vehicles.map(v => `${clientUrl}/ldp/${consultantSlug}/${v.slug}`).join('\n');
                    }
                },
                'status',
                'created_at',
            ]
        }
    },
    methods: {
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }
    }
}
</script>
