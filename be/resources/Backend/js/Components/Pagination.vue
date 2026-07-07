<template>
    <div v-if="links && links.length > 3">
        <div class="flex flex-wrap">
            <div
                v-for="(link, key) in links"
                :key="key"
                class="flex mb-1 mr-1 overflow-hidden border rounded-full cursor-pointer"
                :class="link.url ? 'hover:border-gray-500 ' : 'bg-gray-100 text-gray-400'"
            >
                <div v-if="link.url === null" v-html="link.label" class="px-4 py-3" />
                <div
                    v-else-if="$attrs.onChangePage !== undefined"
                    class="px-4 py-3"
                    :class="{ 'bg-gray-100': isCurrentPage(link) }"
                    v-html="link.label"
                    @click="setPageNumber(link.url)"
                />
                <Link v-else class="px-4 py-3" :class="{ 'bg-white': link.active }" :href="generateUrl(link.url)">{{
                    link.label
                }}</Link>
            </div>
        </div>
    </div>
</template>
<script>
import { Link } from '@inertiajs/inertia-vue3'
export default {
    props: ['links'],
    emits: ['onChangePage'],
    components: {
        Link,
    },
    data() {
        return {
            activePage: null,
        }
    },
    methods: {
        generateUrl(url) {
            return new URL(url).search
        },
        getPageNumber(url) {
            return new URLSearchParams(this.generateUrl(url)).get('page')
        },
        setPageNumber(url) {
            const page = this.getPageNumber(url)
            this.activePage = page
            this.$emit('changePage', page)
        },
        isCurrentPage(link) {
            return this.activePage === this.getPageNumber(link.url)
        },
    },
}
</script>
