import React from "react";
import { PDFLayout } from "@/RequestForms/PDFLayout";
import RequestForDisposal from "@/RequestForms/RequestForDisposal";
import RequestForReturn from "@/RequestForms/RequestForReturn";
import RequestForStorage from "@/RequestForms/RequestForStorage";
import RequestForWithdrawal from "@/RequestForms/RequestForWithdrawal";
import { FormDetails } from "@/Utils/types";

interface FormPreviewProps {
    form_details: FormDetails; // type this properly if you can
    previewMode: boolean; // optional prop to control preview mode
}

function FormPreview({ form_details, previewMode }: FormPreviewProps) {
    // Use passed prop or fallback to Inertia page props

    const renderContent = () => {
        console.log("Form Details:", form_details);

        switch (form_details.request?.type) {
            case "Withdrawal":
                return <RequestForWithdrawal data={form_details} />;
            case "Return":
                return <RequestForReturn data={form_details} />;
            case "Disposal":
                return <RequestForDisposal data={form_details} />;
            default:
                return (
                    <RequestForStorage
                        data={form_details.request}
                        gsuHead={form_details.gsu_head}
                    />
                );
        }
    };

    return (
        <PDFLayout
            previewMode={previewMode}
            requestType={form_details.request.type || "storage"}
            preparedBy={{
                name:
                    form_details.request.creator.first_name +
                    (form_details.request.creator.middle_name
                        ? " " +
                          form_details.request.creator.middle_name.charAt(0) +
                          ". "
                        : " ") +
                    form_details.request.creator.last_name,
                position: form_details.request.creator.position?.name || "",
            }}
            office={form_details.request.creator.office}
            officeHead={form_details.creator_office_head}
            regionDC={form_details.rdc_officer}
            msdHead={form_details.msd_head}
            gsuHead={form_details.gsu_head}
            formNumber={form_details.request.form_number}
        >
            {renderContent()}
        </PDFLayout>
    );
}

export default FormPreview;
