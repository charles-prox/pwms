import { BoxFormState, RequestType } from "@/Utils/types";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";
import BoxLabelViewer from "./BoxLabelViewer";
import BoxRemarksViewer from "./BoxRemarksViewer";

interface RequestBoxesProps {
    boxes: BoxFormState[];
    requestType: RequestType; // Optional prop to handle different request types
}

const RequestBoxes: React.FC<RequestBoxesProps> = ({ boxes, requestType }) => {
    if (!boxes || boxes.length === 0) {
        return <p className="text-gray-500">No boxes found.</p>;
    }

    return (
        <Card className="p-3">
            <CardHeader className="flex ">
                <h2 className="text-lg font-semibold">Items</h2>
            </CardHeader>

            <Divider className="my-2" />
            <CardBody>
                {boxes.map((box) => (
                    <div
                        key={box.id}
                        className="mb-6 p-4 border border-default-300 rounded-lg"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-md font-semibold">
                                    Box Code: {box.box_code}
                                </h3>
                                {box.priority_level &&
                                    requestType === "storage" && (
                                        <p
                                            className={`text-sm text-${box.priority_level.label.toLowerCase()}-600 font-medium`}
                                        >
                                            Priority: {box.priority_level.label}
                                        </p>
                                    )}
                            </div>
                            {requestType === "storage" && (
                                <div className="text-right text-sm">
                                    <p>
                                        <span className="font-medium">
                                            Disposal Date:
                                        </span>{" "}
                                        {box.disposal_date === "Permanent"
                                            ? "Permanent"
                                            : box.disposal_date?.formatted ??
                                              "N/A"}
                                    </p>
                                    <BoxLabelViewer box={box} />
                                </div>
                            )}
                        </div>

                        {!!box.location && (
                            <div className="flex gap-4 items-center">
                                <p className="text-sm ">Location:</p>
                                <p className="whitespace-pre-line text-sm italic text-gray-500">
                                    {box.location}
                                </p>
                            </div>
                        )}

                        <BoxRemarksViewer requestType={requestType} box={box} />

                        {/* Documents inside the box */}
                        {box.box_details.length > 0 &&
                            requestType === "storage" && (
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-gray-500 mb-2">
                                        {box.box_details.length > 1
                                            ? "Documents:"
                                            : "Document:"}
                                    </p>
                                    <ul className="space-y-3 pl-4">
                                        {box.box_details.map((doc, idx) => (
                                            <li
                                                key={doc.id + "-" + idx}
                                                className={`border-l-4 border-gray-300 pl-3`}
                                            >
                                                <p className="font-medium text-sm">
                                                    {doc.description ??
                                                        "Untitled Document"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    RDS No.: {doc.rds_number} |
                                                    Retention:{" "}
                                                    {doc.retention_period}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Period:{" "}
                                                    {doc.document_date
                                                        ?.readable ??
                                                        "N/A"}{" "}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Disposal:{" "}
                                                    {doc.disposal_date ===
                                                    "Permanent"
                                                        ? "Permanent"
                                                        : doc.disposal_date
                                                              ?.formatted ??
                                                          "N/A"}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

export default RequestBoxes;
