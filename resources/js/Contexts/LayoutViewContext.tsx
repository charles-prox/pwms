// LayoutViewContext.ts
import { createContext, useContext } from "react";

export type LayoutType = "grid" | "list";

interface LayoutViewContextType {
    layoutViews: { [pageId: string]: LayoutType };
    setLayoutView: (pageId: string, view: LayoutType) => void;
    getLayoutView: (pageId: string) => LayoutType;
}

const LayoutViewContext = createContext<LayoutViewContextType | undefined>(
    undefined
);

export const useLayoutViewContext = () => {
    const context = useContext(LayoutViewContext);
    if (!context) {
        throw new Error(
            "useLayoutViewContext must be used within a LayoutViewProvider"
        );
    }

    return context;
};

export default LayoutViewContext;
