import DeleteAccount from "@/Components/DeleteAccount";
import { EditIcon, SaveIcon } from "@/Components/Forms/icons";
import { ProfileManagementForm } from "@/Components/Forms/ProfileManagementForm";
import { Head } from "@inertiajs/react";
import { Button, Spacer } from "@nextui-org/react";
import React from "react";

const Profile = () => {
    const [enableEdit, setEnableEdit] = React.useState(false);
    const [onSubmit, setOnSubmit] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

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
                <ProfileManagementForm
                    enableEdit={enableEdit}
                    setEnableEdit={(state) => {
                        setEnableEdit(state);
                        setOnSubmit(false);
                    }}
                    onSubmit={onSubmit}
                    isProcessing={(state) => setLoading(state)}
                />
                <DeleteAccount />
            </div>
        </React.Fragment>
    );
};

export default Profile;
