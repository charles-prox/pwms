import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";
import { Head } from "@inertiajs/react";
import ListViewLayout from "@/Layouts/ListViewLayout";

const RdsPage = () => {
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
                    <ListViewLayout />
                </div>
            </div>
        </div>
    );
};

export default RdsPage;
