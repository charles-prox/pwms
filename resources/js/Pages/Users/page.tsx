import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { UserType } from "@/Utils/types";
import BaseListView from "@/Layouts/BaseListView";
import TableToolbar from "@/Components/TableToolbar";
import EmptyState from "@/Components/EmptyState";
import { columns } from "./columns.";

const UsersPage = ({ users }: { users: UserType[] }) => {
    // console.log(users);

    // const {users} = usePage<{users: UserType[]}>().props;
    return (
        <>
            <Head title="Users" />
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
                            title={"Users"}
                            description={``}
                            tableId="users-table"
                            showFilters={false}
                            showSearch={false}
                            totalRows={users.length}
                            columns={columns}
                            // createButton={
                            //     <div className="flex items-center gap-2">
                            //         <NewBoxForm />
                            //         <SaveButton />
                            //     </div>
                            // }
                            itemLabel="user"
                        />
                    }
                />
            </div>
        </>
    );
};

export default UsersPage;
