import React from "react";
import { Button, Card, CardBody, Chip, Divider, Spacer } from "@heroui/react";

interface RequestStatusProps {
    title?: string;
    status: string;
}

const RequestStatus: React.FC<RequestStatusProps> = ({
    title = "Request Details",
    status = "Pending",
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
                <Button>View Form</Button>
            </div>
        </div>
    );
};

export default RequestStatus;
