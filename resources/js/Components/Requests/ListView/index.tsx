import React from "react";
import { columns } from "./columns";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import AddNewButton from "./AddNewButton";

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
            emptyMessage="No requests available."
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
