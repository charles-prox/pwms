import { Column } from "@/Layouts/BaseListView";
import UpdateStatusAction from "../component/UpdatedStatusAction";
import CompleteStorageRequestAction from "../component/CompleteStorageRequestAction";
import CompleteWithdrawalRequestAction from "../component/CompleteWithdrawalRequestAction";
import CompleteReturnRequestAction from "../component/CompleteReturnRequestAction";
import CompleteDisposalRequestAction from "../component/CompletDisposalRequestAction";
import { FormProp } from "@/Utils/types";
import DisposalStatusUpdateAction from "../component/DisposalStatusUpdateAction";

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
    { label: "STATUS", key: "status", sortable: true },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item: any) => {
            console.log("Rendering actions for item:", item.status);
            console.log("Item details:", item);

            return item.status.toLowerCase() === "approved" ? (
                item.request_type === "storage" ? (
                    <CompleteStorageRequestAction item={item} />
                ) : item.request_type === "withdrawal" ? (
                    <CompleteWithdrawalRequestAction
                        requestId={item.id}
                        boxes={item.boxes.map((b: any) => ({
                            id: b.id,
                            box_code: b.box_code,
                        }))}
                    />
                ) : item.request_type === "return" ? (
                    <CompleteReturnRequestAction
                        requestId={item.id}
                        boxes={item.boxes.map((b: any) => ({
                            id: b.id,
                            box_code: b.box_code,
                        }))}
                    />
                ) : item.request_type === "disposal" ? (
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
                ) : null
            ) : (
                <UpdateStatusAction item={item} />
            );
        },
    },
];
