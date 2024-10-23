import React from "react";

import { usePage } from "@inertiajs/react";
// import SideNavbar from "@/Components/SideNavbar";
import { Button, Spacer } from "@nextui-org/react";
import { useTheme } from "@/Contexts/ThemeContext";
import Sidebar from "@/Components/SideNavbar";
import AppNavbar from "@/Components/AppNavbar";

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { theme } = useTheme();
    return (
        <main className={`${theme} text-foreground bg-background`}>
            <div className="flex flex-col  h-screen ">
                {/* Navbar */}
                <AppNavbar />

                {/* Main Content */}
                <div className="flex">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppLayout;
