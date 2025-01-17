import RequestViewContext from "@/Contexts/RequestViewContext";
import React, { useEffect, useState } from "react";

interface SelectedRequestView {
    pageId: string;
    view: string;
}

interface RequestViewProviderProps {
    children: React.ReactNode;
}

export const RequestViewProvider: React.FC<RequestViewProviderProps> = ({
    children,
}) => {
    const [selectedRequestView, setSelectedRequestView] = useState<
        SelectedRequestView[]
    >(() => {
        // Retrieve the saved layout from localStorage or default to an empty array
        const storedView = localStorage.getItem("selectedRequestView");
        return storedView ? JSON.parse(storedView) : [];
    });

    useEffect(() => {
        // Persist the selected view to localStorage
        localStorage.setItem(
            "selectedRequestView",
            JSON.stringify(selectedRequestView)
        );
    }, [selectedRequestView]);

    const setPageView = (pageId: string, view: string) => {
        setSelectedRequestView((prevState) => {
            // Check if pageId already exists
            const pageExists = prevState.find((item) => item.pageId === pageId);

            if (pageExists) {
                // If the page exists, update the view
                return prevState.map((item) =>
                    item.pageId === pageId ? { ...item, view } : item
                );
            } else {
                // If the page does not exist, add a new page with the default view
                return [...prevState, { pageId, view }];
            }
        });
    };

    return (
        <RequestViewContext.Provider
            value={{ selectedRequestView, setPageView }}
        >
            {children}
        </RequestViewContext.Provider>
    );
};
