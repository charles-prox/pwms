import { Column } from "@/Layouts/BaseListView";
import ActionButtons from "./ActionButtons";

export const columns: Column<Request>[] = [
    { label: "BOX CODE", key: "box_code" },
    { label: "PRIORITY LEVEL", key: "priority_level" },
    { label: "DISPOSAL DATE", key: "disposal_date" },
    { label: "BOX CONTENTS", key: "documents" },
    { label: "REMARKS", key: "remarks" },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item: any) => <ActionButtons row={item} />,
    },
];
