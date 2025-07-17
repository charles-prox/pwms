import React from "react";
import { columns } from "./config/columns";
import BaseListView from "@/Layouts/BaseListView";
import { FormProp } from "@/Utils/types";
import EmptyState from "@/Components/EmptyState";
import TableToolbar from "@/Components/TableToolbar";
import AddNewButton from "./components/AddNewButton";

interface RequestsListViewProps {
    data: FormProp[];
    loading?: boolean;
}
export default function RequestsListView({
    data,
    loading = false,
}: RequestsListViewProps) {
    return (
        <BaseListView<FormProp>
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
                    itemLabel="request"
                />
            }
        />
    );
}
