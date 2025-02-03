import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Selection,
} from "@nextui-org/react";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "../icons";

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
                    <Button color="primary" endContent={<PlusIcon />}>
                        Add New
                    </Button>
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
