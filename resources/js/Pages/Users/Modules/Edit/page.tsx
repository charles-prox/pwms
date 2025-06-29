"use client";

import { Breadcrumbs, BreadcrumbItem, Button, UserProps } from "@heroui/react";
import { Head, router, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import Icon from "@/Components/Icon";
import { UserForm } from "@/Components/Forms/UserForm";
import { UserType } from "@/Utils/types";

const UserEdit = ({ defaultValues }: { defaultValues: UserType }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        formRef.current?.requestSubmit();
    };

    const handleSuccess = () => {
        setIsSubmitting(false);
    };

    return (
        <>
            <Head title={`Edit User`} />

            <Breadcrumbs
                className="mb-3"
                onAction={(key) => router.visit(key as string)}
            >
                <BreadcrumbItem key="/">Dashboard</BreadcrumbItem>
                <BreadcrumbItem key="/users">Users</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Edit</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-col gap-10">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Edit User</h1>
                        <p className="text-sm text-default-500">
                            Update user information, roles, and access details.
                        </p>
                    </div>

                    <Button
                        color="primary"
                        endContent={<Icon name="save" size={18} />}
                        isLoading={isSubmitting}
                        onPress={handleSubmit}
                    >
                        Save Changes
                    </Button>
                </div>

                <UserForm
                    mode="edit"
                    formRef={formRef}
                    user={defaultValues}
                    onSubmitSuccess={handleSuccess}
                />
            </div>
        </>
    );
};

export default UserEdit;
