<template>
    <Head title="Tổng quan" />

    <div class="max-w-screen-lg mx-auto my-8">
        <div class="bg-white rounded-md shadow-xl">
            <div
                class="items-center w-full p-4 font-bold leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md cursor-default focus:outline-none"
            >
                KẾT QUẢ KINH DOANH TRONG NGÀY
            </div>
            <div class="flex border-t divide-x">
                <div class="flex items-center w-1/4 p-4 space-x-1">
                    <div class="p-2 text-blue-500">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="20"
                                cy="20"
                                r="20"
                                fill="currentColor"
                            />
                            <path
                                d="M24.0082 15.1914H15.9919C15.9919 15.1914 10.3801 20.0003 10.3801 25.6122C10.3801 28.8174 12.7933 30.4211 14.3882 30.4211H25.6119C27.2134 30.4211 29.6201 28.8174 29.6201 25.6122C29.6201 20.0003 24.0082 15.1914 24.0082 15.1914ZM20.8008 26.3317V27.6151H19.1993V26.3361C18.019 26.1167 17.2775 25.3884 17.2249 24.3309H18.6136C18.6816 24.886 19.241 25.2436 20.0505 25.2436C20.7964 25.2436 21.3251 24.8816 21.3251 24.3661C21.3251 23.9273 20.9829 23.6772 20.1405 23.4885L19.2476 23.2976C17.9971 23.0366 17.3828 22.385 17.3828 21.3385C17.3828 20.2921 18.0805 19.5374 19.1905 19.2895V17.9973H20.792V19.2917C21.8758 19.533 22.5976 20.2723 22.6327 21.2662H21.2922C21.2242 20.7243 20.7196 20.3623 20.0264 20.3623C19.3331 20.3623 18.8329 20.6958 18.8329 21.2179C18.8329 21.6413 19.1598 21.876 19.965 22.0559L20.792 22.2314C22.172 22.521 22.7665 23.109 22.7665 24.1818C22.7665 25.3291 22.0294 26.097 20.8008 26.3317Z"
                                fill="white"
                            />
                            <path
                                d="M24.0083 10.3804H21.7925C21.5662 10.1294 21.2897 9.92869 20.981 9.79134C20.6722 9.65398 20.3381 9.58301 20.0001 9.58301C19.6622 9.58301 19.328 9.65398 19.0193 9.79134C18.7105 9.92869 18.434 10.1294 18.2078 10.3804H15.992C15.8614 10.3809 15.733 10.4133 15.6178 10.4747C15.5026 10.5361 15.4041 10.6246 15.3309 10.7327C15.2576 10.8407 15.2118 10.965 15.1974 11.0948C15.183 11.2245 15.2005 11.3558 15.2483 11.4773L15.992 13.5856H24.0083L24.752 11.4773C24.7998 11.3558 24.8172 11.2245 24.8028 11.0948C24.7884 10.965 24.7426 10.8407 24.6694 10.7327C24.5961 10.6246 24.4976 10.5361 24.3824 10.4747C24.2672 10.4133 24.1388 10.3809 24.0083 10.3804Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-semibold">Doanh thu</span>
                        <span class="text-3xl font-semibold text-blue-500">
                            {{ data?.todaySales || 0 }}
                        </span>
                    </div>
                </div>
                <div class="flex items-center w-1/4 p-4 space-x-1">
                    <div class="p-2 text-green-500">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="20"
                                cy="20"
                                r="20"
                                fill="currentColor"
                            />
                            <path
                                d="M9.58337 10.625H30.4167V14.7917H9.58337V10.625ZM27.2917 15.8333H10.625V27.2917C10.625 27.8442 10.8445 28.3741 11.2352 28.7648C11.6259 29.1555 12.1558 29.375 12.7084 29.375H27.2917C27.8442 29.375 28.3741 29.1555 28.7648 28.7648C29.1555 28.3741 29.375 27.8442 29.375 27.2917V15.8333H27.2917ZM24.1667 22.0833H15.8334V20H24.1667V22.0833Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-semibold">Đơn hàng</span>
                        <span class="text-3xl font-semibold text-green-500">
                            {{ data?.todayOrders || 0 }}
                        </span>
                    </div>
                </div>
                <div class="flex items-center w-1/4 p-4 space-x-1">
                    <div class="p-2 text-yellow-500">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="20"
                                cy="20"
                                r="20"
                                fill="currentColor"
                            />
                            <path
                                d="M19.3749 22.7812C20.3783 22.1147 21.1405 21.1428 21.5486 20.0094C21.9568 18.876 21.9892 17.6414 21.6411 16.4881C21.293 15.3349 20.5828 14.3244 19.6157 13.6061C18.6486 12.8878 17.476 12.5 16.2714 12.5C15.0667 12.5 13.8941 12.8878 12.927 13.6061C11.9599 14.3244 11.2498 15.3349 10.9016 16.4881C10.5535 17.6414 10.5859 18.876 10.9941 20.0094C11.4022 21.1428 12.1644 22.1147 13.1678 22.7812C11.4573 23.4122 9.97887 24.5482 8.92858 26.0385C8.84972 26.1506 8.80315 26.2821 8.79393 26.4187C8.78471 26.5554 8.81321 26.692 8.87631 26.8136C8.93941 26.9352 9.03469 27.0371 9.15175 27.1082C9.26882 27.1793 9.40317 27.217 9.54015 27.2169L23.0023 27.2164C23.1392 27.2164 23.2736 27.1788 23.3906 27.1077C23.5077 27.0365 23.603 26.9346 23.6661 26.813C23.7291 26.6914 23.7576 26.5548 23.7484 26.4182C23.7392 26.2815 23.6926 26.15 23.6137 26.038C22.5634 24.5479 21.0852 23.4122 19.3749 22.7812Z"
                                fill="white"
                            />
                            <path
                                d="M31.2348 26.038C30.1845 24.548 28.7062 23.4122 26.9959 22.7813C28.1079 22.041 28.9192 20.9282 29.2839 19.6431C29.6485 18.3579 29.5425 16.9848 28.9849 15.7709C28.4273 14.5569 27.4548 13.5818 26.2423 13.0211C25.0299 12.4603 23.6571 12.3507 22.371 12.7119C22.2542 12.7447 22.1472 12.8055 22.0591 12.8889C21.9711 12.9723 21.9046 13.0759 21.8655 13.1907C21.8264 13.3055 21.8158 13.4281 21.8346 13.5479C21.8534 13.6677 21.9011 13.7812 21.9736 13.8784C22.819 15.0141 23.305 16.3769 23.369 17.7912C23.433 19.2055 23.072 20.6066 22.3326 21.8139C22.235 21.9732 22.2004 22.1632 22.2358 22.3466C22.2712 22.53 22.3739 22.6935 22.5238 22.805C22.8073 23.016 23.0801 23.2411 23.3412 23.4794C23.3547 23.4941 23.3683 23.5087 23.3831 23.5224C24.3813 24.4453 25.1903 25.5536 25.765 26.7855C25.8252 26.9145 25.9209 27.0236 26.041 27.1C26.161 27.1764 26.3004 27.217 26.4427 27.217L30.6234 27.2165C30.7604 27.2165 30.8947 27.1788 31.0117 27.1077C31.1288 27.0365 31.224 26.9346 31.2871 26.813C31.3502 26.6914 31.3787 26.5548 31.3694 26.4182C31.3602 26.2815 31.3136 26.15 31.2348 26.038L31.2348 26.038Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-semibold">Khách hàng</span>
                        <span class="text-3xl font-semibold text-yellow-500">
                            {{ data?.todayCustomers || 0 }}
                        </span>
                    </div>
                </div>
                <div class="flex items-center w-1/4 p-4 space-x-1">
                    <div class="p-2 text-pink-500">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="20"
                                cy="20"
                                r="20"
                                fill="currentColor"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M19.4578 20.547C24.0767 25.1646 25.1246 19.8225 28.0655 22.7614C30.9007 25.5958 32.5303 26.1637 28.9381 29.7549C28.4881 30.1166 25.6292 34.467 15.5822 24.4228C5.53387 14.3773 9.88183 11.5155 10.2435 11.0656C13.8445 7.46445 14.4026 9.1035 17.2378 11.938C20.1787 14.878 14.8389 15.9293 19.4578 20.547Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-semibold">Liên hệ</span>
                        <span class="text-3xl font-semibold text-pink-500">
                            {{ data?.todayContacts || 0 }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <iframe
        :src="analyticsEmbedUrl"
        plausible-embed
        scrolling="no"
        frameborder="0"
        loading="lazy"
        style="width: 1px; min-width: 100%; height: 1600px"
    ></iframe>
</template>

<script>
import { Head } from "@inertiajs/inertia-vue3";

export default {
    components: {
        Head,
    },
    props: ["data"],
    data() {
        return {
            domain: "sample.vn?auth=qpspFoDAsVt6Pg9IkqCzG",
        };
    },
    computed: {
        analyticsEmbedUrl() {
            return `https://analytics.jamstackvietnam.com/share/${this.domain}&embed=true&theme=light&background=%23f1f5f9`;
        },
    },

    mounted() {
        this.appendAnalyticsScript();
    },

    methods: {
        appendAnalyticsScript() {
            let script = document.createElement("script");
            script.setAttribute(
                "src",
                "https://analytics.jamstackvietnam.com/js/embed.host.js"
            );
            script.async = 1;
            document.head.appendChild(script);
        },
    },
};
</script>
