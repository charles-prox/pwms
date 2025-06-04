import React from "react";
import { View, Text } from "@react-pdf/renderer";

// Import shared styles
import { styles } from "./styles"; // Adjust path as necessary

// Types
interface BoxDetail {
    rds_number: string;
    document_title: string;
    description: string;
    document_date: string;
}

interface Box {
    box_code: string;
    remarks?: string;
    box_details: string; // Will be parsed as JSON
    disposal_date: string;
    location: string;
}

interface FormData {
    form_no: string;
    details: Box[];
}

interface RequestForDisposalProps {
    data: any;
}

// Date formatting
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const day = String(today.getDate()).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${month} ${day}, ${year}`;

const RequestForDisposal: React.FC<RequestForDisposalProps> = ({ data }) => {
    return (
        <>
            {/* Date */}
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

            {/* RSF No. */}
            <Text style={styles.rsfno}>
                RSF No.:{" "}
                <Text style={{ textDecoration: "underline" }}>
                    {data.data.form_no}
                </Text>
            </Text>

            {/* To: */}
            <View style={styles.flex}>
                <View style={{ width: "10%" }}>
                    <Text>TO:</Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Text>GLADYS A. ELTANAL</Text>
                </View>
            </View>
            <View style={styles.flex}>
                <View style={{ width: "10%" }}>
                    <Text></Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Text>Head, GSU</Text>
                </View>
            </View>

            {/* Body */}
            <Text style={styles.salutation}>Sir/Ma'am,</Text>
            <Text style={styles.letterBody}>
                Please dispose the following records.
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
                        { width: "10%" },
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
                        { width: "15%" },
                    ]}
                >
                    <Text>Record Date</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "13%" },
                    ]}
                >
                    <Text>Disposal Date</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "13%" },
                    ]}
                >
                    <Text>Location</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.data.details.map((box: any, boxIndex: number) => {
                let parsedDetails: BoxDetail[] = [];
                try {
                    parsedDetails = JSON.parse(box.box_details);
                } catch (err) {
                    console.error("Invalid JSON in box_details:", err);
                }

                return (
                    <View style={styles.flex} key={`box-${boxIndex}`}>
                        {/* Box Code */}
                        <View
                            style={[
                                styles.border,
                                styles.tableCell,
                                { width: "18%" },
                            ]}
                        >
                            <Text>{box.box_code}</Text>
                        </View>

                        {/* Box Details */}
                        <View
                            style={{ flexDirection: "column", width: "69.1%" }}
                        >
                            {parsedDetails.map((details, detailIndex) => (
                                <View
                                    style={styles.flex}
                                    key={`detail-${detailIndex}`}
                                >
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "14.44%" },
                                        ]}
                                    >
                                        <Text>{details.rds_number}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "64.96%" },
                                        ]}
                                    >
                                        <Text>{details.document_title}</Text>
                                        <Text>{details.description}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.noTopBottomBorder,
                                            styles.tableCell,
                                            { width: "21.6%" },
                                        ]}
                                    >
                                        <Text>{details.document_date}</Text>
                                    </View>
                                </View>
                            ))}

                            {/* Remarks Row */}
                            <View style={styles.flex}>
                                <View
                                    style={[
                                        styles.bottomBorder,
                                        styles.tableCell,
                                        { width: "14.44%" },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.bottomBorder,
                                        styles.tableCell,
                                        { width: "64.96%" },
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
                                                Box remarks:
                                            </Text>
                                            <Text>{box.remarks}</Text>
                                        </>
                                    )}
                                </View>
                                <View
                                    style={[
                                        styles.bottomBorder,
                                        styles.tableCell,
                                        { width: "21.6%" },
                                    ]}
                                />
                            </View>
                        </View>

                        {/* Disposal Date & Location */}
                        <View
                            style={[
                                styles.border,
                                styles.tableCell,
                                { width: "13%" },
                            ]}
                        >
                            <Text>{box.disposal_date}</Text>
                        </View>
                        <View
                            style={[
                                styles.border,
                                styles.tableCell,
                                { width: "13%" },
                            ]}
                        >
                            <Text>{box.location}</Text>
                        </View>
                    </View>
                );
            })}

            {/* Footer Note */}
            <Text style={{ fontSize: 10, padding: 5 }}>
                Note: This is to certify that the aforementioned records are
                neither needed nor involved in any administrative, financial
                and/or judicial cases.
            </Text>
        </>
    );
};

export default RequestForDisposal;
