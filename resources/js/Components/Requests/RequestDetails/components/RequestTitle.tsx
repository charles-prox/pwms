import React from "react";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Divider,
    Link,
    Spacer,
} from "@heroui/react";

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
                <div>
                    <h2 className="text-2xl font-semibold">
                        Request No.: {title}
                    </h2>
                </div>
                <div className="p-1">
                    <Chip color="secondary">{status}</Chip>
                </div>
            </div>
            <div>
                <Button as={Link} href={pdfPath} target="_blank">
                    View Form
                </Button>
            </div>
        </div>
    );
};

export default RequestTitle;
