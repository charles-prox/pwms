import React, { ReactNode } from "react";
import {
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    Font,
    PDFViewer,
    Document,
} from "@react-pdf/renderer";

// Font registration
Font.register({
    family: "Georgia Bold",
    src: "/fonts/georgia/georgia_bold.ttf",
});
Font.register({
    family: "Georgia Regular",
    src: "/fonts/georgia/Georgia.ttf",
});

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
}

export const PDFLayout: React.FC<PDFLayoutProps> = ({
    children,
    formNo = "",
    title = "",
    preparedBy = { name: "", position: "" },
    office = "",
    officeHead = "",
}) => {
    return (
        <PDFViewer width={innerWidth} height={innerHeight} showToolbar={true}>
            <Document>
                <Page size="A4" style={styles.body}>
                    {/* Header */}
                    <View fixed style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.logo}
                                src="/headers/philhealth_logo.png"
                            />
                        </View>
                        <View style={styles.headerRight}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.formNo}>{formNo}</Text>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>{children}</View>

                    {/* Footer - Signature Section */}
                    <View fixed style={styles.footer}>
                        <Text style={styles.footerTitle}>Prepared by:</Text>

                        <View style={styles.flexRow}>
                            <View style={styles.signCellName}>
                                <Text style={styles.signName}>
                                    {preparedBy.name}
                                </Text>
                            </View>
                            <View style={styles.signCellDate} />
                        </View>

                        <View style={styles.flexRow}>
                            <View style={styles.signCellName}>
                                <Text style={styles.signPosition}>
                                    Signature over Printed Name
                                </Text>
                                <Text style={styles.signPosition}>
                                    {preparedBy.position}, {office}
                                </Text>
                            </View>
                            <View style={styles.signCellDate}>
                                <Text style={styles.signPosition}>Date</Text>
                            </View>
                        </View>

                        {/* Office Head signature block */}
                        {officeHead && (
                            <>
                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.footerTitle}>
                                        Approved by:
                                    </Text>
                                </View>

                                <View style={styles.flexRow}>
                                    <View style={styles.signCellName}>
                                        <Text style={styles.signName}>
                                            {officeHead}
                                        </Text>
                                    </View>
                                    <View style={styles.signCellDate} />
                                </View>

                                <View style={styles.flexRow}>
                                    <View style={styles.signCellName}>
                                        <Text style={styles.signPosition}>
                                            Signature over Printed Name
                                        </Text>
                                        <Text style={styles.signPosition}>
                                            Office Head
                                        </Text>
                                    </View>
                                    <View style={styles.signCellDate}>
                                        <Text style={styles.signPosition}>
                                            Date
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        <Text style={styles.note}>
                            Note: This is to certify that the aforementioned
                            records are neither needed nor involved in any
                            administrative, financial and/or judicial cases.
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 120,
        paddingHorizontal: 50,
        fontSize: 12,
        fontFamily: "Georgia Regular",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        flexDirection: "row",
        border: "1px solid black",
        padding: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    headerLeft: {
        width: "20%",
    },
    logo: {
        width: 40,
        height: 40,
    },
    headerRight: {
        width: "80%",
        position: "relative",
        height: 50,
        justifyContent: "center",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    formNo: {
        fontSize: 8,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 50,
        right: 50,
        fontSize: 10,
    },
    footerTitle: {
        fontWeight: "bold",
        backgroundColor: "#fbd4b4",
        padding: 3,
        marginBottom: 4,
    },
    flexRow: {
        flexDirection: "row",
    },
    signCellName: {
        width: "55%",
        border: "1px solid black",
        paddingTop: 20,
        textAlign: "center",
    },
    signCellDate: {
        width: "45%",
        border: "1px solid black",
        paddingTop: 20,
        textAlign: "center",
    },
    signName: {
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    signPosition: {
        fontSize: 9,
        textAlign: "center",
    },
    note: {
        marginTop: 10,
        fontSize: 8,
        fontStyle: "italic",
    },
});
