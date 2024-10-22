import React from "react";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { usePage } from "@inertiajs/react";
import { appName } from "@/utils/constants";

export default function AuthLayout({ children }) {
    const { component } = usePage();
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gray-100">
            <Card
                className={`w-full max-w-full px-6 py-4 bg-white overflow-hidden ${
                    component === "Auth/Login" ||
                    component === "Auth/TwoFactorChallenge"
                        ? "sm:max-w-md"
                        : "sm:max-w-4xl"
                }`}
            >
                <CardHeader className="block gap-2">
                    <div className="flex items-center justify-center mb-5 sm:mb-2">
                        <Image width={60} alt="App logo" src={"logo.png"} />
                    </div>
                    <h1 className="text-2xl mb-2">
                        {component.includes("Register")
                            ? "We are initializing "
                            : "Welcome to "}
                        <span className="text-primary font-extrabold">
                            {appName}.
                        </span>
                    </h1>
                    <p className="text-sm">
                        {component.includes("Register")
                            ? "You need to register as a system administrator."
                            : component.includes("Login")
                            ? "Please login using your registered account."
                            : ""}
                    </p>
                </CardHeader>
                <CardBody>{children}</CardBody>
            </Card>
        </div>
    );
}
