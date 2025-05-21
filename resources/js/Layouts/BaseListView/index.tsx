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
import EmptyState from "@/Components/Shared/EmptyState";
import type { ColumnSize } from "@react-types/table";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    width?: ColumnSize | null | undefined;
    sortable?: boolean;
}

interface BaseListViewProps<T> {
    columns: Column<T>[];
    data: any[];
    loading?: boolean;
    emptyMessage?: string;
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
}

export default function BaseListView<T>({
    columns,
    data,
    loading = false,
    emptyMessage = "No data available",
    topContent,
    bottomContent,
}: BaseListViewProps<T>) {
    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner size="lg" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <EmptyState title="Nothing to show" description={emptyMessage} />
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
                table: "relative ",
                loadingWrapper:
                    "absolute inset-0 bg-black/50 backdrop-blur-md z-50 rounded-lg",
            }}
        >
            <TableHeader>
                {columns.map((col) => (
                    <TableColumn key={col.key.toString()} width={col.width}>
                        {col.label}
                    </TableColumn>
                ))}
            </TableHeader>

            <TableBody
                emptyContent={
                    <EmptyState title="No data" description={emptyMessage} />
                }
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
