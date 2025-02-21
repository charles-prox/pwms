import React from "react";

import { useTheme } from "@/Contexts/ThemeContext";
import Sidebar from "@/Components/SideNavbar";
import AppNavbar from "@/Components/AppNavbar";
import Footer from "@/Components/Footer";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { theme } = useTheme();
    const navHeight = "64px";

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
                    <div
                        className={`flex-1 overflow-y-auto p-10 h-[calc(100vh-${navHeight})]`}
                    >
                        <TableOptionsProvider>{children}</TableOptionsProvider>
                    </div>
                </div>
                <Footer />
            </div>
        </main>
    );
};

export default AppLayout;
