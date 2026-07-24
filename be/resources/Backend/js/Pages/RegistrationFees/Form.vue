<template layout>
    <Head :title="tt('models.table_list.registration-fees')" />
    <WrapSetting>
        <Form v-model="formData" v-slot="{ form }" :config="{ resource: 'registration-fees' }">
            <div class="card">
                <div class="card-header">Thông tin cấu hình Thuế & Lệ phí</div>
                <div class="card-body">
                    <Field v-model="form.region_id" :field="{
                        type: 'dropdown',
                        name: 'region_id',
                        label: 'Tỉnh / Thành phố',
                        keyBy: 'id',
                        labelBy: 'title',
                        options: regions,
                        emptyLabel: '-- Chọn Tỉnh / Thành phố --',
                    }" />

                    <Field v-model="form.registration_tax_percent" :field="{
                        type: 'number',
                        name: 'registration_tax_percent',
                        label: 'Thuế trước bạ (%)',
                    }" />

                    <Field v-model="form.license_plate_fee" :field="{
                        type: 'number',
                        name: 'license_plate_fee',
                        label: 'Lệ phí biển số (đ)',
                    }" />

                    <Field v-model="form.inspection_fee" :field="{
                        type: 'number',
                        name: 'inspection_fee',
                        label: 'Phí đăng kiểm (đ)',
                    }" />

                    <Field v-model="form.road_maintenance_fee" :field="{
                        type: 'number',
                        name: 'road_maintenance_fee',
                        label: 'Phí bảo trì đường bộ (12 tháng) (đ)',
                    }" />

                    <Field v-model="form.civil_insurance_fee" :field="{
                        type: 'number',
                        name: 'civil_insurance_fee',
                        label: 'Phí bảo hiểm TNDS bắt buộc (12 tháng) (đ)',
                    }" />

                    <Field v-model="form.service_fee" :field="{
                        type: 'number',
                        name: 'service_fee',
                        label: 'Phí dịch vụ đăng ký (đ)',
                    }" />
                </div>
            </div>
        </Form>
    </WrapSetting>
</template>
<script>
import WrapSetting from '@Core/Components/WrapSetting.vue'
export default {
    components: { WrapSetting },
    props: ['item', 'schema', 'data'],
    data() {
        return {
            formData: this.item,
            regions: this.data?.regions ?? [],
        }
    },
}
</script>
