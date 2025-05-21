import React from "react";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

const PaginationSummary = ({
    tableId,
    totalRows,
}: {
    tableId: string;
    totalRows: number;
}) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);
    const { per_page } = tableOptions;

    return (
        <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
                Total {totalRows} requests
            </span>
            <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                    className="bg-transparent outline-none text-default-400 text-small"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        updateTableOptions(tableId, {
                            per_page: Number(e.target.value),
                            current_page: "1",
                        });
                    }}
                    value={per_page || 10}
                >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </label>
        </div>
    );
};

export default PaginationSummary;
