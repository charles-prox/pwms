import { Column } from "@/Layouts/BaseListView";
import { BoxFormState } from "@/Utils/types";
import BoxDetailsPopover from "../components/BoxDetailsPopover";
import { WithdrawalActionButtons } from "../components";

export const returnColumns: Column<BoxFormState>[] = [
    { label: "BOX CODE", key: "box_code" },
    { label: "LOCATION", key: "location" },
    {
        label: "DOCUMENTS",
        key: "box_details",
        render: (item: BoxFormState) => (
            <BoxDetailsPopover documents={item.box_details} />
        ),
    },
    {
        label: "REMARKS",
        key: "remarks",
        render: (item: BoxFormState) => (
            <p className="whitespace-pre-line">
                {item.request_remarks?.withdrawal ?? ""}
            </p>
        ),
    },
    {
        label: "WITHDRAWAL FORM",
        key: "withdrawal_form",
        render: (item: BoxFormState) => item.request_info.form_number ?? "",
    },
    {
        label: "WITHDRAWAL DATE",
        key: "withdrawal_date",
        render: (item: BoxFormState) => item.completed_at,
    },
];
