import BaseListView from "@/Layouts/BaseListView";
import React from "react";
import { columns } from "./columns";
import AddNewButton from "./AddNewButton";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/Shared/EmptyState";

interface RequestsListViewProps {
    data: Request[];
    loading?: boolean;
}
const RequestDetailsListView = ({
    data,
    loading = false,
}: RequestsListViewProps) => {
    return (
        <BaseListView<Request>
            columns={columns}
            data={data}
            loading={loading}
            emptyContent={<EmptyState icon="box-delivery-package" />}
            topContent={
                <TableToolbar
                    tableId="request-details-table"
                    showFilters={false}
                    showSearch={false}
                    totalRows={data.length}
                    columns={columns}
                    createButton={
                        <AddNewButton /> /* Assuming you have an AddNewButton component */
                    }
                />
            }
        />
    );
};

export default RequestDetailsListView;
