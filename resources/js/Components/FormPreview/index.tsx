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
        if (saving || form_details.request.pdf_path) return;
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

            router.reload({ only: ["form_details"] });
        } catch (error) {
            console.error("Failed to generate/save PDF:", error);
        } finally {
            setSaving(false);
        }
    };

    React.useEffect(() => {
        if (
            !form_details.request.pdf_path &&
            form_details.request.status?.toLowerCase() !== "draft"
        ) {
            handleSaveToServer();
        }
    }, [form_details.request.pdf_path, form_details.request.status]);

    return (
        <div className="flex flex-col gap-4 h-full">
            {form_details.request.pdf_path ? (
                <div className="w-full h-[80vh] border border-default-200 rounded-lg overflow-hidden">
                    <iframe
                        src={form_details.request.pdf_path}
                        className="w-full h-full"
                        title="Request PDF"
                    />
                </div>
            ) : (
                <>
                    {saving && (
                        <div className="flex justify-end items-center gap-2 text-primary text-sm font-medium animate-pulse">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            Saving PDF to server...
                        </div>
                    )}
                    <PDFLayout previewMode={previewMode} {...docProps}>
                        {renderContent()}
                    </PDFLayout>
                </>
            )}
        </div>
    );
}

export default FormPreview;
