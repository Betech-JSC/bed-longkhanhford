<template>
    <div class="flex items-center w-full h-full justify-center">
        <!-- Video -->
        <div v-if="isVideo(resolvedUrl)" class="relative w-full h-full flex items-center justify-center bg-black">
            <video muted playsinline class="object-contain w-full h-full" onmouseover="this.play()" onmouseout="this.pause()">
                <source :src="resolvedUrl" type="video/mp4" />
            </video>
        </div>

        <!-- PDF File -->
        <div v-else-if="isPdf" class="w-full h-full flex flex-col items-center justify-center bg-rose-50/50 p-2 border border-rose-100/30 rounded select-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span class="mt-1 text-[9px] font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">PDF</span>
        </div>

        <!-- Generic Document -->
        <div v-else-if="isDocument" class="w-full h-full flex flex-col items-center justify-center bg-blue-50/50 p-2 border border-blue-100/30 rounded select-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span class="mt-1 text-[9px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">{{ fileExtension }}</span>
        </div>

        <!-- Image -->
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
        },
        isPdf() {
            const url = this.resolvedUrl;
            if (!url) return false;
            if (this.file && typeof this.file === 'object' && this.file.extension) {
                return this.file.extension.toLowerCase() === 'pdf';
            }
            const cleanUrl = url.split('?')[0];
            return cleanUrl.toLowerCase().endsWith('.pdf');
        },
        isDocument() {
            const url = this.resolvedUrl;
            if (!url) return false;
            if (this.file && typeof this.file === 'object' && this.file.extension) {
                const ext = this.file.extension.toLowerCase();
                return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'tar', '7z'].includes(ext);
            }
            const cleanUrl = url.split('?')[0].toLowerCase();
            return /\.(doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|tar|7z)$/i.test(cleanUrl);
        },
        fileExtension() {
            if (this.file && typeof this.file === 'object' && this.file.extension) {
                return this.file.extension.toUpperCase();
            }
            const url = this.resolvedUrl;
            if (!url) return '';
            const cleanUrl = url.split('?')[0];
            const parts = cleanUrl.split('.');
            return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
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
