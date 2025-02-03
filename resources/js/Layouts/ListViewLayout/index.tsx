import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
} from "@nextui-org/react";
import {
    ChevronDownIcon,
    PlusIcon,
    SearchIcon,
    VerticalDotsIcon,
} from "./icons";
import FooterContent from "./Table/Footer";
import HeaderContent from "./Table/Header";

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
}

export default function ListViewLayout({
    itemName = "items",
    columns,
    rows,
}: LayoutProps) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
        new Set([])
    );

    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "created_by",
        direction: "ascending",
    });

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...rows];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((row) =>
                row.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredUsers = filteredUsers.filter((row) =>
                Array.from(statusFilter).includes(row.status)
            );
        }

        return filteredUsers;
    }, [rows, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = React.useCallback(
        (row: RowType, columnKey: React.Key) => {
            const cellValue = row[columnKey as keyof RowType];

            switch (columnKey) {
                case "name":
                    return (
                        <User
                            avatarProps={{
                                radius: "lg",
                                fallback: "S",
                                className:
                                    "text-[1.2rem] text-green-200 bg-green-600 opacity-40",
                            }}
                            description={row.email}
                            name={cellValue}
                        >
                            {row.email}
                        </User>
                    );
                case "date_created":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {cellValue}
                            </p>
                            <p className="text-bold text-tiny capitalize text-default-400">
                                {row.team}
                            </p>
                        </div>
                    );
                case "status":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[row.status]}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue}
                        </Chip>
                    );
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

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

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
                    filterValue={filterValue}
                    onClear={onClear}
                    onSearchChange={onSearchChange}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    statusOptions={statusOptions}
                    rows={rows}
                    itemName={itemName}
                    onRowsPerPageChange={onRowsPerPageChange}
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
