import ListViewLayout from "@/Layouts/ListViewLayout";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
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
import NewBoxForm from "@/Components/Forms/NewBoxForm";
import Menu from "../Menu";
import { PlusIcon } from "@/Layouts/ListViewLayout/icons";
import { SaveIcon } from "../icons";
import { axiosInstance } from "@/Utils/axios";

type Request = {
    id: number;
    form_number: string;
    request_type: string;
    creator: string;
};

const List = () => {
    const TABLE_ID = "request";
    const { boxes } = useBoxForm();
    const { form = null, requests = [] } = usePage<{
        form?: FormProp;
        requests?: Request[];
        boxes?: Request[];
    }>().props;
    const [isBoxFormOpen, setIsBoxFormOpen] = React.useState<boolean>(false);
    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    const handleEditAction = (row: any) => {
        // Check if the row is a draft request
        if (row.request_type === "Storage") {
        } else {
        }
    };

    const handleSaveAction = async (action: Key) => {
        if (!form || !form.number) {
            console.error("Form number is missing");
            return;
        }
        if (action === "draft") {
            // Save as draft logic
            try {
                const response = await axiosInstance.post(
                    `/requests/${form.number}/save-draft`,
                    {
                        boxes: boxes,
                    }
                );

                console.log("Draft saved successfully:", response.data);
            } catch (error) {
                console.error("Error saving draft:", error);
            }
        } else if (action === "print") {
            // Save and print logic
            console.log("Saving and printing...");
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
                        key={!!form ? boxes.length : requests.length}
                        tableid={TABLE_ID}
                        itemName={!!form ? "Box" : "Request"}
                        enableFilters={!!form ? false : true}
                        enableSearch={!!form ? false : true}
                        columns={!!form ? boxcolumns : formcolumns}
                        rows={!!form ? boxes : requests}
                        totalRows={!!form ? boxes.length : requests.length}
                        renderCell={renderCell}
                        customAddNewButton={
                            form?.type == "Storage" ? (
                                <Button
                                    className="hidden sm:flex"
                                    color="primary"
                                    endContent={<PlusIcon />}
                                    onPress={() => setIsBoxFormOpen(true)}
                                >
                                    Add New Box
                                </Button>
                            ) : (
                                <Menu />
                            )
                        }
                        customSaveButton={
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        color="secondary"
                                        endContent={<SaveIcon />}
                                    >
                                        Save
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Save Actions"
                                    onAction={(key) => handleSaveAction(key)}
                                >
                                    <DropdownItem key="draft">
                                        Save as Draft
                                    </DropdownItem>
                                    <DropdownItem key="print">
                                        Save and Print
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        }
                        onEditAction={(row) => {
                            if (form?.type == "Storage") {
                                setIsEdit(true);
                                setIsBoxFormOpen(true);
                            } else {
                                router.visit(`/request/${row.form_number}`);
                            }
                        }}
                    />
                </CardBody>
            </Card>

            <NewBoxForm
                isOpen={isBoxFormOpen}
                isEdit={isEdit}
                onClose={() => setIsBoxFormOpen(false)}
            />
        </div>
    );
};

export default List;
