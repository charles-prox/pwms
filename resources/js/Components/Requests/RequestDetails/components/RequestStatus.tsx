import { Card, CardBody } from "@heroui/react";
import React from "react";

interface RequestStatusProps {
    submittedAt?: string | null;
    approvedAt?: string | null;
    completedAt?: string | null;
    rejectedAt?: string | null;
    errorStage?: "approval" | "completion" | null;
    remarks?: {
        submitted?: string;
        approved?: string;
        completed?: string;
        rejected?: string;
        error?: string;
    };
}

const RequestStatus: React.FC<RequestStatusProps> = ({
    submittedAt,
    approvedAt,
    completedAt,
    rejectedAt,
    errorStage,
    remarks = {},
}) => {
    const isDraft = !submittedAt && !rejectedAt;

    const steps = [
        {
            label: "Request Submitted",
            date: submittedAt,
            status: submittedAt ? "done" : isDraft ? "draft" : "pending",
            remark: remarks.submitted,
        },
        {
            label: rejectedAt
                ? "Request Rejected"
                : errorStage === "approval"
                ? "Approval Error"
                : "Request Approved",
            date: rejectedAt ?? approvedAt,
            status: rejectedAt
                ? "rejected"
                : errorStage === "approval"
                ? "error"
                : approvedAt
                ? "done"
                : "pending",
            remark: rejectedAt
                ? remarks.rejected
                : errorStage === "approval"
                ? remarks.error
                : remarks.approved,
        },
        {
            label:
                errorStage === "completion"
                    ? "Completion Error"
                    : "Request Completed",
            date: completedAt,
            status:
                errorStage === "completion"
                    ? "error"
                    : completedAt
                    ? "done"
                    : "pending",
            remark:
                errorStage === "completion" ? remarks.error : remarks.completed,
        },
    ];

    const getDotColor = (status: string) => {
        switch (status) {
            case "done":
                return "bg-green-500";
            case "pending":
                return "bg-gray-300";
            case "draft":
                return "bg-yellow-500";
            case "rejected":
                return "bg-red-500";
            case "error":
                return "bg-orange-500";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <Card className="p-3">
            <CardBody>
                <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
                    Status:
                </p>
                {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start mb-4">
                        <div className="flex flex-col items-center mr-4">
                            <div
                                className={`w-4 h-4 rounded-full ${getDotColor(
                                    step.status
                                )}`}
                            ></div>
                            {idx !== steps.length - 1 && (
                                <div className="w-px h-10 bg-gray-300"></div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium">{step.label}</p>
                            <p className="text-tiny text-gray-500">
                                {step.date
                                    ? new Date(step.date).toLocaleString()
                                    : step.status === "draft"
                                    ? "Not yet submitted"
                                    : "—"}
                            </p>
                            {step.remark && (
                                <p className="text-sm mt-1">{step.remark}</p>
                            )}
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

export default RequestStatus;
