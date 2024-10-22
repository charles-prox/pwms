// SideNavStateProvider.js
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from "react";

const SideNavStateContext = createContext();

export const useSideNavState = () => useContext(SideNavStateContext);

export const SideNavStateProvider = ({ children }) => {
    const [sideNavState, setSideNavState] = useState(() => {
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
