import React from "react";

interface RequestsListViewProps {
    data: Request[];
    loading?: boolean;
}
const RequestDetailsListView = ({
    data,
    loading = false,
}: RequestsListViewProps) => {
    return (
        <div className="border p-4 rounded bg-white shadow">
            <p className="text-gray-600">
                📄 Request Details — List View (placeholder)
            </p>
        </div>
    );
};

export default RequestDetailsListView;
