<template layout>
    <div class="lg:p-6">
        <div class="mb-3">
            <FlashMessages />
        </div>
        <TabView>
            <TabPanel header="Closed">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="closed.status"
                            :field="{
                                type: 'radio_list',
                                name: 'status',
                                label: 'Trạng thái',
                                options: [
                                    { id: 'open', label: 'Hoạt động' },
                                    { id: 'closed', label: 'Bảo trì' },
                                    { id: 'timer', label: 'Theo thời gian' },
                                ],
                            }"
                        />
                        <div v-if="closed.status == 'timer'" class="flex items-center space-x-2 group">
                            <Field
                                class="w-1/2"
                                v-model="closed.time_closed"
                                :field="{
                                    type: 'datetime-local',
                                    name: 'time_closed',
                                    label: 'Thời gian bảo trì',
                                }"
                            />
                            <Field
                                class="w-1/2"
                                v-model="closed.time_open"
                                :field="{
                                    type: 'datetime-local',
                                    name: 'time_open',
                                    label: 'Thời gian trở lại',
                                }"
                            />
                        </div>
                        <Button label="Lưu" class="btn-primary outline-0" @click="store('closed', closed)" />
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
<script>
import FlashMessages from '@Core/Components/FlashMessages.vue'
export default {
    components: { FlashMessages },
    props: ['item', 'schema'],
    data() {
        return {
            flashSale: this.item.flash_sale,
            featuredProduct: this.item.featured_product,
            featuredCategory: this.item.featured_category,
            topCategory: this.item.top_category,
            closed: this.item.closed,
            menuCategory: this.item.menu_category,
            search: this.item.search,
            shipping: this.item.shipping,
            promotion: this.item.promotion,
            footerRedirect: this.item.footer_redirect,
        }
    },
    methods: {
        store(id, data) {
            const locale = this.getCurrentLocale()
            this.$inertia.post(this.route(locale + `.admin.configs.store`, { id }), data)
        },
        confirmRemoveItemSearch(index) {
            if (confirm('Bạn có thực sự muốn xoá đối tượng này?')) {
                this.search.keywords.splice(index, 1)
            }
        },
    },
}
</script>
