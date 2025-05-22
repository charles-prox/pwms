// ModalAlertContext.tsx
import ModalAlert from "@/Components/ModalAlert";
import { ModalAlertContext } from "@/Contexts/ModalAlertContext";
import { AlertOptions } from "@/Utils/types";
import React, { useState, useCallback } from "react";

export const ModalAlertProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AlertOptions>({});

    const showAlert = useCallback((opts: AlertOptions) => {
        setOptions(opts);
        setIsOpen(true);
    }, []);

    const closeAlert = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <ModalAlertContext.Provider value={{ showAlert, closeAlert }}>
            <ModalAlert isOpen={isOpen} onClose={closeAlert} {...options} />
            {children}
        </ModalAlertContext.Provider>
    );
};
