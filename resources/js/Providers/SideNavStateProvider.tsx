import React, { useState, useEffect, useCallback, ReactNode } from "react";
import SideNavStateContext from "@/Contexts/SideNavStateContext";

interface SideNavStateProviderProps {
    children: ReactNode;
}

export const SideNavStateProvider: React.FC<SideNavStateProviderProps> = ({
    children,
}) => {
    const [sideNavState, setSideNavState] = useState<string>(() => {
        return localStorage.getItem("sidebarview") || "expand";
    });

    const toggleSideNavState = useCallback(() => {
        const newSideNavState =
            sideNavState === "expand" ? "collapse" : "expand";
        setSideNavState(newSideNavState);
        localStorage.setItem("sidebarview", newSideNavState);
    }, [sideNavState]);

    useEffect(() => {
        const savedSideNavState = localStorage.getItem("sidebarview");
        if (savedSideNavState) {
            setSideNavState(savedSideNavState);
        }
    }, []);

    return (
        <SideNavStateContext.Provider
            value={{ sideNavState, toggleSideNavState }}
        >
            {children}
        </SideNavStateContext.Provider>
    );
};
