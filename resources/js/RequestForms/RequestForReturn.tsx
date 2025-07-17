import React from "react";
import { View, Text } from "@react-pdf/renderer";

// Import shared styles
import { styles } from "./styles"; // Adjust the import path as needed
import {
    BoxDetails,
    RequestType,
    SelectedWithdrawalBoxes,
} from "@/Utils/types";
import { formatName } from "@/Utils/helpers";

// Type definitions
interface Box {
    box_code: string;
    remarks: string;
    copy_type: string;
    location: string;
}

interface FormData {
    form_no: string;
    details: Box[];
}

interface RequestForReturnProps {
    data: any;
}

// Format current date
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const day = String(today.getDate()).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${month} ${day}, ${year}`;

// Component
const RequestForReturn: React.FC<RequestForReturnProps> = ({ data }) => {
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

            {/* RRF No. */}
            <Text style={styles.rsfno}>
                RRF No.:{" "}
                <Text style={{ textDecoration: "underline" }}>
                    {data.request.form_number}
                </Text>
            </Text>

            {/* TO: */}
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
                May we return the following records.
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
                        { width: "20%", padding: 3 },
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
                        { width: "20%", padding: 3 },
                    ]}
                >
                    <Text>RWF Ref. No</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: "40%", padding: 3 },
                    ]}
                >
                    <Text>Description</Text>
                </View>
                <View
                    style={[
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: "20%", padding: 3 },
                    ]}
                >
                    <Text>Content</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.request.boxes.map(
                (box: SelectedWithdrawalBoxes, index: number) => (
                    <View key={index} style={styles.flex}>
                        <View
                            style={[
                                styles.rightBorder,
                                styles.leftBorder,
                                styles.bottomBorder,
                                styles.tableCell,
                                { width: "20%" },
                            ]}
                        >
                            <Text>{box.box_code}</Text>
                        </View>
                        <View
                            style={[
                                styles.rightBorder,
                                styles.bottomBorder,
                                styles.tableCell,
                                { width: "20%" },
                            ]}
                        >
                            <Text>{box.withdrawal_request.form_number}</Text>
                        </View>
                        <View
                            style={[
                                styles.rightBorder,
                                styles.bottomBorder,
                                styles.tableCell,
                                { width: "40%" },
                            ]}
                        >
                            <Text style={{ paddingBottom: 2 }}>
                                Box Location: {box.location}
                            </Text>
                            <Text>
                                {box.request_remarks
                                    ? box.request_remarks[
                                          data.request.type as RequestType
                                      ]
                                    : "---"}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.rightBorder,
                                styles.bottomBorder,
                                styles.tableCell,
                                { width: "20%" },
                            ]}
                        >
                            <View>
                                {box.box_details.map((details: BoxDetails) => {
                                    return (
                                        <Text
                                            key={details.id}
                                            style={{ paddingBottom: 2 }}
                                        >
                                            {details.document_title || "N/A"}
                                        </Text>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                )
            )}

            {/* Footer Note */}
            <Text style={{ fontSize: 10, padding: 5 }}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForReturn;
