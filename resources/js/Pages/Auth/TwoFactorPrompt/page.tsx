import { Head } from "@inertiajs/react";
import { TwoFactorAuthForm } from "./TwoFactorAuthForm";

export default function TwoFactorPrompt() {
    return (
        <div className="max-w-lg mx-auto space-y-6">
            <Head title="Two-Factor Authentication" />

            <TwoFactorAuthForm />
        </div>
    );
}
