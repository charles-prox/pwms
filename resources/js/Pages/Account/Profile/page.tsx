import { Head } from "@inertiajs/react";
import { Button, Spacer } from "@nextui-org/react";
import React, { useState } from "react";
import { ProfileForms } from "./forms";
import DeleteAccount from "./forms/DeleteAccount";
import { EditIcon, SaveIcon } from "./icons";

const ProfilePage: React.FC = () => {
    const [enableEdit, setEnableEdit] = useState<boolean>(false);
    const [onSubmit, setOnSubmit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <React.Fragment>
            <Head title="Profile" />
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Profile Management
                        </h1>
                        <p>
                            Manage Your Personal Information and Account
                            Settings
                        </p>
                    </div>
                    {enableEdit ? (
                        <div className="flex gap-2">
                            <Button
                                color="danger"
                                onPress={() => setEnableEdit(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => setOnSubmit(true)}
                                startContent={<SaveIcon />}
                                isLoading={loading}
                            >
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <Button
                            color="primary"
                            onPress={() => setEnableEdit(true)}
                            startContent={<EditIcon />}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
                <Spacer y={1} />
                <ProfileForms
                    enableEdit={enableEdit}
                    setEnableEdit={(state: boolean) => {
                        setEnableEdit(state);
                        setOnSubmit(false);
                    }}
                    onSubmit={onSubmit}
                    isProcessing={(state: boolean) => setLoading(state)}
                />
                <DeleteAccount />
            </div>
        </React.Fragment>
    );
};

export default ProfilePage;
