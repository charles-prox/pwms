"use client";

import { Breadcrumbs, BreadcrumbItem, Button, Spacer } from "@heroui/react";
import { Head, router } from "@inertiajs/react";
import { useRef, useState } from "react";
import Icon from "@/Components/Icon";
import { UserForm } from "@/Components/Forms/UserForm";

const UserCreate = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        formRef.current?.requestSubmit();
    };

    const handleSuccess = () => {
        setIsSubmitting(false);
        router.visit(route("users.index"));
    };

    return (
        <>
            <Head title="Users" />

            <Breadcrumbs
                className="mb-3"
                onAction={(key) => router.visit(key as string)}
            >
                <BreadcrumbItem key="/">Dashboard</BreadcrumbItem>
                <BreadcrumbItem key="/users">Users</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Add New</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-col gap-10">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Add New User</h1>
                        <p className="text-sm text-default-500">
                            Set up user accounts, assign roles, and manage user
                            information.
                        </p>
                    </div>

                    <Button
                        color="primary"
                        endContent={<Icon name="save" size={18} />}
                        isLoading={isSubmitting}
                        onPress={handleSubmit}
                    >
                        Confirm
                    </Button>
                </div>

                <UserForm
                    mode="create"
                    formRef={formRef}
                    onSubmitSuccess={handleSuccess}
                />
            </div>
        </>
    );
};

export default UserCreate;
