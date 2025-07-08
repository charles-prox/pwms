import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

// Define the styles here or import from another file
import { styles } from "./styles"; // Adjust path if needed

// Type definitions
interface BoxDetail {
    rds_number?: string;
    document_title?: string;
    description?: string;
}

interface Box {
    box_code: string;
    remarks: string;
    type: string;
    location: string;
    box_details: BoxDetail[];
}

interface RequestForWithdrawalProps {
    data: any;
}

// Get formatted date
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
const day = String(today.getDate()).padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${month} ${day}, ${year}`;

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
                    {data.data.form_no}
                </Text>
            </Text>

            {/* TO: */}
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
                May we request for withdrawal/pull-out of the following records.
            </Text>
            <Text style={styles.horizontalLine}> </Text>

            {/* Table Header */}
            <View style={styles.flex}>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "20%" },
                    ]}
                >
                    <Text>Box Code</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "45%" },
                    ]}
                >
                    <Text>Document Description</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "18%" },
                    ]}
                >
                    <Text>Copy Type</Text>
                </View>
                <View
                    style={[
                        styles.border,
                        styles.tableHeader,
                        { width: "20%" },
                    ]}
                >
                    <Text>Box Location</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.data.details.map((box: any, index: number) => (
                <View key={index} style={styles.flex}>
                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "20%" },
                        ]}
                    >
                        <Text>{box.box_code}</Text>
                    </View>
                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "45%" },
                        ]}
                    >
                        <Text>{box.remarks}</Text>
                    </View>
                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "18%" },
                        ]}
                    >
                        <Text>{box.type}</Text>
                    </View>
                    <View
                        style={[
                            styles.border,
                            styles.tableCell,
                            { width: "20%" },
                        ]}
                    >
                        <Text>{box.location}</Text>
                    </View>
                </View>
            ))}

            {/* Note */}
            <Text style={{ fontSize: 10, padding: 5 }}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForWithdrawal;
