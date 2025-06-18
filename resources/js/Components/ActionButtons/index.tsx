// Components/ActionButtons.tsx

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
} from "@heroui/react";
import Icon from "@/Components/Icon";

interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    extraButtons?: React.ReactNode; // For custom triggers like <BoxLabelViewer />
    disabled?: {
        view?: boolean;
        edit?: boolean;
        delete?: boolean;
    };
    isDraft?: boolean;
    showDetailsButton?: boolean;
}

export default function ActionButtons({
    onEdit,
    onDelete,
    onView,
    extraButtons,
    disabled = {},
    isDraft = false,
    showDetailsButton = false,
}: ActionButtonsProps) {
    return (
        <div className="relative flex justify-start items-center gap-2">
            <div className="hidden md:flex gap-0">
                {onEdit && (
                    <Tooltip content="Edit">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={onEdit}
                            color="primary"
                            isDisabled={disabled.edit}
                        >
                            <Icon name="edit-pen-2" size={20} />
                        </Button>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip content="Delete">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={onDelete}
                            color="danger"
                            isDisabled={disabled.delete}
                        >
                            <Icon name="trash" size={20} />
                        </Button>
                    </Tooltip>
                )}
                {!showDetailsButton && onView && (
                    <Tooltip content="Delete">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={onView}
                            color="secondary"
                            isDisabled={disabled.delete}
                        >
                            <Icon name="eye-open" size={20} />
                        </Button>
                    </Tooltip>
                )}
                {showDetailsButton && onView && (
                    <Button
                        size="sm"
                        variant="solid"
                        onPress={onView}
                        color="warning"
                    >
                        Details
                    </Button>
                )}
                {extraButtons}
            </div>

            <div className="block md:hidden">
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                            <Icon name="navi-menu-dot" size={18} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {onView ? (
                            <DropdownItem key={"view"} onPress={onView}>
                                View
                            </DropdownItem>
                        ) : null}
                        {onEdit ? (
                            <DropdownItem key={"edit"} onPress={onEdit}>
                                Edit
                            </DropdownItem>
                        ) : null}
                        {onDelete ? (
                            <DropdownItem key={"delete"} onPress={onDelete}>
                                Delete
                            </DropdownItem>
                        ) : null}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
