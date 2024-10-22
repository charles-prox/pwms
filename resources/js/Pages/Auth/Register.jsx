import React from "react";
import { RegisterForm } from "@/Components/Forms/RegisterForm";
import { Head } from "@inertiajs/react";

const Register = () => {
    return (
        <React.Fragment>
            <Head title="Register" />
            <RegisterForm />
        </React.Fragment>
    );
};

export default Register;
