import { Column } from "@/Layouts/BaseListView";
import ActionButtons from "../components/ActionButtons";
import { FormProp } from "@/Utils/types";
import { toTitleCase } from "@/Utils/helpers";

export const columns: Column<FormProp>[] = [
    { label: "FORM NO.", key: "form_number", sortable: true },
    { label: "CREATED BY", key: "creator", sortable: true },
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
        render: (item: any) => <ActionButtons row={item} />,
    },
];
