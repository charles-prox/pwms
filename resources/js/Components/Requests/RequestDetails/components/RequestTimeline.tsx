import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

interface RequestTimelineProps {
    submittedAt: string;
    approvedAt?: string | null;
    completedAt?: string | null;
}

const RequestTimeline: React.FC<RequestTimelineProps> = ({
    submittedAt,
    approvedAt,
    completedAt,
}) => {
    const steps = [
        {
            label: "Request Submitted",
            date: submittedAt,
            status: "done",
        },
        {
            label: "Request Approved",
            date: approvedAt,
            status: approvedAt ? "done" : "pending",
        },
        {
            label: "Request Completed",
            date: completedAt,
            status: completedAt ? "done" : "pending",
        },
    ];

    return (
        <Card className="p-3">
            <CardHeader className="flex ">
                <h2 className="text-lg font-semibold">Timeline</h2>
            </CardHeader>

            <Divider className="my-2" />
            <CardBody>
                {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    step.status === "done"
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                }`}
                            ></div>
                            {idx !== steps.length - 1 && (
                                <div className="w-px h-10 bg-gray-300"></div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium">{step.label}</p>
                            <p className="text-sm text-muted-foreground">
                                {step.date
                                    ? new Date(step.date).toLocaleString()
                                    : "—"}
                            </p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

export default RequestTimeline;
