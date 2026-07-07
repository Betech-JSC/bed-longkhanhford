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
                        <div
                            v-if="closed.status == 'timer'"
                            class="flex items-center space-x-2 group"
                        >
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
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('closed', closed)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Phí ship">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="shipping.default"
                            :field="{
                                type: 'money',
                                name: 'default',
                                label: 'Phí ship mặc định'
                            }"
                        />
                        <Field
                            v-model="shipping.free_shipping"
                            :field="{
                                type: 'money',
                                name: 'free_shipping',
                                label: 'Hạn mức free ship'
                            }"
                        />
                        <Field
                            v-model="shipping.product_count"
                            :field="{
                                type: 'number',
                                name: 'product_count',
                                label: 'Số lượng sản phẩm'
                            }"
                        />
                        <Field
                            v-model="shipping.free_shipping_vnp"
                            :field="{
                                type: 'checkbox',
                                name: 'free_shipping_vnp',
                            }"
                        />
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('shipping', shipping)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Flash sale">
                <div class="card">
                    <div class="card-header"></div>
                    <div class="card-body">
                        <Field
                            v-model="flashSale.image_title"
                            :field="{
                                type: 'file_upload',
                                name: 'image_title',
                                label: 'Hình tiêu đề',
                            }"
                        />
                        <Field
                            v-model="flashSale.background_image"
                            :field="{
                                type: 'file_upload',
                                name: 'background_image',
                                label: 'Hình nền',
                            }"
                        />
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('flash-sale', flashSale)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Sản phẩm nổi bật">
                <div class="card">
                    <div class="card-body">
                        <!-- <Field
                            v-model="featuredProduct.image_title"
                            :field="{
                                type: 'file_upload',
                                name: 'image_title',
                                label: 'Hình tiêu đề',
                            }"
                        /> -->
                        <Field
                            class="w-full mr-2"
                            v-model="featuredProduct.title"
                            :field="{
                                type: 'text',
                                name: 'title',
                                label: 'Tiêu đề',
                            }"
                        />
                        <Field
                            class="w-full mr-2"
                            v-model="featuredProduct.text_color"
                            :field="{
                                type: 'text',
                                name: 'text_color',
                                label: 'Mã màu (Hex Code #RRGGBB)',
                            }"
                        />
                        <Field
                            v-model="featuredProduct.background_image"
                            :field="{
                                type: 'file_upload',
                                name: 'background_image',
                                label: 'Hình nền',
                            }"
                        />
                        <Field
                            v-model="featuredProduct.products"
                            :field="{
                                type: 'select_multiple',
                                name: 'products',
                                labelBy: 'title',
                                source: {
                                    model: 'JamstackVietnam\\Product\\Models\\Product',
                                    method: 'get',
                                    only: ['id', 'title'],
                                },
                            }"
                        />
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('featured-products', featuredProduct)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Gợi ý tìm kiếm">
                <div class="card">
                    <div class="card-body">
                        <div
                            v-for="(item, index) in search.keywords"
                            :key="index"
                            class="my-2 bg-white rounded-md"
                        >
                            <div class="flex">
                                <Field
                                    class="w-full mr-2"
                                    v-model="item.title"
                                    :field="{
                                        type: 'text',
                                        name: 'title',
                                        label: 'Từ khóa',
                                    }"
                                />
                                    <div
                                        @click="confirmRemoveItemSearch(index)"
                                        class="ml-auto border rounded cursor-pointer text-gray500 hover:text-gray-700 hover:bg-gray-100 h-[24px] mt-[50px]"
                                    >
                                        <material-symbols:delete-outline-sharp />
                                    </div>
                            </div>
                        </div>
                        <div class="mt-4 mb-6">
                            <Button
                                label="Thêm "
                                variant="white"
                                @click="
                                    this.search.keywords.push({
                                        title: null,
                                    })
                                "
                            />
                        </div>
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('search', search)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Footer - Về chúng tôi">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="footerRedirect.about"
                            :field="{
                                type: 'text',
                                name: 'about',
                                label: 'Link - Báo chí nói về chúng tôi',
                            }"
                        />
                        <Field
                            v-model="footerRedirect.job"
                            :field="{
                                type: 'text',
                                name: 'job',
                                label: 'Link - Thông tin tuyển dụng',
                            }"
                        />
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('footer-redirect', footerRedirect)"
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Khuyến mãi">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="promotion.content"
                            :field="{
                                type: 'richtext',
                                name: 'content',
                                label: 'Nội dung',
                            }"
                        />
                        <Button
                            label="Lưu"
                            class="btn-primary outline-0"
                            @click="store('promotion', promotion)"
                        />
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
<script>
import FlashMessages from "@Core/Components/FlashMessages.vue";
export default {
    components: { FlashMessages },
    props: ["item", "schema"],
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
            footerRedirect: this.item.footer_redirect
        };
    },
    methods: {
        store(id, data) {
            const locale = this.getCurrentLocale();
            this.$inertia.post(
                this.route(locale + `.admin.configs.store`, { id }),
                data
            );
        },
        confirmRemoveItemSearch(index) {
            if (confirm("Bạn có thực sự muốn xoá đối tượng này?")) {
            this.search.keywords.splice(index, 1);
            }
        },
    },
};
</script>
