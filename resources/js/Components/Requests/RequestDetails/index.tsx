import React from "react";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/Shared/EmptyState";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { BoxFormState } from "@/Utils/types";

// Placeholder components for the non-draft layout
import { columns } from "./config/columns";
import {
    RequestBoxes,
    RequestPreview,
    RequestStatus,
    RequestSummary,
    RequestTimeline,
    SaveButton,
} from "./components";
import NewBoxForm from "@/Components/Forms/NewBoxForm";
// import RequestPreview from "./RequestPreview";

interface RequestsViewProps {
    isDraft?: boolean;
}

const RequestDetails = ({ isDraft }: RequestsViewProps) => {
    const { boxes } = useBoxForm();

    if (isDraft) {
        return (
            <BaseListView<BoxFormState>
                columns={columns}
                data={boxes}
                loading={!!!boxes}
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
                        createButton={
                            <div className="flex items-center gap-2">
                                <NewBoxForm />
                                <SaveButton />
                            </div>
                        }
                    />
                }
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 p-4">
                {/* Top row: Status and Timeline */}
                <div className="col-span-1">
                    <RequestStatus status={"Pending"} type={"storage"} />
                </div>
                <div className="col-span-1 xl:col-span-2">
                    <RequestTimeline />
                </div>

                {/* Middle row: Request Details */}
                <div className="col-span-1 xl:col-span-3">
                    <RequestSummary />
                </div>

                {/* Bottom row: Boxes and Preview */}
                <div className="col-span-1 md:col-span-1">
                    <RequestBoxes />
                </div>
                <div className="col-span-1 md:col-span-1">
                    <RequestPreview />
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
