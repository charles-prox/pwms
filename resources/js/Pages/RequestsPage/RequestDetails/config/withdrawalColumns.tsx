import { Column } from "@/Layouts/BaseListView";
import { BoxFormState } from "@/Utils/types";
import BoxDetailsPopover from "../components/BoxDetailsPopover";
import { WithdrawalActionButtons } from "../components";

export const withdrawalColumns: Column<BoxFormState>[] = [
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
                {item.withdrawalRemarks ?? ""}
            </p>
        ),
    },
    {
        label: "ACTION",
        key: "action",
        render: (item: BoxFormState) => <WithdrawalActionButtons row={item} />, // Assuming ActionButtons is defined elsewhere
    },
];
