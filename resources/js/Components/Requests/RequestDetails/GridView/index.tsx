import { BoxFormState } from "@/Utils/types";
import React from "react";
interface RequestsGridViewProps {
    data: BoxFormState[];
    loading?: boolean;
}

const RequestDetailsGridView = ({
    data,
    loading = false,
}: RequestsGridViewProps) => {
    return (
        <div className="border p-4 rounded bg-white shadow">
            <p className="text-gray-600">
                🗃️ Request Details — Grid View (placeholder)
            </p>
        </div>
    );
};

export default RequestDetailsGridView;
