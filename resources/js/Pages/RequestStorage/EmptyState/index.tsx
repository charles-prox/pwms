import { asset } from "@/Utils/helpers";
import { Button, Image, Spacer } from "@heroui/react";
import React from "react";

const NoRequest: React.FC = () => {
    return (
        <div className="w-full flex flex-col justify-center p-10 gap-5">
            <div className="flex w-full justify-center  opacity-80 dark:opacity-70">
                <Image
                    alt="empty storage request"
                    src={asset("./emptystates/storage-request.png")}
                    width={500}
                />
            </div>
            <h2 className="font-bold text-[2rem] text-center">Get started</h2>
            <p className="text-center">
                Start and Manage Your Document Storage Requests with Ease and
                Precision
            </p>
            <Spacer />
            <Button className="mx-auto" color="secondary">
                Create Storage Request
            </Button>
        </div>
    );
};

export default NoRequest;
