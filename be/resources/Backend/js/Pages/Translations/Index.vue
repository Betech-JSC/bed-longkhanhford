<template layout>
    <Head :title="tt('models.titles.translation')" />
    <DataTable :value="items" responsiveLayout="scroll" :loading="loading">
        <Column field="key" :header="tt('models.translations.default')">
            <template #body="{ data }">
                <div>
                    <Image
                        v-if="isImage(data.key)"
                        :src="data.key"
                        width="80"
                        preview
                    />
                    <div v-html="data.key" class="break-words"></div>
                </div>
            </template>
        </Column>
        <Column field="translations" :header="tt('models.translations.translation')">
            <template #body="{ data }">
                <table>
                    <template
                        v-for="(locale, index) in $page.props.locale.list"
                    >
                        <tr>
                            <td class="w-10 label">
                                {{ locale.toUpperCase() }}
                            </td>
                            <td>
                                <CustomEditor
                                    v-if="isHTML(data.key)"
                                    :modelValue="data.translations[locale]"
                                    @change="
                                        data.translations[locale] = $event;
                                        updateTranslation(
                                            $event,
                                            data.key,
                                            locale
                                        );
                                    "
                                    :field="{ size: 'sm' }"
                                />
                                <InputUpload
                                    v-else-if="isImage(data.key)"
                                    @change="
                                        data.translations[locale] = $event;
                                        updateTranslation(
                                            $event,
                                            data.key,
                                            locale
                                        );
                                    "
                                    :modelValue="data.translations[locale]"
                                    :field="{ urlOnly: true }"
                                />
                                <Textarea
                                    v-else-if="data.key.length > 100"
                                    v-model="data.translations[locale]"
                                    @blur="
                                        updateTranslation(
                                            $event.target.value,
                                            data.key,
                                            locale
                                        )
                                    "
                                />
                                <InputText
                                    v-else
                                    v-model="data.translations[locale]"
                                    @blur="
                                        updateTranslation(
                                            $event.target.value,
                                            data.key,
                                            locale
                                        )
                                    "
                                />
                            </td>
                        </tr>
                    </template>
                </table>
            </template>
        </Column>
    </DataTable>
</template>
<script>
import CustomEditor from "@Core/Components/Form/Custom/CustomEditor.vue";
import InputUpload from "@Core/Components/Form/InputUpload.vue";
export default {
    components: {
        CustomEditor,
        InputUpload,
    },
    props: ["schema"],
    data() {
        return {
            items: null,
            loading: false,
        };
    },

    mounted() {
        this.loadLazyData();
    },

    methods: {
        loadLazyData() {
            this.loading = true;
            this.$axios
                .get(this.route(`admin.translations.index`))
                .then((res) => {
                    const data = res.data;
                    this.loading = false;
                    this.items = data;
                });
        },
        updateTranslation(value, key, locale) {
            this.$axios.post(this.route(`admin.translations.store`), {
                value,
                key,
                locale,
            });
        },
        isHTML(string) {
            return /(<([^>]+)>)/.test(string);
        },
    },
};
</script>

<style lang="scss">
.p-datatable tr td:first-child {
    max-width: 40vw;
}
</style>
