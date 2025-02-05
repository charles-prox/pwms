import React from "react";
import { useForm } from "@inertiajs/react";
import { Button, Card, CardBody } from "@heroui/react";
import PasswordInput from "@/Components/PasswordInput";

export const UpdatePasswordForm = () => {
    // UseForm return type inferred from the data object.
    const { data, setData, put, processing, errors, reset } = useForm<any>({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Clear any previous errors
        // Check if the property exists and its type
        if (
            errors.updatePassword &&
            typeof errors.updatePassword !== "string"
        ) {
            (errors.updatePassword as { message: string | null }).message =
                null;
        }
        put(route("user-password.update"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <React.Fragment>
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-4">
                    <h2 className="text-md font-bold">Update Password</h2>
                    <p className="text-sm mx-w-">
                        Ensure your account is using a long, random password to
                        stay secure.
                    </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Card>
                        <CardBody className="p-0">
                            <form onSubmit={submit}>
                                <div className="flex flex-col gap-5 p-8">
                                    <PasswordInput
                                        name="current_password"
                                        label="Current Password"
                                        labelPlacement="outside"
                                        maxWidthClass={"max-w-lg"}
                                        placeholder="Enter current password"
                                        errorMessage={
                                            (
                                                errors.updatePassword as
                                                    | {
                                                          current_password: string;
                                                      }
                                                    | undefined
                                            )?.current_password
                                        }
                                        value={data.current_password}
                                        onChange={(e) =>
                                            setData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <PasswordInput
                                        name="password"
                                        label="New Password"
                                        labelPlacement="outside"
                                        maxWidthClass={"max-w-lg"}
                                        placeholder="Enter new password"
                                        errorMessage={
                                            (
                                                errors.updatePassword as
                                                    | {
                                                          password: string;
                                                      }
                                                    | undefined
                                            )?.password
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />

                                    <PasswordInput
                                        name="password_confirmation"
                                        label="Confirm Password"
                                        labelPlacement="outside"
                                        maxWidthClass={"max-w-lg"}
                                        placeholder="Confirm new password"
                                        errorMessage={
                                            (
                                                errors.updatePassword as
                                                    | {
                                                          password_confirmation:
                                                              | string;
                                                      }
                                                    | undefined
                                            )?.password_confirmation
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="px-8 py-5 bg-slate-400/10 text-right">
                                    <Button
                                        color="primary"
                                        type="submit"
                                        isLoading={processing}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};
