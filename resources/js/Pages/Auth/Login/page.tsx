import React from "react";
import LoginLayout from "./layout";
import LoginForm from "./form";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center">
            <LoginLayout>
                <LoginForm />
            </LoginLayout>
        </div>
    );
};

export default LoginPage;
