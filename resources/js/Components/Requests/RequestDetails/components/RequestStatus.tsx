import React from "react";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/react";

export type RequestStatusType =
    | "Pending"
    | "In Review"
    | "Approved"
    | "Rejected";
export type RequestType = "storage" | "withdrawal" | "return" | "disposal";

interface RequestStatusProps {
    title?: string;
    status: RequestStatusType;
    type: RequestType;
}

const statusColors: Record<RequestStatusType, string> = {
    Pending: "bg-gray-100 text-gray-700",
    "In Review": "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
};

const typeLabels: Record<RequestType, string> = {
    storage: "Storage",
    withdrawal: "Withdrawal",
    return: "Return",
    disposal: "Disposal",
};

const RequestStatus: React.FC<RequestStatusProps> = ({
    title = "Request Details",
    status = "Pending",
    type = "storage",
}) => {
    return (
        <Card>
            <CardBody>
                <h2 className="text-lg font-semibold">{title}</h2>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Chip>{status}</Chip>
                </div>

                <div className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span>{" "}
                    {typeLabels[type]}
                </div>
            </CardBody>
        </Card>
    );
};

export default RequestStatus;
