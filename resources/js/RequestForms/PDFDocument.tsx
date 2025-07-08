import React, { ReactNode } from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import Signatories from "./Signatories";
import { Office, Officer, PDFDocumentProps, RequestType } from "@/Utils/types";

const requestHeaders: Record<RequestType, { title: string; formNo: string }> = {
    Storage: {
        title: "Request for Records Storage Form",
        formNo: "PHILHEALTH-QP-02-F01",
    },
    Withdrawal: {
        title: "Request for Records Withdrawal Form",
        formNo: "PHILHEALTH-QP-02-F02",
    },
    Return: {
        title: "Request for Return of Records Form",
        formNo: "PHILHEALTH-QP-02-F03",
    },
    Disposal: {
        title: "Request for Records Disposal Form",
        formNo: "PHILHEALTH-QP-02-F04",
    },
};

const renderHeaderRight = (requestType: RequestType) => {
    const { title, formNo } = requestHeaders[requestType];

    return (
        <View style={{ width: "80%", position: "relative", height: 70 }}>
            <Text style={[styles.title, styles.boldFont]}>{title}</Text>
            <Text style={styles.formNo}>{formNo}</Text>
        </View>
    );
};

const PDFDocument: React.FC<PDFDocumentProps> = ({
    children,
    requestType,
    formNumber,
    preparedBy,
    office,
    officeHead,
    regionDC,
    msdHead,
    gsuHead,
}) => (
    <Document title={formNumber || "Request Form"}>
        <Page size="A4" style={styles.body}>
            {/* Header */}
            <View fixed style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        style={styles.logo}
                        src="/header/philhealth_logo.png"
                    />
                </View>
                {renderHeaderRight(requestType)}
            </View>

            {/* Content */}
            <View style={styles.content}>{children}</View>

            {/* Signatories */}
            <Signatories
                preparedBy={preparedBy}
                office={office}
                officeHead={officeHead}
                regionDC={regionDC}
                msdHead={msdHead}
                gsuHead={gsuHead}
            />
        </Page>
    </Document>
);

export default PDFDocument;
