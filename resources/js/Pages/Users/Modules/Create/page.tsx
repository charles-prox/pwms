import { Breadcrumbs, BreadcrumbItem, Button } from "@heroui/react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useRef } from "react";
import { NewUserForm } from "../../components/NewUserForm";
import Icon from "@/Components/Icon";
import { ProfileFormData } from "@/Utils/types";

const defaultFormData: ProfileFormData = {
    hris_id: "",
    user_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    position: "",
    contact_no: "",
    employment_status: "",
    office_id: "",
    account_status: "",
    role: "",
    photo: null,
};

const UserCreate = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<ProfileFormData>(defaultFormData);

    const handleSubmit = () => {
        formRef.current?.requestSubmit(); // Triggers native form submit
    };

    return (
        <div>
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
                        <h1 className="text-2xl font-bold">Add New User</h1>
                        <p className="text-sm text-muted-foreground">
                            Set up user accounts, choose their roles, and keep
                            your team organized.
                        </p>
                    </div>

                    <Button
                        color="primary"
                        endContent={<Icon name="save" size={18} />}
                        isLoading={form.processing}
                        onPress={handleSubmit}
                    >
                        Confirm
                    </Button>
                </div>

                <NewUserForm formRef={formRef} form={form} />
            </div>
        </div>
    );
};

export default UserCreate;
