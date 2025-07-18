import React from "react";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/EmptyState";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { BoxFormState, FormProp } from "@/Utils/types";

// Placeholder components for the non-draft layout
import { storageColumns } from "./config/storageColumns";
import { returnColumns } from "./config/returnColumns";
import { withdrawalColumns } from "./config/withdrawalColumns";
import {
    RequestBoxes,
    RequestStatus,
    RequestSummary,
    RequestTitle,
    SaveButton,
} from "./components";
import NewBoxForm from "@/Components/Forms/NewBoxForm";
import RequestCreator from "./components/RequestCreator";
import WithdrawalForm from "@/Components/Forms/WithdrawalForm";
import { useSelectedBoxes } from "@/Contexts/SelectedBoxesContext";
import { usePage } from "@inertiajs/react";

interface RequestsViewProps {
    form: FormProp;
}

const RequestDetails = ({ form }: RequestsViewProps) => {
    const { selectedBoxes } = useSelectedBoxes();
    const { boxes, setBoxes } = useBoxForm();
    const { withdrawn_boxes } = usePage<{
        withdrawn_boxes: BoxFormState[];
    }>().props;

    const displayedBoxes =
        form.request_type === "withdrawal"
            ? selectedBoxes
            : form.request_type === "return"
            ? withdrawn_boxes
            : boxes;

    const getColumns = () => {
        switch (form.request_type) {
            case "storage":
                return storageColumns;
            case "withdrawal":
                return withdrawalColumns;
            case "return":
                return returnColumns;
            default:
                return storageColumns; // Fallback
        }
    };

    if (form.is_draft) {
        return (
            <BaseListView<BoxFormState>
                isSelectable={
                    form.request_type === "return" ||
                    form.request_type === "disposal"
                }
                onSelectedItemsChange={(selected) => {
                    console.log(selected);

                    setBoxes(selected); // or update based on your state logic
                }}
                columns={getColumns()}
                data={displayedBoxes}
                loading={false}
                emptyContent={
                    <EmptyState
                        title="No boxes selected."
                        description="You have not selected any boxes yet for this request."
                        icon="box-delivery-package"
                    />
                }
                topContent={
                    <TableToolbar
                        title={form.form_number}
                        description={`Last updated: ${form.updated_at}`}
                        tableId="request-details-table"
                        showFilters={false}
                        showSearch={false}
                        totalRows={displayedBoxes.length}
                        columns={getColumns()}
                        createButton={
                            <div className="flex items-center gap-2">
                                {form.request_type === "storage" && (
                                    <NewBoxForm />
                                )}
                                {form.request_type === "withdrawal" && (
                                    <WithdrawalForm />
                                )}
                                <SaveButton />
                            </div>
                        }
                        itemLabel="box"
                    />
                }
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
            {/* Top row: Status and Timeline */}
            <div className="col-span-3">
                <RequestTitle
                    title={form.form_number}
                    status={form.status}
                    pdfPath={form.pdf_path || ""}
                />
            </div>
            {/* Middle row: Request Details */}
            <div className="flex flex-col col-span-1 xl:col-span-2 gap-4">
                <RequestSummary items={form.boxes.length} form={form} />
                <RequestBoxes
                    boxes={form.boxes}
                    requestType={form.request_type}
                />
            </div>

            <div className="flex flex-col gap-4 col-span-1 xl:col-span-1">
                <RequestCreator userId={form.created_by} />
                <RequestStatus statusLogs={form.status_logs} />
            </div>
        </div>
    );
};

export default RequestDetails;
