import React from "react";
import { View, Text } from "@react-pdf/renderer";

// Import shared styles
import { styles } from "./styles"; // Adjust path as necessary
import { BoxDetails, BoxFormState } from "@/Utils/types";
import { formatName } from "@/Utils/helpers";

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

            {/* RDF No. */}
            <Text style={styles.rsfno}>
                RDF No.:{" "}
                <Text style={{ textDecoration: "underline" }}>
                    {data.request.form_number}
                </Text>
            </Text>

            {/* To: */}
            <View style={styles.flex}>
                <View style={{ width: "10%" }}>
                    <Text>TO:</Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Text>{formatName(data.gsu_head)}</Text>
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
                        styles.topBorder,
                        styles.rightBorder,
                        styles.leftBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: 90 },
                    ]}
                >
                    <Text>Box Code</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: 70 },
                    ]}
                >
                    <Text>RDS No.</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: 200 },
                    ]}
                >
                    <Text>Title and Description</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: 90 },
                    ]}
                >
                    <Text>Record Date</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: 60 },
                    ]}
                >
                    <Text>Disposal Date</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.request.boxes.map((box: BoxFormState, i: number) => (
                <View key={i} style={styles.flex}>
                    <View
                        style={[
                            styles.rightBorder,
                            styles.leftBorder,
                            styles.bottomBorder,
                            styles.tableCell,
                            { width: 90 },
                        ]}
                    >
                        <Text>{box.box_code}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "column",
                        }}
                    >
                        {box.box_details.map(
                            (document: BoxDetails, j: number) => (
                                <View key={j} style={styles.flex}>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: 70 },
                                        ]}
                                    >
                                        <Text>{document.rds_number}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: 200 },
                                        ]}
                                    >
                                        <Text>{document.description}</Text>
                                        {/* <Text>{document.description}</Text> */}
                                    </View>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: 90 },
                                        ]}
                                    >
                                        <Text>
                                            {document.document_date?.readable}
                                        </Text>
                                    </View>
                                </View>
                            )
                        )}

                        <View style={[styles.flex, styles.bottomBorder]}>
                            <View
                                style={[
                                    styles.rightBorder,
                                    styles.tableCell,
                                    { width: 70 },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.rightBorder,
                                    styles.tableCell,
                                    { width: 200 },
                                ]}
                            >
                                {box.location && (
                                    <>
                                        <Text
                                            style={[
                                                styles.boldFont,
                                                {
                                                    fontSize: 9,
                                                    paddingBottom: 2,
                                                },
                                            ]}
                                        >
                                            Location:{" "}
                                        </Text>
                                        <Text>{box.location}</Text>
                                    </>
                                )}
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
                                    styles.rightBorder,
                                    styles.tableCell,
                                    { width: 90 },
                                ]}
                            ></View>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.rightBorder,
                            styles.bottomBorder,
                            styles.tableCell,
                            { width: 60 },
                        ]}
                    >
                        <Text>
                            {box.disposal_date === "Permanent"
                                ? "Permanent"
                                : box.disposal_date?.formatted}
                        </Text>
                    </View>
                </View>
            ))}

            {/* Footer Note */}
            <Text style={[styles.italicFont, { fontSize: 10, paddingTop: 5 }]}>
                Note: This is to certify that the aforementioned records are
                neither needed nor involved in any administrative, financial
                and/or judicial cases.
            </Text>
        </>
    );
};

export default RequestForDisposal;
