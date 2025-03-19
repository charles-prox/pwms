import BoxForm from "@/Components/Forms/BoxForm";
import ListViewLayout from "@/Layouts/ListViewLayout";
import {
    Accordion,
    AccordionItem,
    Card,
    CardBody,
    Chip,
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
import { DocumentIcon } from "./icons";
import { BoxDetails } from "@/Utils/types";
import { toTitleCase } from "@/Utils/helpers";

const AddStorageRecordTab = () => {
    const TABLE_ID = "storage_record_entry";
    const [isBoxFormOpen, setIsBoxFormOpen] = React.useState<boolean>(false);
    const { boxes } = useBoxForm();

    const renderCell = (row: any, columnKey: React.Key) => {
        console.log(row);

        if (columnKey === "office") {
            // Return office name
            return row.office.name;
        }

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
                <Accordion>
                    <AccordionItem
                        key="anchor"
                        aria-label="Anchor"
                        indicator={<DocumentIcon />}
                        title={
                            row.box_details.length +
                            " Document" +
                            (row.box_details.length > 1 ? "s" : "")
                        }
                        isCompact
                        disableIndicatorAnimation
                        classNames={{ trigger: "p-0 m-0", title: "text-sm" }}
                    >
                        <Table aria-label="Document table">
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
                    </AccordionItem>
                </Accordion>
            );
        }
    };

    return (
        <div>
            <Card>
                <CardBody>
                    <div>
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
                    </div>
                </CardBody>
            </Card>
            <BoxForm
                isOpen={isBoxFormOpen}
                onClose={() => setIsBoxFormOpen(false)}
                editBoxData={false}
            />
        </div>
    );
};

export default AddStorageRecordTab;
