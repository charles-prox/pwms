import {
    Page,
    Font,
    Document,
    Text,
    PDFViewer,
    View,
    Image,
} from "@react-pdf/renderer";
import React from "react";
import { styles } from "./styles"; // Adjust path as necessary

// Font registration
Font.register({
    family: "Georgia Bold",
    src: "/fonts/georgia/georgia_bold.ttf",
});
Font.register({
    family: "Georgia Regular",
    src: "/fonts/georgia/Georgia.ttf",
});

// Type definitions
interface DocumentDetail {
    rds_number: string;
    document_title: string;
    description: string;
    document_date: string;
}

interface BoxDetail {
    box_code: string;
    disposal_date: string;
    remarks?: string;
    box_details: DocumentDetail[];
}

interface RequestData {
    form_no: string;
    details: BoxDetail[];
}

interface Props {
    data: any;
    gsuHead: string;
}

// Date formatting
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const day = String(today.getDate()).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${month} ${day}, ${year}`;

const RequestForStorage: React.FC<Props> = ({ data, gsuHead }) => {
    return (
        <>
            <View style={[styles.flex, styles.date]}>
                <View style={{ width: "10%" }}>
                    <Text>Date:</Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Text style={{ textDecoration: "underline" }}>
                        {formattedDate}
                    </Text>
                </View>
            </View>

            <Text style={styles.rsfno}>
                RSF No.:{" "}
                <Text style={{ textDecoration: "underline" }}>
                    {data.form_number}
                </Text>
            </Text>

            <View style={styles.flex}>
                <View style={{ width: "10%" }}>
                    <Text>TO:</Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Text>{gsuHead}</Text>
                </View>
            </View>

            <View style={styles.flex}>
                <View style={{ width: "10%" }} />
                <View style={{ width: "90%" }}>
                    <Text>Head, GSU</Text>
                </View>
            </View>

            <Text style={styles.salutation}>Sir/Ma'am,</Text>
            <Text style={styles.letterBody}>
                Please archive the following records:
            </Text>

            <Text style={styles.horizontalLine}> </Text>

            {/* Table Header */}
            <View style={styles.flex}>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "18%" },
                    ]}
                >
                    <Text>Box Code</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "12%" },
                    ]}
                >
                    <Text>RDS No.</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "45%" },
                    ]}
                >
                    <Text>Title and Description</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "20%" },
                    ]}
                >
                    <Text>Record Date</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "15%" },
                    ]}
                >
                    <Text>Disposal Date</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.data.details.map((box: BoxDetail, i: number) => (
                <View key={i} style={styles.flex}>
                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "18%" },
                        ]}
                    >
                        <Text>{box.box_code}</Text>
                    </View>

                    <View style={{ flexDirection: "column", width: "76.5%" }}>
                        {box.box_details.map(
                            (details: DocumentDetail, j: number) => (
                                <View key={j} style={styles.flex}>
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "15.75%" },
                                        ]}
                                    >
                                        <Text>{details.rds_number}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "58.9%" },
                                        ]}
                                    >
                                        <Text>{details.document_title}</Text>
                                        <Text>{details.description}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "26.29%" },
                                        ]}
                                    >
                                        <Text>{details.document_date}</Text>
                                    </View>
                                </View>
                            )
                        )}

                        <View style={styles.flex}>
                            <View
                                style={[
                                    styles.bottomBorder,
                                    styles.tableCell,
                                    { width: "15.75%" },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.bottomBorder,
                                    styles.tableCell,
                                    { width: "58.9%" },
                                ]}
                            >
                                {box.remarks && (
                                    <>
                                        <Text
                                            style={[
                                                styles.boldFont,
                                                { fontSize: 9 },
                                            ]}
                                        >
                                            Box remarks:{" "}
                                        </Text>
                                        <Text>{box.remarks}</Text>
                                    </>
                                )}
                            </View>
                            <View
                                style={[
                                    styles.bottomBorder,
                                    styles.tableCell,
                                    { width: "26.29%" },
                                ]}
                            ></View>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "15%" },
                        ]}
                    >
                        <Text>{box.disposal_date}</Text>
                    </View>
                </View>
            ))}

            <Text style={{ fontSize: 10, padding: 5 }}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForStorage;
