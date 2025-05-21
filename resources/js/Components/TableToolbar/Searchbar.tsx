import Icon from "@/Components/Icon";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { Button, Input } from "@heroui/react";
import React from "react";

const Searchbar = ({ tableId }: { tableId: string }) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();

    const tableOptions = getTableOptions(tableId);
    const { search_key } = tableOptions;
    const [searchValue, setSearchValue] = React.useState(search_key || "");

    const onClear = React.useCallback(() => {
        setSearchValue("");
        updateTableOptions(tableId, {
            search_key: "",
            current_page: "1",
        });
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setSearchValue(value);
        } else {
            setSearchValue("");
        }
    }, []);

    return (
        <div className="flex gap-3">
            <Input
                isClearable
                className="w-full min-w-[400px] sm:max-w-[30%]"
                placeholder="Search request..."
                startContent={<Icon name="search-file" size={22} />}
                value={searchValue}
                onClear={onClear}
                onValueChange={onSearchChange}
            />
            <Button
                color="primary"
                onPress={() =>
                    updateTableOptions(tableId, {
                        search_key: searchValue,
                        current_page: "1",
                    })
                }
            >
                Search
            </Button>
        </div>
    );
};

export default Searchbar;
