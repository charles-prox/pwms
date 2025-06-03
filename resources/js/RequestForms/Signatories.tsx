import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles"; // or wherever your shared styles live
type SignatoriesProps = {
    preparedBy: {
        name: string;
    };
    office: string;
    officeHead: string;
    regionDC?: string;
    msdHead?: string;
    gsuHHead?: string;
};

export const Signatories: React.FC<SignatoriesProps> = ({
    preparedBy,
    office,
    officeHead,
    regionDC = "",
    msdHead = "",
    gsuHHead = "",
}) => (
    <View>
        {/* Prepared by */}
        <View wrap={false}>
            <Text style={[styles.signatoryFor, styles.border]}>
                Prepared by:
            </Text>
            <View style={styles.flex}>
                <View
                    style={[styles.border, styles.tableCell, { width: "50%" }]}
                >
                    <Text style={styles.signatoryName}>{preparedBy.name}</Text>
                </View>
                <View
                    style={[styles.border, styles.tableCell, { width: "50%" }]}
                >
                    <Text />
                </View>
            </View>
            <View style={styles.flex}>
                <View
                    style={[styles.border, styles.tableCell, { width: "50%" }]}
                >
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>
                        Document Custodian, {office}
                    </Text>
                </View>
                <View
                    style={[styles.border, styles.tableCell, { width: "50%" }]}
                >
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>
        </View>

        {/* Requesting Officer / Received by */}
        <View wrap={false}>
            <View style={[styles.flex, { marginTop: 10 }]}>
                <Text style={[styles.signatoryLabel, { width: "50%" }]}>
                    Requesting Officer:
                </Text>
                <Text style={[styles.signatoryLabel, { width: "50%" }]}>
                    Received by:
                </Text>
            </View>
            <View style={styles.flex}>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryName}>{officeHead}</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]} />
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryName}>{regionDC}</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]} />
            </View>
            <View style={styles.flex}>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>Head, {office}</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]}>
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>GSU</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]}>
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>

            {/* Verified by / Approved by */}
            <View style={styles.flex}>
                <Text style={[styles.signatoryLabel, { width: "50%" }]}>
                    Verified by:
                </Text>
                <Text style={[styles.signatoryLabel, { width: "50%" }]}>
                    Approved by:
                </Text>
            </View>
            <View style={styles.flex}>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryName}>{gsuHHead}</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]} />
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryName}>{msdHead}</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]} />
            </View>
            <View style={styles.flex}>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>Head, GSU</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]}>
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
                <View style={[styles.cell, { width: "35%" }]}>
                    <Text style={styles.signatoryPosition}>
                        Signature over Printed Name
                    </Text>
                    <Text style={styles.signatoryPosition}>Chief, MSD</Text>
                </View>
                <View style={[styles.cell, { width: "15%" }]}>
                    <Text style={styles.signatoryPosition}>Date</Text>
                </View>
            </View>
        </View>
    </View>
);

export default Signatories;
