import { TwoFactorAuthForm } from "@/Components/Forms/TwoFactorAuthForm";
import { UpdatePasswordForm } from "@/Components/Forms/UpdatePasswordForm";
import { LogoutOtherBrowserSessions } from "@/Components/LogoutOtherBrowserSessions";
import { Head } from "@inertiajs/react";
import { Spacer } from "@heroui/react";
import React from "react";

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
