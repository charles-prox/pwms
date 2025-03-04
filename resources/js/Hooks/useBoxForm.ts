import { BoxDetails, BoxFormState } from "@/Utils/types";
import { useState } from "react";

const useBoxForm = () => {
    const [boxData, setBoxData] = useState<BoxFormState>({
        box_code: "",
        priority_level: "",
        remarks: "",
        disposal_date: "",
        office: "",
        box_details: [
            {
                id: 1,
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: null,
            },
        ] as BoxDetails[],
    });

    const onBoxCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoxData((prev) => ({ ...prev, box_code: e.target.value }));
    };

    const onPriorityLevelChange = (key: string) => {
        setBoxData((prev) => ({ ...prev, priority_level: key }));
    };

    const onDisposalDateChange = (date: string) => {
        setBoxData((prev) => ({ ...prev, disposal_date: date }));
    };

    const onOfficeChange = (office: string) => {
        setBoxData((prev) => ({ ...prev, office: office }));
    };

    const onAddDocument = () => {
        setBoxData((prev) => ({
            ...prev,
            box_details: [
                ...prev.box_details,
                {
                    id: prev.box_details.length + 1,
                    document_title: null,
                    rds_number: "",
                    retention_period: "",
                    document_date: null,
                },
            ],
        }));
    };

    const onDeleteDocument = (index: number) => {
        setBoxData((prev) => ({
            ...prev,
            box_details: prev.box_details.filter((_, i) => i !== index),
        }));
    };

    const onDocumentChange = (
        index: number,
        key: keyof BoxDetails,
        value: any
    ) => {
        setBoxData((prev) => ({
            ...prev,
            box_details: prev.box_details.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    return {
        boxData,
        setBoxData,
        onBoxCodeChange,
        onPriorityLevelChange,
        onOfficeChange,
        onDisposalDateChange,
        onAddDocument,
        onDeleteDocument,
        onDocumentChange,
    };
};

export default useBoxForm;
