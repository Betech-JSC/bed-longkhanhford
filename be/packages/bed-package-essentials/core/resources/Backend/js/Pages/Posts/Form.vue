<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.title"
                        :field="{
                            type: 'text',
                            name: 'title',
                            label: 'Tiêu đề',
                        }"
                    />
                    <small v-if="form.id">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="item" target="_blank" class="link">{{ decodeURI(item) }}</a
                            ><br />
                        </span>
                    </small>
                    <Field
                        v-model="form.description"
                        :field="{
                            type: 'textarea',
                            name: 'description',
                            label: 'Mô tả',
                        }"
                    />
                    <Field
                        v-model="form.content"
                        :field="{
                            type: 'richtext',
                            name: 'content',
                            label: 'Nội dung',
                        }"
                    />
                </div>
            </div>
            <SeoFields :modelValue="form" @update:modelValue="form = $event" />
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
                        v-model="form.published_at"
                        :field="{
                            type: 'date',
                            name: 'published_at',
                            label: 'Ngày xuất bản',
                        }"
                    />
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.items"
                        :field="{
                            type: 'select_tree',
                            mode: 'multiple',
                            name: 'items',
                            label: 'Danh mục',
                            keyBy: 'key',
                            labelBy: 'label',
                            options: [
                                {
                                    key: '0',
                                    label: 'Documents',
                                    data: 'Documents Folder',
                                    icon: 'pi pi-fw pi-inbox',
                                    children: [
                                        {
                                            key: '0-0',
                                            label: 'Work',
                                            data: 'Work Folder',
                                            icon: 'pi pi-fw pi-cog',
                                            children: [
                                                {
                                                    key: '0-0-0',
                                                    label: 'Expenses.doc',
                                                    icon: 'pi pi-fw pi-file',
                                                    data: 'Expenses Document',
                                                },
                                                {
                                                    key: '0-0-1',
                                                    label: 'Resume.doc',
                                                    icon: 'pi pi-fw pi-file',
                                                    data: 'Resume Document',
                                                },
                                            ],
                                        },
                                        {
                                            key: '0-1',
                                            label: 'Home',
                                            data: 'Home Folder',
                                            icon: 'pi pi-fw pi-home',
                                            children: [
                                                {
                                                    key: '0-1-0',
                                                    label: 'Invoices.txt',
                                                    icon: 'pi pi-fw pi-file',
                                                    data: 'Invoices for this month',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    key: '1',
                                    label: 'Events',
                                    data: 'Events Folder',
                                    icon: 'pi pi-fw pi-calendar',
                                    children: [
                                        {
                                            key: '1-0',
                                            label: 'Meeting',
                                            icon: 'pi pi-fw pi-calendar-plus',
                                            data: 'Meeting',
                                        },
                                        {
                                            key: '1-1',
                                            label: 'Product Launch',
                                            icon: 'pi pi-fw pi-calendar-plus',
                                            data: 'Product Launch',
                                        },
                                        {
                                            key: '1-2',
                                            label: 'Report Review',
                                            icon: 'pi pi-fw pi-calendar-plus',
                                            data: 'Report Review',
                                        },
                                    ],
                                },
                                {
                                    key: '2',
                                    label: 'Movies',
                                    data: 'Movies Folder',
                                    icon: 'pi pi-fw pi-star-fill',
                                    children: [
                                        {
                                            key: '2-0',
                                            icon: 'pi pi-fw pi-star-fill',
                                            label: 'Al Pacino',
                                            data: 'Pacino Movies',
                                            children: [
                                                {
                                                    key: '2-0-0',
                                                    label: 'Scarface',
                                                    icon: 'pi pi-fw pi-video',
                                                    data: 'Scarface Movie',
                                                },
                                                {
                                                    key: '2-0-1',
                                                    label: 'Serpico',
                                                    icon: 'pi pi-fw pi-video',
                                                    data: 'Serpico Movie',
                                                },
                                            ],
                                        },
                                        {
                                            key: '2-1',
                                            label: 'Robert De Niro',
                                            icon: 'pi pi-fw pi-star-fill',
                                            data: 'De Niro Movies',
                                            children: [
                                                {
                                                    key: '2-1-0',
                                                    label: 'Goodfellas',
                                                    icon: 'pi pi-fw pi-video',
                                                    data: 'Goodfellas Movie',
                                                },
                                                {
                                                    key: '2-1-1',
                                                    label: 'Untouchables',
                                                    icon: 'pi pi-fw pi-video',
                                                    data: 'Untouchables Movie',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
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
            formData: this.item,
        }
    },
}
</script>
