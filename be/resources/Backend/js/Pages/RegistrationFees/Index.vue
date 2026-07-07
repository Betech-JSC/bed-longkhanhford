<template layout>
    <Table
        :schema="schema"
        :columns="displayColumns"
    />
</template>
<script>
export default {
    props: ['schema', 'data'],
    data() {
        return {
            regions: this.data?.regions ?? [],
        }
    },
    computed: {
        displayColumns() {
            return [
                'id',
                {
                    field: 'region_id',
                    label: 'Tỉnh / Thành phố',
                    transform: (data) => {
                        return data.region ? data.region.name : '—'
                    }
                },
                'registration_tax_percent',
                'license_plate_fee',
                'inspection_fee',
                'road_maintenance_fee',
                'civil_insurance_fee',
                'service_fee',
                'created_at',
            ]
        }
    }
}
</script>
