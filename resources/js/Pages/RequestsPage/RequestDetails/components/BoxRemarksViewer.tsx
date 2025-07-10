import { BoxDetails, BoxFormState } from "@/Utils/types";
import React from "react";

interface BoxRemarksViewerProps {
    requestType: string;
    box: BoxFormState;
}

const BoxRemarksViewer: React.FC<BoxRemarksViewerProps> = ({
    requestType,
    box,
}) => {
    let label = "Remarks";
    let value = "";

    switch (requestType) {
        case "storage":
            value = box.remarks ?? "";
            break;
        case "withdrawal":
            label = "Description/Remarks :";
            value = box.request_remarks?.withdrawal ?? "";
            break;
        case "return":
            label = "Return Remarks";
            value = box.request_remarks?.return ?? "";
            break;
        case "disposal":
            label = "Disposal Remarks";
            value = box.request_remarks?.disposal ?? "";
            break;
        default:
            value = box.remarks ?? "";
    }

    if (!value) return null;

    return (
        <div>
            <p className="mt-2 text-sm italic ">{label}</p>
            <p className="whitespace-pre-line text-sm italic text-gray-500">
                {value}
            </p>
        </div>
    );
};

export default BoxRemarksViewer;
