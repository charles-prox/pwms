import BaseListView from "@/Layouts/BaseListView";
import React from "react";
import { columns } from "./columns";
import AddNewButton from "./AddNewButton";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/Shared/EmptyState";
import { useBoxForm } from "@/Contexts/BoxFormContext";

interface RequestsListViewProps {
    loading?: boolean;
}
const RequestDetailsListView = ({ loading = false }: RequestsListViewProps) => {
    const { boxes } = useBoxForm();

    return (
        <BaseListView<Request>
            columns={columns}
            data={boxes}
            loading={loading}
            emptyContent={
                <EmptyState
                    title="This request is empty."
                    description="You have yet to add boxes for this storage request yet."
                    icon="box-delivery-package"
                />
            }
            topContent={
                <TableToolbar
                    tableId="request-details-table"
                    showFilters={false}
                    showSearch={false}
                    totalRows={boxes.length}
                    columns={columns}
                    createButton={<AddNewButton />}
                />
            }
        />
    );
};

export default RequestDetailsListView;
