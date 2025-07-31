import { Head } from "@inertiajs/react";
import { Button, Spacer } from "@heroui/react";
import React, { useRef, useState } from "react";
import { EditIcon, SaveIcon } from "./icons";
import {
    FormMode,
    // ProfileFormData,
    UserType,
} from "@/Utils/types";
import { UserForm } from "@/Components/Forms/UserForm";
// import DeleteAccount from "@/Components/Forms/UserForm/DeleteAccount";

interface AuthProps {
    user: UserType;
}

const ProfilePage = ({ auth }: { auth: AuthProps }) => {
    const [mode, setMode] = useState<FormMode>("view");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);

    const handleSave = () => {
        if (!isSubmitting) {
            setIsSubmitting(true);
            formRef.current?.requestSubmit();
        }
    };

    const onSubmitSuccess = () => {
        setIsSubmitting(false);
        setMode("view");
    };

    return (
        <>
            <Head title="Profile" />
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Profile Management
                        </h1>
                        <p>
                            Manage your personal information and account
                            settings
                        </p>
                    </div>
                    {mode === "edit" ? (
                        <div className="flex gap-2">
                            <Button
                                color="danger"
                                onPress={() => {
                                    formRef.current?.reset?.(); // only if exposed
                                    setMode("view");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                startContent={<SaveIcon />}
                                onPress={handleSave}
                                isLoading={isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <Button
                            color="primary"
                            startContent={<EditIcon />}
                            onPress={() => setMode("edit")}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                <Spacer y={1} />

                <UserForm
                    mode={mode}
                    user={auth.user} // will default to `auth.user` internally, if implemented that way
                    onSubmitSuccess={onSubmitSuccess}
                    formRef={formRef}
                />

                {/* {mode === "view" && <DeleteAccount />} */}
            </div>
        </>
    );
};

export default ProfilePage;
