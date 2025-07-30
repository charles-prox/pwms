import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { HeroUIProvider } from "@heroui/react";

import AppLayout from "@/Layouts/AppLayout";
import ThemeProvider from "./Providers/ThemeProvider";
import { appName } from "./Utils/constants";
import AuthLayout from "./Layouts/AuthLayout";
import { SideNavStateProvider } from "@/Providers/SideNavStateProvider";
import { ModalAlertProvider } from "./Providers/ModalAlertProvider";

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
                ((page: React.ReactNode) => {
                    return name.includes("Auth") || name.includes("Errors") ? (
                        <AuthLayout>{page}</AuthLayout>
                    ) : (
                        <AppLayout>{page}</AppLayout>
                    );
                });
            return page;
        });
        return pages;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <HeroUIProvider>
                    <ThemeProvider>
                        <SideNavStateProvider>
                            <ModalAlertProvider>
                                <App {...props} />
                            </ModalAlertProvider>
                        </SideNavStateProvider>
                    </ThemeProvider>
                </HeroUIProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
