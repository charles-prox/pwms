// components/PageLayoutViewController.tsx
import React from "react";
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { useLayoutViewContext } from "@/Contexts/LayoutViewContext";
import Icon from "../Icon";

interface PageLayoutViewControllerProps {
    pageId: string;
}

interface Layout {
    key: "list" | "grid";
    label: string;
    icon: JSX.Element;
}

export default function PageLayoutViewController({
    pageId,
}: PageLayoutViewControllerProps) {
    const { getLayoutView, setLayoutView } = useLayoutViewContext();

    const currentView = getLayoutView(pageId);

    const layouts: Layout[] = [
        {
            key: "list",
            label: "List view",
            icon: <Icon name="list-view" size="20" />,
        },
        {
            key: "grid",
            label: "Grid view",
            icon: <Icon name="grid-view" size="20" />,
        },
    ];

    const handleSelectionChange = (keys: any) => {
        const selected = keys.currentKey;
        if (selected === "list" || selected === "grid") {
            setLayoutView(pageId, selected);
        }
    };

    return (
        <ButtonGroup variant="flat">
            <Button isIconOnly>
                {layouts.find((layout) => layout.key === currentView)?.icon}
            </Button>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button isIconOnly>
                        <Icon name="chevron-down" size={15} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Layout view options"
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
