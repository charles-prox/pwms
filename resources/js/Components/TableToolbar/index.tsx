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
    title?: string;
    description?: string;
    itemLabel?: string;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    tableId,
    totalRows = 0,
    columns = [],
    showSearch = true,
    showFilters = true,
    showPaginationSummary = true,
    createButton,
    title,
    description = "",
    itemLabel = "item",
}) => {
    const showToolbar = showSearch || showFilters || createButton;

    return (
        <div className="flex flex-col gap-4">
            {showToolbar && (
                <div
                    className={`flex ${
                        showSearch || !!title
                            ? "justify-between"
                            : "justify-end"
                    } gap-3 items-end flex-wrap`}
                >
                    {title && (
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            <p className="text-tiny font-default-500">
                                {description}
                            </p>
                        </div>
                    )}
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
                <PaginationSummary
                    tableId={tableId}
                    totalRows={totalRows}
                    itemLabel={itemLabel}
                />
            )}
        </div>
    );
};

export default TableToolbar;
