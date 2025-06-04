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

// Props definition
interface PDFLayoutProps {
    children: ReactNode;
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

export const PDFLayout: React.FC<PDFLayoutProps> = ({
    children,
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
                        <View
                            style={{
                                width: "80%",
                                position: "relative",
                                height: 70,
                            }}
                        >
                            <Text style={[styles.title, styles.boldFont]}>
                                Request for Records Withdrawal Form
                            </Text>
                            <Text style={styles.formNo}>
                                PHILHEALTH-QP-02-F02
                            </Text>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>{children}</View>

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
