import React from "react";
import { Head } from "@inertiajs/react";
import NoRequest from "./EmptyState";
import RequestView from "@/Components/RequestView";
import ListViewLayout from "@/Layouts/ListViewLayout";

const RequestStoragePage = () => {
    return (
        <div>
            <Head title="Request Storage" />
            <div className="flex flex-col gap-5">
                <div className="flex w-full">
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">Request Storage</h1>
                        <p>Easily Request and Track Document Storage</p>
                    </div>
                    <div
                        className={
                            "flex-1 flex gap-2 justify-end content-end flex-wrap"
                        }
                    >
                        <RequestView pageId="storage" />
                    </div>
                </div>
                {/* <NoRequest /> */}
                <ListViewLayout />
            </div>
        </div>
    );
};

export default RequestStoragePage;
