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
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import NewBoxForm from "@/Components/Forms/NewBoxForm";

export default function ActionButtons({ row }: any) {
    const { showAlert } = useModalAlert();
    const { deleteBox } = useBoxForm();

    const onEdit = (row: any) => {
        router.visit(`/request/${row.form_number}`);
    };

    return (
        <div className="relative flex justify-start items-center gap-2">
            <div className="hidden md:flex gap-2">
                <NewBoxForm
                    triggerButton={
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                        >
                            <Icon name="edit-pen-2" size={20} />
                        </Button>
                    }
                    editBoxId={row.id}
                />
                <Tooltip content="Delete">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => deleteBox(row.id)}
                        color={"danger"}
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
                        <DropdownItem key="edit" onPress={() => onEdit(row)}>
                            Edit
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            onPress={() => deleteBox(row.id)}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
