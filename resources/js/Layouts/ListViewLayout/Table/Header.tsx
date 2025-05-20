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
    Badge,
} from "@heroui/react";

import {
    EraserIcon,
    FilterIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from "../icons";
import { useTheme } from "@/Contexts/ThemeContext";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

interface HeaderContentProps {
    totalRows: number;
    columns: any[];
    itemName: string;
    onOpenUploadForm: (() => void) | null;
    onOpenAddNewForm: (() => void) | null;
    tableid: string; // Unique table identifier
    enableSearch?: boolean;
    enableFilters?: boolean;
    customAddNewButton?: React.ReactNode;
    customSaveButton?: React.ReactNode;
}

const HeaderContent: React.FC<HeaderContentProps> = ({
    totalRows,
    columns,
    itemName,
    onOpenUploadForm,
    onOpenAddNewForm,
    tableid,
    enableSearch = true,
    enableFilters = true,
    customAddNewButton,
    customSaveButton,
}) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();

    // Get the table options for this specific table
    const tableOptions = getTableOptions(tableid);
    const { per_page, search_key, filters: appliedFilters } = tableOptions;

    const theme = useTheme().theme;
    const hasAddNew = !!onOpenAddNewForm;
    const hasUpload = !!onOpenUploadForm;
    const [searchValue, setSearchValue] = React.useState(search_key || "");
    const [filters, setFilters] = React.useState<
        { column: string; value: string }[]
    >(appliedFilters || []);

    // Function to add a new filter
    const addFilter = () => {
        setFilters([...filters, { column: "", value: "" }]);
    };

    // Function to update a specific filter
    const updateFilter = (
        index: number,
        key: "column" | "value",
        newValue: string
    ) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter, i) =>
                i === index ? { ...filter, [key]: newValue } : filter
            )
        );
    };

    // Function to remove a filter
    const removeFilter = (index: number) => {
        setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
    };

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
            setSearchValue(value);
        } else {
            setSearchValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setSearchValue("");
        updateTableOptions(tableid, {
            search_key: "",
            current_page: "1",
        });
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div
                    className={`flex ${
                        enableSearch ? "justify-between" : "justify-end"
                    } gap-3 items-end`}
                >
                    {enableSearch && (
                        <div className="flex gap-3">
                            <Input
                                isClearable
                                className="w-full min-w-[400px] sm:max-w-[44%]"
                                placeholder="Search item..."
                                startContent={<SearchIcon />}
                                value={searchValue}
                                onClear={onClear}
                                onValueChange={onSearchChange}
                            />
                            <Button
                                color="primary"
                                onPress={() =>
                                    updateTableOptions(tableid, {
                                        search_key: searchValue,
                                        current_page: "1",
                                    })
                                }
                            >
                                Search
                            </Button>
                        </div>
                    )}
                    <div className="flex gap-3">
                        {enableFilters && (
                            <Popover offset={10} placement="bottom">
                                <Badge
                                    color="secondary"
                                    content={filters.length}
                                    isInvisible={filters.length === 0}
                                >
                                    <PopoverTrigger>
                                        <Button color="primary">Filters</Button>
                                    </PopoverTrigger>
                                </Badge>
                                <PopoverContent
                                    className={`w-[540px] ${theme} text-foreground`}
                                >
                                    <div className="m-2 flex flex-col gap-2 w-full">
                                        {filters.map((filter, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-row gap-2 items-center"
                                            >
                                                <Select
                                                    className="min-w-md"
                                                    label="Select a column"
                                                    size="sm"
                                                    selectedKeys={[
                                                        filter.column,
                                                    ]}
                                                    disabledKeys={filters
                                                        .filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                        .map((f) => f.column)}
                                                    onChange={(e) =>
                                                        updateFilter(
                                                            index,
                                                            "column",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {columns.map((column) => (
                                                        <SelectItem
                                                            key={column.uid}
                                                        >
                                                            {column.name}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                <Input
                                                    label="Filter by value"
                                                    size="sm"
                                                    value={filter.value}
                                                    onChange={(e) =>
                                                        updateFilter(
                                                            index,
                                                            "value",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    onPress={() =>
                                                        removeFilter(index)
                                                    }
                                                >
                                                    <TrashIcon size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex self-center gap-2">
                                            {filters.length > 0 && (
                                                <Button
                                                    color="danger"
                                                    onPress={() => {
                                                        setFilters([]);
                                                        updateTableOptions(
                                                            tableid,
                                                            {
                                                                filters: null,
                                                            }
                                                        );
                                                    }}
                                                    className="gap-2"
                                                    startContent={
                                                        <EraserIcon />
                                                    }
                                                >
                                                    Clear Filters
                                                </Button>
                                            )}

                                            {filters.length > 0 && (
                                                <Button
                                                    color="primary"
                                                    onPress={() =>
                                                        updateTableOptions(
                                                            tableid,
                                                            {
                                                                filters:
                                                                    filters,
                                                            }
                                                        )
                                                    }
                                                    className="gap-2"
                                                    startContent={
                                                        <FilterIcon />
                                                    }
                                                >
                                                    Apply Filters
                                                </Button>
                                            )}
                                            <Button
                                                color="secondary"
                                                onPress={addFilter}
                                                className="gap-2"
                                                startContent={<PlusIcon />}
                                            >
                                                Add Filter
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                        {customAddNewButton}
                        {customSaveButton}
                        {hasAddNew && !hasUpload ? (
                            // Only "Add New" button if `onOpenAddNewForm` is defined
                            <Button
                                className="hidden sm:flex"
                                onPress={onOpenAddNewForm}
                                color="primary"
                                endContent={<PlusIcon />}
                            >
                                {itemName === "Request"
                                    ? "Create New"
                                    : "Add New"}{" "}
                                {itemName}
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
                        Total {totalRows} {itemName}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                updateTableOptions(tableid, {
                                    per_page: Number(e.target.value),
                                    current_page: "1",
                                });
                            }}
                            value={per_page || 10}
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
