import { SelectedBoxesContext } from "@/Contexts/SelectedBoxesContext";
import { SelectedWithdrawalBoxes } from "@/Utils/types";
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "selectedBoxes";

export const SelectedBoxesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedBoxes, setSelectedBoxes] = useState<
        SelectedWithdrawalBoxes[]
    >([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSelectedBoxes(JSON.parse(stored));
            } catch {
                console.warn("Failed to parse stored boxes.");
            }
        }
        setIsLoaded(true); // ✅ Mark as loaded after reading
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedBoxes));
        }
    }, [selectedBoxes, isLoaded]); // ✅ Only save after loading

    const toggleBoxSelection = (box: SelectedWithdrawalBoxes) => {
        setSelectedBoxes((prev) => {
            const exists = prev.some((b) => b.id === box.id);
            return exists
                ? prev.filter((b) => b.id !== box.id)
                : [...prev, box];
        });
    };

    const bulkAddBoxes = (boxes: SelectedWithdrawalBoxes[]) => {
        setSelectedBoxes((prev) => {
            const ids = new Set(prev.map((b) => b.id));
            const newBoxes = boxes.filter((box) => !ids.has(box.id));
            return [...prev, ...newBoxes];
        });
    };

    const clearSelections = () => {
        setSelectedBoxes([]);
    };

    const removeBox = (boxId: number) => {
        setSelectedBoxes((prev) => prev.filter((box) => box.id !== boxId));
    };

    const updateWithdrawalRemarks = (boxId: number, remarks: string) => {
        setSelectedBoxes((prev) =>
            prev.map((box) =>
                box.id === boxId ? { ...box, withdrawalRemarks: remarks } : box
            )
        );
    };

    if (!isLoaded) {
        return null; // ✅ Don't render anything until localStorage is loaded
    }

    return (
        <SelectedBoxesContext.Provider
            value={{
                selectedBoxes,
                toggleBoxSelection,
                clearSelections,
                bulkAddBoxes,
                removeBox,
                updateWithdrawalRemarks,
            }}
        >
            {children}
        </SelectedBoxesContext.Provider>
    );
};
