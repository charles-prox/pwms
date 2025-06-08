import React from "react";
import { columns } from "./config/columns";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import AddNewButton from "./components/AddNewButton";
import EmptyState from "@/Components/Shared/EmptyState";

interface RequestsListViewProps {
    data: Request[];
    loading?: boolean;
}
export default function RequestsListView({
    data,
    loading = false,
}: RequestsListViewProps) {
    return (
        <BaseListView<Request>
            columns={columns}
            data={data}
            loading={loading}
            emptyContent={
                <EmptyState title="Oops..." description="No request yet." />
            }
            topContent={
                <TableToolbar
                    tableId="requests-table"
                    totalRows={data.length}
                    columns={columns}
                    createButton={
                        <AddNewButton /> /* Assuming you have an AddNewButton component */
                    }
                />
            }
        />
    );
}
