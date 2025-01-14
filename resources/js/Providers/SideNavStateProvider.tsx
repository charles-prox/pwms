import React, { useState, useEffect, useCallback, ReactNode } from "react";
import SideNavStateContext from "@/Contexts/SideNavStateContext";
import { SideNavState } from "@/Utils/types";

interface SideNavStateProviderProps {
    children: ReactNode;
}

export const SideNavStateProvider: React.FC<SideNavStateProviderProps> = ({
    children,
}) => {
    const [sideNavState, setSideNavState] = useState<SideNavState>(() => {
        const savedState = localStorage.getItem("sidebarview");
        return savedState === "collapse" || savedState === "expand"
            ? savedState
            : "expand"; // Default to "expand" if invalid or not found
    });

    const toggleSideNavState = useCallback(() => {
        const newSideNavState =
            sideNavState === "expand" ? "collapse" : "expand";
        setSideNavState(newSideNavState);
        localStorage.setItem("sidebarview", newSideNavState);
    }, [sideNavState]);

    useEffect(() => {
        const savedSideNavState = localStorage.getItem("sidebarview");
        if (
            savedSideNavState === "collapse" ||
            savedSideNavState === "expand"
        ) {
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
