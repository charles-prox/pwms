import React from "react";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { ConfirmPassword } from "../ConfirmPassword";
import { router, usePage } from "@inertiajs/react";
import { ConfirmTwoFactorAuthForm } from "./ConfirmTwoFactorAuthForm";

export const TwoFactorAuthForm = () => {
    const { auth } = usePage().props;
    const [passwordConfirmed, setPasswordConfirmed] = React.useState(false);
    const [recoveryCodes, setRecoveryCodes] = React.useState([]);
    const [showRecoveryCodes, setShowRecoveryCodes] = React.useState(false);
    const [openConfirmPasswordForm, setOpenConfirmPasswordForm] =
        React.useState(false);
    const [openConfirmTwoFactorAuthForm, setOpenConfirmTwoFactorAuthForm] =
        React.useState(false);
    const [action, setAction] = React.useState("");
    const [processing, setProcessing] = React.useState(false);

    const getRecoveryCodes = () => {
        return Promise.all([
            axios.get(route("two-factor.recovery-codes")).then((response) => {
                setRecoveryCodes(response.data);
                setProcessing(false);
            }),
        ]);
    };

    const disableTwoFactorAuthentication = () => {
        router.delete(route("two-factor.disable"), {
            onFinish: () => setProcessing(false),
        });
    };

    const regenerateRecoveryCodes = () => {
        axios.post(route("two-factor.recovery-codes")).then(() => {
            getRecoveryCodes();
            setProcessing(false);
        });
    };

    React.useEffect(() => {
        auth.user?.two_factor_enabled &&
            showRecoveryCodes &&
            getRecoveryCodes();
    }, [auth, showRecoveryCodes]);

    React.useEffect(() => {
        if (passwordConfirmed) {
            switch (action) {
                case "enable_2fa":
                    setOpenConfirmTwoFactorAuthForm(true);
                    break;
                case "disable_2fa":
                    disableTwoFactorAuthentication();
                    break;

                default:
                    break;
            }
        }
    }, [passwordConfirmed, action]);

    return (
        <React.Fragment>
            <Divider />
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-4">
                    <h2 className="text-md font-bold">
                        Two Factor Authentication
                    </h2>
                    <p className="text-sm mx-w-">
                        Add additional security to your account using two factor
                        authentication.
                    </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Card>
                        <CardBody className="p-0">
                            <div className="flex flex-col gap-5 p-8">
                                <h3 className="text-md font-semibold">
                                    {auth.user?.two_factor_enabled
                                        ? "You have enabled two factor authentication."
                                        : "You have not enabled two factor authentication."}
                                </h3>
                                <p className="text-sm max-w-xl">
                                    When two-factor authentication is enabled,
                                    you will be prompted to enter a secure,
                                    random token during authentication. You can
                                    retrieve this token from your phone's
                                    authenticator application (e.g., Google
                                    Authenticator, Microsoft Authenticator).
                                </p>

                                {showRecoveryCodes && (
                                    <div>
                                        <div className="flex flex-col gap-2 mt-2 max-w-xl text-sm">
                                            <p className="font-semibold">
                                                Store these recovery codes in a
                                                secure password manager. They
                                                can be used to recover access to
                                                your account if your two factor
                                                authentication device is lost.
                                            </p>
                                            <p className="font-semibold">
                                                These codes will not be shown
                                                again, and they will not be
                                                available if you refresh the
                                                page or leave this page.
                                            </p>
                                        </div>

                                        <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-slate-100/50 rounded-lg">
                                            {recoveryCodes.map(
                                                (code, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {code}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-8 py-5 bg-slate-400/10 text-right">
                                {auth.user?.two_factor_enabled &&
                                auth.user?.two_factor_confirmed_at ? (
                                    <div className="flex gap-3 justify-end">
                                        {showRecoveryCodes ? (
                                            <Button
                                                variant="flat"
                                                color="default"
                                                onPress={() => {
                                                    setProcessing(true);
                                                    regenerateRecoveryCodes();
                                                }}
                                                isLoading={processing}
                                            >
                                                Regenerate Recovery Codes
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="flat"
                                                color="default"
                                                onPress={() => {
                                                    setProcessing(true);
                                                    setOpenConfirmPasswordForm(
                                                        true
                                                    );
                                                }}
                                                isLoading={processing}
                                            >
                                                Show Recovery Codes
                                            </Button>
                                        )}
                                        <Button
                                            color="danger"
                                            onPress={() => {
                                                {
                                                    setProcessing(true);
                                                    setAction("disable_2fa");
                                                    setOpenConfirmPasswordForm(
                                                        true
                                                    );
                                                }
                                            }}
                                            isLoading={processing}
                                        >
                                            Disable
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setAction("enable_2fa");
                                            setOpenConfirmPasswordForm(true);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <ConfirmTwoFactorAuthForm
                isOpen={openConfirmTwoFactorAuthForm}
                onClose={() => {
                    setOpenConfirmTwoFactorAuthForm(false);
                    setProcessing(false);
                }}
                onSuccess={() => {
                    setOpenConfirmTwoFactorAuthForm(false);
                    setPasswordConfirmed(false);
                }}
            />

            <ConfirmPassword
                isOpen={openConfirmPasswordForm}
                onClose={() => {
                    setOpenConfirmPasswordForm(false);
                    setProcessing(false);
                }}
                onSuccess={(state) => {
                    setOpenConfirmPasswordForm(false);
                    setPasswordConfirmed(state);
                    setShowRecoveryCodes(true);
                }}
            />
        </React.Fragment>
    );
};
