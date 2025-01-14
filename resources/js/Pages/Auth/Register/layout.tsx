import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { appName } from "@/Utils/constants";

interface RegisterLayoutProps {
    children: React.ReactNode;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
    const logoSize = 60;

    return (
        <>
            <Head title="Register" />
            <Card className="w-full px-6 py-4 overflow-hidden sm:max-w-4xl">
                <CardHeader className="block gap-2">
                    <div className="flex items-center justify-center mb-5 sm:mb-2">
                        <Image
                            width={logoSize}
                            height={logoSize}
                            alt={`${appName} logo`} // Improved accessibility
                            src="/logo.png" // Consider making this dynamic if needed
                        />
                    </div>
                    <h1 className="text-2xl mb-2">
                        We are initializing{" "}
                        <span className="text-primary font-extrabold">
                            {appName}.
                        </span>
                    </h1>
                    <p className="text-sm">
                        You need to register as a system administrator.
                    </p>
                </CardHeader>
                <CardBody>{children}</CardBody>
            </Card>
        </>
    );
};

export default RegisterLayout;
