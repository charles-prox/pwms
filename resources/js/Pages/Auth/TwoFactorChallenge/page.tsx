import React, { FormEvent, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input, Button, Card } from "@heroui/react"; // Adjust import if needed

type FormDataConvertible =
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | File
    | Blob
    | FormDataConvertible[]
    | { [key: string]: FormDataConvertible };

interface TwoFactorFormData {
    code: string;
    recovery_code: string;
    [key: string]: FormDataConvertible;
}

const TwoFactorChallenge: React.FC = () => {
    const [useRecoveryCode, setUseRecoveryCode] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<TwoFactorFormData>({
            code: "",
            recovery_code: "",
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("two-factor.login"), {
            replace: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Two-Factor Challenge" />

            <div className="flex items-center justify-center min-h-screen px-4 py-12 ">
                <Card className="w-full max-w-md p-6 space-y-6 shadow-lg rounded-2xl">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Two-Factor Authentication
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {useRecoveryCode
                                ? "Please confirm access to your account by entering one of your recovery codes."
                                : "Please confirm access to your account by entering the authentication code from your authenticator app."}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {!useRecoveryCode ? (
                            <Input
                                type="text"
                                name="code"
                                id="code"
                                placeholder="Enter authenticator code"
                                label="Code"
                                labelPlacement="outside"
                                value={data.code}
                                isInvalid={!!errors.code}
                                errorMessage={errors.code}
                                onChange={(e) => {
                                    clearErrors("code");
                                    setData("code", e.target.value);
                                }}
                                classNames={{
                                    label: "text-black dark:text-white font-semibold",
                                    inputWrapper:
                                        "border-gray-300 dark:border-white/20",
                                }}
                            />
                        ) : (
                            <Input
                                type="text"
                                name="recovery_code"
                                id="recovery_code"
                                placeholder="Enter recovery code"
                                label="Recovery Code"
                                labelPlacement="outside"
                                value={data.recovery_code}
                                isInvalid={!!errors.recovery_code}
                                errorMessage={errors.recovery_code}
                                onChange={(e) => {
                                    clearErrors("code");
                                    setData("recovery_code", e.target.value);
                                }}
                                classNames={{
                                    label: "text-black dark:text-white font-semibold",
                                    inputWrapper:
                                        "border-gray-300 dark:border-white/20",
                                }}
                            />
                        )}

                        <div className="flex justify-between items-center">
                            <Button
                                variant="light"
                                color="default"
                                type="button"
                                onPress={() =>
                                    setUseRecoveryCode(!useRecoveryCode)
                                }
                                className="underline text-sm"
                            >
                                {useRecoveryCode
                                    ? "Use authentication code"
                                    : "Use recovery code"}
                            </Button>

                            <Button
                                color="primary"
                                type="submit"
                                isLoading={processing}
                            >
                                Log in
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default TwoFactorChallenge;
