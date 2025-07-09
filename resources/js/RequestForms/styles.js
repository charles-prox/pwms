import { StyleSheet, Font } from "@react-pdf/renderer";

// Font registration
Font.register({
    family: "Georgia",
    fonts: [
        { src: "/fonts/georgia/Georgia.ttf", fontWeight: "normal" },
        { src: "/fonts/georgia/georgia_bold.ttf", fontWeight: "bold" },
        { src: "/fonts/georgia/georgia_italic.ttf", fontStyle: "italic" },
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
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontSize: 12,
    },
    italicFont: {
        fontFamily: "Georgia",
        fontStyle: "italic",
    },
    border: {
        border: "1px solid black",
    },
    leftBorder: {
        borderLeft: "1px solid black",
    },
    rightBorder: {
        borderRight: "1px solid black",
    },
    topBorder: {
        borderTop: "1px solid black",
    },
    bottomBorder: {
        borderBottom: "1px solid black",
    },
    cell: {
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
        borderLeft: 0,
        borderRight: 0,
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
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontSize: 9,
    },
    signatoryLabel: {
        backgroundColor: "#fbd4b4",
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontSize: 9,
        padding: 4,
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
        paddingTop: 20,
        textAlign: "center",
    },
    signCellName: {
        width: "55%",
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
        display: "flex",
        justifyContent: "flex-start",
        fontSize: 10,
        padding: 2,
    },
    tableHeader: {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "#fbd4b4",
        textTransform: "uppercase",
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontSize: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: "28 0 0 25",
    },
});
