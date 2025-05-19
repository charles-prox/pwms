import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Selection,
    SortDescriptor,
    Spinner,
    Tooltip,
} from "@heroui/react";
import { EditIcon, InfoIcon, TrashIcon, VerticalDotsIcon } from "./icons";
import FooterContent from "./Table/Footer";
import HeaderContent from "./Table/Header";

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

type RowType = {
    [key: string]: any; // Allows any key with any value type
};

interface Column {
    uid: string;
    name: string;
    sortable?: boolean;
}

interface LayoutProps {
    itemName?: string;
    columns: Column[];
    rows: RowType[];
    onOpenUploadForm?: () => void;
    onOpenAddNewForm?: () => void;
    pages?: number;
    isDataLoading?: boolean;
    tableid: string;
    totalRows?: number;
    enableFilters?: boolean;
    enableSearch?: boolean;
    customAddNewButton?: React.ReactNode;
    customEditAction?: React.ReactNode;
    onEditAction?: (row: RowType) => void;
    onDeleteAction?: (row: RowType) => void;
    onViewAction?: (row: RowType) => void;
    renderCell?: (row: RowType, columnKey: React.Key) => React.ReactNode;
}

export default function ListViewLayout({
    itemName = "items",
    columns,
    rows,
    onOpenUploadForm,
    onOpenAddNewForm,
    pages = 0,
    isDataLoading,
    tableid,
    totalRows = 0,
    enableFilters,
    enableSearch,
    renderCell: customRenderCell,
    customAddNewButton,
    customEditAction,
    onEditAction = (row: RowType) => {
        console.log("Edit action not implemented", row);
    },
    onDeleteAction = (row: RowType) => {
        console.log("Delete action not implemented", row);
    },
    onViewAction = (row: RowType) => {
        console.log("View action not implemented", row);
    },
}: LayoutProps) {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
        new Set([])
    );
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "module",
        direction: "ascending",
    });

    const defaultRenderCell = React.useCallback(
        (
            row: RowType,
            columnKey: React.Key,
            customRenderCell?: (
                row: RowType,
                columnKey: React.Key
            ) => React.ReactNode
        ) => {
            if (customRenderCell) {
                const customRenderResult = customRenderCell(row, columnKey);
                if (customRenderResult !== undefined) {
                    return customRenderResult;
                }
            }

            const cellValue = row[columnKey as keyof RowType];

            if (columnKey === "actions") {
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        {/* Visible on medium and larger screens */}
                        <div className="hidden md:flex gap-2">
                            <Tooltip content={"Edit"}>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                        onEditAction(row);
                                    }}
                                    color="primary"
                                >
                                    <EditIcon size={18} />
                                </Button>
                            </Tooltip>
                            <Tooltip content="View more information">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                        onViewAction(row);
                                    }}
                                    color="warning"
                                    className={`${
                                        row.form_number ? "" : "hidden"
                                    }`}
                                >
                                    <InfoIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip content={"Delete"}>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                        onDeleteAction(row);
                                    }}
                                    color={row.is_draft ? "default" : "danger"}
                                    isDisabled={row.is_draft}
                                    className="disabled:opacity-10"
                                >
                                    <TrashIcon size={18} />
                                </Button>
                            </Tooltip>
                        </div>

                        {/* Visible only on small screens */}
                        <div className="block md:hidden">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                    >
                                        <VerticalDotsIcon className="text-default-300" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        key="view"
                                        onPress={() => console.log("View", row)}
                                    >
                                        View
                                    </DropdownItem>
                                    <DropdownItem
                                        key="edit"
                                        onPress={() => console.log("Edit", row)}
                                    >
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        onPress={() =>
                                            console.log("Delete", row)
                                        }
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                );
            } else {
                return cellValue;
            }
        },
        []
    );

    const renderCell = (row: RowType, columnKey: React.Key) => {
        return defaultRenderCell(row, columnKey, customRenderCell);
    };

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={
                pages ? <FooterContent tableid={tableid} pages={pages} /> : null
            }
            bottomContentPlacement="outside"
            classNames={{
                table: "relative ",
                // td: "align-top",
                // wrapper: "w-full overflow-auto h-[calc(100vh-20rem)]",
                loadingWrapper:
                    "absolute inset-0 bg-black/50 backdrop-blur-md z-50 rounded-lg",
            }}
            selectedKeys={selectedKeys}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            topContent={
                <HeaderContent
                    totalRows={totalRows}
                    columns={columns}
                    itemName={itemName}
                    onOpenUploadForm={
                        onOpenUploadForm ? onOpenUploadForm : null
                    }
                    onOpenAddNewForm={
                        onOpenAddNewForm ? onOpenAddNewForm : null
                    }
                    tableid={tableid}
                    enableFilters={enableFilters}
                    enableSearch={enableSearch}
                    customAddNewButton={customAddNewButton}
                />
            }
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No rows found"}
                items={rows}
                isLoading={isDataLoading}
                loadingContent={
                    <div className="absolute inset-0 flex items-start justify-center">
                        <Spinner
                            classNames={{
                                label: "text-white text-sm",
                                base: "sticky top-1/2",
                            }}
                            label="Loading..."
                            variant="simple"
                        />
                    </div>
                }
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
