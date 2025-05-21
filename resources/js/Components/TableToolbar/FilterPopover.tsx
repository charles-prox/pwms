import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { EraserIcon, FilterIcon } from "@/Layouts/ListViewLayout/icons";
import {
    Popover,
    Badge,
    PopoverTrigger,
    Button,
    PopoverContent,
    Select,
    SelectItem,
    Input,
} from "@heroui/react";
import React from "react";
import { TrashIcon } from "../Forms/icons";
import Icon from "../Icon";

const FilterPopover = ({
    tableId,
    columns,
}: {
    tableId: string;
    columns: any;
}) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);
    const { filters: appliedFilters } = tableOptions;
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

    return (
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
            <PopoverContent>
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
                                selectedKeys={[filter.column]}
                                disabledKeys={filters
                                    .filter((_, i) => i !== index)
                                    .map((f) => f.column)}
                                onChange={(e) =>
                                    updateFilter(
                                        index,
                                        "column",
                                        e.target.value
                                    )
                                }
                            >
                                {columns.map((column: any) => (
                                    <SelectItem key={column.key}>
                                        {column.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Input
                                label="Filter by value"
                                size="sm"
                                value={filter.value}
                                onChange={(e) =>
                                    updateFilter(index, "value", e.target.value)
                                }
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                onPress={() => removeFilter(index)}
                            >
                                <Icon name="trash" size={18} />
                            </Button>
                        </div>
                    ))}
                    <div className="flex self-center gap-2">
                        {filters.length > 0 && (
                            <Button
                                color="danger"
                                onPress={() => {
                                    setFilters([]);
                                    updateTableOptions(tableId, {
                                        filters: null,
                                    });
                                }}
                                className="gap-2"
                                startContent={<Icon name="eraser" size={20} />}
                            >
                                Clear Filters
                            </Button>
                        )}

                        {filters.length > 0 && (
                            <Button
                                color="primary"
                                onPress={() =>
                                    updateTableOptions(tableId, {
                                        filters: filters,
                                    })
                                }
                                className="gap-2"
                                startContent={<Icon name="filter" size={20} />}
                            >
                                Apply Filters
                            </Button>
                        )}
                        <Button
                            color="secondary"
                            onPress={addFilter}
                            className="gap-2"
                            startContent={<Icon name="plus" size={20} />}
                        >
                            Add Filter
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default FilterPopover;
