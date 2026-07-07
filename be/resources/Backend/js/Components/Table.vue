<template>
    <DataTable
        :value="items"
        :lazy="true"
        :paginator="true"
        :rows="parseInt(lazyParams.per_page || 20)"
        :first="firstItem"
        :last="lastItem"
        v-model:filters="lazyParams.filters"
        ref="data-table"
        dataKey="id"
        :totalRecords="totalItems"
        :loading="loading"
        @page="onPage($event)"
        @sort="onSort($event)"
        @filter="onFilter($event)"
        @update:rows="onChangePerPage"
        responsiveLayout="scroll"
        v-model:selection="selectedItems"
        :selectAll="selectAll"
        @select-all-change="onSelectAllChange"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :currentPageReportTemplate="reportPageValue"
        :globalFilterFields="displayColumns.map((x) => x.field)"
    >
        <template #header v-if="!hideHeader">
            <div class="space-y-2">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center space-x-2">
                        <Link
                            v-if="canCreate"
                            class="p-button btn-primary"
                            :text="tt('models.table.create')"
                            :href="formUrl"
                        />
                        <a
                            v-if="canExport"
                            class="p-button btn-outline-primary"
                            :text="tt('models.table.export')"
                            :href="
                                route(`admin.${currentResource}.export`, { filters: lazyParams.filters, sellectIds })
                            "
                        />
                        <div
                            v-if="canImport"
                            :text="tt('models.table.import')"
                            class="btn btn-outline-primary"
                            @click.prevent="$refs.importBtn.click()"
                        >
                            <span>{{ tt('models.table.import') }}</span>
                        </div>
                        <input
                            type="file"
                            class="hidden"
                            accept=".xlsx, .xls, .csv"
                            ref="importBtn"
                            @input="
                                $inertia.post(
                                    this.route(`admin.${currentResource}.import`),
                                    { file: $event.target.files[0] },
                                    { forceFormData: true }
                                )
                            "
                        />
                        <button
                            v-if="selectedItems && selectedItems.length > 0 && canDestroy"
                            type="button"
                            class="p-button btn-danger ml-2 flex items-center gap-1 cursor-pointer"
                            @click="deleteSelected"
                        >
                            <heroicons-outline:trash class="w-4 h-4" />
                            <span>{{ tt('models.table.delete_selected') }} ({{ selectedItems.length }})</span>
                        </button>
                    </div>
                    <span v-if="sortByDate" class="w-1/2">
                        <div class="field-row">
                            <Field
                                v-model="filter_begin_time"
                                @change="onFilter()"
                                :field="{
                                    type: 'datetime-local',
                                    name: 'filter_begin_time',
                                }"
                            />
                            <Field
                                v-model="filter_end_time"
                                @change="onFilter()"
                                :field="{
                                    type: 'datetime-local',
                                    name: 'filter_end_time',
                                }"
                            />
                        </div>
                    </span>
                    <div class="ml-auto mr-2" v-if="$slots.filter">
                        <slot name="filter" :filters="lazyParams.filters"></slot>
                    </div>
                    <div class="p-input-icon-right w-[20rem]">
                        <heroicons-outline:search class="absolute right-2 h-full" />
                        <InputText
                            v-model="lazyParams.filters.global.value"
                            :placeholder="tt('models.table.search_load')"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template #empty>{{ tt('models.table.not_found') }}</template>
        <template #loading>{{ tt('models.table.loading') }}</template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="showCheckbox"></Column>
        <template v-if="displayColumns" v-for="(column, index) in displayColumns" :key="index">
            <Column
                :field="column.field"
                filterMatchMode="contains"
                :sortable="false"
                :header="tt('models.' + currentResource + '.' + column.label)"
            >
                <template #body="{ data }">
                    <Image
                        v-if="isImageCell(data, column)"
                        :src="staticUrl(data[column.field]?.path || (typeof data[column.field] === 'string' ? data[column.field] : null))"
                        imageClass="h-[80px] w-[80px] object-contain"
                        preview
                    />
                    <Link
                        v-else
                        :href="
                            route(`admin.${currentResource}.form`, {
                                id: data.id,
                            })
                        "
                        :preserve-state="true"
                    >
                        <span
                            v-if="getStyles(data, column)"
                            class="px-2 py-1 text-xs font-medium uppercase whitespace-pre rounded-sm"
                            :style="getStyles(data, column)"
                        >
                            {{ transformCell(data, column) }}
                        </span>
                        <span v-else v-html="transformCell(data, column)"> </span>
                    </Link>
                </template>
                <template #filter="{ filterCallback }" v-if="lazyParams.filters[column.field]">
                    <InputText
                        type="text"
                        v-model="lazyParams.filters[column.fields].value"
                        @keydown.enter="filterCallback()"
                        :placeholder="tt('models.table.search')"
                    />
                </template>
            </Column>
        </template>
        <Column header="Thao tác" headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center" v-if="canCreate || canDestroy">
            <template #body="{ data }">
                <div class="flex items-center justify-center space-x-3">
                    <Link
                        v-if="canCreate"
                        :href="route(`admin.${currentResource}.form`, { id: data.id })"
                        class="text-blue-500 hover:text-blue-750 transition inline-flex items-center"
                        title="Sửa"
                    >
                        <heroicons-outline:pencil class="w-5 h-5" />
                    </Link>
                    <button
                        v-if="canDestroy"
                        type="button"
                        class="text-red-500 hover:text-red-750 transition bg-transparent border-0 cursor-pointer p-0 inline-flex items-center"
                        @click="deleteSingle(data.id)"
                        title="Xóa"
                    >
                        <heroicons-outline:trash class="w-5 h-5" />
                    </button>
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<script>
import { FilterMatchMode } from 'primevue/api'

