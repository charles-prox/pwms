import { StyleSheet, Font } from "@react-pdf/renderer";

// Font registration
Font.register({
    family: "Georgia",
    fonts: [
        { src: "/fonts/georgia/Georgia.ttf", fontWeight: "normal" },
        { src: "/fonts/georgia/georgia_bold.ttf", fontWeight: "bold" },
    ],
});

export const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 120,
        paddingHorizontal: 50,
        fontSize: 12,
        fontFamily: "Georgia",
        fontWeight: "normal",
        display: "flex",
        flexDirection: "column",
    },
    boldFont: {
        fontFamily: "Georgia Bold",
        fontSize: 12,
    },
    border: {
        border: "1px solid black",
        padding: 2,
        marginLeft: -1,
    },
    bottomBorder: {
        borderBottom: "1px solid black",
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
        padding: 2,
        marginLeft: -1,
        paddingTop: 5,
    },
    cell: {
        border: "1px solid black",
        padding: 3,
        justifyContent: "center",
        fontSize: 10,
    },
    column: {
        width: "50%",
    },
    content: {
        flex: 1,
    },
    date: {
        paddingBottom: 10,
    },
    flex: {
        flexDirection: "row",
    },
    flexRow: {
        flexDirection: "row",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 50,
        right: 50,
        fontSize: 10,
    },
    footerTitle: {
        fontWeight: "bold",
        backgroundColor: "#fbd4b4",
        padding: 3,
        marginBottom: 4,
    },
    formNo: {
        fontSize: 8,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    header: {
        flexDirection: "row",
        border: "1px solid black",
        padding: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    headerLeft: {
        width: "20%",
    },
    headerRight: {
        width: "80%",
        position: "relative",
        height: 50,
        justifyContent: "center",
    },
    horizontalLine: {
        borderTop: "2px solid black",
        marginTop: 15,
    },
    letterBody: {
        paddingTop: 10,
        paddingLeft: 20,
    },
    logo: {
        width: 40,
        height: 60,
    },
    noTopBottomBorder: {
        borderTop: 0,
        borderBottom: 0,
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
        padding: 2,
        marginLeft: -1,
    },
    note: {
        marginTop: 10,
        fontSize: 8,
        fontStyle: "italic",
    },
    row: {
        paddingTop: 35,
        flexDirection: "row",
        alignItems: "center",
    },
    rsfno: {
        textAlign: "right",
        marginBottom: 30,
    },
    salutation: {
        paddingTop: 30,
    },
    signatoryFor: {
        backgroundColor: "#fbd4b4",
        fontFamily: "Georgia Bold",
        fontSize: 10,
    },
    signatoryLabel: {
        backgroundColor: "#fbd4b4",
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontSize: 9,
        padding: 4,
        border: "1px solid black",
        textAlign: "left",
    },
    signatoryName: {
        paddingTop: 20,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 9,
    },
    signatoryPosition: {
        textAlign: "center",
        fontSize: 8,
    },
    signCellDate: {
        width: "45%",
        border: "1px solid black",
        paddingTop: 20,
        textAlign: "center",
    },
    signCellName: {
        width: "55%",
        border: "1px solid black",
        paddingTop: 20,
        textAlign: "center",
    },
    signName: {
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    signPosition: {
        fontSize: 9,
        textAlign: "center",
    },
    tableCell: {
        marginTop: -1,
        display: "flex",
        justifyContent: "flex-start",
        borderTop: 0,
        fontSize: 10,
    },
    tableHeader: {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "#fbd4b4",
        textTransform: "uppercase",
        fontFamily: "Georgia Bold",
        fontSize: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: "28 0 0 25",
    },
});
