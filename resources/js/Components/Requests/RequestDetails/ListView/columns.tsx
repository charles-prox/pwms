import { Column } from "@/Layouts/BaseListView";
import ActionButtons from "./ActionButtons";
import { BoxDetails, BoxFormState } from "@/Utils/types";
import {
    TableRow,
    TableCell,
    PopoverContent,
    Button,
    Popover,
    PopoverTrigger,
    Table,
    TableBody,
    TableColumn,
    TableHeader,
    Chip,
} from "@heroui/react";
import { toTitleCase } from "@/Utils/helpers";

export const columns: Column<Request>[] = [
    { label: "BOX CODE", key: "box_code" },
    {
        label: "PRIORITY LEVEL",
        key: "priority_level",
        render: (item: any) => {
            return item.priority_level?.value ? (
                <Chip
                    size="sm"
                    color={
                        item.priority_level.value === "black"
                            ? "default"
                            : item.priority_level.value === "green"
                            ? "success"
                            : item.priority_level.value === "red"
                            ? "danger"
                            : "primary"
                    }
                >
                    {toTitleCase(item.priority_level.value)}
                </Chip>
            ) : (
                "N/A"
            );
        },
    },
    {
        label: "DISPOSAL DATE",
        key: "disposal_date",
    },
    {
        label: "BOX CONTENTS",
        key: "documents",
        render: (item: any) => (
            <Popover showArrow placement="bottom-end">
                <PopoverTrigger>
                    <Button color="primary" size="sm">{`${
                        item.box_details.length
                    } document${
                        item.box_details.length > 1 ? "s" : ""
                    }`}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Table
                        aria-label="Document table"
                        classNames={{ wrapper: "shadow-none" }}
                    >
                        <TableHeader>
                            <TableColumn>DOCUMENT TITLE</TableColumn>
                            <TableColumn>RDS NO.</TableColumn>
                            <TableColumn>DOCUMENT DATE</TableColumn>
                            <TableColumn>DISPOSAL DATE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {item.box_details.map((document: BoxDetails) => {
                                return (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            {document.document_title}
                                        </TableCell>
                                        <TableCell>
                                            {document.rds_number}
                                        </TableCell>
                                        <TableCell>
                                            {document.document_date.formatted}
                                        </TableCell>
                                        <TableCell>
                                            {document.disposal_date.formatted}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </PopoverContent>
            </Popover>
        ),
    },
    { label: "REMARKS", key: "remarks" },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item: any) => <ActionButtons row={item} />,
    },
];
