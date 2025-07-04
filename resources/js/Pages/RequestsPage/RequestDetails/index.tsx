import React from "react";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/EmptyState";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { BoxFormState, FormProp } from "@/Utils/types";

// Placeholder components for the non-draft layout
import { storageColumns } from "./config/storageColumns";
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

interface RequestsViewProps {
    form: FormProp;
}

const RequestDetails = ({ form }: RequestsViewProps) => {
    const { boxes } = useBoxForm();

    if (form.is_draft) {
        return (
            <BaseListView<BoxFormState>
                columns={storageColumns}
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
                        title={form.form_number}
                        description={`Last updated: ${form.updated_at}`}
                        tableId="request-details-table"
                        showFilters={false}
                        showSearch={false}
                        totalRows={boxes.length}
                        columns={storageColumns}
                        createButton={
                            <div className="flex items-center gap-2">
                                {form.request_type === "Storage" && (
                                    <NewBoxForm />
                                )}
                                {form.request_type === "Withdrawal" && (
                                    <WithdrawalForm />
                                )}
                                <SaveButton />
                            </div>
                        }
                        itemLabel="request"
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
                <RequestSummary items={boxes.length} form={form} />
                <RequestBoxes boxes={boxes} />
            </div>

            <div className="flex flex-col gap-4 col-span-1 xl:col-span-1">
                <RequestCreator userId={form.created_by} />
                <RequestStatus statusLogs={form.status_logs} />
            </div>
        </div>
    );
};

export default RequestDetails;
