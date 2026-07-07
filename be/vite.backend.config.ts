import vue from '@vitejs/plugin-vue';
import laravel from "laravel-vite-plugin";
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
const exec = require('child_process').exec;

import {
    PrimeVueResolver
} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/Backend/js/app.js",
            buildDirectory: 'build/backend',
            hotFile: "public/vite.backend.hot",
            refresh: [
                "resources/Backend/**",
                "routes/backend.php",
            ],
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        Components({
            dirs: ["resources/Backend/js/Components"],
            directoryAsNamespace: false,
            resolvers: [
                PrimeVueResolver(),
                IconsResolver({
                    prefix: false,
                })
            ],
        }),
        Icons({}),
        {
            name: 'ziggy',
            enforce: 'post',
            handleHotUpdate({ server, file }) {
                // if (file.includes('/routes/') && file.endsWith('.php')) {
                //     exec('yarn backend:route', (error, stdout) => {
                //         error === null && console.log(`  > Ziggy routes generated!`)
                //     })
                // }
                if (file.includes('/resources/lang/vi/') && file.endsWith('.php')) {
                    exec('php artisan vue-i18n:generate', (error, stdout) => {
                        error === null && console.log(`  > I18n routes generated!`)
                    })
                }
            }
        },
    ],
    css: {
        postcss: {
            plugins: [
                require("tailwindcss")({
                    config: "./packages/bed-package-essentials/core/resources/Backend/tailwind.config.js",
                }),
                require("autoprefixer"),
            ],
        },
    },
    resolve: {
        alias: {
            '@Core': '/packages/bed-package-essentials/core/resources/Backend/js',
            '@': '/resources/Backend/js',
        },
    },
    server: {
        port: 5175,
        host: '127.0.0.1',
    },
})
