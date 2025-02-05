import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Selection,
} from "@heroui/react";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "../icons";
import { useTheme } from "@/Contexts/ThemeContext";

interface StatusOption {
    uid: string;
    name: string;
}

interface HeaderContentProps {
    filterValue: string;
    onClear: () => void;
    onSearchChange: (value: string) => void;
    statusFilter: Selection;
    setStatusFilter: (keys: any) => void;
    statusOptions: StatusOption[];
    rows: any[];
    itemName: string;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const HeaderContent: React.FC<HeaderContentProps> = ({
    filterValue,
    onClear,
    onSearchChange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    rows,
    itemName,
    onRowsPerPageChange,
}) => {
    const theme = useTheme().theme;

    const handleAddAction = (key: Key) => {
        if (key === "upload") {
            // Handle file upload logic
            console.log("Opening file upload modal...");
        } else if (key === "manual") {
            // Handle manual form entry logic
            console.log("Opening manual form...");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Search by name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button
                                endContent={
                                    <ChevronDownIcon className="text-small" />
                                }
                                variant="flat"
                            >
                                Status
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                        >
                            {statusOptions.map((status) => (
                                <DropdownItem
                                    key={status.uid}
                                    className="capitalize"
                                >
                                    {status.name.charAt(0).toUpperCase() +
                                        status.name.slice(1)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                        showArrow
                        classNames={{
                            content: `${theme} text-foreground`,
                        }}
                    >
                        <DropdownTrigger>
                            <Button color="primary" endContent={<PlusIcon />}>
                                Add New
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Static Actions"
                            onAction={handleAddAction}
                        >
                            <DropdownItem key="upload">From File</DropdownItem>
                            <DropdownItem key="manual">Use Form</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Total {rows.length} {itemName}
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default HeaderContent;
