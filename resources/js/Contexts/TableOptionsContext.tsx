import { createContext, useContext, ReactNode } from "react";

// Define the shape of the context value
interface TableOptionsContextType {
    getTableOptions: (tableId: string) => Record<string, any>;
    updateTableOptions: (
        tableId: string,
        newOptions: Record<string, any>
    ) => void;
}

// Create the context with an initial value of `undefined`
const TableOptionsContext = createContext<TableOptionsContextType | undefined>(
    undefined
);

// Custom hook to use the TableOptionsContext
export const useTableOptions = (): TableOptionsContextType => {
    const context = useContext(TableOptionsContext);
    if (!context) {
        throw new Error(
            "useTableOptions must be used within a TableOptionsProvider"
        );
    }
    return context;
};

export default TableOptionsContext;
