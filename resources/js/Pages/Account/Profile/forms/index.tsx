"use client";
import Alert from "@/Components/Alert";
import { useForm, usePage } from "@inertiajs/react";
import { Divider, Spacer, Button } from "@heroui/react";
import React, { FormEvent, RefObject } from "react";
import { UserInfoForm } from "./UserInfo";
import { ContactInfoForm } from "./ContactInfo";
import { EmploymentDetailsForm } from "./EmploymentDetails";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { ProfileFormData } from "@/Utils/types";

interface ProfileFormsProps {
    enableEdit: boolean;
    setEnableEdit: (value: boolean) => void;
    onSubmit: boolean;
    isProcessing: (value: boolean) => void;
}

export const ProfileForms: React.FC<ProfileFormsProps> = ({
    enableEdit,
    setEnableEdit,
    onSubmit,
    isProcessing,
}) => {
    const { auth } = usePage<any>().props;
    const { showAlert } = useModalAlert();

    const formRef: RefObject<HTMLFormElement> = React.useRef(null);

    const { data, setData, post, errors, processing, reset } =
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
            photo: null,
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(route("account.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setEnableEdit(false);
                showAlert({
                    type: "success",
                    title: "Profile Updated",
                    message:
                        "Your profile changes have been saved successfully!",
                    autoClose: true,
                });
            },
            onError: () => {
                showAlert({
                    type: "error",
                    title: "Update Failed",
                    message:
                        "There was an issue saving your changes. Please try again.",
                    autoClose: true,
                });
            },
            onFinish: () => {},
        });
    };

    React.useEffect(() => {
        if (auth.user) {
            setData({
                hris_id: auth.user.hris_id || "",
                user_id: auth.user.user_id || "",
                first_name: auth.user.first_name || "",
                middle_name: auth.user.middle_name || "",
                last_name: auth.user.last_name || "",
                email: auth.user.email || "",
                position: auth.user.position || "",
                contact_no: auth.user.contact_no || "",
                employment_status: auth.user.employment_status || "",
                office_id: auth.user.office_id || "",
                account_status: auth.user.account_status || "",
                photo: null,
            });
        }
    }, [auth]);

    React.useEffect(() => {
        if (onSubmit) {
            formRef.current?.requestSubmit();
        }
    }, [onSubmit]);

    React.useEffect(() => {
        isProcessing(processing);
    }, [processing]);

    return (
        <React.Fragment>
            {/* Display alert only if errors exist */}
            {Object.keys(errors).length > 0 && (
                <div>
                    <Spacer y={2} />
                    <Alert
                        show={true}
                        type="error"
                        title="Error updating profile information"
                        message="We encountered some issues while saving your changes. Please check the highlighted fields for details."
                        variant="flat"
                        isCloseable
                    />
                </div>
            )}

            <form ref={formRef} onSubmit={submit}>
                <div className="flex flex-col gap-10">
                    <UserInfoForm
                        user={auth.user}
                        enableEdit={enableEdit}
                        setData={setData}
                        errors={errors}
                        data={data}
                        reset={reset}
                        setEnableEdit={setEnableEdit}
                    />
                    <Divider />
                    <ContactInfoForm
                        enableEdit={enableEdit}
                        setData={setData}
                        errors={errors}
                        data={data}
                    />
                    <Divider />
                    <EmploymentDetailsForm
                        enableEdit={enableEdit}
                        setData={setData}
                        errors={errors}
                        data={data}
                    />

                    {enableEdit && (
                        <Button type="submit" color="success">
                            Save Changes
                        </Button>
                    )}
                </div>
            </form>
        </React.Fragment>
    );
};
