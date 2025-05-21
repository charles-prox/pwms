import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            ssr: "resources/js/ssr.tsx",
            refresh: true,
        }),
        react(),
        svgr({
            svgrOptions: {
                icon: true,
                replaceAttrValues: {
                    "#000": "currentColor",
                    "#000000": "currentColor",
                    "#0F0F0F": "currentColor",
                    "#1C274C": "currentColor",
                },
            },
        }),
    ],
    // resolve: {
    //     alias: {
    //         ui: resolve('resources/js/components/ui/index.ts'),
    //         layouts: resolve('resources/js/layouts/index.ts'),
    //         components: resolve('resources/js/components'),
    //         'ziggy-js': resolve('vendor/tightenco/ziggy')
    //     }
    // }
});
