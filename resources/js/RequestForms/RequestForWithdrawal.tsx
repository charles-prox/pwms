import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

// Define the styles here or import from another file
import { styles } from "./styles"; // Adjust path if needed
import {
    BoxDetails,
    FormDetails,
    Officer,
    SelectedWithdrawalBoxes,
} from "@/Utils/types";

interface RequestForWithdrawalProps {
    data: FormDetails;
}

// Get formatted date
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const day = String(today.getDate()).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${month} ${day}, ${year}`;

const formatName = (gsuHead: Officer) => {
    const { first_name, middle_initial, last_name } = gsuHead;
    return `${first_name} ${
        middle_initial ? middle_initial + "." : ""
    } ${last_name}`
        .replace(/\s+/g, " ")
        .trim();
};

// Component
const RequestForWithdrawal: React.FC<RequestForWithdrawalProps> = ({
    data,
}) => {
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

            {/* Form No */}
            <Text style={styles.rsfno}>
                RWF No.:{" "}
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
                May we request for withdrawal/pull-out of the following records.
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
                        { width: "50%", padding: 3 },
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
                        { width: "30%", padding: 3 },
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
                                { width: "50%" },
                            ]}
                        >
                            <Text style={{ paddingBottom: 2 }}>
                                Box Location: {box.location}
                            </Text>
                            <Text>
                                {box.request_remarks
                                    ? box.request_remarks[data.request.type]
                                    : "---"}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.rightBorder,
                                styles.bottomBorder,
                                styles.tableCell,
                                { width: "30%" },
                            ]}
                        >
                            <Text>
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
                            </Text>
                        </View>
                    </View>
                )
            )}

            {/* Note */}
            <Text style={[styles.italicFont, { fontSize: 10, paddingTop: 5 }]}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForWithdrawal;
