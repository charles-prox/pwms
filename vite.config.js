import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
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
    resolve: {
        alias: {
            buffer: "buffer",
        },
    },
});
