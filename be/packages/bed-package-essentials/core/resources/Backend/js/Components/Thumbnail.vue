<template>
    <div class="flex items-center w-full h-full">
        <div v-if="isVideo(resolvedUrl)" class="relative w-full h-full flex items-center justify-center bg-black">
            <video muted playsinline class="object-contain w-full h-full" onmouseover="this.play()" onmouseout="this.pause()">
                <source :src="resolvedUrl" type="video/mp4" />
            </video>
        </div>
        <img v-else :src="resolvedUrl ? (resolvedUrl.startsWith('data:') || resolvedUrl.includes('?') ? resolvedUrl : `${resolvedUrl}?w=200`) : ''" class="object-contain w-full h-full" />
        <a
            v-if="resolvedUrl"
            class="absolute top-0 right-0 invisible space-x-1 text-white uppercase bg-black group-hover:visible w-[20px] h-[20px] flex items-center justify-center rounded-sm"
            :href="resolvedUrl"
            target="_blank"
            @click.stop
        >
            <ph:arrow-square-up-right />
        </a>
        <button
            v-if="resolvedUrl"
            class="absolute top-0 right-[22px] invisible text-white bg-blue-600 hover:bg-blue-700 group-hover:visible w-[20px] h-[20px] flex items-center justify-center rounded-sm transition-all duration-200"
            type="button"
            title="Copy Link"
            @click.stop.prevent="$emit('copy', file)"
        >
            <ph:link-light class="w-3.5 h-3.5" />
        </button>
        <Button
            class="absolute invisible right-1 bottom-1 group-hover:visible btn-white btn-sm"
            :label="tt('models.files.delete')"
            @click.stop.prevent="$emit('remove', file)"
        />
    </div>
</template>

<script>
import 'plyr/dist/plyr.css'
export default {
    props: ['file'],

    computed: {
        resolvedUrl() {
            if (!this.file) return '';
            if (typeof this.file === 'string') {
                if (this.file.startsWith('http') || this.file.startsWith('data:') || this.file.startsWith('/')) {
                    return this.file;
                }
                return this.staticUrl(this.file);
            }
            if (typeof this.file === 'object') {
                if (this.file.path && typeof this.file.path === 'string') {
                    if (this.file.path.startsWith('http') || this.file.path.startsWith('data:') || this.file.path.startsWith('/')) {
                        return this.file.path;
                    }
                    return this.staticUrl(this.file.path);
                }
                if (this.file.static_url && typeof this.file.static_url === 'string') return this.file.static_url;
                if (this.file.url && typeof this.file.url === 'string') return this.file.url;
            }
            return '';
        }
    },

    methods: {
        isVideo(url) {
            if (!url) return false;
            return (
                url.endsWith('.mp4') ||
                url.endsWith('.avi') ||
                url.endsWith('.mov') ||
                url.endsWith('.wmv') ||
                url.endsWith('.flv') ||
                url.endsWith('.mkv')
            )
        },
    },
}
</script>

<style scoped>
.v-lazy-image {
    filter: blur(10px);
    transition: filter 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    will-change: filter;
}
.v-lazy-image-loaded {
    filter: blur(0);
}
</style>
