import { createContext, useContext, ReactNode } from "react";

// Define the shape of the context value
interface SideNavStateContextType {
    sideNavState: string;
    toggleSideNavState: () => void;
}

// Create the context with an initial value of `undefined`
const SideNavStateContext = createContext<SideNavStateContextType | undefined>(
    undefined
);

// Custom hook to use the SideNavStateContext
export const useSideNavState = (): SideNavStateContextType => {
    const context = useContext(SideNavStateContext);
    if (!context) {
        throw new Error(
            "useSideNavState must be used within a SideNavStateProvider"
        );
    }
    return context;
};

export default SideNavStateContext;
