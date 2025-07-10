import useFetch from "@/Hooks/useFetch";
import { toTitleCase } from "@/Utils/helpers";
import { FormProp } from "@/Utils/types";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

interface RequestSummaryProps {
    form: FormProp;
    items: number;
}

const RequestSummary: React.FC<RequestSummaryProps> = ({ form, items }) => {
    const {
        data: office,
        loading: loadingOffice,
        error: officeError,
    } = useFetch<any>(route("offices.show", { id: form.office_id }));

    return (
        <Card className="p-3">
            <CardHeader>
                <h2 className="text-lg font-semibold">Details</h2>
            </CardHeader>
            <Divider className="my-2" />

            <CardBody className="space-y-3 text-sm">
                <div className="flex gap-5">
                    <span className="w-28 text-default-600">Office:</span>
                    <span className="font-medium">{office.name}</span>
                </div>
                <div className="flex gap-5">
                    <span className="w-28 text-default-600">Request Type:</span>
                    <span className="font-medium">
                        {toTitleCase(form.request_type)}
                    </span>
                </div>
                <div className="flex gap-5">
                    <span className="w-28 text-default-600">
                        Number of Items:
                    </span>
                    <span className="font-medium">{items}</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default RequestSummary;
