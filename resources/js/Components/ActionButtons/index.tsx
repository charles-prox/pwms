// Components/Shared/ActionButtons.tsx

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
            <div className="hidden md:flex gap-2">
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
                        {onView && (
                            <DropdownItem onPress={onView}>View</DropdownItem>
                        )}
                        {onEdit && (
                            <DropdownItem onPress={onEdit}>Edit</DropdownItem>
                        )}
                        {onDelete && (
                            <DropdownItem onPress={onDelete}>
                                Delete
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
