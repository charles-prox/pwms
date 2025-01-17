import { createContext } from "react";
import { useContext } from "react";

interface SelectedRequestView {
    pageId: string;
    view: string;
}

interface RequestViewContextType {
    selectedRequestView: SelectedRequestView[];
    setPageView: (pageId: string, view: string) => void;
}

const RequestViewContext = createContext<RequestViewContextType | undefined>(
    undefined
);

export const useRequestViewContext = () => {
    const context = useContext(RequestViewContext);

    if (!context) {
        throw new Error(
            "useRequestViewContext must be used within a RequestViewProvider"
        );
    }

    return context;
};

export default RequestViewContext;
