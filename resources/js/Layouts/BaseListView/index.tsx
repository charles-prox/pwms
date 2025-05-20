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

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    width?: string | number;
    sortable?: boolean;
}

interface BaseListViewProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
}

export default function BaseListView<T>({
    columns,
    data,
    loading = false,
    emptyMessage = "No data available",
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
        <Table>
            <TableHeader>
                {columns.map((col) => (
                    <TableColumn
                        key={col.key.toString()}
                        style={{ width: col.width }}
                    >
                        {col.label}
                    </TableColumn>
                ))}
            </TableHeader>

            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {columns.map((col) => (
                            <TableCell key={col.key.toString()}>
                                {col.render
                                    ? col.render(item)
                                    : (item as any)[col.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
