import React from "react";
import { useTheme } from "@/Contexts/ThemeContext";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { theme } = useTheme();
    return (
        <main className={`${theme} text-foreground bg-background`}>
            <div className="min-h-screen flex flex-col sm:justify-center items-center">
                {children}
            </div>
        </main>
    );
}
