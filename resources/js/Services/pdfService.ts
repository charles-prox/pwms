// services/pdfService.ts
import { pdf } from "@react-pdf/renderer";
import { axiosInstance } from "@/Utils/axios";

export async function savePdfToBackend(
    documentElement: JSX.Element,
    requestId: string
) {
    const blob = await pdf(documentElement).toBlob();
    const formData = new FormData();
    formData.append("pdf", blob, `request-${requestId}.pdf`);
    formData.append("request_id", String(requestId));

    try {
        const response = await axiosInstance.post(
            "/request/upload-pdf",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log("Upload success:", response.data);
    } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Failed to upload PDF to backend");
    }
}
