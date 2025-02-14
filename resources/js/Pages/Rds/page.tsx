import React from "react";
import { Head } from "@inertiajs/react";
import ListViewLayout from "@/Layouts/ListViewLayout";
import { columns } from "./columns";
import { users } from "./rows";
import UploadForm from "./forms/UploadForm";

const RdsPage = () => {
    const [isFileUploadOpen, setIsFileUploadOpen] =
        React.useState<boolean>(false);
    return (
        <div>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="text-2xl font-bold">RDS Management</h1>
                    <p>
                        Manage Records Disposition Schedule (RDS) for all
                        documents used in the office.
                    </p>
                </div>
                <div className="w-full ">
                    <ListViewLayout
                        columns={columns}
                        rows={users}
                        onOpenUploadForm={() =>
                            setIsFileUploadOpen(!isFileUploadOpen)
                        }
                        onOpenAddNewForm={() => {}}
                    />
                </div>
            </div>
            <UploadForm
                isOpen={isFileUploadOpen}
                onClose={() => setIsFileUploadOpen(false)}
            />
        </div>
    );
};

export default RdsPage;
