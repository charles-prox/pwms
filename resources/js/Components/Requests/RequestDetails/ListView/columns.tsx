import { Column } from "@/Layouts/BaseListView";
import ActionButtons from "./ActionButtons";
import { BoxDetails, BoxFormState, PriorityLevel } from "@/Utils/types";
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

export const columns: Column<BoxFormState>[] = [
    { label: "BOX CODE", key: "box_code" },
    {
        label: "PRIORITY LEVEL",
        key: "priority_level",
        render: (item: BoxFormState) => {
            const value = item.priority_level?.value ?? null;
            if (!value) return "N/A";

            const colorMap: Record<any, any> = {
                black: "default",
                green: "success",
                red: "danger",
            };

            return (
                <Chip size="sm" color={colorMap[value] ?? "primary"}>
                    {toTitleCase(value)}
                </Chip>
            );
        },
    },
    {
        label: "DISPOSAL DATE",
        key: "disposal_date",
        render: (item: BoxFormState) => {
            const disp = item.disposal_date;
            if (typeof disp === "string") return disp; // e.g. "Permanent"
            return disp?.formatted ?? "N/A";
        },
    },
    {
        label: "BOX CONTENTS",
        key: "box_details",
        render: (item: BoxFormState) => (
            <Popover showArrow placement="bottom-end">
                <PopoverTrigger>
                    <Button color="primary" size="sm">
                        {item.box_details.length} document
                        {item.box_details.length !== 1 ? "s" : ""}
                    </Button>
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
                            {item.box_details.map((document: BoxDetails) => (
                                <TableRow key={document.id ?? Math.random()}>
                                    <TableCell>
                                        {document.document_title ?? "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {document.rds_number ?? "N/A"}
                                    </TableCell>

                                    {/* document_date: show formatted range */}
                                    <TableCell>
                                        {document.document_date?.start
                                            ?.formatted
                                            ? document.document_date.end
                                                  ?.formatted &&
                                              document.document_date.end
                                                  .formatted !==
                                                  document.document_date.start
                                                      .formatted
                                                ? `${document.document_date.start.formatted} - ${document.document_date.end.formatted}`
                                                : document.document_date.start
                                                      .formatted
                                            : "N/A"}
                                    </TableCell>

                                    {/* disposal_date: single date or "Permanent" */}
                                    <TableCell>
                                        {document.disposal_date === "Permanent"
                                            ? "Permanent"
                                            : document.disposal_date
                                                  ?.formatted ?? "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </PopoverContent>
            </Popover>
        ),
    },
    {
        label: "REMARKS",
        key: "remarks",
        render: (item: BoxFormState) => (
            <p className="whitespace-pre-line">{item.remarks ?? ""}</p>
        ),
    },
    {
        label: "ACTIONS",
        key: "actions",
        render: (item: BoxFormState) => <ActionButtons row={item} />,
    },
];
