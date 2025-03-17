import { Tabs, Tab, Card, CardBody, Spacer } from "@heroui/react";
import { Head } from "@inertiajs/react";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import AddStorageRecordTab from "./Tabs/AddStorageRecordTab";
import { PlusIcon } from "@/Layouts/ListViewLayout/icons";
import {
    EyeFilledIcon,
    EyeSlashFilledIcon,
} from "@/Components/PasswordVisibilityButton/icons";

const StorageRecordEntry = () => {
    return (
        <BoxFormProvider>
            <div className="flex-1 flex flex-col">
                <Head title="Storage Record Entry" />
                <div>
                    <h1 className="text-2xl font-bold">Storage Record Entry</h1>
                    <p>
                        This module can focus on logging these existing boxes
                        into the system while ensuring they are correctly
                        assigned to their respective locations.
                    </p>
                </div>
                <Spacer y={10} />
                <Tabs
                    aria-label="Options"
                    // isVertical={true}
                    variant="solid"
                    classNames={{
                        tab: "justify-start",
                        panel: "flex-1 ",
                        tabWrapper: "flex-1",
                    }}
                >
                    <Tab
                        key="add-storage-record"
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <PlusIcon /> */}
                                <span>Add Record</span>
                            </div>
                        }
                    >
                        <AddStorageRecordTab />
                    </Tab>
                    <Tab
                        key="view-all-entries"
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <EyeSlashFilledIcon /> */}
                                <span>View Entries</span>
                            </div>
                        }
                    >
                        <Card>
                            <CardBody>
                                Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex
                                ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </BoxFormProvider>
    );
};

export default StorageRecordEntry;
