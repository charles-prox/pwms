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
    Chip,
    User,
    Selection,
    ChipProps,
    SortDescriptor,
} from "@heroui/react";
import { VerticalDotsIcon } from "./icons";
import FooterContent from "./Table/Footer";
import HeaderContent from "./Table/Header";
import { debounce } from "lodash";

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

type RowType = {
    [key: string]: any; // Allows any key with any value type
};

interface LayoutProps {
    itemName?: string;
    columns: Column[];
    rows: RowType[];
    onOpenUploadForm?: () => void;
    onOpenAddNewForm?: () => void;
    page: number;
    pages: number;
    setPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (perPage: number) => void;
    setSearchKey: (key: string) => void;
}

export default function ListViewLayout({
    itemName = "items",
    columns,
    rows,
    onOpenUploadForm,
    onOpenAddNewForm,
    page,
    pages,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setSearchKey,
}: LayoutProps) {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
        new Set([])
    );

    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "module",
        direction: "ascending",
    });

    const renderCell = React.useCallback(
        (row: RowType, columnKey: React.Key) => {
            const cellValue = row[columnKey as keyof RowType];

            switch (columnKey) {
                case "actions":
                    return (
                        <div className="relative flex justify-end items-center gap-2">
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
                                    <DropdownItem key="view">View</DropdownItem>
                                    <DropdownItem key="edit">Edit</DropdownItem>
                                    <DropdownItem key="delete">
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        []
    );

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={
                <FooterContent page={page} pages={pages} setPage={setPage} />
            }
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "h-[calc(100vh-430px)]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            topContent={
                <HeaderContent
                    handleSearch={(key: string) => setSearchKey(key)}
                    // statusFilter={statusFilter}
                    // setStatusFilter={setStatusFilter}
                    statusOptions={statusOptions}
                    rows={rows}
                    columns={columns}
                    itemName={itemName}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onOpenUploadForm={
                        onOpenUploadForm ? onOpenUploadForm : null
                    }
                    onOpenAddNewForm={
                        onOpenAddNewForm ? onOpenAddNewForm : null
                    }
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
            <TableBody emptyContent={"No rows found"} items={rows}>
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
