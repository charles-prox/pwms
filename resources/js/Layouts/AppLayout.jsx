import React from "react";

import { usePage } from "@inertiajs/react";
import AppNavbar from "@/Components/AppNavbar";
import SideNavbar from "@/Components/SideNavbar";
import { useTheme } from "@/ThemeProvider";
import { useSideNavState } from "@/SideNavStateProvider";
import { Spacer } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";

const AppLayout = ({ children }) => {
    const minSideNavWidth = 16;
    const maxSideNavWidth = 60;
    const animationOptions = {
        delay: 200,
        duration: 100,
    };
    const { component } = usePage();
    const { sideNavState } = useSideNavState();
    const theme = useTheme().theme;

    switch (component.startsWith("Auth/")) {
        // if the component is in login, use LoginLayout
        case true:
            return (
                <main>
                    <AuthLayout>{children}</AuthLayout>
                </main>
            );

        default:
            return (
                <main
                    className={`${theme} text-foreground bg-background flex flex-col h-screen `}
                >
                    <AppNavbar />
                    <div
                        className={`flex flex-grow overflow-auto bg-slate-300/10`}
                    >
                        {/* Side Navbar */}
                        <SideNavbar
                            minSideNavWidth={minSideNavWidth}
                            maxSideNavWidth={maxSideNavWidth}
                            animationOptions={animationOptions}
                        />
                        <Spacer
                            x={
                                sideNavState === "collapse"
                                    ? minSideNavWidth
                                    : maxSideNavWidth
                            }
                            className={`transition-all delay-${animationOptions.delay} duration-${animationOptions.duration}`}
                        />
                        <div
                            className={`
                                    flex-grow p-10 overflow-y-auto  bg-slate-400/10
                                   `}
                        >
                            {children}
                        </div>
                    </div>
                </main>
            );
    }
};

export default AppLayout;
