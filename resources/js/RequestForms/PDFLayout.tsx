import React, { ReactNode } from "react";
import {
    Page,
    View,
    Text,
    Image,
    PDFViewer,
    Document,
} from "@react-pdf/renderer";
import { styles } from "./styles"; // or wherever your shared styles live
import Signatories from "./Signatories"; // Import the Signatories component
import { Officer, Office } from "@/Utils/types";

type RequestType = "storage" | "withdrawal" | "return" | "disposal";
interface PDFLayoutProps {
    children: ReactNode;
    requestType: RequestType;
    formNo?: string;
    title?: string;

    preparedBy?: {
        name: string;
        position: string;
    };

    office: Office;

    officeHead?: Officer;
    regionDC?: Officer;
    msdHead?: Officer;
    gsuHead: Officer;
}

// Supported request types
const requestHeaders: Record<RequestType, { title: string; formNo: string }> = {
    storage: {
        title: "Request for Records Storage Form",
        formNo: "PHILHEALTH-QP-02-F01",
    },
    withdrawal: {
        title: "Request for Records Withdrawal Form",
        formNo: "PHILHEALTH-QP-02-F02",
    },
    return: {
        title: "Request for Return of Records Form",
        formNo: "PHILHEALTH-QP-02-F03",
    },
    disposal: {
        title: "Request for Records Disposal Form",
        formNo: "PHILHEALTH-QP-02-F04",
    },
};

// Utility to render dynamic header right section
const renderHeaderRight = (requestType: RequestType) => {
    const { title, formNo } = requestHeaders[requestType];

    return (
        <View style={{ width: "80%", position: "relative", height: 70 }}>
            <Text style={[styles.title, styles.boldFont]}>{title}</Text>
            <Text style={styles.formNo}>{formNo}</Text>
        </View>
    );
};

export const PDFLayout: React.FC<PDFLayoutProps> = ({
    children,
    requestType = "storage", // Default to storage if not provided
    preparedBy = { name: "", position: "" },
    office,
    officeHead,
    regionDC,
    msdHead,
    gsuHead,
}) => {
    return (
        <PDFViewer height={innerHeight - 280} showToolbar={true}>
            <Document>
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

                    {/* Main Content */}
                    <View style={styles.content}>{children}</View>

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
        </PDFViewer>
    );
};
