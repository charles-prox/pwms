import { useForm } from "@inertiajs/react";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { ConfirmPassword } from "../ConfirmPassword";

const DeleteAccount = () => {
    const [openConfirmPasswordForm, setOpenConfirmPasswordForm] =
        useState(false);
    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        password: "",
    });

    const deleteUser = () => {
        destroy(route("current-user.destroy"), {
            preserveScroll: true,
        });
    };

    // Trigger deleteUser when data.password is updated
    useEffect(() => {
        if (data.password) {
            deleteUser();
        }
    }, [data]);

    return (
        <>
            <Divider />
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-4">
                    <h2 className="text-md font-bold">Delete Account</h2>
                    <p className="text-sm">Permanently delete your account.</p>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Card>
                        <CardBody className="p-0">
                            <div className="flex flex-col gap-5 p-8">
                                <p className="text-sm max-w-xl">
                                    Once your account is deleted, all of its
                                    resources and data will be permanently
                                    deleted. Before deleting your account,
                                    please download any data or information that
                                    you wish to retain.
                                </p>
                            </div>
                            <div className="px-8 py-5 bg-slate-400/10 text-right">
                                <Button
                                    onPress={() =>
                                        setOpenConfirmPasswordForm(true)
                                    }
                                    isLoading={processing}
                                    color="danger"
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <ConfirmPassword
                title="Delete Account"
                content="Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."
                isOpen={openConfirmPasswordForm}
                onClose={() => setOpenConfirmPasswordForm(false)}
                onSubmit={(pass) => setData("password", pass)}
                errors={errors}
                processing={processing}
            />
        </>
    );
};

export default DeleteAccount;
