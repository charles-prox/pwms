import React from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TableCell,
} from "@heroui/react";
import { BoxDetails } from "@/Utils/types";

interface DocumentPopoverProps {
    documents: BoxDetails[];
}

const BoxDetailsPopover: React.FC<DocumentPopoverProps> = ({ documents }) => {
    return (
        <Popover showArrow placement="bottom-end">
            <PopoverTrigger>
                <Button color="primary" size="sm">
                    {documents.length} document
                    {documents.length !== 1 ? "s" : ""}
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
                        {documents.map((doc) => (
                            <TableRow key={doc.id ?? Math.random()}>
                                <TableCell>
                                    {doc.document_title ?? "N/A"}
                                </TableCell>
                                <TableCell>{doc.rds_number ?? "N/A"}</TableCell>
                                <TableCell>
                                    {doc.document_date?.readable ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                    {doc.disposal_date === "Permanent"
                                        ? "Permanent"
                                        : doc.disposal_date?.formatted ?? "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PopoverContent>
        </Popover>
    );
};

export default BoxDetailsPopover;
