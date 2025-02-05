import Alert from "@/Components/Alert";
import ModalAlert from "@/Components/ModalAlert";
import { useForm, usePage } from "@inertiajs/react";
import { Divider, Spacer } from "@heroui/react";
import React, { FormEvent, RefObject } from "react";
import { UserInfoForm } from "./UserInfo";
import { ContactInfoForm } from "./ContactInfo";
import { EmploymentDetailsForm } from "./EmploymentDetails";

interface ProfileFormsProps {
    enableEdit: boolean;
    setEnableEdit: (value: boolean) => void;
    onSubmit: boolean;
    isProcessing: (value: boolean) => void;
}

interface ProfileFormData {
    hris_id: string;
    user_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    position: string;
    contact_no: string;
    employment_status: string;
    office_id: string;
    account_status: string;
    photo: File | null;
}

export const ProfileForms: React.FC<ProfileFormsProps> = ({
    enableEdit,
    setEnableEdit,
    onSubmit,
    isProcessing,
}) => {
    const { auth } = usePage<any>().props;

    const formRef: RefObject<HTMLFormElement> = React.useRef(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

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
                setIsAlertOpen(true);
                setEnableEdit(false);
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
                account_status: auth.user.account_status || "", // Ensure this is included
                photo: null, // You can set a default value here
            });
        }
    }, [auth]);

    React.useEffect(() => {
        if (onSubmit) {
            if (formRef.current) {
                formRef.current.requestSubmit(); // Trigger form submission
            }
        }
    }, [onSubmit]);

    React.useEffect(() => {
        isProcessing(processing);
    }, [processing]);

    return (
        <React.Fragment>
            <ModalAlert
                isOpen={isAlertOpen}
                setIsAlertOpen={(state: boolean) => setIsAlertOpen(state)}
                type="success"
                autoClose={true}
            />

            <form ref={formRef} onSubmit={submit}>
                {Object.keys(errors).length !== 0 && (
                    <div>
                        <Spacer y={2} />
                        <Alert
                            type={"error"}
                            title={"Error updating profile information"}
                            message={
                                "We encountered some issues while saving your changes. Please check the highlighted fields for details."
                            }
                            variant={"flat"}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-10">
                    <UserInfoForm
                        user={auth.user}
                        enableEdit={enableEdit}
                        setData={setData}
                        errors={errors}
                        data={data}
                        reset={reset}
                        setIsAlertOpen={(state) => setIsAlertOpen(state)}
                        setEnableEdit={(state) => setEnableEdit(state)}
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
                </div>
            </form>
        </React.Fragment>
    );
};
