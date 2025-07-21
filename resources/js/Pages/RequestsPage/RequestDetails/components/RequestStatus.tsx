import { toTitleCase } from "@/Utils/helpers";
import { Card, CardBody, Divider } from "@heroui/react";
import React from "react";

interface RequestStatusProps {
    statusLogs: {
        date: string;
        status: string;
        remark?: string;
        updated_by?: string;
    }[];
}

const RequestStatus: React.FC<RequestStatusProps> = ({ statusLogs }) => {
    const getDotColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-success-200";
            case "completed":
                return "bg-success-500";
            case "partially_completed":
                return "bg-success-500";
            case "rejected":
                return "bg-danger-500";
            case "pending":
                return "bg-warning-400";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <Card className="p-3">
            <CardBody>
                <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4 ">
                    Status History:
                </p>
                <div className="max-w-full ">
                    <div className="grid mx-auto">
                        {statusLogs.map((log, idx) => (
                            <div key={idx} className="flex mt-[-3px]">
                                <div className="flex flex-col items-center mr-3">
                                    <div className="w-px h-1 opacity-0 " />
                                    <div>
                                        <div
                                            className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${getDotColor(
                                                log.status
                                            )}`}
                                        ></div>
                                    </div>
                                    {!log.status.includes("completed") && (
                                        <div className="w-px h-full bg-gray-400" />
                                    )}
                                </div>
                                <div className="flex flex-col pb-6 pt-1 items-center ">
                                    <div>
                                        <p className="text-xl font-semibold sm:text-base">
                                            {toTitleCase(log.status)}
                                        </p>
                                        <p className="text-tiny text-default-500">
                                            {log.date}
                                            {log.updated_by &&
                                                ` · by ${log.updated_by}`}
                                        </p>

                                        <p className="text-sm text-gray-500 pt-1">
                                            {log.remark}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default RequestStatus;
