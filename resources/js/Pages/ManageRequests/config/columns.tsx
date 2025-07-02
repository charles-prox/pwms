import { Column } from "@/Layouts/BaseListView";
import { UpdatePasswordForm } from "@/Pages/Account/Security/forms/UpdatePasswordForm";
import UpdateStatusAction from "../component/UpdatedStatusAction";

export const columns: Column<Request>[] = [
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
        render: (item: any) => <UpdateStatusAction item={item} />,
    },
];
