import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
} from "@heroui/react";
import Icon from "@/Components/Icon";
import { router } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";
import { useModalAlert } from "@/Contexts/ModalAlertContext";

export default function ActionButtons({ row }: any) {
    const { showAlert } = useModalAlert();
    const onDelete = async (row: { form_number: string }) => {
        showAlert({
            type: "warning",
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this request?",
            mode: "confirm",
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/request/${row.form_number}`);
                    showAlert({
                        type: "success",
                        title: "Request Deleted",
                        message: "Request deleted successfully.",
                        autoClose: true,
                        autoCloseDuration: 3000,
                    });
                    router.reload();
                } catch (error) {
                    console.error("Failed to delete request:", error);
                    showAlert({
                        type: "error",
                        title: "Error",
                        message: "Failed to delete request.",
                        autoClose: true,
                        autoCloseDuration: 3000,
                    });
                }
            },
            onCancel: () => {
                console.log("Deletion canceled");
            },
        });
    };

    const onEdit = (row: any) => {
        router.visit(`/request/${row.form_number}`);
    };

    const onView = (row: any) => {
        router.visit(`/request/${row.form_number}`);
        // showAlert("Redirecting", "info", "Navigating to request details...");
    };

    return (
        <div className="relative flex justify-start items-center gap-2">
            <div className="hidden md:flex gap-2">
                <Tooltip content="Edit">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(row)}
                        color="primary"
                    >
                        <Icon name="edit-pen-2" size={20} />
                    </Button>
                </Tooltip>
                {!row.is_draft ? (
                    <Tooltip content="View more information">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => onView(row)}
                            color="warning"
                            className={row.form_number ? "" : "hidden"}
                        >
                            <Icon name="file-info" size={20} />
                        </Button>
                    </Tooltip>
                ) : null}
                <Tooltip content="Delete">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onDelete(row)}
                        color={!row.is_draft ? "default" : "danger"}
                        isDisabled={!row.is_draft}
                        className="disabled:opacity-10"
                    >
                        <Icon name="trash" size={20} />
                    </Button>
                </Tooltip>
            </div>

            <div className="block md:hidden">
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                            <Icon name="navi-menu-dot" size={18} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {!row.is_draft ? (
                            <DropdownItem
                                key="view"
                                onPress={() => onView(row)}
                            >
                                View
                            </DropdownItem>
                        ) : null}
                        <DropdownItem key="edit" onPress={() => onEdit(row)}>
                            Edit
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            onPress={() => onDelete(row)}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
