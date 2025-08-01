import { Head } from "@inertiajs/react";
import { Spacer } from "@heroui/react";
import React from "react";
import { UpdatePasswordForm } from "./forms/UpdatePasswordForm";
import { LogoutOtherBrowserSessions } from "./forms/LogoutOtherBrowserSessions";
import { TwoFactorAuthForm } from "./forms/TwoFactorAuthForm";

const Security: React.FC = () => {
    return (
        <React.Fragment>
            <Head title="Security" />
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="text-2xl font-bold">Account Security</h1>
                    <p>
                        Keep your account safe by managing your security
                        preferences here.
                    </p>
                </div>
                <Spacer y={1} />
                <UpdatePasswordForm />
                <TwoFactorAuthForm />
                <LogoutOtherBrowserSessions />
            </div>
        </React.Fragment>
    );
};

export default Security;
