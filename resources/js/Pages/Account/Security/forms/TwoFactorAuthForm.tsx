import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { usePage } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";
import ConfirmPassword from "@/Components/ConfirmPassword";

export const TwoFactorAuthForm: React.FC = () => {
    const { confirmsTwoFactorAuthentication } = usePage<any>().props;
    const [recoveryCodes, setRecoveryCodes] = useState<any>([]);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState<boolean>(false);
    const [openConfirmPasswordForm, setOpenConfirmPasswordForm] =
        useState<boolean>(false);

    const [processing, setProcessing] = useState<boolean>(false);

    const getRecoveryCodes = (): Promise<void> => {
        return axiosInstance
            .get(route("two-factor.recovery-codes"))
            .then((response) => {
                setRecoveryCodes(response.data);
                setProcessing(false);
            });
    };

    const regenerateRecoveryCodes = (): void => {
        axiosInstance.post(route("two-factor.recovery-codes")).then(() => {
            getRecoveryCodes();
            setProcessing(false);
        });
    };

    useEffect(() => {
        if (confirmsTwoFactorAuthentication && showRecoveryCodes) {
            getRecoveryCodes();
        }
    }, [confirmsTwoFactorAuthentication, showRecoveryCodes]);

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
                                    {confirmsTwoFactorAuthentication
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
                                                (code: string, index: any) => (
                                                    <div key={index}>
                                                        {code}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-8 py-5 bg-slate-400/10 text-right">
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
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <ConfirmPassword
                isOpen={openConfirmPasswordForm}
                onClose={() => {
                    setOpenConfirmPasswordForm(false);
                    setProcessing(false);
                }}
                onSuccess={(state: boolean) => {
                    setOpenConfirmPasswordForm(false);
                    setShowRecoveryCodes(true);
                }}
            />
        </React.Fragment>
    );
};
