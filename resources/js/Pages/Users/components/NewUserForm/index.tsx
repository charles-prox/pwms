"use client";

import { useForm } from "@inertiajs/react";
import { Divider, Spacer, Button } from "@heroui/react";
import React, { FormEvent, RefObject, useEffect } from "react";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { ProfileFormData, UserType } from "@/Utils/types";
import Alert from "@/Components/Alert";
import { UserInfoForm } from "./UserInfo";
import { ContactInfoForm } from "./ContactInfo";
import { EmploymentDetailsForm } from "./EmploymentDetails";

interface NewUserFormProps {
    user?: UserType;
    enableEdit?: boolean;
    formRef: RefObject<HTMLFormElement>;
    form: ReturnType<typeof useForm<ProfileFormData>>;
}

export const NewUserForm: React.FC<NewUserFormProps> = ({
    user,
    enableEdit = false,
    formRef,
    form,
}) => {
    const { showAlert } = useModalAlert();
    const { data, setData, post, errors, reset } = form;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        post(route("users.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                showAlert({
                    type: "success",
                    title: "User Created",
                    message: "The new user has been added successfully.",
                    autoClose: true,
                });
            },
            onError: () => {
                showAlert({
                    type: "error",
                    title: "Error",
                    message: "Something went wrong. Please try again.",
                    autoClose: true,
                });
            },
        });
    };

    useEffect(() => {
        if (!user) return;
        setData({
            hris_id: user.hris_id || "",
            user_id: user.user_id || "",
            first_name: user.first_name || "",
            middle_name: user.middle_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            position: user.position?.name || "",
            contact_no: user.contact_no || "",
            employment_status: user.employment_status || "",
            office_id: String(user.office_id ?? ""),
            account_status: user.account_status || "",
            role: user.role || "",
            photo: null,
        });
    }, [user]);

    return (
        <>
            {Object.keys(errors).length > 0 && (
                <>
                    <Spacer y={2} />
                    <Alert
                        show
                        type="error"
                        title="Validation Errors"
                        message="Please check the fields below and try again."
                        variant="flat"
                        isCloseable
                    />
                </>
            )}

            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-10">
                    <UserInfoForm
                        user={user}
                        enableEdit={enableEdit}
                        setData={setData}
                        data={data}
                        reset={reset}
                        errors={errors}
                    />

                    <Divider />

                    <ContactInfoForm
                        enableEdit={enableEdit}
                        setData={setData}
                        data={data}
                        errors={errors}
                    />

                    <Divider />

                    <EmploymentDetailsForm
                        enableEdit={enableEdit}
                        setData={setData}
                        data={data}
                        errors={errors}
                    />

                    {enableEdit && (
                        <Button type="submit" color="success">
                            Save Changes
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
};
