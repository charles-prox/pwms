// LayoutViewProvider.tsx
import LayoutViewContext, { LayoutType } from "@/Contexts/LayoutViewContext";
import React, { useEffect, useState } from "react";

interface LayoutViewProviderProps {
    children: React.ReactNode;
}

export const LayoutViewProvider: React.FC<LayoutViewProviderProps> = ({
    children,
}) => {
    const [layoutViews, setLayoutViews] = useState<{
        [pageId: string]: LayoutType;
    }>(() => {
        const stored = localStorage.getItem("layoutViews");
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        localStorage.setItem("layoutViews", JSON.stringify(layoutViews));
    }, [layoutViews]);

    const setLayoutView = (pageId: string, view: LayoutType) => {
        setLayoutViews((prev) => ({
            ...prev,
            [pageId]: view,
        }));
    };

    const getLayoutView = (pageId: string): LayoutType => {
        return layoutViews[pageId] ?? "list";
    };

    return (
        <LayoutViewContext.Provider
            value={{ layoutViews, setLayoutView, getLayoutView }}
        >
            {children}
        </LayoutViewContext.Provider>
    );
};
