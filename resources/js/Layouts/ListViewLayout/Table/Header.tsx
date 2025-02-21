import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Selection,
    PopoverTrigger,
    Popover,
    PopoverContent,
    Select,
    SelectItem,
} from "@heroui/react";

import { ChevronDownIcon, PlusIcon, SearchIcon } from "../icons";
import { useTheme } from "@/Contexts/ThemeContext";

interface StatusOption {
    uid: string;
    name: string;
}

interface HeaderContentProps {
    statusFilter?: Selection;
    setStatusFilter?: (keys: any) => void;
    statusOptions: StatusOption[];
    rows: any[];
    columns: any[];
    itemName: string;
    rowsPerPage?: number;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onOpenUploadForm: (() => void) | null;
    onOpenAddNewForm: (() => void) | null;
    handleSearch: (key: string) => void;
}

const HeaderContent: React.FC<HeaderContentProps> = ({
    statusFilter,
    setStatusFilter,
    statusOptions,
    rows,
    columns,
    itemName,
    rowsPerPage,
    onRowsPerPageChange,
    onOpenUploadForm,
    onOpenAddNewForm,
    handleSearch,
}) => {
    const theme = useTheme().theme;
    const hasAddNew = !!onOpenAddNewForm;
    const hasUpload = !!onOpenUploadForm;
    const [filterValue, setFilterValue] = React.useState("");

    const handleAddAction = (key: Key) => {
        if (key === "upload") {
            // Handle file upload logic
            console.log("Opening file upload modal...");
        } else if (key === "manual") {
            // Handle manual form entry logic
            console.log("Opening manual form...");
        }
    };

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <div className="flex gap-3">
                        <Input
                            isClearable
                            className="w-full min-w-[400px] sm:max-w-[44%]"
                            placeholder="Search by item..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                        <Button
                            color="primary"
                            onPress={() => handleSearch(filterValue)}
                        >
                            Search
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        <Popover showArrow offset={10} placement="bottom">
                            <PopoverTrigger>
                                <Button color="primary">Customize</Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className={`w-[540px] ${theme} text-foreground`}
                            >
                                <div className="m-2 flex flex-row gap-2 w-full">
                                    <Select
                                        className="min-w-md"
                                        label="Select a column"
                                        size="sm"
                                    >
                                        {columns.map((column) => (
                                            <SelectItem key={column.uid}>
                                                {column.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Input label="Filter by value" size="sm" />
                                </div>
                            </PopoverContent>
                        </Popover>
                        {hasAddNew && !hasUpload ? (
                            // Only "Add New" button if `onOpenAddNewForm` is defined
                            <Button
                                className="hidden sm:flex"
                                onPress={onOpenAddNewForm}
                                color="primary"
                                endContent={<PlusIcon />}
                            >
                                Add New {itemName}
                            </Button>
                        ) : hasUpload && !hasAddNew ? (
                            // Only "Upload File" button if `onOpenUploadForm` is defined
                            <Button
                                className="hidden sm:flex"
                                onPress={onOpenUploadForm}
                                color="primary"
                                endContent={<PlusIcon />}
                            >
                                Import from File
                            </Button>
                        ) : hasAddNew && hasUpload ? (
                            // Dropdown if both `onOpenAddNewForm` and `onOpenUploadForm` are defined
                            <Dropdown
                                showArrow
                                classNames={{
                                    content: `${theme} text-foreground`,
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        color="primary"
                                        endContent={<PlusIcon />}
                                    >
                                        Add New
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Static Actions"
                                    onAction={handleAddAction}
                                >
                                    <DropdownItem
                                        key="upload"
                                        onPress={onOpenUploadForm}
                                    >
                                        Import from File
                                    </DropdownItem>
                                    <DropdownItem
                                        key="manual"
                                        onPress={onOpenAddNewForm}
                                    >
                                        Use Form
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : null}
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
                            value={rowsPerPage}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </label>
                </div>
            </div>
        </>
    );
};

export default HeaderContent;
