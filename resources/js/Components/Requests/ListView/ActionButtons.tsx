// Components/Requests/ListView/ActionButtons.tsx
import React from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
} from "@heroui/react";
import Icon from "@/Components/Icon";

interface Props {
    row: any;
    onEdit: (row: Request) => void;
    onView: (row: Request) => void;
    onDelete: (row: Request) => void;
}

export default function ActionButtons({
    row,
    onEdit,
    onView,
    onDelete,
}: Props) {
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
                                key="delete"
                                onPress={() => onView(row)}
                            >
                                View
                            </DropdownItem>
                        ) : null}
                        <DropdownItem key="delete" onPress={() => onEdit(row)}>
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