export default {
    props: {
        schema: {
            type: Object,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            items: null,
            totalItems: 0,
            loading: false,
            timer: null,
            firstItem: 1,
            lastItem: 20,
            reportPageValue:
                this.tt('models.table.from') +
                ' {first} ' +
                this.tt('models.table.to').toLowerCase() +
                ' {last} ' +
                this.tt('models.table.on_total').toLowerCase() +
                ' {totalRecords}',

            selectedItems: null,
            selectedIds: [],
            selectAll: false,

            mergedColumns: this.mergeColumns(),
            filter_begin_time: null,
            filter_end_time: null,
            lazyParams: this.getParams(),
        }
    },
    computed: {
        currentResource() {
            return this.config.resource ?? this.getResource()
        },
        tableName() {
            return this.config.name ?? this.tt('models.table_list.' + this.currentResource)
        },
        hideHeader() {
            return this.config.hideHeader === true || false
        },
        showCheckbox() {
            return this.config.showCheckbox ?? true
        },
        showFilter() {
            return this.config.showFilter ?? false
        },
        canDestroy() {
            return this.config.canDestroy ?? this.can('admin.' + this.currentResource + '.destroy')
        },
        formUrl() {
            return this.config.formUrl ?? this.route(`admin.${this.currentResource}.form`)
        },
        sortByDate() {
            return this.config.sortByDate ?? false
        },
        displayColumns() {
            return Object.values(this.mergedColumns)
                .filter((x) => x.display)
                .filter((x) => x.field !== 'slug' && x.field !== 'locale' && !x.field.includes('seo_'))
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .slice(0, 10)
        },
        canCreate() {
            return this.config.canCreate ?? this.can('admin.' + this.currentResource + '.form')
        },
        canExport() {
            let routeName = this.getCurrentLocale() + '.admin.' + this.currentResource + '.export'
            return (
                Object.keys(this.route().t.routes).includes(routeName) &&
                (this.config.canExport ?? this.can('admin.' + this.currentResource + '.export'))
            )
        },
        canImport() {
            return this.config.canImport
        },
    },
    watch: {
        selectedItems(value) {
            if (!Array.isArray(value)) return

            this.sellectIds = this.selectedIds = value
                .map(function (item) {
                    return item.id
                })
                .join()
            this.$emit('on-select', value)
        },
        lazyParams: {
            handler() {
                this.pushToUrl()
            },
            deep: true,
        },
    },
    mounted() {
        this.loadLazyData()
    },
    methods: {
        deleteSingle(id) {
            if (confirm(this.tt("models.form.confirm_destroy") || "Bạn chắc chắn muốn xoá đối tượng này?")) {
                this.$inertia.post(
                    this.route(`admin.${this.currentResource}.destroy`, { id: id }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            this.selectedItems = [];
                            this.selectedIds = '';
                            this.loadLazyData();
                        }
                    }
                );
            }
        },
        deleteSelected() {
            if (confirm(this.tt("models.table.confirm_destroy_multiple") || "Bạn có chắc chắn muốn xóa các mục đã chọn?")) {
                this.$inertia.post(
                    this.route(`admin.${this.currentResource}.destroy`, { id: this.selectedIds }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            this.selectedItems = [];
                            this.selectedIds = '';
                            this.loadLazyData();
                        }
                    }
                );
            }
        },
        pushToUrl() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }

            this.timer = setTimeout(() => {
                const newUrl = this.route(`admin.${this.currentResource}.index`, this.lazyParams)

                this.$inertia.page.url = newUrl
                this.$inertia.pushState(this.$inertia.page)

                this.loadLazyData()
            }, 200)
        },
        loadLazyData() {
            this.loading = true

            this.$axios.get(this.route(`admin.${this.currentResource}.index`, this.lazyParams)).then((res) => {
                const data = res.data
                this.loading = false
                this.items = data.data
                this.totalItems = data.total

                this.firstItem = data.form
                this.lastItem = data.to
            })
        },
        onPage(event) {
            this.lazyParams.page = event.page + 1
        },
        onSort(event) {},
        onFilter(event) {},
        onSelectAllChange(event) {
            const selectAll = event.checked

            if (selectAll) {
                this.$axios
                    .get(
                        this.route(`admin.${this.currentResource}.index`, {
                            ...this.lazyParams,
                            page: this.lazyParams.page + 1,
                        })
                    )
                    .then((res) => {
                        this.selectAll = true
                        this.selectedItems = res.data.data
                    })
            } else {
                this.selectAll = false
                this.selectedItems = []
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedItems.length === this.totalItems
        },
        onRowUnselect() {
            this.selectAll = false
        },
        onChangePerPage(value) {
            this.lazyParams.per_page = value
        },

        mergeColumns() {
            let schemaColumns = { ...this.schema.columns }

            const columns = this.columns.length ? this.columns : this.pluck(Object.values(this.schema.columns), 'label')

            columns.forEach(function (column, index) {
                let transformColumn = {}

                if (typeof column === 'object') {
                    transformColumn = {
                        display: true,
                        order: index,
                        ...column,
                    }
                } else {
                    transformColumn = {
                        display: true,
                        order: index,
                        field: column,
                    }
                }

                if (schemaColumns[transformColumn.field]) {
                    schemaColumns[transformColumn.field] = {
                        ...schemaColumns[transformColumn.field],
                        ...transformColumn,
                    }
                } else {
                    schemaColumns[transformColumn.field] = {
                        type: 'text',
                        default: null,
                        label: transformColumn.field,
                        ...transformColumn,
                    }
                }
            })

            schemaColumns['id'].order = 0

            return schemaColumns
        },

        getParams() {
            const params = route().params
            return {
                page: params.page || 1,
                per_page: params.per_page || 20,
                sortField: null,
                sortOrder: null,
                filters: {
                    ...params,
                    global: {
                        value: params.filters?.global?.value,
                        matchMode: FilterMatchMode.CONTAINS,
                    },
                },
            }
        },

        getFilters() {
            let keyword = route().params.global?.value
            let filters = {
                ...route().params,
            }

            filters.global = {
                value: keyword,
                matchMode: FilterMatchMode.CONTAINS,
            }

            const columns = this.mergeColumns

            Object.keys(columns)
                .filter((x) => x === 'id' || columns[x]?.rules?.includes('required'))
                .forEach((column) => {
                    filters[column] = {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS,
                    }
                })

            return filters
        },
        getStyles(data, column) {
            const value = data[column.field]
            if (!column.list) return false

            return column.list.find((x) => x.label === value || x.id === value).styles
        },
        transformCell(data, column) {
            let value = data[column.field]

            if (column.list) {
                let dataColumn = column.list.find((x) => x.label === value || x.id === value)
                value = dataColumn.styles.label || dataColumn.label
            }

            if (this.mergedColumns[column.field].transform) {
                value = this.mergedColumns[column.field].transform(data)
            } else if (column.type === 'date') {
                value = this.toDate(value, 'DD/MM/YYYY')
            } else if (column.type === 'datetime') {
                value = this.toDate(value)
            } else if (column.type === 'decimal') {
                value = this.toMoney(value)
            } else if ((column.type === 'bigint' || column.type === 'integer') && column.field !== 'id') {
                value = this.toNumber(value)
            } else if (column.type === 'boolean') {
                value = `<div class="flex m-auto w-3 h-3 ${
                    value ? 'bg-green-500' : 'bg-orange-300'
                } rounded-full"></div>`
            } else if (column.type === 'json' && value && Object.keys(value).length === 0) {
                return null
            }

            return value
        },
        isImageCell(data, column) {
            const val = data[column.field];
            if (!val) return false;
            if (column.field === 'image' || column.field?.endsWith('_image') || column.field === 'avatar') return true;
            return this.isImage(val?.path || (typeof val === 'string' ? val : ''))
        },
        capitalize(string) {
            return string?.charAt(0).toUpperCase() + string.slice(1)
        },
    },
}
</script>

<style>
.p-datatable td .p-image {
    @apply flex items-center justify-center -m-2;
    min-height: 60px;
}
</style>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-progressbar) {
    height: 0.5rem;
    background-color: #d8dadc;

    .p-progressbar-value {
        background-color: #607d8b;
    }
}

::v-deep(.p-datepicker) {
    min-width: 25rem;

    td {
        font-weight: 400;
    }
}

::v-deep(.p-datatable.p-datatable-customers) {
    .p-datatable-header {
        padding: 1rem;
        text-align: left;
        font-size: 1.5rem;
    }

    .p-paginator {
        padding: 1rem;
    }

    .p-datatable-thead > tr > th {
        text-align: left;
    }

    .p-datatable-tbody > tr > td {
        cursor: auto;
    }

    .p-dropdown-label:not(.p-placeholder) {
        text-transform: uppercase;
    }
}
</style>
