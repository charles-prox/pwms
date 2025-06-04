import React from "react";
import { View, Text } from "@react-pdf/renderer";

// Import shared styles
import { styles } from "./styles"; // Adjust the import path as needed

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
                May we return the following records.
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
                <View style={styles.flex} key={`row-${index}`}>
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
                        <Text>{box.copy_type}</Text>
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

            {/* Footer Note */}
            <Text style={{ fontSize: 10, padding: 5 }}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForReturn;
