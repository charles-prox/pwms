import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { NextUIProvider } from "@nextui-org/react";
import AppLayout from "@/Layouts/AppLayout";
import ThemeProvider from "./ThemeProvider";
import { SideNavStateProvider } from "@/SideNavStateProvider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        let pages = resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        );
        pages.then((page) => {
            page.default.layout =
                page.default.layout ||
                ((page) => <AppLayout>{page}</AppLayout>);
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
                        <SideNavStateProvider>
                            <App {...props} />
                        </SideNavStateProvider>
                    </ThemeProvider>
                </NextUIProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
