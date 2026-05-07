import React from "react";
import { Button, Chip, Link } from "@heroui/react";

interface RequestStatusProps {
    title?: string;
    status: string;
    pdfPath?: string;
}

const RequestTitle: React.FC<RequestStatusProps> = ({
    title = "Request Details",
    status = "Pending",
    pdfPath = "",
}) => {
    return (
        <div className="flex justify-between">
            <div className="flex gap-6 items-start">
                <div className="flex gap-2">
                    <h2 className="text-2xl font-semibold text-default-600">
                        Request No.:
                    </h2>
                    <h2 className="text-2xl font-semibold ">{title}</h2>
                </div>
                <div className="p-1">
                    <Chip
                        color={status === "Completed" ? "success" : "secondary"}
                    >
                        {status}
                    </Chip>
                </div>
            </div>
            <div>
                {pdfPath && typeof pdfPath === "string" && pdfPath !== "" && (
                    <Button
                        as="a"
                        href={pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        variant="flat"
                    >
                        View Form
                    </Button>
                )}
            </div>
        </div>
    );
};

export default RequestTitle;
