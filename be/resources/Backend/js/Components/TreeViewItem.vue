<template>
    <Draggable
        tag="ul"
        :modelValue="items"
        @update:modelValue="$emit('update:modelValue', $event)"
        item-key="hash_id"
        handle=".handle"
        :animation="200"
        group="category"
        :disabled="!draggable"
        ghostClass="ghost"
        class="text-sm tree-view-list"
    >
        <template #item="{ element }">
            <li class="flex-col w-full select-none tree-view-item-wrapper">
                <div
                    class="flex items-center w-full px-2 mt-0.5 space-x-1.5 rounded cursor-pointer group handle tree-view-item"
                    :class="{
                        'text-emerald-700':
                            selectable &&
                            modelValue !== undefined &&
                            modelValue.some((x) => x[keyBy] === element[keyBy]),
                    }"
                >
                    <div
                        v-if="element[childrenBy] && element[childrenBy].length > 0"
                        @click="onClickIcon(element)"
                        class="p-1 rounded-md hover:bg-gray-200 flex items-center justify-center shrink-0"
                    >
                        <ph:caret-right-fill v-if="!elementIsActive(element)" class="w-3 h-3 text-gray-400" />
                        <ph:caret-down-fill v-else class="w-3 h-3 text-gray-400" />
                    </div>
                    <div v-else class="w-5 h-5 flex items-center justify-center shrink-0"></div>
                    <ph:folder-light v-if="!elementIsActive(element)" class="w-4 h-4 text-emerald-600 mr-1 shrink-0" />
                    <ph:folder-open-light v-else class="w-4 h-4 text-emerald-600 mr-1 shrink-0" />
                    <label
                        class="flex-1 py-1.5 truncate text-gray-700 group-hover:text-gray-900"
                        @click="onClickName($event.target, element)"
                    >
                        {{ element[labelBy] }}
                    </label>
                </div>
                <TreeViewItem
                    :key="element.hash_id"
                    v-show="currentLevel < maxLevel"
                    :level="currentLevel + 1"
                    class="tree-view-list"
                    :class="[
                        {
                            'max-h-0 overflow-hidden':
                                !elementIsActive(element),
                        },
                        selectable ? 'ml-2' : 'ml-4',
                    ]"
                    :active="!elementIsActive(element)"
                    :field="field"
                    :model-value="modelValue"
                    @update:modelValue="$emit('update:modelValue', $event)"
                    v-model:options="element[childrenBy]"
                />
            </li>
        </template>
    </Draggable>
</template>
<script>
import Draggable from "vuedraggable";

export default {
    props: ["modelValue", "field", "level", "active", "options"],
    emits: ["update:modelValue", "change", "update:options"],
    components: {
        Draggable,
    },
    computed: {
        keyBy() {
            return this.field.keyBy || "id";
        },
        labelBy() {
            return this.field.labelBy || "label";
        },
        childrenBy() {
            return this.field.childrenBy ?? "children";
        },
        currentLevel() {
            return this.level === undefined ? 1 : this.level;
        },
        currentLevelIsActive() {
            if (this.active !== undefined) {
                return this.active;
            } else if (this.currentLevel <= this.expandDefaultLevel) {
                return true;
            } else {
                return false;
            }
        },
        maxLevel() {
            return this.field.maxLevel ?? 3;
        },
        expandDefaultLevel() {
            return this.field.expandDefaultLevel ?? 1;
        },
        draggable() {
            return this.field.draggable ?? false;
        },
        selectable() {
            return this.field.selectable ?? false;
        },
        busKey() {
            return "treeSelectedItem" + (this.field.key ?? "");
        },
    },
    data() {
        return {
            items: [],
        };
    },

    watch: {
        "field.options"() {
            this.fetchSource();
        },
        options() {
            this.items = this.options;
        }
    },

    created() {
        this.fetchSource();
    },

    methods: {
        fetchSource() {
            if (this.currentLevel === 1) {
                if (this.field.options !== undefined) {
                    this.items = this.field.options;
                } else {
                    this.$axios
                        .post(
                            route("admin.helper.model-data"),
                            this.field.source
                        )
                        .then((res) => {
                            this.items = res.data;
                        });
                }
            } else {
                this.items = this.options;
            }
        },
        elementIsActive(element) {
            if (element.active !== undefined) {
                return element.active;
            } else if (this.currentLevel + 1 <= this.expandDefaultLevel) {
                return true;
            } else {
                return false;
            }
        },
        onClickIcon(element) {
            if (!this.selectable) {
                element.active = !this.elementIsActive(element);
            }
        },
        onClickName(target, element) {
            if (!this.selectable) {
                this.$bus.emit(this.busKey, element);
                document
                    .querySelector(".tree-view-item-wrapper .is-selected")
                    ?.classList.remove("is-selected");
                target.parentNode
                    .closest(".group")
                    .classList.add("is-selected");
            }
        },
    },
};
</script>
<style lang="scss">
.ghost {
    @apply opacity-50 border-t;
}
.tree-view-list {
    @apply flex-col;
}
.tree-view-item {
    @apply rounded-lg transition-all duration-150;
    &.is-selected {
        @apply bg-emerald-50 text-emerald-700 font-medium;
    }
    &:not(.is-selected):hover {
        @apply bg-gray-50;
    }
}
</style>
