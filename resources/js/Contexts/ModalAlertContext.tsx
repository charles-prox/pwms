// ModalAlertContext.tsx
import { AlertOptions, AlertType } from "@/Utils/types";
import React, { createContext, useContext } from "react";

interface ModalAlertContextType {
    showAlert: (options: AlertOptions) => void;
    closeAlert: () => void;
}

export const ModalAlertContext = createContext<
    ModalAlertContextType | undefined
>(undefined);

export const useModalAlert = (): ModalAlertContextType => {
    const context = useContext(ModalAlertContext);
    if (!context) {
        throw new Error(
            "useModalAlert must be used within a ModalAlertProvider"
        );
    }
    return context;
};
