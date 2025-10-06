"use client";

import { useState, memo, useEffect } from "react";
import useFetch from "@/Hooks/useFetch";
import {
    Card,
    CardBody,
    Input,
    Popover,
    Spinner,
    PopoverTrigger,
    PopoverContent,
    Button,
    Chip,
} from "@heroui/react";

type RdsResponse = Record<
    string,
    Record<
        string,
        Record<
            string,
            {
                parent_item: {
                    title_description: string;
                    retention_period: string | number;
                    item_no: number;
                    rds_number?: string;
                };
                sub_items: {
                    title_description: string;
                    retention_period: string | number;
                    item_no: number;
                    rds_number?: string;
                }[];
            }
        >
    >
>;

interface SelectorProps {
    onChange: (e: any) => void;
    rds_details?: any;
    errors: string | undefined;
}

// Memoized highlight component
const HighlightedText = memo(
    ({ text, keyword }: { text: string; keyword: string }) => {
        if (!keyword) return <>{text}</>;
        const parts = text.split(new RegExp(`(${keyword})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === keyword.toLowerCase() ? (
                        <mark key={i} className="bg-yellow-200">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    }
);

// Memoized chip component
const RetentionChip = memo(({ period }: { period: string | number }) => {
    if (
        !period ||
        period === 0 ||
        period === "0" ||
        period === "None" ||
        period === "none"
    )
        return null;
    return (
        <Chip
            size="sm"
            color={
                String(period).toLowerCase() === "permanent"
                    ? "success"
                    : "secondary"
            }
            variant="flat"
            className="ml-auto text-xs"
        >
            {period}
        </Chip>
    );
});

const RdsSelector = ({ onChange, rds_details, errors }: SelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightKeyword, setHighlightKeyword] = useState(""); // only update on search
    const [selected, setSelected] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [searchParams, setSearchParams] = useState<Record<string, unknown>>(
        {}
    );

    // Fetch RDS
    const { data, loading, error, refetch } = useFetch<{
        success: boolean;
        data: RdsResponse;
    }>(
        "/rds/search",
        { success: true, data: {} as RdsResponse },
        { method: "GET", params: searchParams }
    );

    useEffect(() => {
        // When resetting, wait until loading finishes
        if (isResetting && !loading) {
            setIsResetting(false);
        }
    }, [isResetting, loading]);

    const handleSearch = () => {
        setSearchParams(query ? { q: query } : {});
        setHighlightKeyword(query); // highlight only on search
        setHasSearched(true);
    };

    const handleSelect = (item: any, parent?: any) => {
        if (!item || item.retention_period === 0) return;
        const label = parent
            ? `${parent.title_description} — ${item.title_description}`
            : item.title_description;
        const value = {
            ...item,
            retention_period: item.retention_period ?? 0,
            label,
        };
        setSelected(value);
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="space-y-3">
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom-start"
                classNames={{ content: "px-0" }}
            >
                <PopoverTrigger>
                    <Input
                        label="RDS Title/Description"
                        name="title_description"
                        placeholder="Search and select RDS..."
                        value={
                            rds_details?.description ||
                            (selected ? selected.label : "")
                        }
                        errorMessage={errors}
                        isRequired
                        isReadOnly
                        classNames={{
                            inputWrapper: "w-[400px]",
                            input: "text-left",
                            label: "font-bold",
                        }}
                    />
                </PopoverTrigger>

                <PopoverContent className="py-4 w-[500px]">
                    <div className="flex gap-1 px-2 mb-3 w-full">
                        <Input
                            placeholder="Search RDS..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            fullWidth
                            variant="bordered"
                            size="sm"
                            isClearable
                            onClear={() => setQuery("")}
                        />
                        <Button
                            size="sm"
                            color="primary"
                            onPress={handleSearch}
                            isDisabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                        <Button
                            size="sm"
                            color="warning"
                            onPress={() => {
                                setSelected(null);
                                setQuery("");
                                setHighlightKeyword("");
                                setSearchParams({});
                                setHasSearched(false); // no search active
                                setIsResetting(true); // start resetting
                                refetch(); // async fetch
                            }}
                        >
                            Reset
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Spinner size="sm" label="Loading..." />
                        </div>
                    ) : (
                        <div className="max-h-[450px] overflow-y-auto rounded-md bg-white px-2">
                            {Object.entries(data?.data ?? {}).length === 0 &&
                                hasSearched &&
                                !isResetting && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        We couldn’t find any items related to
                                        your search. Try using different
                                        keywords or check your spelling.
                                    </p>
                                )}

                            {Object.entries(data?.data ?? {}).map(
                                ([module, departments]) => (
                                    <Card
                                        key={module}
                                        shadow="none"
                                        className="mb-3 border min-w-[460px]"
                                    >
                                        <CardBody>
                                            <h3 className="font-semibold text-blue-600 text-sm mb-2">
                                                {module}
                                            </h3>
                                            {Object.entries(
                                                departments ?? {}
                                            ).map(([dept, items]) => (
                                                <div
                                                    key={dept}
                                                    className="ml-3 mb-2"
                                                >
                                                    <h4 className="font-medium text-gray-700 text-sm mb-1">
                                                        {dept}
                                                    </h4>
                                                    {Object.entries(
                                                        items ?? {}
                                                    ).map(
                                                        ([
                                                            parentKey,
                                                            itemData,
                                                        ]) => {
                                                            const parent =
                                                                itemData?.parent_item;
                                                            const subItems =
                                                                itemData?.sub_items ??
                                                                [];
                                                            if (!parent)
                                                                return null;

                                                            return (
                                                                <div
                                                                    key={
                                                                        parentKey
                                                                    }
                                                                    className="ml-3 mb-2"
                                                                >
                                                                    {/* Parent item */}
                                                                    <div className="flex items-center justify-between relative">
                                                                        <div className="border-l-2 border-green-500 h-full absolute left-0 top-0" />
                                                                        <div
                                                                            onClick={() =>
                                                                                handleSelect(
                                                                                    parent
                                                                                )
                                                                            }
                                                                            className={`flex-1 cursor-pointer px-2 py-1 rounded text-sm ml-1 flex items-center gap-2 ${
                                                                                parent.retention_period ===
                                                                                0
                                                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                                    : selected?.item_no ===
                                                                                      parent.item_no
                                                                                    ? "bg-blue-100 text-blue-700"
                                                                                    : "hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            <span className="flex-1">
                                                                                <HighlightedText
                                                                                    text={
                                                                                        parent.title_description ??
                                                                                        ""
                                                                                    }
                                                                                    keyword={
                                                                                        highlightKeyword
                                                                                    }
                                                                                />
                                                                            </span>
                                                                            <RetentionChip
                                                                                period={
                                                                                    parent.retention_period
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Sub-items */}
                                                                    {subItems.length >
                                                                        0 && (
                                                                        <div className="ml-6 mt-1 relative">
                                                                            {subItems.map(
                                                                                (
                                                                                    sub,
                                                                                    idx
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className="flex items-center justify-between relative"
                                                                                    >
                                                                                        <div className="border-l-2 border-gray-300 h-full absolute left-0 top-0" />
                                                                                        <div className="border-t-2 border-gray-300 w-3 ml-0.5 mr-1" />
                                                                                        <div
                                                                                            onClick={() =>
                                                                                                handleSelect(
                                                                                                    sub,
                                                                                                    parent
                                                                                                )
                                                                                            }
                                                                                            className={`flex-1 cursor-pointer px-2 py-1 rounded text-sm flex items-center gap-2 ${
                                                                                                sub.retention_period ===
                                                                                                0
                                                                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                                                    : selected?.item_no ===
                                                                                                      sub.item_no
                                                                                                    ? "bg-blue-100 text-blue-700"
                                                                                                    : "hover:bg-gray-100"
                                                                                            }`}
                                                                                        >
                                                                                            <span className="flex-1">
                                                                                                <HighlightedText
                                                                                                    text={
                                                                                                        sub.title_description ??
                                                                                                        ""
                                                                                                    }
                                                                                                    keyword={
                                                                                                        highlightKeyword
                                                                                                    }
                                                                                                />
                                                                                            </span>
                                                                                            <RetentionChip
                                                                                                period={
                                                                                                    sub.retention_period
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ))}
                                        </CardBody>
                                    </Card>
                                )
                            )}
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default RdsSelector;
