import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { NextUIProvider } from "@nextui-org/react";

import AppLayout from "@/Layouts/AppLayout";
import ThemeProvider from "./Providers/ThemeProvider";
import { appName } from "./Utils/constants";
// import { SideNavStateProvider } from "@/SideNavStateProvider";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        let pages = resolvePageComponent(
            `./Pages/${name}/page.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        );
        pages.then((page: any) => {
            page.default.layout =
                page.default.layout ||
                ((page: React.ReactNode) => <AppLayout>{page}</AppLayout>);
            return page;
        });
        return pages;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <NextUIProvider>
                    <ThemeProvider>
                        {/* <SideNavStateProvider> */}
                        <App {...props} />
                        {/* </SideNavStateProvider> */}
                    </ThemeProvider>
                </NextUIProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
