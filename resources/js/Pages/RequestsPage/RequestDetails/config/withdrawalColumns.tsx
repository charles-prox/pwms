import { Column } from "@/Layouts/BaseListView";
import { BoxFormState } from "@/Utils/types";
import BoxDetailsPopover from "../components/BoxDetailsPopover";

export const storageColumns: Column<BoxFormState>[] = [
    { label: "BOX CODE", key: "box_code" },
    { label: "LOCATION", key: "location" },
    { label: "Remarks", key: "remarks" },
    {
        label: "Documents",
        key: "box_details",
        render: (item: BoxFormState) => (
            <BoxDetailsPopover documents={item.box_details} />
        ),
    },
];
