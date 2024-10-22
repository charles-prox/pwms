import React from "react";
import RegisterLayout from "./layout";
import RegisterForm from "./form";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gray-100">
            <RegisterLayout>
                <RegisterForm />
            </RegisterLayout>
        </div>
    );
};

export default RegisterPage;
