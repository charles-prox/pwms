import React, { ReactNode } from "react";
import {
    Page,
    View,
    Text,
    Image,
    PDFViewer,
    Document,
} from "@react-pdf/renderer";
import { styles } from "./styles";
import Signatories from "./Signatories";

// Supported request types
type RequestType = "storage" | "withdrawal" | "return" | "disposal";

// Props definition
interface PDFLayoutProps {
    children: ReactNode;
    requestType: RequestType;
    formNo?: string;
    title?: string;
    preparedBy?: {
        name: string;
        position: string;
    };
    office?: string;
    officeHead?: string;
    regionDC?: string;
    msdHead?: string;
    gsuHHead?: string;
}

// Utility to conditionally render content by request type
const renderContentByRequestType = (
    type: RequestType,
    children: ReactNode
): ReactNode => {
    switch (type) {
        case "storage":
            return (
                <>
                    <Text>Request for Records Storage</Text>
                    {children}
                </>
            );
        case "withdrawal":
            return (
                <>
                    <Text>Request for Records Withdrawal</Text>
                    {children}
                </>
            );
        case "return":
            return (
                <>
                    <Text>Request for Records Return</Text>
                    {children}
                </>
            );
        case "disposal":
            return (
                <>
                    <Text>Request for Records Disposal</Text>
                    {children}
                </>
            );
        default:
            return children;
    }
};

export const PDFLayout: React.FC<PDFLayoutProps> = ({
    children,
    requestType,
    formNo = "",
    title = "",
    preparedBy = { name: "", position: "" },
    office = "",
    officeHead = "",
    regionDC = "",
    msdHead = "",
    gsuHHead = "",
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
                        <View style={styles.headerRight}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.formNo}>{formNo}</Text>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                        {renderContentByRequestType(requestType, children)}
                    </View>

                    {/* Signatories */}
                    <Signatories
                        preparedBy={preparedBy}
                        office={office}
                        officeHead={officeHead}
                        regionDC={regionDC}
                        msdHead={msdHead}
                        gsuHHead={gsuHHead}
                    />
                </Page>
            </Document>
        </PDFViewer>
    );
};
