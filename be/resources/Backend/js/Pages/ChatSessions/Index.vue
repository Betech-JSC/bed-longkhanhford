<template layout>
    <Table
        :schema="schema"
        :columns="displayColumns"
        :config="{
            canCreate: false,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
    computed: {
        displayColumns() {
            return [
                'id',
                'session_id',
                {
                    field: 'lead_score',
                    transform: (data) => {
                        const badges = {
                            hot: 'bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded text-xs font-bold uppercase',
                            warm: 'bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded text-xs font-bold uppercase',
                            cold: 'bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-bold uppercase'
                        };
                        const label = {
                            hot: '🔥 NÓNG (Hot Lead)',
                            warm: '⚡ ẤM (Warm)',
                            cold: '❄️ LẠNH (Cold)'
                        };
                        const badgeClass = badges[data.lead_score] || badges.cold;
                        const text = label[data.lead_score] || data.lead_score;
                        return `<span class="${badgeClass}">${text}</span>`;
                    },
                    raw: true
                },
                'interested_vehicle',
                {
                    field: 'contact_info',
                    transform: (data) => {
                        if (!data.contact_info) return '—';
                        const info = [];
                        if (data.contact_info.name) info.push(data.contact_info.name);
                        if (data.contact_info.phone) info.push(data.contact_info.phone);
                        if (data.contact_info.email) info.push(data.contact_info.email);
                        return info.join(' - ') || '—';
                    }
                },
                'notified',
                'created_at'
            ];
        }
    }
};
</script>
