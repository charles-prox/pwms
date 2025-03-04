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
                <div className=" relative flex flex-grow h-[calc(100vh - 64px)] overflow-auto">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className={`flex flex-grow flex-col overflow-auto `}>
                        <div
                            className={`p-10 mx-5 flex-grow bg-gray-900/10 dark:bg-gray-100/10 rounded-lg overflow-auto`}
                        >
                            <TableOptionsProvider>
                                {children}
                            </TableOptionsProvider>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppLayout;
