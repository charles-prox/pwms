import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input, Button } from "@nextui-org/react";

const TwoFactorChallenge = () => {
    const [useRecoveryCode, setUseRecoveryCode] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        recovery_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("two-factor.login"), {
            replace: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <React.Fragment>
            <Head title="Login" />
            {!useRecoveryCode ? (
                <p className="text-sm mb-5">
                    Please confirm access to your account by entering the
                    authentication code provided by your authenticator
                    application.
                </p>
            ) : (
                <p className="text-sm mb-5">
                    Please confirm access to your account by entering one of
                    your emergency recovery codes.
                </p>
            )}
            <form onSubmit={submit}>
                <div className="flex flex-col gap-4">
                    {!useRecoveryCode ? (
                        <Input
                            type={"text"}
                            name="code"
                            id="code"
                            placeholder="Enter authenticator code"
                            label="Code"
                            labelPlacement={"outside"}
                            value={data.code}
                            isInvalid={!!errors.code}
                            errorMessage={errors.code}
                            onChange={(e) => setData("code", e.target.value)}
                            classNames={{
                                label: "text-black dark:text-white/90 font-bold",
                                inputWrapper: "border-slate-400",
                            }}
                        />
                    ) : (
                        <Input
                            type={"text"}
                            name="recovery_code"
                            id="recovery_code"
                            placeholder="Enter recovery code"
                            label="Recovery Code"
                            labelPlacement={"outside"}
                            value={data.recovery_code}
                            isInvalid={!!errors.recovery_code}
                            errorMessage={errors.recovery_code}
                            onChange={(e) =>
                                setData("recovery_code", e.target.value)
                            }
                            classNames={{
                                label: "text-black dark:text-white/90 font-bold",
                                inputWrapper: "border-slate-400",
                            }}
                        />
                    )}
                    <div className="flex gap-3 justify-end">
                        {!useRecoveryCode ? (
                            <Button
                                variant="light"
                                color="default"
                                onPress={() => setUseRecoveryCode(true)}
                                className="underline"
                            >
                                Use a recovery code
                            </Button>
                        ) : (
                            <Button
                                variant="light"
                                color="default"
                                onPress={() => setUseRecoveryCode(false)}
                                className="underline"
                            >
                                Use an authentication code
                            </Button>
                        )}

                        <Button
                            color="primary"
                            type="submit"
                            isLoading={processing}
                        >
                            Log in
                        </Button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};

export default TwoFactorChallenge;
