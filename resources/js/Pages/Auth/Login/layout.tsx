import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { appName } from "@/Utils/constants";

const LoginLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const logoSize = 60;

    return (
        <>
            <Head title="Login" />
            <Card className={`w-full px-6 py-4 overflow-hidden sm:max-w-md`}>
                <CardHeader className="block gap-2">
                    <div className="flex items-center justify-center mb-5 sm:mb-2">
                        <Image
                            width={logoSize}
                            height={logoSize}
                            alt="App logo"
                            src={"/logo.png"}
                        />
                    </div>
                    <h1 className="text-2xl mb-2">
                        {"Welcome to "}
                        <span className="text-primary font-extrabold">
                            {appName}.
                        </span>
                    </h1>
                    <p className="text-sm">
                        {"Please login using your registered account."}
                    </p>
                </CardHeader>
                <CardBody>{children}</CardBody>
            </Card>
        </>
    );
};

export default LoginLayout;
