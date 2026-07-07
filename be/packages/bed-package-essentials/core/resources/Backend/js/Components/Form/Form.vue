<template>
    <form
        @submit.prevent="submit"
        :canaction="canStore"
        :class="{
            'grid grid-cols-12 gap-y-4 lg:gap-x-6 lg:p-6':
                config?.addGrid !== false,
        }"
    >
        <div
            v-if="
                showActions &&
                (canDestroyResource || canStore) &&
                config?.showActionOntop
            "
            class="flex justify-between col-span-full lg:col-span-8"
        >
            <Button
                v-if="canDestroyResource && !form.deleted_at && form.id"
                :label="tt('models.form.delete')"
                class="btn-danger-link"
                @click="destroy"
            />
            <Button
                v-if="reloadOctane"
                label="Xóa cache"
                class="btn-primary"
                @click="reloadOctane"
                :loading="octaneReloading"
            />
            <div class="flex items-center ml-auto space-x-2">
                <slot name="buttons"></slot>
                <Button
                    v-if="canStoreDraft"
                    :label="tt('models.form.store_draft')"
                    @click="storeDraft"
                    class="btn-white"
                    :loading="form.processing"
                />
                <Button
                    v-if="canStore"
                    :label="tt('models.form.save')"
                    type="submit"
                    :loading="form.processing"
                />
            </div>
        </div>
        <div class="space-y-6 col-span-full lg:col-span-8">
            <div class="card" v-if="form.deleted_at">
                <TrashedMessage v-if="form.deleted_at" />
            </div>
            <div class="card" v-if="hasFlash">
                <FlashMessages />
            </div>
            <slot :form="form" :errors="form.errors" :submit="submit" />
            <div
                v-if="showActions && (canDestroyResource || canStore)"
                class="flex justify-between card-footer"
            >
                <Button
                    v-if="canDestroyResource && !form.deleted_at && form.id"
                    :label="tt('models.form.delete')"
                    class="btn-danger-link"
                    @click="destroy"
                />
                <Button
                    v-if="reloadOctane"
                    label="Xóa cache"
                    class="btn-primary"
                    @click="reloadOctane"
                    :loading="octaneReloading"
                />
                <div class="flex items-center ml-auto space-x-2">
                    <slot name="buttons"></slot>
                    <Button
                        v-if="canStoreDraft"
                        :label="tt('models.form.store_draft')"
                        @click="storeDraft"
                        class="btn-white"
                        :loading="form.processing"
                    />
                    <Button
                        v-if="canStore"
                        :label="tt('models.form.save')"
                        type="submit"
                        :loading="form.processing"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="$slots.aside"
            class="col-span-full lg:col-span-4"
            :class="{ 'order-first': !!config.reverse }"
        >
            <slot name="aside" :form="form" />
        </div>
    </form>
</template>

<script>
import FlashMessages from "@Core/Components/FlashMessages.vue";
import TrashedMessage from "@Core/Components/TrashedMessage.vue";
import isEqual from "lodash/isEqual";
export default {
    components: { FlashMessages, TrashedMessage },
    props: {
        modelValue: {
            type: Object,
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            form: this.$inertia.form(this.modelValue),
            octaneReloading: false,
            isLoading : false,
            initFormValue: this.modelValue,
        };
    },
    watch: {
        form: {
            deep: true,
            handler(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    computed: {
        showActions() {
            return this.config?.showActions ?? true;
        },
        currentResource() {
            return this.config.resource ?? this.getResource();
        },
        canDestroyResource() {
            const canDestroy = this.config.canDestroy ?? true;
            return (
                canDestroy &&
                this.can("admin." + this.currentResource + ".destroy")
            );
        },
        canStore() {
            return (
                this.config.canStore ??
                this.can("admin." + this.currentResource + ".store")
            );
        },
        canStoreDraft() {
            return (
                this.config.canStoreDraft ??
                this.can("admin." + this.currentResource + ".draft")
            );
        },
        reloadOctane() {
            return this.config.reloadOctane ?? false;
        },
        hasFlash() {
            const { errors, flash } = this.$page.props;
            return (
                this.config?.showFlashMessages ??
                (flash.success !== null ||
                    flash.error !== null ||
                    Object.keys(errors).length > 0)
            );
        },
    },
    created() {
            document.addEventListener("inertia:before", this.beforeWindowUnload);
            window.addEventListener("beforeunload", this.beforeWindowUnload);
    },
    unmounted() {
            document.removeEventListener("inertia:before", this.beforeWindowUnload);
            window.removeEventListener("beforeunload", this.beforeWindowUnload);
    },
    methods: {

        confirmLeave() {
            return confirm( this.tt('models.message.confirm_message') );
        },

        confirmStayInDirtyForm() {
            return (
                !this.isLoading &&
                !this.form.processing &&
                this.formValueChanged() &&
                this.form.isDirty &&
                !this.confirmLeave()
            );
        },

        beforeWindowUnload(e) {
            if (this.confirmStayInDirtyForm()) {
                e.preventDefault();
                e.returnValue = "";
            }
        },

        formValueChanged() {
            return !isEqual(this.initFormValue, this.modelValue);
        },

        pick(obj, fields) {
            return fields.reduce(
                (acc, cur) => ((acc[cur] = obj[cur]), acc),
                {}
            );
        },

        validateAsync(...fields) {
            this.isLoading = true,
            this.$inertia.post(
                this.route(`admin.${this.currentResource}.store`, {
                    id: this.form?.id,
                }),
                this.pick(this.form, fields),
                {
                    preserveScroll: true,
                    headers: { "X-Dry-Run": true },
                    onError: (errors) => this.form.setError(errors),
                    onSuccess: () => this.form.clearErrors(...fields),
                }
            );
            this.isLoading = false
        },

        submit() {
            this.isLoading = true,
            this.$inertia.post(
                this.route(`admin.${this.currentResource}.store`, {
                    id: this.form?.id,
                }),
                this.form,
                {
                    onSuccess: () => {
                        this.form = this.$inertia.form(this.modelValue);
                        this.isLoading = true
                    },
                }
            );
            this.isLoading = false
        },

        storeDraft() {
            this.isLoading = true
            this.$inertia.post(
                this.route(`admin.${this.currentResource}.draft`, {
                    id: this.form?.id,
                }),
                this.form,
                {
                    onSuccess: () => {
                        this.form = this.$inertia.form(this.modelValue);
                        this.isLoading = true
                    },
                }
            );
            this.isLoading = false
        },

        destroy() {
            if (confirm(this.tt("models.form.confirm_destroy"))) {
                this.$inertia.post(
                    this.route(`admin.${this.currentResource}.destroy`, {
                        id: this.form.id,
                    }), this.isLoading = true,
                );
            }
        },

        restore() {
            if (confirm(this.tt("models.form.confirm_restore"))) {
                this.$inertia.post(
                    this.route(`admin.${this.currentResource}.restore`, {
                        id: this.form.id,
                    }),this.isLoading = true,
                );
            }
        },

        reloadOctane() {
            this.octaneReloading = true;
            this.$axios
                .get(this.route("admin.helper.reload-octane"))
                .finally(() => (this.octaneReloading = false));
        },
    },
};
</script>
