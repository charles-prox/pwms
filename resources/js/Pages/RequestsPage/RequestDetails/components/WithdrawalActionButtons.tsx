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
import { BoxFormState, FormProp } from "@/Utils/types";
import { useSelectedBoxes } from "@/Contexts/SelectedBoxesContext";
import WithdrawalBoxRemarks from "@/Components/Forms/WithdrawalBoxRemarks";

export default function WithdrawalActionButtons({
    row,
}: {
    row: BoxFormState;
}) {
    const { removeBox } = useSelectedBoxes();

    const onEdit = (row: any) => {
        router.visit(`/request/${row.form_number}`);
    };

    return (
        <div className="relative flex justify-start items-center gap-2">
            <div className="hidden md:flex gap-0">
                <WithdrawalBoxRemarks box={row} />
                <Tooltip content="Delete">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => removeBox(row.id)}
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
                            onPress={() => removeBox(row.id)}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
