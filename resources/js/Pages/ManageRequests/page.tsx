import React from "react";
import { columns } from "./config/columns";
import BaseListView from "@/Layouts/BaseListView";
import EmptyState from "@/Components/EmptyState";
import TableToolbar from "@/Components/TableToolbar";
import { RequestProps } from "@/Utils/types";
import { url } from "@/Utils/helpers";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Head, router, usePage } from "@inertiajs/react";

const ManageRequestsPage = ({
    pendingRequests,
}: {
    pendingRequests: RequestProps[];
}) => {
    const url = usePage().url;

    return (
        <>
            <Head title="Requests" />
            <Breadcrumbs
                className="mb-3"
                onAction={(key) => router.visit(key as string)}
            >
                <BreadcrumbItem key="/">Dashboard</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Manage Requests</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex flex-col gap-5">
                {/* Header Section */}
                <div className="flex w-full">
                    <div className="flex-grow">
                        <h1 className="text-xl font-bold">Manage Requests</h1>
                        <p className="text-sm text-gray-500">
                            View and manage all pending requests from users.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <BaseListView<Request>
                    columns={columns}
                    data={pendingRequests}
                    loading={!pendingRequests}
                    emptyContent={
                        <EmptyState
                            title="Oops..."
                            description="No request yet."
                        />
                    }
                    topContent={
                        <TableToolbar
                            tableId="requests-table"
                            totalRows={pendingRequests.length}
                            columns={columns}
                            itemLabel="request"
                        />
                    }
                />
            </div>
        </>
    );
};

export default ManageRequestsPage;
