import React, { createContext, useContext } from "react";
import { BoxFormState, BoxDetails } from "@/Utils/types";

interface BoxFormContextType {
    boxes: BoxFormState[];
    boxData: BoxFormState;
    errors: any;
    rdsData: any;
    rdsLoading: boolean;
    rdsError: any;
    saveBoxDataToBoxes: () => void | boolean;
    setBoxData: React.Dispatch<React.SetStateAction<BoxFormState>>;
    onBoxCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPriorityLevelChange: (level: string) => void;
    onOfficeChange: (office: { id: number; name: string }) => void;
    onDocumentChange: (
        index: number,
        field: keyof BoxDetails,
        value: any
    ) => void;
    addDocument: () => void;
    deleteDocument: (index: number) => void;
    parseDateRange: (dateStr: string | null) => any;
}

export const BoxFormContext = createContext<BoxFormContextType | undefined>(
    undefined
);

export const useBoxForm = () => {
    const context = useContext(BoxFormContext);
    if (!context) {
        throw new Error("useBoxForm must be used within a BoxFormProvider");
    }
    return context;
};
