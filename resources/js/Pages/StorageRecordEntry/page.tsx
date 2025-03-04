import ListViewLayout from "@/Layouts/ListViewLayout";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Head } from "@inertiajs/react";
import React from "react";
import { columns } from "./column";
import BoxForm from "@/Components/Forms/BoxForm";

const StorageRecordEntry = () => {
    const TABLE_ID = "storage_record_entry";
    const [boxes, setBoxes] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    const [isBoxFormOpen, setIsBoxFormOpen] = React.useState<boolean>(false);

    return (
        <div className="flex-1 flex flex-col gap-10">
            <Head title="Storage Record Entry" />
            <div>
                <h1 className="text-2xl font-bold">Storage Record Entry</h1>
                <p>
                    This module can focus on logging these existing boxes into
                    the system while ensuring they are correctly assigned to
                    their respective locations.
                </p>
            </div>
            <Tabs
                aria-label="Options"
                isVertical={true}
                variant="light"
                classNames={{
                    tab: "justify-start",
                    panel: "flex-1 ",
                    tabWrapper: "flex-1",
                }}
            >
                <Tab key="add-storage-record" title="Add Storage Record">
                    <Card>
                        <CardBody>
                            <div className="flex flex-col flex-1">
                                <div>
                                    <ListViewLayout
                                        tableid={TABLE_ID}
                                        itemName="Box"
                                        enableFilters={false}
                                        enableSearch={false}
                                        columns={columns}
                                        rows={boxes}
                                        pages={totalPages}
                                        totalRows={boxes.length}
                                        onOpenAddNewForm={() =>
                                            setIsBoxFormOpen(true)
                                        }
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
                </Tab>
                <Tab key="view-all-entries" title="View All Entries">
                    <Card>
                        <CardBody>
                            Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default StorageRecordEntry;
