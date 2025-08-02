import { Column } from "@/Layouts/BaseListView";
import UpdateStatusAction from "../component/UpdatedStatusAction";
import CompleteStorageRequestAction from "../component/CompleteStorageRequestAction";
import CompleteWithdrawalRequestAction from "../component/CompleteWithdrawalRequestAction";
import CompleteReturnRequestAction from "../component/CompleteReturnRequestAction";
import { toTitleCase } from "@/Utils/helpers";
import CompleteDisposalRequestAction from "../component/CompleteDisposalRequestAction";
import DisposalStatusUpdateAction from "../component/DisposalStatusUpdateAction";
import { FormProp } from "@/Utils/types";

const renderAction = (item: any) => {
    const status = item.status.toLowerCase();
    const requestType = item.request_type;

    if (status !== "completed" && status !== "pending") {
        if (requestType === "storage") {
            return <CompleteStorageRequestAction item={item} />;
        } else if (requestType === "withdrawal") {
            return (
                <CompleteWithdrawalRequestAction
                    requestId={item.id}
                    boxes={item.boxes.map((b: any) => ({
                        id: b.id,
                        box_code: b.box_code,
                    }))}
                />
            );
        } else if (requestType === "return") {
            return (
                <CompleteReturnRequestAction
                    requestId={item.id}
                    boxes={item.boxes.map((b: any) => ({
                        id: b.id,
                        box_code: b.box_code,
                    }))}
                />
            );
        } else if (requestType === "disposal") {
            return (
                <div className="flex gap-1">
                    <CompleteDisposalRequestAction
                        requestId={item.id}
                        boxes={item.boxes.map((b: any) => ({
                            id: b.id,
                            box_code: b.box_code,
                        }))}
                    />
                    <DisposalStatusUpdateAction item={item} />
                </div>
            );
        }
    }

    return <UpdateStatusAction item={item} />;
};

export const columns: Column<FormProp>[] = [
    { label: "FORM NO.", key: "form_number", sortable: true },
    { label: "CREATED BY", key: "creator", sortable: true },
    {
        label: "OFFICE",
        key: "office",
        sortable: true,
        render: (item: any) => item.office?.name || "N/A",
    },
    { label: "DATE CREATED", key: "created_at", sortable: true },
    // { label: "LAST MODIFIED", key: "updated_at", sortable: true },
    { label: "TYPE OF REQUEST", key: "request_type", sortable: true },
    {
        label: "STATUS",
        key: "status",
        sortable: true,
        render: (item: any) => toTitleCase(item.status),
    },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item: any) => renderAction(item),
    },
];
