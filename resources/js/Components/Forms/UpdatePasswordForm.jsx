import React from "react";
import { useForm } from "@inertiajs/react";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { PasswordVisibilityButton } from "../PasswordVisibilityButton";

export const UpdatePasswordForm = () => {
    const [isVisible, setIsVisible] = React.useState({
        current_password: false,
        password: false,
        password_confirmation: false,
    });
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        errors.message = null;
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
                                    <Input
                                        type={
                                            isVisible.current_password
                                                ? "text"
                                                : "password"
                                        }
                                        name="current_password"
                                        id="current_password"
                                        label="Current Password"
                                        placeholder="Enter current password"
                                        labelPlacement="outside"
                                        value={data.current_password}
                                        isInvalid={
                                            !!errors.updatePassword
                                                ?.current_password
                                        }
                                        errorMessage={
                                            errors.updatePassword
                                                ?.current_password
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        classNames={{
                                            label: "text-black dark:text-white/90 font-bold",
                                            inputWrapper: "border-slate-400",
                                            base: "max-w-lg",
                                        }}
                                        endContent={
                                            <PasswordVisibilityButton
                                                handleState={(state) =>
                                                    setIsVisible(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            current_password:
                                                                state,
                                                        })
                                                    )
                                                }
                                            />
                                        }
                                    />

                                    <Input
                                        type={
                                            isVisible.password
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        id="password"
                                        label="New Password"
                                        placeholder="Enter new password"
                                        labelPlacement="outside"
                                        value={data.password}
                                        isInvalid={
                                            !!errors.updatePassword?.password
                                        }
                                        errorMessage={
                                            errors.updatePassword?.password
                                        }
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        classNames={{
                                            label: "text-black dark:text-white/90 font-bold",
                                            inputWrapper: "border-slate-400",
                                            base: "max-w-lg",
                                        }}
                                        endContent={
                                            <PasswordVisibilityButton
                                                handleState={(state) =>
                                                    setIsVisible(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            password: state,
                                                        })
                                                    )
                                                }
                                            />
                                        }
                                    />

                                    <Input
                                        type={
                                            isVisible.password_confirmation
                                                ? "text"
                                                : "password"
                                        }
                                        name="password_confirmation"
                                        id="password_confirmation"
                                        label="Confirm Password"
                                        placeholder="Confirm new password"
                                        labelPlacement="outside"
                                        value={data.password_confirmation}
                                        isInvalid={
                                            !!errors.updatePassword
                                                ?.password_confirmation
                                        }
                                        errorMessage={
                                            errors.updatePassword
                                                ?.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        classNames={{
                                            label: "text-black dark:text-white/90 font-bold",
                                            inputWrapper: "border-slate-400",
                                            base: "max-w-lg",
                                        }}
                                        endContent={
                                            <PasswordVisibilityButton
                                                handleState={(state) =>
                                                    setIsVisible(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            password_confirmation:
                                                                state,
                                                        })
                                                    )
                                                }
                                            />
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
