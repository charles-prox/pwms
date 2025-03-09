import BoxForm from "@/Components/Forms/BoxForm";
import ListViewLayout from "@/Layouts/ListViewLayout";
import { Card, CardBody } from "@heroui/react";
import React from "react";
import { columns } from "./columns";
import { useBoxForm } from "@/Contexts/BoxFormContext";

const AddStorageRecordTab = () => {
    const TABLE_ID = "storage_record_entry";
    const [isBoxFormOpen, setIsBoxFormOpen] = React.useState<boolean>(false);
    const { boxes } = useBoxForm();

    const renderCell = (row: any, columnKey: React.Key) => {
        if (
            columnKey === "rds_number" ||
            columnKey === "document_title" ||
            columnKey === "document_date"
        ) {
            // Concatenate all document details in the same cell
            return (
                <div className="flex flex-col gap-3 justify-start items-start self-start">
                    {row.box_details.map((detail: any, index: number) => (
                        <p key={index}>
                            {detail[columnKey as keyof typeof detail]}
                        </p>
                    ))}
                </div>
            );
        }
    };

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="flex flex-col flex-1">
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
