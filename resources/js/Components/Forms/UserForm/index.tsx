"use client";

import React, { FormEvent, useEffect, RefObject } from "react";
import { Divider, Button, Spacer } from "@heroui/react";
import Alert from "@/Components/Alert";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { useForm } from "@inertiajs/react";
import { UserInfoForm } from "./UserInfo";
import { ContactInfoForm } from "./ContactInfo";
import { EmploymentDetailsForm } from "./EmploymentDetails";
import { FormMode, ProfileFormData, UserType } from "@/Utils/types";

interface UserFormProps {
    mode: FormMode;
    user?: UserType;
    onSubmitSuccess?: () => void;
    onSubmitError?: () => void;
    formRef?: RefObject<HTMLFormElement>;
    submitRoute?: string; // fallback for inertia post route
}

export const UserForm: React.FC<UserFormProps> = ({
    mode,
    user,
    onSubmitSuccess,
    onSubmitError,
    formRef,
    submitRoute,
}) => {
    const { showAlert } = useModalAlert();

    const { data, clearErrors, setData, post, errors, reset, processing } =
        useForm<ProfileFormData>({
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
        });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const routeName =
            submitRoute ??
            (mode === "create"
                ? "users.store"
                : mode === "edit"
                ? "users.update"
                : "account.profile.update");

        const payload = {
            preserveState: true,
            preserveScroll: true,
            only: ["response"],
            onSuccess: () => {
                mode === "create" && reset();
                showAlert({
                    type: "success",
                    title: mode === "create" ? "User Created" : "User Updated",
                    message:
                        mode === "create"
                            ? "The new user has been added successfully."
                            : "The user has been updated successfully.",
                    autoClose: true,
                });

                if (onSubmitSuccess) onSubmitSuccess();
            },
            onError: () => {
                if (onSubmitError) onSubmitError();
                showAlert({
                    type: "error",
                    title: "Error",
                    message: "Something went wrong. Please try again.",
                    autoClose: true,
                });
            },
        };

        if (mode === "edit") {
            post(route(routeName, user?.id), payload);
        } else {
            post(route(routeName), payload);
        }
    };

    const isEditable = mode !== "view";

    useEffect(() => {
        if (!user) return;
        setData({
            hris_id: user.hris_id || "",
            user_id: user.user_id || "",
            first_name: user.first_name || "",
            middle_name: user.middle_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            position: String(user.position?.id ?? ""),
            contact_no: user.contact_no || "",
            employment_status: user.employment_status || "",
            office_id: String(user.office_id ?? ""),
            account_status: user.account_status,
            role: user.roles[0],
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
                        isEditable={isEditable}
                        setData={setData}
                        clearErrors={clearErrors}
                        data={data}
                        reset={reset}
                        errors={errors}
                    />

                    <Divider />

                    <ContactInfoForm
                        isEditable={isEditable}
                        setData={setData}
                        clearErrors={clearErrors}
                        data={data}
                        errors={errors}
                    />

                    <Divider />

                    <EmploymentDetailsForm
                        isEditable={isEditable}
                        setData={setData}
                        clearErrors={clearErrors}
                        data={data}
                        errors={errors}
                    />

                    {isEditable && (
                        <Button
                            type="submit"
                            color="success"
                            isLoading={processing}
                        >
                            {mode === "create" ? "Create User" : "Save Changes"}
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
};
