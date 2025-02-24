import React, { useState, useCallback, useEffect, ReactNode } from "react";
import TableOptionsContext from "@/Contexts/TableOptionsContext";
import { Filter } from "@/Utils/types";

interface TableOptions {
    current_page: string;
    per_page: string;
    sort_by: string;
    search_key: string;
    filters: Filter[] | null; // Adjust `filters` type based on actual structure
}

interface TableOptionsProviderProps {
    children: ReactNode;
}

interface TableOptionsContextType {
    getTableOptions: (tableId: string) => TableOptions;
    updateTableOptions: (
        tableId: string,
        newOptions: Partial<TableOptions>
    ) => void;
}

const defaultOptions: TableOptions = {
    current_page: "1",
    per_page: "10",
    sort_by: "id:asc",
    search_key: "",
    filters: null,
};

export const TableOptionsProvider: React.FC<TableOptionsProviderProps> = ({
    children,
}) => {
    const [tableOptions, setTableOptions] = useState<{
        [key: string]: TableOptions;
    }>(() => {
        const storedOptions = sessionStorage.getItem("tableOptions");
        return storedOptions ? JSON.parse(storedOptions) : {};
    });

    useEffect(() => {
        if (Object.keys(tableOptions).length > 0) {
            sessionStorage.setItem(
                "tableOptions",
                JSON.stringify(tableOptions)
            );
        }
    }, [tableOptions]);

    const getTableOptions = useCallback(
        (tableId: string): TableOptions => {
            if (!tableOptions[tableId]) {
                // If the tableId doesn't exist, initialize it with default options
                setTableOptions((prev) => ({
                    ...prev,
                    [tableId]: { ...defaultOptions },
                }));
                return { ...defaultOptions };
            }
            return tableOptions[tableId];
        },
        [tableOptions]
    );

    const updateTableOptions = useCallback(
        (tableId: string, newOptions: Partial<TableOptions>) => {
            setTableOptions((prevOptions) => {
                const currentOptions = prevOptions[tableId] || {
                    ...defaultOptions,
                };
                const updatedOptions = {
                    ...currentOptions,
                    ...newOptions,
                };

                // Only update if there are actual changes
                if (
                    JSON.stringify(currentOptions) !==
                    JSON.stringify(updatedOptions)
                ) {
                    return {
                        ...prevOptions,
                        [tableId]: updatedOptions,
                    };
                }
                return prevOptions;
            });
        },
        []
    );

    return (
        <TableOptionsContext.Provider
            value={{ getTableOptions, updateTableOptions }}
        >
            {children}
        </TableOptionsContext.Provider>
    );
};
