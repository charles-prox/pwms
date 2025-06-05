import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { styles } from "./styles"; // Adjust path as necessary
import { BoxDetails, BoxFormState } from "@/Utils/types";

interface Props {
    data: any;
    gsuHead: any;
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
                    <Text>
                        {gsuHead.first_name +
                            (gsuHead.middle_initial
                                ? " " + gsuHead.middle_initial + ". "
                                : " ") +
                            gsuHead.last_name}
                    </Text>
                </View>
            </View>

            <View style={styles.flex}>
                <View style={{ width: "10%" }} />
                <View style={{ width: "90%" }}>
                    <Text>{gsuHead.positions[0].name}</Text>
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
                        styles.topBorder,
                        styles.rightBorder,
                        styles.leftBorder,
                        styles.bottomBorder,
                        styles.tableHeader,
                        { width: "18%" },
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
                        { width: "12%" },
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
                        { width: "45%" },
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
                        { width: "20%" },
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
                        { width: "15%" },
                    ]}
                >
                    <Text>Disposal Date</Text>
                </View>
            </View>

            {/* Table Body */}
            {data.boxes.map((box: BoxFormState, i: number) => (
                <View key={i} style={styles.flex}>
                    <View
                        style={[
                            styles.rightBorder,
                            styles.leftBorder,
                            styles.bottomBorder,
                            styles.tableCell,
                            { width: "18%" },
                        ]}
                    >
                        <Text>{box.box_code}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "column",
                            width: "76.5%",
                            padding: 2,
                        }}
                    >
                        {box.box_details.map(
                            (document: BoxDetails, j: number) => (
                                <View key={j} style={styles.flex}>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: "15.75%" },
                                        ]}
                                    >
                                        <Text>{document.rds_number}</Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: "58.9%" },
                                        ]}
                                    >
                                        <Text>{document.document_title}</Text>
                                        {/* <Text>{document.description}</Text> */}
                                    </View>
                                    <View
                                        style={[
                                            styles.rightBorder,
                                            styles.tableCell,
                                            { width: "26.29%" },
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
                                    styles.leftBorder,
                                    styles.tableCell,
                                    { width: "15.75%" },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.rightBorder,
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
                                    styles.rightBorder,
                                    styles.tableCell,
                                    { width: "26.29%" },
                                ]}
                            ></View>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.rightBorder,
                            styles.bottomBorder,
                            styles.tableCell,
                            { width: "15%" },
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

            <Text style={[styles.itallicFont, { fontSize: 10, padding: 5 }]}>
                Note: The Records Section shall not be responsible for any loss
                of the box's contents.
            </Text>
        </>
    );
};

export default RequestForStorage;
