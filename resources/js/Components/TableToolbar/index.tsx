import React from "react";
import Searchbar from "./Searchbar";
import FilterPopover from "./FilterPopover";
import PaginationSummary from "./PaginationSummary";
import type { Column } from "@/Layouts/BaseListView";

interface TableToolbarProps {
    tableId: string;
    totalRows?: number;
    columns?: Column<any>[]; // Optional, only needed if FilterPopover is shown
    showSearch?: boolean;
    showFilters?: boolean;
    showPaginationSummary?: boolean;
    createButton?: React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    tableId,
    totalRows = 0,
    columns = [],
    showSearch = true,
    showFilters = true,
    showPaginationSummary = true,
    createButton,
}) => {
    const showToolbar = showSearch || showFilters || createButton;

    return (
        <div className="flex flex-col gap-4">
            {showToolbar && (
                <div
                    className={`flex ${
                        showSearch ? "justify-between" : "justify-end"
                    } gap-3 items-end flex-wrap`}
                >
                    {showSearch && <Searchbar tableId={tableId} />}

                    <div className="flex gap-3 items-center flex-wrap">
                        {showFilters && columns?.length > 0 && (
                            <FilterPopover
                                tableId={tableId}
                                columns={columns}
                            />
                        )}
                        {createButton && <div>{createButton}</div>}
                    </div>
                </div>
            )}

            {showPaginationSummary && (
                <PaginationSummary tableId={tableId} totalRows={totalRows} />
            )}
        </div>
    );
};

export default TableToolbar;
