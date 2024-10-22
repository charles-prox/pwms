import React from "react";
import { Head } from "@inertiajs/react";
import { LoginForm } from "@/Components/Forms/LoginForm";

const Login = ({ status }) => {
    return (
        <React.Fragment>
            <Head title="Login" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <LoginForm />
        </React.Fragment>
    );
};

export default Login;
