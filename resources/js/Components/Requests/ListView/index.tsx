import BaseListView, { Column } from "@/Layouts/BaseListView";
import React from "react";

const columns: Column<Request>[] = [
    { label: "FORM NO.", key: "form_number", sortable: true },
    { label: "CREATED BY", key: "creator", sortable: true },
    { label: "DATE CREATED", key: "created_at", sortable: true },
    // { label: "LAST MODIFIED", key: "updated_at", sortable: true },
    { label: "TYPE OF REQUEST", key: "request_type", sortable: true },
    { label: "STATUS", key: "status", sortable: true },
    { label: "ACTIONS", key: "actions" },
];

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
        />
    );
}
