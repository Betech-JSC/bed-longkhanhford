<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header font-bold text-gray-700">Thông tin dòng xe bảo dưỡng</div>
                <div class="card-body">

                    <Field
                        v-model="formData.title"
                        :field="{
                            type: 'text',
                            name: 'title',
                            label: 'Tên dòng xe bảo dưỡng',
                            placeholder: 'vd: Ford Ranger, Ford Everest',
                        }"
                    />

                    <Field
                        v-model="formData.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            label: 'Ảnh đại diện xe',
                        }"
                    />

                    <!-- Lịch bảo dưỡng & file PDF -->
                    <div class="border-t border-gray-200 pt-4 mt-6">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm font-bold text-gray-700">Danh sách File lịch bảo dưỡng (PDF)</span>
                            <button type="button" class="btn btn-secondary btn-sm" @click="addLink">
                                + Thêm link bảo dưỡng
                            </button>
                        </div>
                        
                        <div class="space-y-3">
                            <div v-for="(link, index) in formData.links" :key="index" class="flex gap-3 items-center bg-gray-50 border p-3 rounded-lg border-gray-200">
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Nhãn hiển thị</label>
                                        <input 
                                            v-model="link.label" 
                                            type="text" 
                                            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                            placeholder="vd: Fiesta 2011 - 2013" 
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Đường dẫn tài liệu PDF</label>
                                        <input 
                                            v-model="link.url" 
                                            type="text" 
                                            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                            placeholder="https://..." 
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    class="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer shrink-0 transition"
                                    @click="removeLink(index)"
                                    title="Xóa link này"
                                >
                                    ✕
                                </button>
                            </div>
                            <div v-if="!formData.links || formData.links.length === 0" class="text-xs text-gray-400 italic py-2 text-center">
                                Chưa có file lịch bảo dưỡng nào. Hãy ấn nút "Thêm link bảo dưỡng" ở trên.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="formData.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: schema.columns.status.list,
                        }"
                    />
                    <Field
                        v-model="formData.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự hiển thị',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema'],
    data() {
        return {
            formData: this.initFormData(this.item),
        }
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
                sort_order: 0,
                title: '',
                image: null,
                links: [],
                ...item,
            };
            if (!data.links || !Array.isArray(data.links)) {
                data.links = [];
            }
            return data;
        },
        addLink() {
            if (!this.formData.links) {
                this.formData.links = [];
            }
            this.formData.links.push({ label: '', url: '' });
        },
        removeLink(index) {
            if (this.formData.links) {
                this.formData.links.splice(index, 1);
            }
        }
    }
}
</script>
