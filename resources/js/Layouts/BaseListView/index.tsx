// components/Layout/BaseListView.tsx
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spinner,
} from "@heroui/react";
import type { ColumnSize } from "@react-types/table";
import type { Selection } from "@heroui/react";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    width?: ColumnSize | null | undefined;
    sortable?: boolean;
}

interface BaseListViewProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyContent?: React.ReactNode | string;
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    isSelectable?: boolean;
    selectedRows?: number[];
    onSelectedItemsChange?: (selectedItems: T[]) => void;
}

export default function BaseListView<T extends { id: number }>({
    columns,
    data,
    loading = false,
    emptyContent,
    topContent,
    bottomContent,
    isSelectable = false,
    selectedRows,
    onSelectedItemsChange,
}: BaseListViewProps<T>) {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
        new Set(selectedRows ?? []) as Selection
    );

    React.useEffect(() => {
        if (selectedRows) {
            setSelectedKeys(new Set(selectedRows) as Selection);
        }
    }, [selectedRows]);

    const handleSelectionChange = (keys: Selection) => {
        setSelectedKeys(keys);

        if (onSelectedItemsChange && keys !== "all") {
            const selectedIds = Array.from(keys);
            const selectedItems = data.filter((item) =>
                selectedIds.map(Number).includes(item.id)
            );
            console.log(selectedItems);
            onSelectedItemsChange(selectedItems);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Table
            aria-label="List of requests"
            bottomContent={bottomContent}
            topContent={topContent}
            topContentPlacement="outside"
            bottomContentPlacement="outside"
            classNames={{
                table: "relative",
                loadingWrapper:
                    "absolute inset-0 bg-black/50 backdrop-blur-md z-50 rounded-lg",
                // td: "align-top py-4",
            }}
            selectionMode={isSelectable ? "multiple" : "none"}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
        >
            <TableHeader>
                {columns.map((col) => (
                    <TableColumn key={col.key.toString()} width={col.width}>
                        {col.label}
                    </TableColumn>
                ))}
            </TableHeader>

            <TableBody
                emptyContent={emptyContent ?? "No data available."}
                items={data}
                isLoading={loading}
                loadingContent={
                    <div className="absolute inset-0 flex items-start justify-center">
                        <Spinner
                            classNames={{
                                label: "text-white text-sm",
                                base: "sticky top-1/2",
                            }}
                            label="Loading..."
                            variant="simple"
                        />
                    </div>
                }
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {columns.map((col) => (
                            <TableCell key={col.key.toString()}>
                                {col.render
                                    ? col.render(item)
                                    : (item as any)[col.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
