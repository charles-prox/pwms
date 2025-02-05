import React from "react";
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { ChevronDownIcon, GridIcon, ListIcon } from "./icons";
import { useRequestViewContext } from "@/Contexts/RequestViewContext";

interface Layout {
    key: string;
    label: string;
    icon: JSX.Element;
}

interface ViewButtonProps {
    pageId: string;
}

export default function ViewButton({ pageId }: ViewButtonProps) {
    const { selectedRequestView, setPageView } = useRequestViewContext();

    // Find the current view for the page (defaults to 'list' if not found)
    const currentView =
        selectedRequestView.find((item) => item.pageId === pageId)?.view ||
        "list";

    const layouts: Layout[] = [
        { key: "list", label: "List view", icon: <ListIcon size="20" /> },
        { key: "grid", label: "Grid view", icon: <GridIcon size="20" /> },
    ];

    const handleSelectionChange = (keys: any) => {
        const selected = keys.currentKey;
        setPageView(pageId, selected); // Update context and localStorage for the selected page view
    };

    return (
        <ButtonGroup variant="flat">
            <Button isIconOnly>
                {layouts.find((layout) => layout.key === currentView)?.icon}
            </Button>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button isIconOnly>
                        <ChevronDownIcon />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    className="max-w-[300px]"
                    selectedKeys={new Set([currentView])}
                    selectionMode="single"
                    onSelectionChange={handleSelectionChange}
                >
                    {layouts.map((layout) => (
                        <DropdownItem
                            key={layout.key}
                            startContent={layout.icon}
                        >
                            {layout.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </ButtonGroup>
    );
}
