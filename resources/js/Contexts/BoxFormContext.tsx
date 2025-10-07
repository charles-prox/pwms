import React, { createContext, useContext } from "react";
import { BoxFormState, BoxDetails, BoxDateRange, BoxDate } from "@/Utils/types";
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";

interface BoxFormContextType {
    boxes: BoxFormState[];
    boxData: BoxFormState;
    errors: any;
    getBoxById: (id: number) => BoxFormState;
    deleteBox: (id: number) => void;
    saveBoxDataToBoxes: () => void | boolean;
    setBoxData: React.Dispatch<React.SetStateAction<BoxFormState>>;
    onBoxCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOfficeChange: (office: { id: number; name: string }) => void;
    onRemarksChange: (remarks: string) => void;
    onDocumentChange: (
        index: number,
        field: keyof BoxDetails,
        value: any
    ) => void;
    addDocument: () => void;
    deleteDocument: (index: number) => void;
    parseDateRange: (
        dateRange: BoxDateRange | null
    ) => RangeValue<DateValue> | null;
    resetBoxes: () => void;
    setBoxes: React.Dispatch<React.SetStateAction<BoxFormState[]>>;
    editBox: (updatedBox: BoxFormState) => void | boolean;
    resetBoxData: () => void;
    formatDocumentDate: (date: BoxDateRange | null) => string;
    formatDisposalDate: (date: BoxDate | "Permanent" | null) => string;
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
