import ListViewLayout from "@/Layouts/ListViewLayout";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import React from "react";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { columns } from "../columns";
import { BoxDetails } from "@/Utils/types";
import { toTitleCase } from "@/Utils/helpers";
import NewBoxForm from "@/Components/Forms/NewBoxForm";
import OldBoxForm from "@/Components/Forms/OldBoxForm";

const AddStorageRecordTab = () => {
    const TABLE_ID = "storage_record_entry";
    const [isBoxFormOpen, setIsBoxFormOpen] = React.useState<boolean>(false);
    const { boxes } = useBoxForm();

    const renderCell = (row: any, columnKey: React.Key) => {
        // if (columnKey === "office") {
        //     // Return office name
        //     return row.office.name;
        // }

        if (columnKey === "priority_level") {
            return row.priority_level?.value ? (
                <Chip
                    size="sm"
                    color={
                        row.priority_level.value === "black"
                            ? "default"
                            : row.priority_level.value === "green"
                            ? "success"
                            : row.priority_level.value === "red"
                            ? "danger"
                            : "primary"
                    }
                >
                    {toTitleCase(row.priority_level.value)}
                </Chip>
            ) : (
                "N/A"
            );
            // return row.priority_level?.value;
        }

        if (columnKey === "documents") {
            // Concatenate all document details in the same cell
            return (
                <Popover showArrow placement="bottom-end">
                    <PopoverTrigger>
                        <Button color="primary" size="sm">{`${
                            row.box_details.length
                        } document${
                            row.box_details.length > 1 ? "s" : ""
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
                                {row.box_details.map((document: BoxDetails) => {
                                    return (
                                        <TableRow key={document.id}>
                                            <TableCell>
                                                {document.document_title}
                                            </TableCell>
                                            <TableCell>
                                                {document.rds_number}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    document.document_date
                                                        .formatted
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    document.disposal_date
                                                        .formatted
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </PopoverContent>
                </Popover>
            );
        }
    };

    return (
        <div>
            <Card>
                <CardBody>
                    <ListViewLayout
                        key={boxes.length}
                        tableid={TABLE_ID}
                        itemName="Box"
                        enableFilters={false}
                        enableSearch={false}
                        columns={columns}
                        rows={boxes}
                        totalRows={boxes.length}
                        onOpenAddNewForm={() => setIsBoxFormOpen(true)}
                        renderCell={renderCell}
                    />
                </CardBody>
            </Card>
            <OldBoxForm
                isOpen={isBoxFormOpen}
                onClose={() => setIsBoxFormOpen(false)}
                editBoxData={false}
            />
        </div>
    );
};

export default AddStorageRecordTab;
