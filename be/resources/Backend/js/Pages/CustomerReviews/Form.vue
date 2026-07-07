<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <!-- ===== LOCALE TABS ===== -->
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">🇬🇧 English</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body mt-4">

                    <!-- Dòng xe liên kết (không dịch) -->
                    <Field
                        v-model="form.vehicle_id"
                        :field="{
                            type: 'dropdown',
                            name: 'vehicle_id',
                            label: 'Dòng xe liên kết',
                            keyBy: 'id',
                            labelBy: 'title',
                            options: products,
                            emptyLabel: '— Đánh giá chung (không gắn dòng xe) —',
                        }"
                    />

                    <!-- Số sao (không dịch) -->
                    <Field
                        v-model="form.rating"
                        :field="{
                            type: 'radio_list',
                            name: 'rating',
                            label: 'Đánh giá (sao)',
                            options: [
                                { id: 5, label: '⭐⭐⭐⭐⭐  (5 sao)' },
                                { id: 4, label: '⭐⭐⭐⭐  (4 sao)' },
                                { id: 3, label: '⭐⭐⭐  (3 sao)' },
                                { id: 2, label: '⭐⭐  (2 sao)' },
                                { id: 1, label: '⭐  (1 sao)' },
                            ],
                        }"
                    />

                    <!-- Tên khách hàng (dịch) -->
                    <Field
                        v-model="form[currentTab].customer_name"
                        :field="{
                            type: 'text',
                            name: `customer_name_${currentTab}`,
                            label: 'Tên khách hàng',
                            placeholder: 'vd: colinandmandy94',
                        }"
                    />

                    <!-- Nội dung đánh giá (dịch) -->
                    <Field
                        v-model="form[currentTab].content"
                        :field="{
                            type: 'textarea',
                            name: `content_${currentTab}`,
                            label: 'Nội dung đánh giá',
                            placeholder: 'Does exactly what it says...',
                        }"
                    />

                    <!-- Ảnh feedback (không dịch) -->
                    <Field
                        v-model="form.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            label: 'Ảnh feedback',
                            help: 'Ảnh thực tế từ khách hàng',
                        }"
                    />
                </div>
            </div>
        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: schema.columns.status.list,
                        }"
                    />
                    <Field
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự hiển thị',
                        }"
                    />
                </div>
            </div>

            <!-- Preview card -->
            <div class="card mt-4">
                <div class="card-header">Preview</div>
                <div class="card-body">
                    <div class="text-yellow-400 text-lg mb-2">
                        {{ '⭐'.repeat(formData.rating || 5) }}
                    </div>
                    <p class="text-sm text-gray-600 mb-4 italic">
                        "{{ formData[currentTab]?.content || 'Nội dung đánh giá...' }}"
                    </p>
                    <p class="font-semibold text-sm">{{ formData[currentTab]?.customer_name || 'Tên khách hàng' }}</p>
                    <p class="text-xs text-gray-400 uppercase">
                        {{ vehicleTitle }}
                    </p>
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema', 'data'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            products: this.data?.products ?? [],
            formData: this.initFormData(this.item),
        }
    },

    computed: {
        vehicleTitle() {
            if (!this.formData.vehicle_id) return '— Đánh giá chung —'
            const p = this.products.find(p => p.id === this.formData.vehicle_id)
            return p ? p.title.toUpperCase() : ''
        },
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                rating: 5,
                sort_order: 0,
                vehicle_id: null,
                image: null,
                ...item,
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    customer_name: trans ? (trans.customer_name ?? '') : (loc === 'vi' ? (item.customer_name ?? '') : ''),
                    content:       trans ? (trans.content       ?? '') : (loc === 'vi' ? (item.content       ?? '') : ''),
                }
            })
            return data
        },
    },
}
</script>
