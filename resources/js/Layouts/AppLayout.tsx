import React from "react";

import { usePage } from "@inertiajs/react";
import AppNavbar from "@/Components/AppNavbar";
import SideNavbar from "@/Components/SideNavbar";
import { Button, Spacer } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { useTheme } from "@/Contexts/ThemeContext";

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { theme } = useTheme();
    return (
        <main className={`${theme} text-foreground bg-background`}>
            {children}
        </main>
    );
};

export default AppLayout;
