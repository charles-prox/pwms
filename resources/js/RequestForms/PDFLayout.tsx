// PDFLayout.tsx
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDocumentProps } from "@/Utils/types";
import PDFDocument from "./PDFDocument";

interface PDFLayoutProps extends PDFDocumentProps {
    previewMode: boolean;
}

export const PDFLayout: React.FC<PDFLayoutProps> = ({
    previewMode = true,
    ...pdfDocumentProps
}) => {
    const document = <PDFDocument {...pdfDocumentProps} />;

    return previewMode ? (
        <PDFViewer height={innerHeight - 260} showToolbar>
            {document}
        </PDFViewer>
    ) : (
        document
    );
};
