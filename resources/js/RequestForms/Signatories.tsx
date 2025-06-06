import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Office, Officer } from "@/Utils/types";

type SignatoriesProps = {
    preparedBy: {
        name: string;
    };
    office: Office;
    officeHead?: Officer;
    regionDC?: Officer;
    msdHead?: Officer;
    gsuHead?: Officer;
};

const getFullName = (officer?: Officer) => {
    if (!officer) return "";
    const middle = officer.middle_initial ? ` ${officer.middle_initial}.` : "";
    return `${officer.first_name}${middle} ${officer.last_name}`;
};

const getPosition = (officer?: Officer) => {
    return officer?.positions?.[0]?.name || "";
};

export const Signatories: React.FC<SignatoriesProps> = ({
    preparedBy,
    office,
    officeHead,
    regionDC,
    msdHead,
    gsuHead,
}) => (
    <View>
        {/* Prepared by */}
        <View wrap={false}>
            <Text style={[styles.signatoryLabel, styles.border]}>
                Prepared by:
            </Text>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.leftBorder,
                        styles.rightBorder,
                        styles.tableCell,
                        { width: "50%" },
                    ]}
                >
                    <Text style={styles.signatoryName}>{preparedBy.name}</Text>
                </View>
                <View
                    style={[
                        styles.rightBorder,
                        styles.tableCell,
                        { width: "50%" },
                    ]}
                >
                    <Text />
                </View>
            </View>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.leftBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.topBorder,
                        styles.tableCell,
                        { width: "50%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        Document Custodian, {office.name}
                    </Text>
                </View>
                <View
                    style={[
                        styles.rightBorder,
                        styles.bottomBorder,
                        styles.topBorder,
                        styles.tableCell,
                        styles.tableCell,
                        { width: "50%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>
        </View>

        {/* Requesting Officer / Received by */}
        <View wrap={false}>
            <View style={[styles.flex, { marginTop: 10 }]}>
                <Text
                    style={[
                        styles.signatoryLabel,
                        styles.border,
                        { width: "50%" },
                    ]}
                >
                    Requesting Officer:
                </Text>
                <Text
                    style={[
                        styles.signatoryLabel,
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "50%" },
                    ]}
                >
                    Received by:
                </Text>
            </View>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.cell,
                        styles.leftBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryName}>
                        {getFullName(officeHead)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                />
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryName}>
                        {getFullName(regionDC)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                />
            </View>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.cell,
                        styles.leftBorder,
                        styles.rightBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        {getPosition(officeHead)}
                    </Text>
                </View>
                <View
                    style={[styles.cell, styles.rightBorder, { width: "15%" }]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
                <View
                    style={[styles.cell, styles.rightBorder, { width: "35%" }]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        {getPosition(regionDC)}
                    </Text>
                </View>
                <View
                    style={[styles.cell, styles.rightBorder, { width: "15%" }]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>

            {/* Verified by / Approved by */}
            <View style={styles.flex}>
                <Text
                    style={[
                        styles.signatoryLabel,
                        styles.border,
                        { width: "50%" },
                    ]}
                >
                    Verified by:
                </Text>
                <Text
                    style={[
                        styles.signatoryLabel,
                        styles.topBorder,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "50%" },
                    ]}
                >
                    Approved by:
                </Text>
            </View>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.leftBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryName}>
                        {getFullName(gsuHead)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                />
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryName}>
                        {getFullName(msdHead)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                />
            </View>
            <View style={styles.flex}>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.leftBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        {getPosition(gsuHead)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "35%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        {getPosition(msdHead)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.rightBorder,
                        styles.bottomBorder,
                        { width: "15%" },
                    ]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>
        </View>
    </View>
);

export default Signatories;
