<template layout>
    <Head :title="tt('models.titles.meta_page')" />
    <WrapSetting>
        <Form
            v-model="formData"
            :config="{
                resource: 'settings.meta-pages',
                canDestroy: item.can_created,
                addGrid: false,
            }"
        >
            <template #default="{ form }">
                <div class="pt-6 card">
                    <div class="card-body">
                        <Field
                            v-model="form.url"
                            :disabled="!item.can_created"
                            :field="{
                                name: 'url',
                                label: 'URL',
                            }"
                        />
                    </div>
                </div>
                <SeoFields
                    :modelValue="form"
                    @update:modelValue="form = $event"
                    :config="{
                        hiddenFields: ['seo_slug'],
                    }"
                />
            </template>
        </Form>
    </WrapSetting>
</template>
<script>
export default {
    props: ["item", "schema"],
    data() {
        return {
            formData: this.item,
        };
    },
};
</script>
