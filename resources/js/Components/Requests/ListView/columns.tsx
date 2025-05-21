import { Column } from "@/Layouts/BaseListView";
import ActionButtons from "./ActionButtons";

export const columns: Column<Request>[] = [
    { label: "FORM NO.", key: "form_number", sortable: true },
    { label: "CREATED BY", key: "creator", sortable: true },
    { label: "DATE CREATED", key: "created_at", sortable: true },
    // { label: "LAST MODIFIED", key: "updated_at", sortable: true },
    { label: "TYPE OF REQUEST", key: "request_type", sortable: true },
    { label: "STATUS", key: "status", sortable: true },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item) => (
            <ActionButtons
                row={item}
                onEdit={(r) => console.log("Edit", r)}
                onView={(r) => console.log("View", r)}
                onDelete={(r) => console.log("Delete", r)}
            />
        ),
    },
];
