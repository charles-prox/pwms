import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { router, usePage } from "@inertiajs/react";
import React from "react";
import { ComputerIcon, MobileIcon } from "./icons";
import { ConfirmPassword } from "../ConfirmPassword";

export const LogoutOtherBrowserSessions = () => {
    const { sessions } = usePage().props;
    const [processing, setProcessing] = React.useState(false);
    const [openConfirmPasswordForm, setOpenConfirmPasswordForm] =
        React.useState(false);

    const logoutOtherBrowserSessions = () => {
        router.delete(route("other-browser-sessions.destroy"), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <React.Fragment>
            <Divider />
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-4">
                    <h2 className="text-md font-bold">Browser Sessions</h2>
                    <p className="text-sm mx-w-">
                        Manage and log out your active sessions on other
                        browsers and devices.
                    </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Card>
                        <CardBody className="p-0">
                            <div className="flex flex-col gap-5 p-8">
                                <p className="text-sm max-w-xl">
                                    If necessary, you may log out of all of your
                                    other browser sessions across all of your
                                    devices. Some of your recent sessions are
                                    listed below; however, this list may not be
                                    exhaustive. If you feel your account has
                                    been compromised, you should also update
                                    your password.
                                </p>
                                {sessions?.map((session, index) => {
                                    return (
                                        <div
                                            key={`session-${index}`}
                                            className="flex items-center gap-3"
                                        >
                                            {session.agent.is_desktop ? (
                                                <ComputerIcon />
                                            ) : (
                                                <MobileIcon />
                                            )}

                                            <div className="flex flex-col ">
                                                <div className="text-sm text-gray-600">
                                                    {session.agent.platform
                                                        ? session.agent.platform
                                                        : "Unknown"}{" "}
                                                    -{" "}
                                                    {session.agent.browser
                                                        ? session.agent.browser
                                                        : "Unknown"}
                                                </div>

                                                <div>
                                                    <div className="text-xs text-gray-500">
                                                        {session.ip_address},{" "}
                                                        {session.is_current_device ? (
                                                            <span className="text-green-500 font-semibold">
                                                                This device
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Last active{" "}
                                                                {
                                                                    session.last_active
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="px-8 py-5 bg-slate-400/10 text-right">
                                <Button
                                    onPress={() =>
                                        setOpenConfirmPasswordForm(true)
                                    }
                                    isLoading={processing}
                                >
                                    Log Out Other Browser Sessions
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <ConfirmPassword
                title={"Log Out Other Browser Sessions"}
                content={
                    "Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices."
                }
                isOpen={openConfirmPasswordForm}
                onClose={() => {
                    setOpenConfirmPasswordForm(false);
                }}
                onSuccess={() => {
                    setOpenConfirmPasswordForm(false);
                    logoutOtherBrowserSessions();
                }}
            />
        </React.Fragment>
    );
};
