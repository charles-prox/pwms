import React from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@heroui/react";
import { axiosInstance } from "@/Utils/axios";
import { router } from "@inertiajs/react";
import { PDFLayout } from "@/RequestForms/PDFLayout";
import PDFDocument from "@/RequestForms/PDFDocument";
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
    const [saving, setSaving] = React.useState(false);

    const preparedBy = {
        name:
            form_details.request.creator.first_name +
            (form_details.request.creator.middle_name
                ? " " +
                  form_details.request.creator.middle_name.charAt(0) +
                  ". "
                : " ") +
            form_details.request.creator.last_name,
        position: form_details.request.creator.position?.name || "",
    };

    const docProps = {
        requestType: form_details.request?.type || "storage",
        preparedBy,
        office: form_details.request.creator.office,
        officeHead: form_details.creator_office_head,
        regionDC: form_details.rdc_officer,
        msdHead: form_details.msd_head,
        gsuHead: form_details.gsu_head,
        formNumber: form_details.request.form_number,
    };

    const renderContent = () => {
        switch (form_details.request?.type) {
            case "withdrawal":
                return <RequestForWithdrawal data={form_details} />;
            case "return":
                return <RequestForReturn data={form_details} />;
            case "disposal":
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

    const handleSaveToServer = async () => {
        setSaving(true);
        try {
            const blob = await pdf(
                <PDFDocument {...docProps}>{renderContent()}</PDFDocument>
            ).toBlob();

            const formData = new FormData();
            formData.append("pdf", blob, `request-${form_details.request.form_number}.pdf`);
            formData.append("request_id", form_details.request.form_number);

            await axiosInstance.post("/request/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            router.reload();
        } catch (error) {
            console.error("Failed to save PDF:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {!form_details.request.pdf_path && (
                <div className="flex justify-end">
                    <Button
                        color="primary"
                        onPress={handleSaveToServer}
                        isLoading={saving}
                    >
                        Save PDF to Server
                    </Button>
                </div>
            )}
            <PDFLayout
                previewMode={previewMode}
                {...docProps}
            >
                {renderContent()}
            </PDFLayout>
        </div>
    );
}

export default FormPreview;
