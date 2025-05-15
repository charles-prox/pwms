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
import { BoxDetails, FormProp } from "@/Utils/types";
import { toTitleCase } from "@/Utils/helpers";
import { formcolumns, boxcolumns } from "./columns";
import { router, usePage } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";

const List = () => {
    const TABLE_ID = "storage-request";
    const { boxes } = useBoxForm();
    const { form = null } = usePage<{ form?: FormProp }>().props;

    const onCreateRequest = async () => {
        const type = "storage";

        try {
            const response = await axiosInstance.post(
                `/requests/create/${type}`
            );
            const form_no = response.data.form_no;

            console.log("Request created!", response.data);

            // Redirect to the newly created request
            router.visit(`/request-storage/${form_no}`);
        } catch (error) {
            console.error("Failed to create request:", error);
            alert("Something went wrong.");
        }
    };

    const renderCell = (row: any, columnKey: React.Key) => {
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
                        itemName={!!form ? "Box" : "Request"}
                        enableFilters={false}
                        enableSearch={!!form ? false : true}
                        columns={!!form ? boxcolumns : formcolumns}
                        rows={boxes}
                        totalRows={boxes.length}
                        onOpenAddNewForm={() => onCreateRequest()}
                        renderCell={renderCell}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default List;
