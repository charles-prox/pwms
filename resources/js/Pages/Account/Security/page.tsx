import { Head } from "@inertiajs/react";
import { Spacer } from "@nextui-org/react";
import React from "react";
import { TwoFactorAuthForm } from "./forms/TwoFactorAuthForm";
import { UpdatePasswordForm } from "./forms/UpdatePasswordForm";
import { LogoutOtherBrowserSessions } from "./forms/LogoutOtherBrowserSessions";

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
