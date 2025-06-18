import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { UserType } from "@/Utils/types";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/EmptyState";
import { columns } from "./columns.";
import { BreadcrumbItem, Breadcrumbs, Button, Spacer } from "@heroui/react";
import { Icon } from "@/Components/Icon";

const UsersPage = ({ users }: { users: UserType[] }) => {
    return (
        <>
            <Head title="Users" />
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Users</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex flex-col gap-10 ">
                <div>
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <p className="text-sm text-muted-foreground">
                        View, add, and manage user accounts, positions, and
                        roles across all offices.
                    </p>
                </div>
                <BaseListView<UserType>
                    columns={columns}
                    data={users}
                    loading={!!!users}
                    emptyContent={
                        <EmptyState
                            title="This request is empty."
                            description="You have yet to add boxes for this storage request yet."
                            icon="box-delivery-package"
                        />
                    }
                    topContent={
                        <TableToolbar
                            description={``}
                            tableId="users-table"
                            showFilters={true}
                            showSearch={true}
                            totalRows={users.length}
                            columns={columns}
                            createButton={
                                <Button
                                    color="secondary"
                                    onPress={() => {
                                        router.visit(route("users.create"));
                                    }}
                                    startContent={
                                        <Icon name="plus" size={20} />
                                    }
                                >
                                    New User
                                </Button>
                            }
                            itemLabel="user"
                        />
                    }
                />
            </div>
        </>
    );
};

export default UsersPage;
