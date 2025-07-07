import { SelectedWithdrawalBoxes } from "@/Utils/types";
import { createContext, useContext } from "react";

export interface SelectedBoxesContextType {
    selectedBoxes: SelectedWithdrawalBoxes[];
    toggleBoxSelection: (box: SelectedWithdrawalBoxes) => void;
    clearSelections: () => void;
    bulkAddBoxes: (boxes: SelectedWithdrawalBoxes[]) => void;
    removeBox: (boxId: number) => void;
    updateWithdrawalRemarks: (boxId: number, remarks: string) => void;
}

export const SelectedBoxesContext = createContext<
    SelectedBoxesContextType | undefined
>(undefined);

export const useSelectedBoxes = (): SelectedBoxesContextType => {
    const context = useContext(SelectedBoxesContext);
    if (!context) {
        throw new Error(
            "useSelectedBoxes must be used within a SelectedBoxesProvider"
        );
    }
    return context;
};
